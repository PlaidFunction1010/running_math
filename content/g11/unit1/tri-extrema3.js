// 來源：使用者上傳之 topic7（高二·單元一·三角函數·三種常見極值題目）
// src/topics/hs2/u1/topic7.js
// 高二 — 單元一（三角函數）— 主題七：三種考試常見極值題
// 本模組輸出 topic7 物件，內含三個隨機出題器。
// 使用者畫面只顯示 questionLatex；平台端可用 answer 與 solutionLatex 進行判題與講解。

function randint(L, U, excludeZero=false) {
  while (true) {
    const v = Math.floor(Math.random()*(U-L+1))+L;
    if (!excludeZero || v !== 0) return v;
  }
}

function extremaQuadraticOnInterval(A, B, C, L, U) {
  const f = (x) => A*x*x + B*x + C;
  const candidates = [L, U];
  if (Math.abs(A) > 1e-12) {
    const xv = -B / (2*A);
    if (xv >= L-1e-12 && xv <= U+1e-12) candidates.push(xv);
  }
  const vals = candidates.map(f);
  return { max: Math.max(...vals), min: Math.min(...vals) };
}

// ---------------- 第一題 ----------------
// 題型： y = a cos^2 x + b sin^2 x + c sin x cos x
// 條件： a,b,c 為整數且可為負。為保證 r^2=((a-b)/2)^2+(c/2)^2 為整數：令 a,b 同奇偶；c 為偶數。
function genQ1() {
  let a, b, c;
  while (true) {
    a = randint(-6, 6, true);
    b = randint(-6, 6, true);
    if ((a-b) % 2 !== 0) continue;     // 同奇偶
    c = 2*randint(-6, 6, true);        // 偶數
    if (a!==0 || b!==0 || c!==0) break;
  }
  const d = (a + b) / 2;
  const r = Math.sqrt(((a - b) / 2) ** 2 + (c / 2) ** 2);

  const questionLatex = `y = ${a}\\cos^2 x + ${b}\\sin^2 x + ${c}\\sin x\\cos x`;
  const answer = { max: d + r, min: d - r };

  const solutionLatex = [
    String.raw`y = ${a}\cos^2 x + ${b}\sin^2 x + ${c}\sin x\cos x`,
    String.raw`= \frac{a+b}{2} + \frac{a-b}{2}\cos 2x + \frac{c}{2}\sin 2x`,
    String.raw`= ${d} + r\sin(2x+\varphi),\quad r=\sqrt{\Bigl(\frac{a-b}{2}\Bigr)^2+\Bigl(\frac{c}{2}\Bigr)^2}`,
    String.raw`\Rightarrow\ y_{\max}=${(d+r).toFixed(6)}\ ,\ y_{\min}=${(d-r).toFixed(6)}`
  ].join(" \\\\ ");

  return {
    id: "hs2-u1-t7-q1",
    questionLatex,
    params: {a, b, c},
    answer,
    solutionLatex
  };
}

// ---------------- 第二題 ----------------
// 題型： y = a\sin x + b\cos(2x) + k
// 解法：\cos 2x = 1 - 2\sin^2 x。令 u=\sin x \in [-1,1]，
//      y(u) = -2b u^2 + a u + (b+k)。對區間 [-1,1] 的二次函數取極值。
function genQ2() {
  const a = randint(-8, 8, true);
  const b = randint(-6, 6, false);   // 允許 0
  const k = randint(-8, 8, false);

  const A = -2*b, B = a, C = b + k;
  const ext = extremaQuadraticOnInterval(A, B, C, -1, 1);

  const questionLatex = `y = ${a}\\sin x + ${b}\\cos(2x) + ${k}`;
  const solutionLatex = [
    String.raw`y = ${a}\sin x + ${b}\cos(2x) + ${k}`,
    String.raw`= ${a}\sin x + ${b}\bigl(1-2\sin^2 x\bigr) + ${k}`,
    String.raw`= -2${b}\,(\sin x)^2 + ${a}\sin x + (${b}+${k})`,
    String.raw`令\ u=\sin x\in[-1,1],\ y(u)= ${A}u^2 + ${B}u + ${C}`,
    String.raw`\Rightarrow\ y_{\max}=${ext.max.toFixed(6)}\ ,\ y_{\min}=${ext.min.toFixed(6)}`
  ].join(" \\\\ ");

  return {
    id: "hs2-u1-t7-q2",
    questionLatex,
    params: {a, b, k},
    answer: { max: ext.max, min: ext.min },
    solutionLatex
  };
}

// ---------------- 第三題 ----------------
// 題型： y = (\sin x + k)(\cos x + k)
// 解法：令 t=\sin x+\cos x \in [-\sqrt{2},\sqrt{2}], 且 \sin x\cos x=\frac{t^2-1}{2}
//      => y(t)=\frac12 t^2 + k t + (k^2-\frac12)，對該區間取極值。
function genQ3() {
  const k = randint(-5, 5, false);
  const A = 0.5, B = k, C = k*k - 0.5;
  const L = -Math.SQRT2, U = Math.SQRT2;
  const ext = extremaQuadraticOnInterval(A, B, C, L, U);

  const questionLatex = `y = (\sin x + ${k})(\cos x + ${k})`;
  const solutionLatex = [
    String.raw`y = \sin x\cos x + ${k}(\sin x+\cos x) + ${k}^2`,
    String.raw`令\ t=\sin x+\cos x\in[-\sqrt{2},\sqrt{2}],\ \sin x\cos x=\frac{t^2-1}{2}`,
    String.raw`y(t)=\frac12 t^2 + ${k}t + (${k}^2-\frac12)`,
    String.raw`\Rightarrow\ y_{\max}=${ext.max.toFixed(6)}\ ,\ y_{\min}=${ext.min.toFixed(6)}`
  ].join(" \\\\ ");

  return {
    id: "hs2-u1-t7-q3",
    questionLatex,
    params: {k},
    answer: { max: ext.max, min: ext.min },
    solutionLatex
  };
}

export const topic7 = {
  id: "hs2-u1-t7",
  grade: "高二",
  unit: "單元一：三角函數",
  title: "主題七：三種考試常見極值題",
  generators: [
    { name: "第一題（疊合法）", generate: genQ1 },
    { name: "第二題（配方法）", generate: genQ2 },
    { name: "第三題（變數變換）", generate: genQ3 },
  ]
};



export function getProblems(mode='5') {
  const want = mode === '10' ? 10 : 5;
  const gens = (typeof topic7 !== 'undefined' && topic7.generators) ? topic7.generators : [];
  const out = [];
  let guard = 0;
  while (out.length < want && guard++ < 200) {
    for (const g of gens) {
      if (out.length >= want) break;
      const q = g.generate();
      if (!q || !q.answer) continue;
      const stemBase = q.questionLatex || '';
      const maxVal = (q.answer.max!=null)? q.answer.max : null;
      const minVal = (q.answer.min!=null)? q.answer.min : null;
      if (maxVal==null && minVal==null) continue;

      out.push({
        stemHtml: `題型：${g.name}\\（同時求最大與最小）\\\\ \\(${stemBase}\\)`,
        answers: { max: (maxVal!=null? String(maxVal): ''), min: (minVal!=null? String(minVal): '') },
        validator: 'numeric',
        solutionMode: 'key-final',
        keySteps: [q.solutionLatex || ''],
        finalLatexMax: (maxVal!=null? String(maxVal): ''),
        finalLatexMin: (minVal!=null? String(minVal): '')
      });
    }
  }
  return out.slice(0, want);
}
