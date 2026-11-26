
## index.html の役割 / The role of index.html

index.html は画面の見た目だけを作る。ボタンを押したときの動きは script.js が担当する。 index.html only defines what the screen looks like. script.js decides what happens when a button is pressed.

JS と CSS は次の2行でつなぐ。`<link>` がないと、style.css を書いてもブラウザは読み込まない。 I connect JS and CSS with these two lines. Without the `<link>` line, the browser never loads style.css.

```html
<link rel="stylesheet" href="style.css" />
<script src="script.js"></script>
```

## 使ったタグ / Tags I used

`<input>` は文字を入力する欄、`<button>` はボタン、`<p>` は段落。 `<input>` is a text box, `<button>` is a button, and `<p>` is a paragraph.

`<ul>` は番号なしのリスト、`<ol>` は番号つきのリストで、中の1行は `<li>` で書く。 `<ul>` is a bulleted list and `<ol>` is a numbered list. Each line inside is an `<li>`.

`<p>` の中に `<li>` は入れられないので、リストを表示するときは `<ul>` を使う。 A `<li>` cannot go inside a `<p>`, so I used a `<ul>` to show lists.

`<ol>` は番号を自動でつける。調理手順の「1. 2. 3.」は Gemini ではなく `<ol>` がつけている。 `<ol>` adds numbers automatically. The "1. 2. 3." in the cooking steps comes from `<ol>`, not from Gemini.

## アプリの画面と id / Screen parts and their ids

```html
<input id="item" placeholder="食材名" />
<button id="add">追加</button>
<ul id="list"></ul>

<button id="search">レシピを探す</button>
<p id="result"></p>
<ul id="recipes"></ul>
<ol id="steps"></ol>
```

`item` は食材の入力欄、`list` は食材のリスト、`result` は注意や読み込み中やエラーの表示、`recipes` は料理名3つ、`steps` は作り方。 `item` is the ingredient input, `list` is the ingredient list, `result` shows messages, loading text, and errors, `recipes` holds the three dish names, and `steps` holds the cooking steps.

`item`（入力欄）と `list`（リスト）は間違えやすいので、迷ったら index.html を開いて確認する。 I mixed up `item` (the input) and `list` (the list), so when I am unsure I open index.html and check.

## id と class / id vs class

id は1つの要素だけにつける名前。class はグループや状態を表す名前で、あとから付けたり外したりできる。 An id names one single element. A class names a group or a state, and it can be added or removed later.

CSS では id を `#recipes`、class を `.selected` と書く。JS では id を `getElementById("recipes")` で探し、class は `classList.add("selected")` で付ける。 In CSS an id is written `#recipes` and a class `.selected`. In JS I find an id with `getElementById("recipes")` and add a class with `classList.add("selected")`.

## HTML の id と JS の変数は別物 / HTML ids are not JS variables

`getElementById()` は HTML の id だけを探す。JS の変数名（たとえば `memo`）を渡しても見つからず、`null` が返ってエラーになる。 `getElementById()` only searches HTML ids. If I pass a JS variable name such as `memo`, it finds nothing, returns `null`, and the next line throws an error.

```javascript
document.getElementById("memo");    // null（HTML に id="memo" はない / no id="memo" in the HTML）
document.getElementById("result");  // <p id="result">
```

## HTML ファイルとブラウザの中の状態 / The file vs what the browser shows

`<li>` は JS が実行中に作って追加するので、HTML ファイルには空の `<ul id="recipes"></ul>` だけを書いておけばいい。 JS creates and adds the `<li>` elements while the app runs, so the HTML file only needs an empty `<ul id="recipes"></ul>`.

`selected` のような class も HTML に直接書かず、クリックしたときに JS で付ける。 Classes like `selected` are not written in the HTML. JS adds them when the user clicks.


```bash
npx wrangler pages dev public
```