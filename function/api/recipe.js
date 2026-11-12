export function onRequestGet() {
  const data = {
    recipes: [
      {
        name: "卵かけごはん",
        ingredients: ["卵 1個", "ごはん 1杯"],
        steps: ["ごはんに卵をのせる", "しょうゆをかける"],
      },
    ],
  };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
