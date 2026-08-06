# LUNA BRAND HUNT ｜ ルナのブランド巡回ノート

Amazonのブランド商品を、編集メディアの見せ方で紹介するWebサイトです。

> いいものを、いい価格で。

## 現在の状態

**Phase 1（静的UI＋モックデータ）まで完了**しています。
Supabase、Amazon Creators API、定期更新、管理画面は未実装です。

| Phase | 内容                          | 状態             |
| ----- | ----------------------------- | ---------------- |
| 1     | 静的UI・モックデータ          | ✅ 完了          |
| 2     | Supabase接続                  | 未着手           |
| 3     | Amazon Creators APIアダプター | 未着手           |
| 4     | Vercel Cronによる定期更新     | 未着手           |
| 5     | 管理画面                      | 未着手           |
| 6     | QA                            | 一部（下記参照） |

## 技術構成

- Next.js 16（App Router）
- React 19
- TypeScript 5.9（strict / noUncheckedIndexedAccess）
- Tailwind CSS 4（CSS-first。デザイントークンは `app/globals.css` の CSS Custom Properties）
- Vitest 4
- ESLint 9 + eslint-config-next / Prettier

UIライブラリ、アニメーションライブラリは追加していません。

## ローカル起動

```bash
npm install
npm run dev
```

http://localhost:3000 が開きます。**環境変数が無くてもモックデータで動作します。**

## コマンド

```bash
npm run dev                 # 開発サーバー
npm run build               # 本番ビルド
npm run start               # 本番サーバー
npm run lint                # ESLint
npm run typecheck           # tsc --noEmit
npm run test                # Vitest
npm run format              # Prettier
npm run check:placeholders  # 公開前チェック（未置換の {{要確認: ...}} を検出）
```

記事の再生成:

```bash
node scripts/build-articles.mjs
```

`content/articles/*.md` を読み、`data/mock/articles.generated.ts` を書き出します。
Markdownをそのまま HTML 化せず、許可したブロック種別だけに変換します（任意HTMLを描画しないため）。

## 環境変数

`.env.example` をコピーして `.env.local` を作ります。

```bash
cp .env.example .env.local
```

**秘密値を `NEXT_PUBLIC_` に入れないでください。** ブラウザへ露出します。
`SUPABASE_SERVICE_ROLE_KEY` とAmazonの秘密値はサーバー専用です。

`NEXT_PUBLIC_SITE_URL` が未設定の場合、canonical と OG URL を出力しません
（架空のURLを出さないための仕様です）。本番公開前に設定してください。

## モックモード

`NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` が未設定のとき、
自動的にモックデータで動作します。

- ブランドはすべて架空（Atelier Nove / Maison Lueur / Calma Objects / Neri Beauty / Studio Aube）
- 商品16件、価格はサンプル値。すべて `isMock: true`
- **実在ブランドの価格・割引率は一切生成していません**
- 画面上部に「SAMPLE DATA」の帯を常時表示します

商品画像は `public/images/mock/` の抽象シルエットSVGです。
第三者のロゴ・商品写真は含めていません。

## 価格の扱い

事実でない数値を出さないための仕様です。

- 現在価格が取得できなければ「Amazonで現在の価格をご確認ください」と表示
- 参考価格が無ければ取り消し線を出さない
- 割引率は、現在価格と比較可能な参考価格の**両方**が妥当なときだけ計算（それ以外は `null`）
- 「通常価格」と断定せず「参考価格」と表記
- 価格の確認日時を必ず表示し、24時間以上経過したものには注意書きを添える
- 価格の確認日時と、記事の更新日時は別のものとして表示

## Amazonへのリンク

- `rel="nofollow sponsored noopener noreferrer"`
- 押す前に広告リンクと分かる補足文を表示
- 記事本文中のAmazonリンクには［広告］を表示
- 許可ホスト（amazon.co.jp / amzn.to）以外のURLは商品として扱わない（Open Redirect対策）

## ディレクトリ

```
app/(public)/       公開ページ（Route Group名はURLに出ません）
components/
  layout/           ヘッダー・フッター・モバイルメニュー・モーション
  editorial/        編集面（ヒーロー・特集・ブランド索引・カテゴリー）
  products/         商品カード・価格表示・Amazonリンク・開示表示
  articles/         記事本文レンダラー
  ui/               汎用部品
lib/                データ取得・整形・サイト定数・計測
data/mock/          サンプルデータ
types/              ドメイン型
tests/              Vitest
content/articles/   記事のMarkdown（原稿）
scripts/            記事変換・公開前チェック
```

## Vercelへのデプロイ

`vercel.json` に `framework: nextjs` を指定しているので、追加設定は不要です。

**注意：** このリポジトリは以前、静的サイトジェネレーター構成で `lunabrandhunt.com` に
デプロイされていました。pushすると自動デプロイが走り、**本番ドメインの内容が
サンプルデータのサイトに置き換わります。** 公開タイミングは意図して選んでください。

## 未確定事項

`npm run check:placeholders` で検出できます。公開前に置き換えてください。

| 項目                                    | 場所                                  |
| --------------------------------------- | ------------------------------------- |
| 運営者名                                | `lib/site.ts`                         |
| お問い合わせ方法                        | `lib/site.ts` / `/contact`            |
| プライバシーポリシー責任者              | `lib/site.ts`                         |
| Amazonアソシエイト指定表示              | `lib/site.ts` / `/advertising-policy` |
| SNS URL                                 | `lib/site.ts`                         |
| ブランド名とドメイン・Xアカウントの統一 | `lib/site.ts`                         |
| アクセス解析サービス                    | `lib/analytics.ts`                    |

### ブランド名について

識別子は統一済みです。サイト名は `lib/site.ts` の `SITE` で一元管理しています。

|          | 現状                                         |
| -------- | -------------------------------------------- |
| サイト名 | LUNA BRAND HUNT / ルナのブランド巡回ノート   |
| ドメイン | lunabrandhunt.com                            |
| X        | @luna_brandhunt（🌙 ルナ｜ブランドハンター） |

## 法務確認が必要な項目

- **Amazonアソシエイトの指定表示文言**：公開時点の規約を確認し、承認された文言に差し替えること。
  現在の文言は一般的な表現であり、「規約準拠済み」とは確認できていません。
- **Amazonの商標・ロゴ・商品画像・APIデータの利用範囲**：適用される規約と利用許諾の範囲で使用すること。
- **Product構造化データ**：当サイトは販売者ではないため、誤解を生む構造化データは実装していません。
  採用する場合は公式仕様を確認してください。
- **Cookie・アクセス解析の同意設計**：解析サービス導入時にプライバシーポリシーと合わせて確認すること。

## 公開前チェック

```bash
npm run check:placeholders
npm run lint
npm run typecheck
npm run test
npm run build
```

加えて、次を目視で確認してください。

- モバイル幅（375〜430px）での表示
- キーボードのみでの操作（Tab / Esc / Enter）
- `prefers-reduced-motion: reduce` での表示
- 画像が読み込めない場合の代替表示
