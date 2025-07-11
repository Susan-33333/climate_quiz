<button
  onClick={async () => {
    const payload = {
      township: "台南市安平區",
      answers: [0, 1, 2, 0, 1, 2, 1, 1, 0, 2],
    };

    const res = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    console.log("後端回傳分數：", result);
  }}
  className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
>
  測試送出作答
</button>
