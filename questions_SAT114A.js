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

const state = { questions: [] };

function singleQ(id, html, correct) {
  return {
    id,
    type: "單選題",
    render: () => html,
    options: ["(1)", "(2)", "(3)", "(4)", "(5)"],
    correct: [String(correct)],
    // 只要把使用者選到的第一個值拿來比就好
    answerCheck: (raw) => String(raw?.[0]) === String(correct),
  };
}


function multiQ(id, html, correctArray) {
  return {
    id,
    type: "多選題",
    render: () => html,
    options: ["(1)", "(2)", "(3)", "(4)", "(5)"],
    correct: correctArray.map(String),
    answerCheck: (rawArray) => {
      const user = new Set(rawArray.map(String));
      const correct = new Set(correctArray.map(String));
      const all = ["1", "2", "3", "4", "5"];
      let score = 0;
      for (const opt of all) {
        if (user.has(opt) && correct.has(opt)) score++;
        else if (user.has(opt) && !correct.has(opt)) score--;
      }
      return score === correct.size;
    },
  };
}

function fillQ(id, html, correctArray) {
  return {
    id,
    type: "選填題",
    render: () => html,
    correct: correctArray,
    answerCheck: () => null,
  };
}

function openQ(id, html) {
  return {
    id,
    type: "非選擇題",
    render: () => html,
    correct: [],              // 不自動評分
    answerCheck: () => null,  // 永遠回傳 null 代表交老師批改
  };
}


const qs = [];

// 題目資料（略）——你已經貼過，我這裡省略，假設你已經填好 qs.push(...) 的題庫
// 單選題 Q1–Q6
qs.push(singleQ(1, `不透明袋中有藍、綠色球各若干顆，球上皆有1或2的編號，其顆數如下表：<br><table><tr><th></th><th>藍</th><th>綠</th></tr><tr><td>1號</td><td>2</td><td>4</td></tr><tr><td>2號</td><td>3</td><td>k</td></tr></table><br>若抽到藍色球與抽到1號球互為獨立事件，試問 k 值為何？`, 5));
qs.push(singleQ(2, `坐標平面上，$P(a,0)$ 為 \\(x\\)  軸上一點，$a > 0$。\\(L_{1}\\)、\\(L_{2}\\)  為通過 P 的直線，斜率分別為 4/3 與 3/2。已知 L₁、L₂ 與坐標軸圍成的兩個直角三角形面積差為 3，試問 a 值為何？`, 2));
qs.push(singleQ(3, `某校舉辦音樂會，包含鋼琴 5 個、小提琴 4 個、歌唱 3 個，共 12 曲目。若同類表演排在一起，且歌唱必須排在鋼琴或小提琴之後，試問可能的排列方式共有幾種？`, 4));
qs.push(singleQ(4, `在函數圖形 y = log₂x、x 軸與直線 x = 61 所圍區域的內部（不含邊界）共有多少個格子點？`, 3));
qs.push(singleQ(5, `設 0 ≤ θ ≤ 2π，已知所有滿足 sin2θ > sinθ 且 cos2θ > cosθ 的 θ 可表為 aπ < θ < bπ，試問 b - a 值為何？`, 1));
qs.push(singleQ(6, `坐標空間中有三個互相垂直的向量 u, v, w。已知 u - v = (2,-1,0)，v - w = (-1,2,3)。試問由 u, v, w 所張出的平行六面體體積為何？`, 2));

// 多選題 Q7–Q12
qs.push(multiQ(7, `已知數列 aₙ 滿足 3aₙ₊₁ = aₙ + n，且 a₁ = 2。令 bₙ = aₙ² + n/3。試選出正確選項。`, [2, 4]));
qs.push(multiQ(8, `考慮坐標平面上滿足方程式 (x² + 8x + 2) / (2x² - 4x + 2) = y 的點 P(x,y)，試選出正確選項。`, [3, 5]));
qs.push(multiQ(9, `設 b, c 為實數。已知 x² + bx + c = 0 有實根，但 x² + (b+2)x + c = 0 無實根。試選出正確選項。`, [2, 4, 5]));
qs.push(multiQ(10, `令 T 為 y = sin(πx) 在 0 ≤ x ≤ 3 的圖形。一水平直線 y = k 與 T 相交三點 P, Q, R，滿足 x₁ < x₂ < 1 < x₃。試選出正確選項。`, [1, 4, 5]));
qs.push(multiQ(11, `在 △ABC 中，AB = 6, AC = 5, BC = 4。令 AB 中點為 D，P 為角平分線與 CD 交點。試選出正確選項。`, [3, 4, 5]));
qs.push(multiQ(12, `某生測量甲占比 x% 的合金對應波長 y（奈米），迴歸直線為 y = 21.3x - 40。若轉換為乙占比 u%、波長 v（微米），則迴歸直線為 v = au + b。試選出正確選項。`, [1, 4, 5]));

// 選填題 Q13–Q17（不自動批改）
qs.push(fillQ(13, `已知三次多項式 f(x) 除以 x+6 得商式 q(x) 和餘式 3，且 q(x) 在 x = -6 有最大值 8。則 f(x) 的圖形對稱中心坐標為 ((13-1)(13-2),(13-3))。`, ["－", "6", "3"]));
qs.push(fillQ(14, `點 A(a,b,c) 與三平面 E₁:4y+3z=2、E₂:3y+4z=-5、E₃:x+2y+2z=-2 距離皆為 6，則 a+b+c = (14-1)(14-2)(14-3)。`, ["－", "1", "1"]));
qs.push(fillQ(15, `假日市集玩偶遊戲，依擲硬幣次數決定價格。試問顧客購得玩偶的期望花費為 (15-1)(15-2)(15-3) 元。`, ["4", "0", "5"]));
qs.push(fillQ(16, `設 L₁、L₂ 為通過 (3,1)，斜率分別為 m、-m 的直線，與圓心在原點的圓交於 A, B，且圓心到 L₁ 距離為 1，L₂ 與圓相切。則弦 AB 長度為 (16-1)(16-2)(16-3)。`, ["2", "4", "5"]));
qs.push(fillQ(17, `在 △ABC 中，AB = BC = 3，cos∠ABC = -1/2，外接圓上有一點 D 滿足 BD = 4 且 AD ≤ CD，則 CD = (17-1)+(17-2)。`, ["3", "2"]));

// 非選擇題 Q18（不自動批改）
qs.push(openQ(18, `請證明：若 $\\triangle ABC$ 為銳角三角形，則其外心位於三角形內部。\\n（可使用垂直平分線性質）`));


state.questions = qs;

function showScore() {
  const total = state.questions.length;
  const ok = state.questions.filter((q) => q._ok).length;
  document.getElementById("scoreboard").textContent = `得分：${ok} / ${total}`;
}

// === 在檔案頂端既有程式碼之後，直接用這段覆蓋 __mountApp ===
window.__mountApp = function () {
  const root = document.getElementById("app");
  const anchorsBar = document.getElementById("type-anchors"); // 可能為 null，容錯即可
  root.innerHTML = "";

  // 1) 依題型分組（保留你的中文題型）
  const TYPE_ORDER = ["單選題", "多選題", "選填題", "非選擇題"];
  const grouped = Object.fromEntries(TYPE_ORDER.map(t => [t, []]));
  (state.questions || []).forEach(q => {
    if (grouped[q.type]) grouped[q.type].push(q);
    else {
      // 未知型別也能顯示：直接當作一組
      if (!grouped[q.type]) grouped[q.type] = [];
      grouped[q.type].push(q);
    }
  });

  // 2) 生成頂部錨點列（如果有放 <nav id="type-anchors">）
  if (anchorsBar) {
    anchorsBar.innerHTML = TYPE_ORDER
      .filter(t => (grouped[t] && grouped[t].length > 0))
      .map(t => `<a class="tag" href="#sec-${t}">${t}（${grouped[t].length}）</a>`)
      .join(" ");
  }

  // 3) 逐區渲染：先輸出分區標頭（.meta + .tag），再塞入原本的卡片
  TYPE_ORDER.forEach(type => {
    const list = grouped[type] || [];
    if (list.length === 0) return;

    // 分區容器（不用新樣式，直接用 id 與一個 meta 當小標）
    const section = document.createElement("div");
    section.id = `sec-${type}`;

    // 分區標頭（沿用你的 .meta/.tag）
    const header = document.createElement("div");
    header.className = "meta";
    header.innerHTML = `
      <span class="tag">${type}</span>
      <span>本區 ${list.length} 題</span>
      ${type === "非選擇題" ? `<span class="small">（此區需人工批改）</span>` : ""}
    `;
    section.appendChild(header);

    // 分區內的每題卡片（沿用你原本的卡片渲染方式）
    list.forEach(q => {
      section.appendChild(renderCard(q));
    });

    root.appendChild(section);
  });

  // 4) 顯示分數與重排數學
  showScore();
  rerenderMath();

  // === 把你原本建立題目卡片的邏輯，抽成一個函式（直接貼舊程式碼即可）===
  function renderCard(q) {
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
        result.textContent = ok ? "✔ 正確" : `✖ 錯誤（正解：${q.correct.join(", ")})`;
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
        result.textContent = ok ? "✔ 正確" : `✖ 錯誤（正解：${q.correct.join(", ")})`;
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
    } else {
      // 若未來你新增 "非選擇題" 類型，這裡預留簡單 textarea（不計分）
      const ta = document.createElement("textarea");
      ta.className = "answer";
      ta.placeholder = "請在此書寫解題過程與答案（此題需人工批改）";
      ta.style.minHeight = "120px";
      row.appendChild(ta);
      const note = document.createElement("span");
      note.className = "result hint";
      note.textContent = "此題不自動計分，交卷後由老師批改。";
      row.appendChild(note);
    }

    card.appendChild(meta);
    card.appendChild(qtext);
    card.appendChild(row);
    return card;
  }
};


