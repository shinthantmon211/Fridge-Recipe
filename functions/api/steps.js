const MODEL = "gemini-3.5-flash-lite";

export async function onRequestPost({ env, request }) {
  const body = await request.json();
  console.log(body.dish);

  const dish = body.dish;

  let res;
  for (let attempt = 1; attempt <= 3; attempt++) {
    res = await callGemini(env, dish);
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

  const steps = text.split("\n");

  return new Response(JSON.stringify({ steps }), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function callGemini(env, dish) {
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
                text: `${dish}の作り方を1行に1つずつ簡単に手順だけ、番号なしでお願いします。`,
              },
            ],
          },
        ],
      }),
    },
  );
}
