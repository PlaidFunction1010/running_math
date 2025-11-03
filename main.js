// main.js（高中站）— 支援動態輸入欄位與三角極值題

let currentTypeId = null;
let currentAnswers = null;     // 物件，如 {x:3, y:3} 或 {ymax:..., ymin:...}
let currentUsesLatex = false;
let currentTolerance = 0;      // 容差（預設 0；三角極值用 1e-6）

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

function setFontSize(mode){
  mainArea.classList.remove("font-small","font-medium","font-large");
  mainArea.classList.add(mode);
}
sizeSmallBtn.addEventListener("click", ()=>setFontSize("font-small"));
sizeMediumBtn.addEventListener("click", ()=>setFontSize("font-medium"));
sizeLargeBtn.addEventListener("click", ()=>setFontSize("font-large"));

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
    g.innerHTML = `
      <label for="${id}">${def.label}</label>
      <input id="${id}" type="${def.type || 'number'}" />
    `;
    inputsContainer.appendChild(g);
  });
}

/* 出題：實際呼叫 generator 取得 payload（題目+詳解+答案） */
function newProblem(){
  const entry = window.problemBank.find(p=>p.id===currentTypeId);
  if(!entry) return;

  const { ui, payload } = entry.generator();

  equationsBox.innerHTML = payload.questionHtml;
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

/* 檢查答案（支援多欄位與容差） */
function checkAnswer(){
  if(!currentAnswers){
    feedbackBox.textContent = "請先按「出題」產生題目";
    feedbackBox.className = "feedback wrong";
    return;
  }

  // 逐一比對
  for(const [key, correctVal] of Object.entries(currentAnswers)){
    const inp = document.getElementById("input-"+key);
    if(!inp || inp.value===""){
      feedbackBox.textContent = "請先把所有答案填完再檢查";
      feedbackBox.className = "feedback wrong";
      return;
    }
    const userVal = Number(inp.value);

    if(Number.isNaN(userVal)){
      feedbackBox.textContent = "請輸入數字答案";
      feedbackBox.className = "feedback wrong";
      return;
    }

    // 容差比對（for 浮點數）
    if(Math.abs(userVal - Number(correctVal)) > currentTolerance){
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

/* 按鈕綁定 */
btnNew.addEventListener("click", newProblem);
btnCheck.addEventListener("click", checkAnswer);
btnClear.addEventListener("click", clearAnswer);

/* 啟動 */
buildSidebar();
selectProblemType("type1");
setFontSize("font-small");
