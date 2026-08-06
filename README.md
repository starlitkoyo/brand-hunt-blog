# ルナのブランド巡回ノート

Amazonでブランド品を買うときの見方をまとめたブログ。
Markdown で記事を書き、静的HTMLを生成して公開します。

Xアカウント「🌙 ルナ｜ブランドハンター」と同じ人格で運営します。
自動投稿システム本体は別リポジトリ（`amazon-deal-x-bot`）です。

## このブログの役割

Amazonアソシエイトの審査には **申込から180日以内に3件の適格販売** が必要です。
フォロワー数ではなく「買う気で検索してきた人」を連れてくるのがこのブログの仕事です。

## 使い方

### 準備（初回だけ）

```bash
python -m venv .venv
.venv\Scripts\activate        # macOS/Linux は source .venv/bin/activate
pip install -r requirements.txt
```

### 記事を書く

`content/articles/` に `.md` ファイルを追加します。ファイル名の数字は並び順用です。

```markdown
---
slug: "url-になる文字列"
title: "記事タイトル"
description: "検索結果に出る説明文。120文字くらい"
published: "2026-08-07"
tags: ["タグ1", "タグ2"]
---

本文をMarkdownで書きます。
```

### ビルド

```bash
python build.py
```

`dist/` に静的HTMLが出ます。**禁止表現が含まれているとビルドが失敗します**
（`content/site.yaml` の `banned_expressions`）。

### ローカルで確認

```bash
python -m http.server 8899 --directory dist
```

http://127.0.0.1:8899/ を開きます。

## 公開手順（Vercel）

1. ドメインを取得する
2. `content/site.yaml` の `base_url` を実際のドメインに差し替える
3. `python build.py` で再生成
4. GitHubにpush
5. Vercelでリポジトリを取り込む（`vercel.json` があるのでビルド設定は不要）
6. Vercelの Domains でドメインを接続

`dist/` もコミットします。ホスティング側でビルドを走らせない構成です。

## 書くときのルール

- **誇張・断定をしない。** 「絶対」「正規品」「最安値保証」などは使わない（ビルドで検査）
- 割引率を書くときは **必ず比較の相手を明記する**（例「過去90日の中央値と比べて」）
- 真贋の鑑定や判定はしない
- 価格・在庫は変動するので「掲載時点の情報」と添える
- アフィリエイトリンクを入れる記事には、Amazonアソシエイトの表記を出す（フッターに常時表示）

## 記事のストック

- [x] 01 Amazonでブランドバッグを買うとき、最初に見るのは「販売元」の欄
- [x] 02 Amazonの「参考価格」と割引率の読み方
- [x] 03 通勤用A4トートの選び方
- [x] 04 Amazon販売とマーケットプレイス出品の違い
- [x] 05 二つ折りと長財布、カード枚数で選ぶ
- [x] 06 腕時計のケース径の測り方と目安
- [x] 07 Amazonの大型セール時期と、セール外で下がるパターン
- [x] 08 ブランド小物のギフト選び（予算別）
- [x] 09 ほしい物リストで値段の変化を追う
- [x] 10 ブランド品を買う前に返品条件を見ておく理由

## 関連

- 自動投稿システム：`C:\Users\saltl\amazon-deal-x-bot`
- アカウント設計・投稿原稿：`Momo_vault\09_Amazon値下げX\`
