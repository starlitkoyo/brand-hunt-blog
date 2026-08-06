"""Markdown の記事から静的サイトを生成する。

    python build.py

content/articles/*.md を読み、dist/ に HTML を書き出す。
dist/ をそのまま Vercel（または任意の静的ホスティング）に置けば公開できる。
ビルド結果もコミットするので、ホスティング側でビルドは走らせない。
"""

from __future__ import annotations

import html
import re
import shutil
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any

import markdown
import yaml

ROOT = Path(__file__).parent
CONTENT = ROOT / "content"
ARTICLES = CONTENT / "articles"
PUBLIC = ROOT / "public"
DIST = ROOT / "dist"


@dataclass(frozen=True)
class Article:
    slug: str
    title: str
    description: str
    published: str
    updated: str
    tags: tuple[str, ...]
    body_html: str

    @property
    def url(self) -> str:
        return f"/{self.slug}/"


def load_site() -> dict[str, Any]:
    with (CONTENT / "site.yaml").open("r", encoding="utf-8") as handle:
        data = yaml.safe_load(handle)
    if not isinstance(data, dict):
        raise ValueError("content/site.yaml の形式が不正です。")
    return data


def split_front_matter(text: str) -> tuple[dict[str, Any], str]:
    if not text.startswith("---"):
        raise ValueError("記事の先頭に front matter (---) がありません。")
    _, raw_meta, body = text.split("---", 2)
    meta = yaml.safe_load(raw_meta)
    if not isinstance(meta, dict):
        raise ValueError("front matter の形式が不正です。")
    return meta, body.strip()


def wrap_tables(html_text: str) -> str:
    """表を横スクロールできる箱に入れる（スマホで本文が横に伸びないように）。"""
    return re.sub(
        r"<table>(.*?)</table>",
        r'<div class="table-wrap"><table>\1</table></div>',
        html_text,
        flags=re.DOTALL,
    )


def load_articles() -> list[Article]:
    renderer = markdown.Markdown(extensions=["extra", "toc", "sane_lists"])
    articles: list[Article] = []
    for path in sorted(ARTICLES.glob("*.md")):
        meta, body = split_front_matter(path.read_text(encoding="utf-8"))
        renderer.reset()
        for key in ("slug", "title", "description", "published"):
            if not meta.get(key):
                raise ValueError(f"{path.name}: front matter に '{key}' がありません。")
        articles.append(
            Article(
                slug=str(meta["slug"]),
                title=str(meta["title"]),
                description=str(meta["description"]),
                published=str(meta["published"]),
                updated=str(meta.get("updated") or meta["published"]),
                tags=tuple(str(t) for t in (meta.get("tags") or [])),
                body_html=wrap_tables(renderer.convert(body)),
            )
        )
    return articles


def layout(site: dict[str, Any], *, title: str, description: str, canonical: str, body: str) -> str:
    name = html.escape(str(site["name"]))
    base = str(site["base_url"]).rstrip("/")
    return f"""<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(description)}">
<link rel="canonical" href="{base}{canonical}">
<meta property="og:type" content="article">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(description)}">
<meta property="og:url" content="{base}{canonical}">
<link rel="stylesheet" href="/style.css">
</head>
<body>
<header class="site-header">
  <a class="brand" href="/">
    <span class="moon" aria-hidden="true"></span>
    <span class="brand-text">{name}</span>
  </a>
  <nav><a href="/">記事一覧</a><a href="/about/">このサイトについて</a></nav>
</header>
<main>
{body}
</main>
<footer class="site-footer">
  <p class="disclosure">{html.escape(str(site["disclosure"]))}</p>
  <p class="copyright">&copy; {date.today().year} {name}</p>
</footer>
</body>
</html>
"""


def render_index(site: dict[str, Any], articles: list[Article]) -> str:
    cards = []
    for article in articles:
        tags = "".join(f'<span class="tag">{html.escape(t)}</span>' for t in article.tags)
        cards.append(
            f"""<li class="card">
  <a href="{article.url}">
    <h2>{html.escape(article.title)}</h2>
    <p>{html.escape(article.description)}</p>
    <div class="meta"><time datetime="{article.published}">{article.published}</time>{tags}</div>
  </a>
</li>"""
        )
    body = f"""<section class="hero">
  <h1>{html.escape(str(site["tagline"]))}</h1>
  <p>{html.escape(str(site["intro"]))}</p>
</section>
<ul class="cards">
{chr(10).join(cards)}
</ul>"""
    return layout(
        site,
        title=str(site["name"]),
        description=str(site["description"]),
        canonical="/",
        body=body,
    )


def render_article(site: dict[str, Any], article: Article) -> str:
    tags = "".join(f'<span class="tag">{html.escape(t)}</span>' for t in article.tags)
    body = f"""<article>
  <h1>{html.escape(article.title)}</h1>
  <div class="meta">
    <time datetime="{article.published}">公開 {article.published}</time>
    <time datetime="{article.updated}">更新 {article.updated}</time>{tags}
  </div>
  <p class="lead">{html.escape(article.description)}</p>
  {article.body_html}
  <p class="note">{html.escape(str(site["disclosure"]))}</p>
  <p class="back"><a href="/">記事一覧へ戻る</a></p>
</article>"""
    return layout(
        site,
        title=f"{article.title}｜{site['name']}",
        description=article.description,
        canonical=article.url,
        body=body,
    )


def render_about(site: dict[str, Any]) -> str:
    body = f"""<article>
  <h1>このサイトについて</h1>
  {markdown.markdown(str(site["about"]), extensions=["extra"])}
  <p class="note">{html.escape(str(site["disclosure"]))}</p>
</article>"""
    return layout(
        site,
        title=f"このサイトについて｜{site['name']}",
        description=str(site["description"]),
        canonical="/about/",
        body=body,
    )


def render_sitemap(site: dict[str, Any], articles: list[Article]) -> str:
    base = str(site["base_url"]).rstrip("/")
    urls = ["/", "/about/"] + [a.url for a in articles]
    entries = "".join(f"<url><loc>{base}{u}</loc></url>" for u in urls)
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{entries}</urlset>\n'


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def check_banned(site: dict[str, Any], articles: list[Article]) -> list[str]:
    """誇張・断定表現が混入していないか検査する。"""
    banned = [str(w) for w in (site.get("banned_expressions") or [])]
    problems: list[str] = []
    for article in articles:
        plain = re.sub(r"<[^>]+>", "", article.body_html)
        for word in banned:
            if word and word in plain:
                problems.append(f"{article.slug}: 禁止表現『{word}』")
    return problems


def main() -> int:
    site = load_site()
    articles = load_articles()

    problems = check_banned(site, articles)
    if problems:
        for problem in problems:
            print(f"NG  {problem}")
        raise SystemExit("禁止表現が含まれています。修正してください。")

    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir(parents=True)

    write(DIST / "index.html", render_index(site, articles))
    write(DIST / "about" / "index.html", render_about(site))
    for article in articles:
        write(DIST / article.slug / "index.html", render_article(site, article))
    write(DIST / "sitemap.xml", render_sitemap(site, articles))
    write(
        DIST / "robots.txt",
        f"User-agent: *\nAllow: /\nSitemap: {str(site['base_url']).rstrip('/')}/sitemap.xml\n",
    )

    for asset in PUBLIC.iterdir():
        shutil.copy2(asset, DIST / asset.name)

    print(f"生成しました: {len(articles)} 記事 → {DIST}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
