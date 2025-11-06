function rerenderMath() {
  if (window.renderMathInElement) {
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\(", right: "\\)", display: false },
        { left: "$", right: "$", display: false }
      ],
      throwOnError: false
    });
  }
}

window.__mountApp = function () {
  const root = document.getElementById("app");
  root.innerHTML = "";

  state.questions.forEach((q) => {
    const card = document.createElement("div");
    card.className = "card";

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.innerHTML = `<span class="tag">第 ${q.id} 題</span><span class="tag">${q.type}</span>`;

    const qtext = document.createElement("div");
    qtext.className = "qtext";
    qtext.innerHTML = q.render();

    const row = document.createElement("div");
    row.className = "answerRow";

    const result = document.createElement("span");
    result.className = "result";

    if (q.type === "單選題") {
      q.options.forEach((opt, i) => {
        const label = document.createElement("label");
        label.className = "opt";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `q${q.id}`;
        input.value = String(i + 1);
        label.appendChild(input);
        label.appendChild(document.createTextNode(opt));
        row.appendChild(label);
      });

      const btn = document.createElement("button");
      btn.className = "btn-check";
      btn.textContent = "檢查";
      btn.onclick = () => {
        const selected = [...row.querySelectorAll("input:checked")].map((el) => el.value);
        const ok = q.answerCheck(selected);
        q._ok = ok;
        result.textContent = ok ? "✔ 正確" : `✖ 錯誤（正解：${q.correct.join(", ")}）`;
        result.className = "result " + (ok ? "ok" : "no");
        showScore();
      };
      row.appendChild(btn);
      row.appendChild(result);
    }

    else if (q.type === "多選題") {
      q.options.forEach((opt, i) => {
        const label = document.createElement("label");
        label.className = "opt";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = String(i + 1);
        label.appendChild(input);
        label.appendChild(document.createTextNode(opt));
        row.appendChild(label);
      });

      const btn = document.createElement("button");
      btn.className = "btn-check";
      btn.textContent = "檢查";
      btn.onclick = () => {
        const selected = [...row.querySelectorAll("input:checked")].map((el) => el.value);
        const ok = q.answerCheck(selected);
        q._ok = ok;
        result.textContent = ok ? "✔ 正確" : `✖ 錯誤（正解：${q.correct.join(", ")}）`;
        result.className = "result " + (ok ? "ok" : "no");
        showScore();
      };
      row.appendChild(btn);
      row.appendChild(result);
    }

    else if (q.type === "選填題") {
      const inputs = q.correct.map((_, i) => {
        const input = document.createElement("input");
        input.className = "answer";
        input.placeholder = `填入第 ${i + 1} 格`;
        row.appendChild(input);
        return input;
      });

      const btn = document.createElement("button");
      btn.className = "btn-check";
      btn.textContent = "顯示參考答案";
      btn.onclick = () => {
        result.textContent = `參考答案：${q.correct.join(", ")}`;
        result.className = "result hint";
      };
      row.appendChild(btn);
      row.appendChild(result);
    }

    card.appendChild(meta);
    card.appendChild(qtext);
    card.appendChild(row);
    root.appendChild(card);
  });

  showScore();
  rerenderMath();
};

function showScore() {
  const total = state.questions.length;
  const ok = state.questions.filter((q) => q._ok).length;
  document.getElementById("scoreboard").textContent = `得分：${ok} / ${total}`;
}
