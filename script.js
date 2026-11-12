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
