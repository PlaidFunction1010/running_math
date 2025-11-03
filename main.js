// main.js（高中站）— 支援動態輸入、根號鍵、簡化符號與安全運算

let currentTypeId = null;
let currentAnswers = null;     // 物件，如 {x:3, y:3} 或 {ymax:..., ymin:...}
let currentUsesLatex = false;
let currentTolerance = 0;      // 容差（預設 0；三角極值用 1e-6）
let lastFocusedInput = null;   // 目前聚焦的輸入框（供數學鍵盤插入）

const sidebarContainer = document.getElementById("sidebar-problem-types");

const mainArea = document.getElementById("mainArea");
const sizeSmallBtn = document.getElementById("sizeSmall");
const sizeMediumBtn = document.getElementById("sizeMedium");
const sizeLargeBtn = document.getElementById("sizeLarge");

const headerBox = document.getElementById("problem-header");
const exampleHintBox = document.getElementById("example-hint");

const equationsBox = document.getElementById("equationsBox");
const inputsContainer = document.getElementById("inputsContainer");
const feedbackBox = document.getElementById("feedback");

const toggleSolutionBtn = document.getElementById("toggle-solution");
const toggleIcon = document.getElementById("toggle-icon");
const solutionBox = document.getElementById("solutionBox");

const btnNew = document.getElementById("btn-new");
const btnCheck = document.getElementById("btn-check");
const btnClear = document.getElementById("btn-clear");
const btnInsertSqrt = document.getElementById("btn-insert-sqrt");

function setFontSize(mode){
  mainArea.classList.remove("font-small","font-medium","font-large");
  mainArea.classList.add(mode);
}
sizeSmallBtn.addEventListener("click", ()=>setFontSize("font-small"));
sizeMediumBtn.addEventListener("click", ()=>setFontSize("font-medium"));
sizeLargeBtn.addEventListener("click", ()=>setFontSize("font-large"));

// 非 LaTeX 題目時，將 "+(-4)" 類型字樣簡化
function prettySigns(str){
  if(typeof str !== "string") return str;
  str = str.replace(/\+\s*\(-\s*([0-9]+(?:\.[0-9]+)?)\s*\)/g, " - $1");
  str = str.replace(/\+\s*-/g, " - ");
  str = str.replace(/--/g, "+");
  str = str.replace(/\s+\+\s+-/g, " - ");
  return str;
}

function rerenderMath(){
  if(window.MathJax && window.MathJax.typeset){
    window.MathJax.typeset();
  }
}

/* 建立側欄（依 problemBank 產生卡片） */
function buildSidebar(){
  sidebarContainer.innerHTML = "";
  window.problemBank.forEach(pb=>{
    const card = document.createElement("div");
    card.className = "nav-card";
    card.setAttribute("data-typeid", pb.id);
    card.innerHTML = `
      <div class="nav-card-title">
        <span>${pb.group ? (pb.group + "｜" + pb.sidebarTitle) : pb.sidebarTitle}</span>
        <span class="lvl-tag">${pb.level}</span>
      </div>
      <div class="nav-card-desc">${pb.sidebarDesc.replace(/\n/g,"<br/>")}</div>
    `;
    card.addEventListener("click", ()=> selectProblemType(pb.id));
    sidebarContainer.appendChild(card);
  });
}

/* 切換題型：更新上方標題/說明/提示，並動態渲染輸入欄位 */
function selectProblemType(typeId){
  currentTypeId = typeId;

  // 側欄 active 樣式
  Array.from(sidebarContainer.children).forEach(node=>{
    node.classList.toggle("active", node.getAttribute("data-typeid")===typeId);
  });

  const entry = window.problemBank.find(p=>p.id===typeId);
  if(!entry) return;

  // 呼叫這個題型的 generator 先拿一次 UI 結構（不出題，僅取 ui 顯示）
  const { ui } = entry.generator();

  // 標題區
  headerBox.innerHTML = `
    <h1>高中數學練習 <span class="badge">${ui.headerTitle}</span></h1>
    <div class="subtext">${ui.headerSubtext.replace(/\n/g,"<br/>")}</div>
  `;
  exampleHintBox.innerHTML = ui.exampleHint.replace(/\n/g,"<br/>");

  // 清空題目/詳解/回饋
  equationsBox.textContent = "請按「出題」";
  solutionBox.style.display = "none";
  toggleIcon.textContent = "▶";
  solutionBox.innerHTML = "（詳解會出現在這裡）";
  feedbackBox.textContent = ""; feedbackBox.className = "feedback";

  // 動態輸入欄位（依題型）
  renderInputs(ui.inputs);

  // 重置答題狀態
  currentAnswers = null;
  currentUsesLatex = !!ui.usesLatex;
  currentTolerance = 0;

  rerenderMath(); // 有些 hint 內含 LaTeX
}

/* 依題型渲染輸入欄位 */
function renderInputs(inputsDef){
  inputsContainer.innerHTML = "";
  (inputsDef || []).forEach(def=>{
    const g = document.createElement("div");
    g.className = "input-group";
    const id = "input-" + def.key;

    // 改用 text 欄位以支援 √ 表達；若為 number 則加 inputmode 提示數字鍵盤
    const inputType = "text";
    const inputMode = (def.type === "number") ? ' inputmode="decimal"' : "";

    g.innerHTML = `
      <label for="${id}">${def.label}</label>
      <input id="${id}" type="${inputType}"${inputMode} />
    `;
    inputsContainer.appendChild(g);

    const inp = g.querySelector("input");
    inp.addEventListener("focus", ()=>{ lastFocusedInput = inp; });
  });
}

/* 將「√」與「sqrt」等字串轉為可計算表達式，並做基本安全檢查 */
function evalSafeExpression(raw){
  if(typeof raw !== "string") return NaN;
  let s = raw.trim();

  // 常見替換：中文全形轉半形基本處理
  s = s.replace(/＋/g,'+').replace(/－/g,'-').replace(/＊/g,'*').replace(/／/g,'/').replace(/（/g,'(').replace(/）/g,')');

  // 將 "√( ... )" 與 "√number" 轉為 Math.sqrt(...)
  s = s.replace(/√\s*\(/g, 'Math.sqrt(');
  s = s.replace(/√\s*([0-9]+(?:\.[0-9]+)?)/g, 'Math.sqrt($1)');

  // 支援 "sqrt(" 寫法
  s = s.replace(/\bsqrt\s*\(/g, 'Math.sqrt(');

  // 允許的字元檢查：數字、小數點、運算子、括號、空白、"Math.sqrt"
  const chk = s.replace(/Math\.sqrt/g, '');
  if(/[A-Za-z]/.test(chk)){
    return NaN; // 有其他英文字母，拒絕
  }

  try{
    // 使用 Function 進行運算（嚴格模式）
    // 僅當上述白名單通過時才評估
    const val = Function('"use strict";return (' + s + ')')();
    return (typeof val === "number" && isFinite(val)) ? val : NaN;
  }catch(e){
    return NaN;
  }
}

/* 出題：實際呼叫 generator 取得 payload（題目+詳解+答案） */
function newProblem(){
  const entry = window.problemBank.find(p=>p.id===currentTypeId);
  if(!entry) return;

  const { ui, payload } = entry.generator();

  // 題目：若不是 LaTeX 類型，做符號簡化
  if(ui.usesLatex){
    equationsBox.innerHTML = payload.questionHtml;
  }else{
    equationsBox.textContent = prettySigns(payload.questionHtml);
  }

  solutionBox.innerHTML = payload.solutionHtml;
  solutionBox.style.display = "none";
  toggleIcon.textContent = "▶";

  currentAnswers = payload.answers || null;
  currentUsesLatex = !!ui.usesLatex;
  currentTolerance = payload.tolerance || 0;

  // 清空所有輸入
  Array.from(inputsContainer.querySelectorAll("input")).forEach(inp=> inp.value = "");

  feedbackBox.textContent = ""; feedbackBox.className = "feedback";

  if(currentUsesLatex){ rerenderMath(); }
}

/* 檢查答案（支援多欄位與容差 + 表達式解析） */
function checkAnswer(){
  if(!currentAnswers){
    feedbackBox.textContent = "請先按「出題」產生題目";
    feedbackBox.className = "feedback wrong";
    return;
  }

  // 逐一比對
  for(const [key, correctVal] of Object.entries(currentAnswers)){
    const inp = document.getElementById("input-"+key);
    if(!inp || inp.value.trim()===""){
      feedbackBox.textContent = "請先把所有答案填完再檢查";
      feedbackBox.className = "feedback wrong";
      return;
    }

    const userNum = evalSafeExpression(inp.value);
    if(Number.isNaN(userNum)){
      feedbackBox.textContent = "請輸入可計算的數學表達式（可使用 √ 或 sqrt）";
      feedbackBox.className = "feedback wrong";
      return;
    }

    const target = Number(correctVal);
    if(Math.abs(userNum - target) > currentTolerance){
      feedbackBox.textContent = "❌ 還沒對喔，請再試一次";
      feedbackBox.className = "feedback wrong";
      return;
    }
  }

  feedbackBox.textContent = "✅ 正確！做得好！";
  feedbackBox.className = "feedback correct";
}

/* 清除輸入與回饋 */
function clearAnswer(){
  Array.from(inputsContainer.querySelectorAll("input")).forEach(inp=> inp.value = "");
  feedbackBox.textContent = ""; feedbackBox.className = "feedback";
}

/* 詳解 展開/收合 */
toggleSolutionBtn.addEventListener("click", ()=>{
  const open = solutionBox.style.display !== "none";
  solutionBox.style.display = open ? "none" : "block";
  toggleIcon.textContent = open ? "▶" : "▼";
  rerenderMath();
});

/* 數學鍵盤：插入根號 */
function insertAtCursor(el, text){
  if(!el) return;
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? el.value.length;
  const before = el.value.slice(0, start);
  const after = el.value.slice(end);
  el.value = before + text + after;
  const pos = start + text.length;
  el.setSelectionRange(pos, pos);
  el.focus();
}
btnInsertSqrt.addEventListener("click", ()=>{
  // 插入 "√()"，並將游標放在括號中間
  if(!lastFocusedInput){
    // 若沒有焦點，嘗試選第一個輸入框
    lastFocusedInput = inputsContainer.querySelector("input");
  }
  if(lastFocusedInput){
    insertAtCursor(lastFocusedInput, "√()");
    // 將游標移到括號中間
    const pos = (lastFocusedInput.selectionStart || 0) - 1;
    lastFocusedInput.setSelectionRange(pos, pos);
  }
});

/* 按鈕綁定 */
btnNew.addEventListener("click", newProblem);
btnCheck.addEventListener("click", checkAnswer);
btnClear.addEventListener("click", clearAnswer);

/* 啟動 */
buildSidebar();
selectProblemType("type1");
setFontSize("font-small");
