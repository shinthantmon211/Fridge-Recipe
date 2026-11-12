function add() {
  const item = document.getElementById("item").value;

  if (item === "") {
    return;
  }

  const li = document.createElement("li");
  li.textContent = item;

  const del = document.createElement("button");
  del.textContent = "削除";
  del.onclick = function () {
    li.remove();
  };
  li.appendChild(del);

  document.getElementById("list").appendChild(li);
}

document.getElementById("add").onclick = add;

async function ask() {
  const res = await fetch("/api/recipe");
  const data = await res.json();

  if (!res.ok) {
    document.getElementById("result").textContent = "エラー: " + data.error;
    return;
  }

  document.getElementById("result").textContent = data.recipes[0].name;
}

document.getElementById("search").onclick = ask;
