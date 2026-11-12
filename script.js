function add() {
  const item = document.getElementById("item").value;

  if (item === "") {
    return;
  }

  const li = document.createElement("li");
  li.textContent = item;

  document.getElementById("list").appendChild(li);
}

document.getElementById("add").onclick = add;
