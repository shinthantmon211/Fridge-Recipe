const memo = JSON.parse(localStorage.getItem("memo")) || [];
function add() {
  const item = document.getElementById("item").value;

  if (item === "") {
    return;
  }

  memo.push(item);
  localStorage.setItem("memo", JSON.stringify(memo));

  document.getElementById("item").value = "";

  showItem(item);
}

document.getElementById("add").onclick = add;
document.getElementById("item").onkeydown = function (e) {
  //Add ingredient with Enter key
  if (e.key === "Enter" && !e.isComposing) {
    add();
  }
};

for (const x of memo) {
  showItem(x);
}
async function ask() {
  if (memo.length === 0) {
    document.getElementById("result").textContent = "食材を入れてください！";
    return;
  }

  document.getElementById("result").textContent = "レシピを考え中";
  const res = await fetch("/api/recipe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      things: memo,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    document.getElementById("result").textContent = "エラー: " + data.error;
    return;
  }
  document.getElementById("result").textContent = "";
  document.getElementById("recipes").textContent = "";
  document.getElementById("steps").textContent = "";
  for (const r of data.recipes) {
    const li = document.createElement("li");
    li.textContent = r.name;
    li.onclick = function () {
      document
        .querySelector("#recipes li.selected")
        ?.classList.remove("selected");
      li.classList.add("selected");
      showSteps(r.name);
    };
    document.getElementById("recipes").appendChild(li);
  }
}

document.getElementById("search").onclick = ask;

async function showSteps(dish) {
  document.getElementById("result").textContent = "レシピの手順を探してます。";

  const res = await fetch("/api/steps", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dish }),
  });

  const data = await res.json();
  if (!res.ok) {
    document.getElementById("result").textContent =
      "手順を取得できませんでした:" + data.error;
    return;
  }

  document.getElementById("steps").textContent = "";
  for (const s of data.steps) {
    const li = document.createElement("li");
    li.textContent = s;
    document.getElementById("steps").appendChild(li);
  }
  document.getElementById("result").textContent = "";
}

function showItem(item) {
  const li = document.createElement("li");
  li.textContent = item;

  const del = document.createElement("button");
  del.textContent = "削除";
  del.onclick = function () {
    li.remove();
    const i = memo.indexOf(item);

    memo.splice(i, 1);
    localStorage.setItem("memo", JSON.stringify(memo));
  };
  li.appendChild(del);

  document.getElementById("list").appendChild(li);
}
