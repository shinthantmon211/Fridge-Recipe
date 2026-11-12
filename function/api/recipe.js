const MODEL = "gemini-3.8-flash";

export async function onRequestGet({ env }) {
  const res = await fetch(
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
                text: "卵とねぎで作れる料理名を1つだけ、料理名だけで答えてください",
              },
            ],
          },
        ],
      }),
    },
  );

  const data = await res.json();
  console.log(JSON.stringify(data));

  const name = data.candidates[0].contents.parts[0].text;

  return new Response(JSON.stringify({ recipes: [{ name }] }), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
