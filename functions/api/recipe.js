const MODEL = "gemini-3.5-flash-lite";

export async function onRequestPost({ env, request }) {
  const body = await request.json();
  console.log(body.things);

  const foods = body.things.join("、");

  let res;
  for (let attempt = 1; attempt <= 3; attempt++) {
    res = await callGemini(env, foods);
    if (res.status !== 503) break;
    await new Promise((r) => setTimeout(r, 1000 * attempt));
  }

  const data = await res.json();
  console.log(JSON.stringify(data));

  if (!res.ok) {
    return new Response(JSON.stringify({ error: data.error?.message }), {
      status: res.status,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const text = data.candidates[0].content.parts[0].text;

  const names = text.split("\n").filter((s) => s.trim() !== "");

  const recipes = [];
  for (const n of names) {
    recipes.push({ name: n });
  }

  return new Response(JSON.stringify({ recipes }), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function callGemini(env, foods) {
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${foods}で作れる料理名を3つ、1行に1つずつ、料理名だけで答えてください`,
              },
            ],
          },
        ],
      }),
    },
  );
}
