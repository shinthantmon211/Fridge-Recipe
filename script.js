const memo = [];
function add() {
  const item = document.getElementById("item").value;

  if (item === "") {
    return;
  }

  memo.push(item);

  const li = document.createElement("li");
  li.textContent = item;

  const del = document.createElement("button");
  del.textContent = "削除";
  del.onclick = function () {
    li.remove();
    const i = memo.indexOf(item);

    memo.splice(i, 1)
  };
  li.appendChild(del);

  document.getElementById("list").appendChild(li);
}

document.getElementById("add").onclick = add;

async function ask() {
  const res = await fetch("/api/recipe",{
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body : JSON.stringify({
      things: memo
    })

  });
  const data = await res.json();

  if (!res.ok) {
    document.getElementById("result").textContent = "エラー: " + data.error;
    return;
  }

  document.getElementById("result").textContent = data.recipes[0].name;
}

document.getElementById("search").onclick = ask;
