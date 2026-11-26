## 変数 / Variables

`const` はあとで変えない変数、`let` はあとで変えられる変数。 `const` is for a variable that does not change, and `let` is for one that can change later.

同じ名前の `const` は2回作れない。作っていない名前を使うと `ReferenceError` になる。 I cannot declare the same `const` name twice, and using a name I never declared gives a `ReferenceError`.

変数名は中身がわかる名前にする。`things.things` より `body.things` のほうが読みやすい。 Variable names should say what they hold. `body.things` reads better than `things.things`.

## 比較と条件 / Comparisons and conditions

`=` は値を入れる、`===` は同じかどうか調べる、`!==` は違うかどうか調べる。 `=` assigns a value, `===` checks if two values are equal, and `!==` checks if they differ.

`!A` は「A ではないとき」、`A && B` は「A と B の両方が正しいとき」、`A || B` は「A がないときは B を使う」。 `!A` means "when A is not true", `A && B` means "when both are true", and `A || B` means "use B when A is empty".

`if` の条件は全部 `( )` の中に書く。 The whole condition of an `if` goes inside `( )`.

```javascript
if (memo.length === 0) { }    // 正しい / correct
if (memo.length) === 0 { }    // エラー / error
```

`if (item = "")` は比較ではなく代入なので、`const` ならエラー、`let` なら中身が消える。`if` の中に `=` が1つだけあったら疑う。 `if (item = "")` assigns instead of comparing. With `const` it throws, and with `let` it wipes the value. I get suspicious when I see a single `=` inside an `if`.

`0 === ""` は `false`。数字と文字列は型が違うので一致しない。 `0 === ""` is `false` because a number and a string are different types.

`if (...) return;` を関数の最初に置くと、条件に合わないときにそこで止められる。空の食材を追加しないチェックに使った。 Putting `if (...) return;` at the top of a function stops it early. I used it to block empty ingredients.

```javascript
if (item === "") {
  return;
}
```

## 配列 / Arrays

`push(x)` は最後に追加、`indexOf(x)` は位置を探す（ないと `-1`）、`splice(i, 1)` は `i` 番目から1つ削除。 `push(x)` adds to the end, `indexOf(x)` finds the index (`-1` if missing), and `splice(i, 1)` removes one item at `i`.

```javascript
memo.push(item);
const i = memo.indexOf(item);
memo.splice(i, 1);
```

`splice(-1, 1)` は最後の要素を消してしまう。`indexOf` に正しい値を渡さないと、関係ない食材が消える。 `splice(-1, 1)` removes the last item. If `indexOf` gets the wrong value, an unrelated ingredient disappears.

`length` は個数で、空なら `0`。`[0]` は最初の1つ。 `length` is the number of items, `0` when empty. `[0]` is the first item.

`join` は配列を文字列に、`split` は文字列を配列にする。 `join` turns an array into a string, and `split` turns a string into an array.

```javascript
["卵", "ねぎ"].join("、");          // "卵、ねぎ"
"ねぎ玉\n卵スープ".split("\n");      // ["ねぎ玉", "卵スープ"]
```

`join` は配列のメソッドなので、文字列には使えない。料理名が1つ（文字列）のときは、そのまま使えばいい。 `join` is an array method and does not work on a string. When there is only one dish name, I use the string as it is.

`filter` は条件に合うものだけを残した新しい配列を返す。メソッドはつなげて書けて、左から順に実行される。 `filter` returns a new array with only the items that match. Methods can be chained, and they run from left to right.

```javascript
const names = text.split("\n").filter((s) => s.trim() !== "");
```

`trim()` は前後の空白を消す。`(s) => ...` はアロー関数で、`function (s) { return ...; }` の短い書き方。 `trim()` removes spaces at both ends. `(s) => ...` is an arrow function, a short way to write `function (s) { return ...; }`.

## ループ / Loops

```javascript
for (let attempt = 1; attempt <= 3; attempt++) { }   // 回数で回す / count-based
for (const r of data.recipes) { }                     // 配列の1つずつ / each item in an array
```

文字列を `for...of` で回すと、1文字ずつ出てくる。オブジェクトを `for...of` で回すとエラー（`is not iterable`）になる。 Looping over a string with `for...of` gives one character at a time, and looping over an object throws `is not iterable`.

## オブジェクト / Objects

`.` は「〜の中の」という意味。`data.recipes[0].name` は、data の中の recipes 配列の、最初の要素の name。 `.` means "inside of". `data.recipes[0].name` is the name of the first item in the recipes array inside data.

`{ name }` は `{ name: name }` の省略形。`{ env, request }` は受け取ったオブジェクトから名前で取り出す書き方で、順番は関係ない。 `{ name }` is short for `{ name: name }`. `{ env, request }` picks values out of an object by name, and the order does not matter.

`?.` は「あれば実行、なければ飛ばす」。`querySelector` が `null` を返しても、エラーにならない。 `?.` means "run it if the value exists, skip it if not", so a `null` from `querySelector` does not throw.

```javascript
document.querySelector("#recipes li.selected")?.classList.remove("selected");
```

## DOM（画面の操作） / DOM (changing the page)

`getElementById("id")` は id で探し、`querySelector()` は CSS セレクタで探す。見つからないとどちらも `null`。 `getElementById("id")` finds by id, and `querySelector()` finds with a CSS selector. Both return `null` when nothing matches.

`createElement("li")` で要素を作り、`appendChild(li)` で画面に追加し、`remove()` で消す。作っただけでは画面に出ない。 `createElement("li")` makes an element, `appendChild(li)` puts it on the page, and `remove()` deletes it. Creating it alone does not show it.

```javascript
const li = document.createElement("li");
li.textContent = r.name;
document.getElementById("recipes").appendChild(li);
```

`=` の左にあれば書き込み、右にあれば読み込み。 On the left of `=` it writes, and on the right it reads.

```javascript
const item = document.getElementById("item").value;   // 読む / read
document.getElementById("item").value = "";           // 書く / write
```

`textContent` は子要素の文字もまとめて返す。削除ボタンを入れた `li` は `"卵削除"` になるので、食材名は別の変数から取る。 `textContent` also returns the text of child elements. An `li` with a delete button reads `"卵削除"`, so I take the ingredient name from a separate variable.

`appendChild` は前の内容を消さずに足していく。もう一度検索するときは、先に `textContent = ""` で前の結果を消す。 `appendChild` keeps what is already there. Before showing new search results, I clear the old ones with `textContent = ""`.

`classList.add()` と `classList.remove()` で class を付けたり外したりする。選んだ料理だけに色をつけるため、前の選択を外してから付けた。 `classList.add()` and `classList.remove()` add and remove a class. To highlight only the chosen dish, I remove the old selection first and then add the new one.

```javascript
li.onclick = function () {
  document.querySelector("#recipes li.selected")?.classList.remove("selected");
  li.classList.add("selected");
  showSteps(r.name);
};
```

## イベント / Events

`button.onclick = add` は「押したときに実行する」、`add()` は「今すぐ実行する」。`onclick` は `<button>` だけでなく `<li>` にも使える。 `button.onclick = add` means "run when clicked", while `add()` means "run now". `onclick` works on `<li>` as well as `<button>`.

`onkeydown` はキーを押すたびに実行される。`e.key` で押したキーがわかり、`e.isComposing` で日本語の変換中かどうかがわかる。 `onkeydown` runs on every key press. `e.key` tells me which key was pressed, and `e.isComposing` tells me whether Japanese input is still converting.

Enter キーで追加するとき、日本語の確定の Enter でも反応してしまったので `!e.isComposing` を条件に入れた。 When adding with Enter, the Enter that confirms Japanese conversion also fired, so I added `!e.isComposing` to the condition.

```javascript
document.getElementById("item").onkeydown = function (e) {
  if (e.key === "Enter" && !e.isComposing) {
    add();
  }
};
```

## クロージャ / Closures

ループの中で作った関数は、そのときの変数（`r` や `item`）を覚えている。だから削除ボタンや料理名をそれぞれ押したとき、正しい食材や料理が使われる。 A function created inside a loop remembers the variables from that moment (`r`, `item`). That is why each delete button and each dish name uses its own value.

## async / await と fetch / async, await, and fetch

`async` は待つ処理を含む関数につけ、`await` は結果が来るまで待つ。 `async` marks a function that waits for something, and `await` waits until the result arrives.

`JSON.stringify()` はオブジェクトを文字列に、`res.json()` は文字列をオブジェクトにする。`res.ok` は成功なら `true`。 `JSON.stringify()` turns an object into a string, and `res.json()` turns a string into an object. `res.ok` is `true` on success.

読み込み中の表示は `await fetch` の前に書く。後ろに書くと、待ち終わってから表示されるので意味がない。 The loading message goes before `await fetch`. If it comes after, it only appears once the wait is over.

```javascript
document.getElementById("result").textContent = "レシピを考え中";
const res = await fetch("/api/recipe", { ... });
```

似た関数（`ask()` と `showSteps()`）には、同じようにエラーのチェックを入れる。 Functions that do similar work (`ask()` and `showSteps()`) need the same error check.

```javascript
if (!res.ok) {
  document.getElementById("result").textContent = "手順を取得できませんでした: " + data.error;
  return;
}
```

## localStorage

localStorage はブラウザの中のノートのようなもので、再読み込みやブラウザを閉じても消えない。文字列しか保存できないので、配列は JSON に変換する。 localStorage works like a notebook inside the browser. It survives a reload and closing the browser. It only stores strings, so I convert arrays to JSON.

```javascript
localStorage.setItem("memo", JSON.stringify(memo));               // 保存 / save
const memo = JSON.parse(localStorage.getItem("memo")) || [];     // 読み込み / load
```

初めて開いたときは `getItem` が `null` を返すので、`|| []` で空の配列から始める。 On the first visit `getItem` returns `null`, so `|| []` starts with an empty array.

`JSON.stringify` を付けずに保存すると、保存のときはエラーにならないが、次に開いたとき `JSON.parse` でエラーになる。`stringify` と `parse` はセットで使う。 Saving without `JSON.stringify` gives no error at first, but `JSON.parse` fails the next time the page opens. I always use `stringify` and `parse` as a pair.

`memo` を変える場所（`push` と `splice`）の両方で保存する。 I save in both places that change `memo` (`push` and `splice`).

## コードの順番 / Code order

コードは上から下に実行される。使うデータは先に準備しておく。 Code runs from top to bottom, so the data I need must be ready first.

`function 名前() {}` は、ファイルのどこからでも呼べる。`const` の変数は、その行より後でしか使えない。 A `function name() {}` can be called from anywhere in the file, but a `const` variable only works after its line.

## リファクタリング / Refactoring

`add()` が「入力を読んで保存する」と「画面にリストを表示する」の2つの仕事をしていたので、表示の部分を `showItem()` に分けた。新しいコードは書かず、場所を移しただけ。これで、ページを開いたときに保存済みの食材を表示するループからも `showItem()` を使えるようになった。 `add()` was doing two jobs, reading and saving the input and drawing the list item. I moved the drawing part into `showItem()` without writing new code. Now the loop that shows saved ingredients on page load can use `showItem()` too.

```javascript
for (const x of memo) {
  showItem(x);
}
```

