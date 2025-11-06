window.__mountApp = function () {
  const state = { questions: [] };

  function singleQ(id, html, correct) {
    return {
      id,
      type: "單選題",
      render: () => html,
      options: ["(1)", "(2)", "(3)", "(4)", "(5)"],
      correct: [String(correct)],
      answerCheck: (raw) => [String(raw)]?.[0] === String(correct),
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
      answerCheck: () => null, // 不自動批改
    };
  }

  const qs = [];

  // 單選題 Q1–Q6
  qs.push(singleQ(1, `不透明袋中有藍、綠色球各若干顆，球上皆有1或2的編號，其顆數如下表：<br><table><tr><th></th><th>藍</th><th>綠</th></tr><tr><td>1號</td><td>2</td><td>4</td></tr><tr><td>2號</td><td>3</td><td>k</td></tr></table><br>若抽到藍色球與抽到1號球互為獨立事件，試問 k 值為何？`, 5));
  qs.push(singleQ(2, `坐標平面上，P(a,0) 為 x 軸上一點，a > 0。L₁、L₂ 為通過 P 的直線，斜率分別為 4/3 與 3/2。已知 L₁、L₂ 與坐標軸圍成的兩個直角三角形面積差為 3，試問 a 值為何？`, 2));
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

  state.questions = qs;

  // 顯示題目
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
    qtext
