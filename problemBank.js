// problemBank.js（高中站）
// ---- 共用工具 ----
function randInt(min, max){
  return Math.floor(Math.random()*(max-min+1))+min;
}
function nzRandInt(min, max){
  let v = 0;
  while(v === 0){ v = randInt(min, max); }
  return v;
}

// ---- 題型 1：代入消去法 第一型 ----
function generateType1Problem(){
  let xVal = randInt(-5,5);
  let yVal = randInt(-5,5);
  if(xVal===0 && yVal===0){ xVal=2; yVal=-3; }

  const singleIsX = Math.random() < 0.5;

  let a=0,b=0;
  while(a===0 && b===0){
    a = randInt(-6,6);
    b = randInt(-6,6);
  }
  const c = a*xVal + b*yVal;

  function term(coeff, v){
    if(coeff===0) return "";
    if(coeff===1) return v;
    if(coeff===-1) return "-"+v;
    return coeff+v;
  }
  function join(ax,by){
    if(ax && by){
      if(by.startsWith("-")) return ax+" "+by;
      return ax+" + "+by;
    }
    return ax||by;
  }

  const left2 = join(term(a,"x"), term(b,"y"));
  const eq1 = singleIsX ? `式(1)：x = ${xVal}` : `式(1)：y = ${yVal}`;
  const eq2 = `式(2)：${left2} = ${c}`;

  let sol = "";
  if(singleIsX && b!==0){
    const t = c - a*xVal;
    sol =
`1) 由式(1)得 x=${xVal}
2) 代入式(2)：${a}×${xVal} + ${b}y = ${c}
3) ${b}y = ${t} ⇒ y = ${t} ÷ ${b} = ${yVal}
答：(x,y)=(${xVal},${yVal})`;
  }else if(!singleIsX && a!==0){
    const t = c - b*yVal;
    sol =
`1) 由式(1)得 y=${yVal}
2) 代入式(2)：${a}x + ${b}×${yVal} = ${c}
3) ${a}x = ${t} ⇒ x = ${t} ÷ ${a} = ${xVal}
答：(x,y)=(${xVal},${yVal})`;
  }else{
    sol = `答：(x,y)=(${xVal},${yVal})`;
  }

  return {
    ui: {
      headerTitle: "代入消去法｜第一型",
      headerSubtext: "用單一變數的等式先求出 x 或 y，\n再代回另一式解出 (x,y)。",
      exampleHint:
`範例：
式(1)：x = 3
式(2)：2x + y = 9
正解：(x, y) = (3, 3)`,
      inputs: [
        { key: "x", label: "你的答案 x =", type: "number" },
        { key: "y", label: "你的答案 y =", type: "number" }
      ],
      usesLatex: false
    },
    payload: {
      questionHtml: eq1 + "\n" + eq2,
      solutionHtml: sol,
      answers: { x: xVal, y: yVal }
    }
  };
}

// ---- 題型 2：代入消去法 第二型 ----
function generateType2Problem(){
  let xVal = randInt(-5,5);
  let yVal = randInt(-5,5);
  if(xVal===0 && yVal===0){ xVal=2; yVal=-1; }

  let a1=0,b1=0; while(a1===0 && b1===0){ a1=randInt(-6,6); b1=randInt(-6,6); }
  let a2=0,b2=0; while(a2===0 && b2===0){ a2=randInt(-6,6); b2=randInt(-6,6); }
  const c1 = a1*xVal + b1*yVal;
  const c2 = a2*xVal + b2*yVal;

  function term(c,v){ if(c===0) return ""; if(c===1) return v; if(c===-1) return "-"+v; return c+v; }
  function join(ax,by){ if(ax && by){ return by[0]==='-'? ax+" "+by: ax+" + "+by } return ax||by; }

  const left1 = join(term(a1,"x"),term(b1,"y"));
  const left2 = join(term(a2,"x"),term(b2,"y"));
  const eq1 = `式(1)：${left1} = ${c1}`;
  const eq2 = `式(2)：${left2} = ${c2}`;

  let sol = "";
  if(b1!==0){
    const A = a2*b1 - b2*a1;
    const B = c2*b1 - b2*c1;
    sol =
`1) 由式(1)得：y = (${c1} - ${a1}x) ÷ ${b1}
2) 代入式(2)：${a2}x + ${b2}[(${c1}-${a1}x)/${b1}] = ${c2}
3) 化簡得：${A}x = ${B} ⇒ x = ${B} ÷ ${A} = ${xVal}
4) 代回 y = (${c1} - ${a1}×${xVal}) ÷ ${b1} = ${yVal}
答：(x,y)=(${xVal},${yVal})`;
  }else if(a1!==0){
    const A = a1*b2 - a2*b1;
    const B = a1*c2 - a2*c1;
    sol =
`1) 由式(1)得：x = (${c1} - ${b1}y) ÷ ${a1}
2) 代入式(2)：${a2}[(${c1}-${b1}y)/${a1}] + ${b2}y = ${c2}
3) 化簡得：${A}y = ${B} ⇒ y = ${B} ÷ ${A} = ${yVal}
4) 代回 x = (${c1} - ${b1}×${yVal}) ÷ ${a1} = ${xVal}
答：(x,y)=(${xVal},${yVal})`;
  }else{
    sol = `答：(x,y)=(${xVal},${yVal})`;
  }

  return {
    ui: {
      headerTitle: "代入消去法｜第二型",
      headerSubtext: "先把式(1) 變形為 y = ax + b（或 x = ay + b），\n再代入式(2)，逐步解出 (x,y)。",
      exampleHint:
`範例：
式(1)：2x - y = 3
式(2)：2x + y = 9
正解：(x, y) = (3, 3)`,
      inputs: [
        { key: "x", label: "你的答案 x =", type: "number" },
        { key: "y", label: "你的答案 y =", type: "number" }
      ],
      usesLatex: false
    },
    payload: {
      questionHtml: eq1 + "\n" + eq2,
      solutionHtml: sol,
      answers: { x: xVal, y: yVal }
    }
  };
}

// ---- 題型 3：代入消去法 第三型（a/x + b/y = c）----
function generateType3Problem(){
  function nz(){ let v=0; while(v===0){ v=randInt(-5,5) } return v; }
  let xVal = nz(), yVal = nz();

  let a,b,d,e,cInt=null,fInt=null, tries=0;
  while(true){
    tries++;
    a=nz(); b=nz(); d=nz(); e=nz();
    const den = xVal*yVal;
    const cnum = a*yVal + b*xVal;
    const fnum = d*yVal + e*xVal;
    if(den!==0 && cnum%den===0 && fnum%den===0){
      cInt = cnum/den; fInt = fnum/den;
      if(cInt!==0 && fInt!==0) break;
    }
    if(tries>500){ xVal=1; yVal=1; a=2; b=1; d=1; e=2; cInt=3; fInt=3; break; }
  }

  const eq = (A,B,C)=> `$$ \\frac{${A}}{x} + \\frac{${B}}{y} = ${C} $$`;
  const qHtml = "式(1)：<br/>"+eq(a,b,cInt)+"<br/>式(2)：<br/>"+eq(d,e,fInt);
  const sHtml = [
    `$$\\text{設 }U=\\frac{1}{x},\\;V=\\frac{1}{y}$$`,
    `$$\\begin{cases}
    ${a}U + ${b}V = ${cInt} \\\\
    ${d}U + ${e}V = ${fInt}
    \\end{cases}$$`,
    `$$\\text{解得 }U=\\frac{1}{${xVal}},\\;V=\\frac{1}{${yVal}}$$`,
    `$$x=\\frac{1}{U}=${xVal},\\quad y=\\frac{1}{V}=${yVal}$$`,
    `$$\\boxed{(x,\\;y)=(${xVal},\\;${yVal})}$$`
  ].join("\n");

  return {
    ui: {
      headerTitle: "代入消去法｜第三型",
      headerSubtext: "令 \\(U=\\tfrac{1}{x}, V=\\tfrac{1}{y}\\)，將兩式化為一次聯立，\n先解 U、V 再回推 x、y。",
      exampleHint:
`範例：
式(1)：\\( \\frac{2}{x} + \\frac{1}{y} = 3 \\)
式(2)：\\( \\frac{1}{x} + \\frac{2}{y} = 3 \\)
正解：(x, y) = (1, 1)`,
      inputs: [
        { key: "x", label: "你的答案 x =", type: "number" },
        { key: "y", label: "你的答案 y =", type: "number" }
      ],
      usesLatex: true
    },
    payload: {
      questionHtml: qHtml,
      solutionHtml: sHtml,
      answers: { x: xVal, y: yVal }
    }
  };
}

// ---- 新題型：三角函數極值 第一題 ----
// 題目： y = a cos^2 x + b sin^2 x + c sin x cos x ，求 y 的最大值與最小值
// 條件： a,b,c ∈ Z（可負），且 (a/2 - b/2)^2 + (c/2)^2 為整數
// 實作重點：只要 (a-b) 為偶數 且 c 為偶數，即可保證此條件成立。
function generateTrigExt1(){
  // 1) 亂數 a,b 任意整數，c 必須為偶數；且 (a-b) 為偶數
  let a = randInt(-6,6);
  let b = randInt(-6,6);
  // 強制 (a-b) 偶數
  if ((a - b) % 2 !== 0) {
    b += 1;
  }
  // c 強制偶數且非零
  let c = 0;
  while (c === 0 || c % 2 !== 0) {
    c = randInt(-6,6);
  }

  // 2) 轉換： cos^2 x = (1+cos2x)/2 ; sin^2 x = (1 - cos2x)/2 ; sin x cos x = (1/2) sin 2x
  // y = (a+b)/2 + (a-b)/2 * cos 2x + (c/2) * sin 2x
  const d = (a + b) / 2;
  const A = (a - b) / 2;
  const B = c / 2;

  // r = sqrt(A^2 + B^2)
  const r = Math.sqrt(A*A + B*B);

  // 最大最小
  const ymax = d + r;
  const ymin = d - r;

  // 題目（只顯示原式，其他推導藏在詳解）
  const qHtml =
    `$$ y = ${a}\\cos^2 x + ${b}\\sin^2 x + ${c}\\sin x\\cos x \\quad \\text{，求 }y\\text{ 的最大值與最小值。} $$`;

  // 詳解（以 LaTeX 呈現）
  const sHtml = [
    `$$
    \\begin{aligned}
    y &= ${a}\\cos^2 x + ${b}\\sin^2 x + ${c}\\sin x\\cos x \\\\
      &= \\frac{a+b}{2} + \\frac{a-b}{2}\\cos 2x + \\frac{c}{2}\\sin 2x \\\\
      &= d + A\\cos 2x + B\\sin 2x
    \\end{aligned}
    $$`,
    `其中 \\( d=\\tfrac{a+b}{2}=${d}\\), \\( A=\\tfrac{a-b}{2}=${A}\\), \\( B=\\tfrac{c}{2}=${B}\\)。`,
    `把 \\(A\\cos 2x + B\\sin 2x\\) 寫成單一正弦：`,
    `$$ A\\cos 2x + B\\sin 2x = r\\sin(2x+\\varphi), \\quad r=\\sqrt{A^2+B^2}=\\sqrt{${A}^2+${B}^2}=${r.toFixed(6)} $$`,
    `因此 $$ y = d + r\\sin(2x+\\varphi). $$`,
    `所以最大值與最小值為 $$ y_{\\max}=d+r=${(ymax).toFixed(6)}, \\quad y_{\\min}=d-r=${(ymin).toFixed(6)}. $$`
  ].join("\n");

  return {
    ui: {
      headerTitle: "三角函數極值題目練習｜第一題",
      headerSubtext: "給定 \\( y = a\\cos^2 x + b\\sin^2 x + c\\sin x\\cos x \\)，請求出最大值與最小值。\n（只顯示題目；推導在詳解中）",
      exampleHint:
`提示：
可用 \\( \\cos^2 x=\\tfrac{1+\\cos2x}{2},\\; \\sin^2 x=\\tfrac{1-\\cos2x}{2},\\; \\sin x\\cos x=\\tfrac{1}{2}\\sin2x \\)
整理為 \\( y = d + r\\sin(2x+\\varphi) \\)`,
      inputs: [
        { key: "ymax", label: "最大值 y_max =", type: "number" },
        { key: "ymin", label: "最小值 y_min =", type: "number" }
      ],
      usesLatex: true
    },
    payload: {
      questionHtml: qHtml,
      solutionHtml: sHtml,
      answers: { ymax, ymin },
      tolerance: 1e-6
    }
  };
}

// ---- 題型清單 ----
const problemBank = [
  {
    id: "type1",
    group: "代入消去法",
    level: "Lv.1",
    sidebarTitle: "第一型",
    sidebarDesc: "一條式子只有單一變數\n直接代入另一條",
    generator: generateType1Problem
  },
  {
    id: "type2",
    group: "代入消去法",
    level: "Lv.2",
    sidebarTitle: "第二型",
    sidebarDesc: "整理為 y=ax+b（或 x=ay+b）\n再代入另一條",
    generator: generateType2Problem
  },
  {
    id: "type3",
    group: "代入消去法",
    level: "Lv.3",
    sidebarTitle: "第三型",
    sidebarDesc: "分母含未知數\na/x + b/y = c",
    generator: generateType3Problem
  },
  {
    id: "trig-ext-1",
    group: "三角函數極值題目練習",
    level: "Trig",
    sidebarTitle: "第一題",
    sidebarDesc: "y=a cos^2 x + b sin^2 x + c sin x cos x\n求最大/最小值",
    generator: generateTrigExt1
  }
];

window.problemBank = problemBank;
