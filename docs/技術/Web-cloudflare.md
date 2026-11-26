## アプリの全体像 / How the app fits together

index.html は画面、script.js はユーザーのブラウザで動くコード、functions の中のファイルは Cloudflare のサーバーで動くコード。ブラウザがサーバーに食材を送り、サーバーが Gemini API に質問して、答えをブラウザに返す。 index.html is the screen, script.js runs in the user's browser, and the files in functions run on Cloudflare's server. The browser sends the ingredients to the server, the server asks the Gemini API, and the answer goes back to the browser.

## ブラウザとサーバーは別のコンピュータ / The browser and the server are different computers

script.js の変数（`memo` など）は、サーバーの recipe.js からは見えない。データはリクエストの body に入れて送る必要がある。 The server code in recipe.js cannot see variables in script.js such as `memo`. Data has to travel in the request body.

ブラウザで受け取る返事は `res`、サーバーで受け取るリクエストは `request`。 In the browser the reply is `res`, and on the server the incoming request is `request`.

## API キーをサーバーに置く理由 / Why the API key stays on the server

ブラウザのコードは誰でも見られる。API キーを書くと他の人に勝手に使われ、無料枠を使い切られたりお金がかかったりする可能性がある。だから Cloudflare の環境変数（`env.GEMINI_API_KEY`）に置いて、ブラウザのコードには書かない。 Anyone can read browser code. If the API key is there, someone else can use it, burn through the free quota, or run up a bill. So the key lives in a Cloudflare environment variable (`env.GEMINI_API_KEY`) and never appears in browser code.

## GET と POST、fetch の3つの部分 / GET, POST, and the three parts of fetch

GET はデータを受け取るだけ。POST はデータを送ってから返事をもらう。 GET only fetches. POST sends data and then gets a reply.

`method` は送り方、`headers` は封筒の外に書くメモ（中身の種類など）、`body` は封筒の中身（実際に送るデータ）。 `method` is how to send, `headers` are notes on the outside of the envelope (like the content type), and `body` is what is inside the envelope.

```javascript
await fetch("/api/recipe", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ things: memo }),
});
```

## Cloudflare Pages Functions

`functions/api/recipe.js` というファイルを置くと、`/api/recipe` という URL になる。関数の名前で、どのリクエストを受けるかが決まる。`onRequestGet` は GET のとき、`onRequestPost` は POST のときに実行される。 A file at `functions/api/recipe.js` becomes the URL `/api/recipe`. The function name decides which requests it handles. `onRequestGet` runs for GET and `onRequestPost` runs for POST.

POST で送っているのに `onRequestGet` しかないと、関数は呼ばれず 405 エラーになる。 If the browser sends POST and only `onRequestGet` exists, the function never runs and the server returns 405.

```javascript
export async function onRequestPost({ env, request }) {
  const body = await request.json();
  const foods = body.things.join("、");
  // ...
  return new Response(JSON.stringify({ recipes }), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
```

`charset=utf-8` を付けると日本語が文字化けしない。 `charset=utf-8` keeps Japanese text from breaking.

## 2つの API / The two APIs

`/api/recipe` は食材の配列を受け取り、Gemini に料理名を3つ聞いて、料理名のリストを返す。`/api/steps` は料理名を1つ受け取り、作り方を聞いて、手順のリストを返す。 `/api/recipe` receives an array of ingredients, asks Gemini for three dish names, and returns them as a list. `/api/steps` receives one dish name, asks how to make it, and returns the steps as a list.

```javascript
// script.js から送るもの / what script.js sends
{ things: ["卵", "ねぎ"] }   // /api/recipe
{ dish: "ねぎ玉" }           // /api/steps

// サーバーが返すもの / what the server returns
{ recipes: [{ name: "ねぎ玉" }, ...] }
{ steps: ["卵を割る", ...] }
```

API は「何を受け取るか、何を聞くか、何を返すか」の3つで考えると整理しやすい。ファイルの形は同じで、この3か所だけが違う。 I think of an API as three questions: what it receives, what it asks, and what it returns. Both files share the same structure and differ only in those three places.

送る側のキー名と受け取る側のキー名は同じにする。`{ steps: dish }` と送って `body.dish` で読むと `undefined` になり、エラーが出ないまま「undefinedの作り方」と質問してしまう。 The key name must match on both sides. Sending `{ steps: dish }` and reading `body.dish` gives `undefined`, and with no error shown, the app asks Gemini how to cook "undefined".

## HTTP ステータス / HTTP status codes

200 は成功、404 は見つからない、405 はこのメソッドを受け付けない、503 はサーバーが混んでいるという意味。 200 means success, 404 means not found, 405 means the method is not allowed, and 503 means the server is busy.

503 のときは少し待ってから最大3回まで聞き直すようにした。 On 503 the server waits a little and retries, up to three times.

```javascript
for (let attempt = 1; attempt <= 3; attempt++) {
  res = await callGemini(env, foods);
  if (res.status !== 503) break;
  await new Promise((r) => setTimeout(r, 1000 * attempt));
}
```

## AI に質問するときのコツ / Writing prompts for the AI

答えの形をはっきり指定する（「1行に1つずつ」「料理名だけで」「番号なしで」）。形が決まっていると、`split("\n")` でプログラムが扱いやすい。 I specify the answer format clearly ("one per line", "names only", "no numbers"). A fixed format is easy to handle with `split("\n")`.

```javascript
text: `${foods}で作れる料理名を3つ、1行に1つずつ、料理名だけで答えてください`,
```

AI の答えは間違えることがある。実際に「ガーリックシュリンpライス」のような誤字や、冷蔵庫にない材料（卵など）を使った手順が返ってきた。 AI answers can be wrong. I actually got a typo like "ガーリックシュリンpライス" and steps that used ingredients I did not have, such as eggs.

Gemini は答えの最後に空の行を入れることがあるので、`filter` で空の行を消してから表示する。 Gemini sometimes adds empty lines at the end, so I remove them with `filter` before showing the result.

AI の処理は数秒かかるので、待っている間は「考え中」と表示する。 The AI takes a few seconds, so the app shows a "thinking" message while waiting.

## データを保存する場所 / Where data is stored

JS の変数はブラウザのメモリにあり、再読み込みで消える。localStorage はユーザーの端末のブラウザにあり、消すまで残る。 JS variables live in the browser's memory and disappear on reload. localStorage lives in the browser on the user's device and stays until deleted.

食材リストは localStorage に保存した。端末ごとに別なので、Mac で追加した食材はスマホには出てこない。PRD の非ゴール（クラウド同期はしない）どおり。 The ingredient list is saved in localStorage. Each device has its own copy, so ingredients added on my Mac do not show up on my phone. That matches the PRD non-goal of no cloud sync.

## Wrangler

Wrangler は Cloudflare をパソコンから操作するためのコマンドラインツール。 Wrangler is a command-line tool for controlling Cloudflare from my computer.

```bash
npx wrangler pages dev public        # ローカルで動かす / run locally
npx wrangler login                   # ログイン / log in
npx wrangler whoami                  # ログイン確認 / check login
npx wrangler pages deploy public     # デプロイ / deploy
npx wrangler pages secret put GEMINI_API_KEY --project-name=fridge-recipe   # API キーを登録 / set the API key
```

ローカルでは `.dev.vars` のキー、Cloudflare 上では `secret put` で登録したキーが使われる。secret は次のデプロイから有効になるので、登録したあともう一度デプロイした。 Locally the key comes from `.dev.vars`, and on Cloudflare it comes from `secret put`. A secret only takes effect on the next deploy, so I deployed again after setting it.

Live Server ではサーバーのコードが動かないので、`/api/recipe` は 404 になる。 Live Server cannot run the server code, so `/api/recipe` returns 404 there.

## public フォルダを分けた理由 / Why I split out a public folder

`npx wrangler pages deploy .` のようにフォルダ全体をデプロイすると、`.dev.vars`（API キー）までネットに公開される可能性がある。そこで公開するファイル（index.html、script.js、style.css）だけを `public/` に入れ、`functions/` と `.dev.vars` はその外に置いた。デプロイ結果は「Uploaded 3 files」で、公開されたのはこの3つだけだった。 Deploying the whole folder with `npx wrangler pages deploy .` could publish `.dev.vars`, which holds the API key. So I put only the public files (index.html, script.js, style.css) in `public/` and kept `functions/` and `.dev.vars` outside it. The deploy reported "Uploaded 3 files", meaning only those three went online.

## デプロイの流れ / Deploy steps

まず `npx wrangler login` でブラウザから Cloudflare にログインした。次に `npx wrangler pages deploy public` を実行し、プロジェクト名（小文字・数字・ハイフンのみ）と本番ブランチ `main` を入力した。そのあと `secret put` で API キーを登録してもう一度デプロイし、スマホで本番 URL を開いて確認した。 First I logged in to Cloudflare through the browser with `npx wrangler login`. Next I ran `npx wrangler pages deploy public` and entered a project name (lowercase letters, numbers, and hyphens only) and the production branch `main`. Then I set the API key with `secret put`, deployed again, and opened the production URL on my phone to check it.

URL は2種類ある。`https://2d1a866f.fridge-recipe-dgb.pages.dev` はそのデプロイ専用で、`https://fridge-recipe-dgb.pages.dev` はいつも最新版を表示する。 There are two kinds of URL. `https://2d1a866f.fridge-recipe-dgb.pages.dev` belongs to that single deploy, and `https://fridge-recipe-dgb.pages.dev` always shows the latest version.

## つまずいたこと / Problems I ran into

`GET / 404 Not Found` が出たのは、コマンドと一緒に `#` のコメントまでコピーしたから。Mac の zsh は `#` をコメントとして扱わないので、コマンドだけをコピーする。 I got `GET / 404 Not Found` because I copied a `#` comment along with the command. Mac's zsh does not treat `#` as a comment by default, so I copy only the command.

デプロイ直後に `ERR_SSL_VERSION_OR_CIPHER_MISMATCH` が出たのは、新しいデプロイの SSL 証明書がまだできていなかったから。数分待つと開けた。 Right after deploying I got `ERR_SSL_VERSION_OR_CIPHER_MISMATCH` because the SSL certificate for the new deploy was not ready yet. It opened after a few minutes.

`No compatibility_date` の警告はエラーではなく、推奨の案内だった。 The `No compatibility_date` warning was a recommendation, not an error.

スマホで食材リストが空だったのは、localStorage が端末ごとに別だからで、想定どおりの動きだった。 The ingredient list was empty on my phone because localStorage is separate on each device, which is the expected behavior.