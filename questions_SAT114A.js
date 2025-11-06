/* ==========================================================
   SAT 114A 題庫與渲染程式（支援四種題型 + 題型分區塊）
   題型(type)： 'single'單選｜'multiple'多選｜'fill'填充｜'open'非選擇題
   計分規則：只自動計 'single'/'multiple'/'fill' 三種；'open' 交由老師批改
========================================================== */

// 你可以把這裡換成實際題庫。
// 為了示範四種題型與分區，我放了 6 題樣本（請自由擴充）。
const QUESTIONS = [
  // 單選
  {
    id: 'Q1', type: 'single', points: 2,
    prompt: '已知 $f(x)=x^2-4x+5$，則 $f(2)$ 等於？',
    choices: ['-1', '1', '3', '5'],
    answer: 1 // choices[1] => '1'
  },
  {
    id: 'Q2', type: 'single', points: 2,
    prompt: '下列何者為恆等式？',
    choices: ['$(x+1)^2=x^2+1$', '$\\sin^2x+\\cos^2x=1$', '$e^x=1+x$', '$\\ln(1+x)=x$'],
    answer: 1
  },

  // 多選
  {
    id: 'Q3', type: 'multiple', points: 3,
    prompt: '關於數列 $a_n$，下列哪些為真？',
    choices: ['等差數列公差固定', '等比數列公比固定', '費波那契數列首兩項皆1', '遞迴一定可寫成顯式'],
    // 正確答案的索引陣列（順序不限）
    answer: [0,1]
  },

  // 填充
  {
    id: 'Q4', type: 'fill', points: 3,
    prompt: '化簡 $\\dfrac{(x+2)^2 - x^2}{x}$，$x\\ne 0$，結果為：',
    // 支援字串或陣列（多個可接受答案）
    answer: ['4 + 4/x', '4+4/x', '4 + \\frac{4}{x}', '4+\\frac{4}{x}']
  },

  // 非選擇題（開放作答，人工批改）
  {
    id: 'Q5', type: 'open', points: 0, // 不計自動分
    prompt: '設 $\\triangle ABC$ 為銳角三角形，試證明其外心位於三角形內部。\\n（請完整敘述理由與步驟）'
  },
  {
    id: 'Q6', type: 'open', points: 0,
    prompt: '已知向量 $\\vec{a},\\vec{b}$，試以向量方法證明平行四邊形對角線互相平分。'
  }
];

// === 工具：字串標準化（給填充題） ===
function normalize(s){
  return String(s||'').trim()
    .replace(/\s+/g,'')           // 去空白
    .replace(/，/g,',')           // 全形逗號
    .replace(/（/g,'(').replace(/）/g,')') // 全形括號
    .toLowerCase();
}

// === 狀態 ===
const state = {
  questions: QUESTIONS,
  started: false,
  submitted: false,
  score: 0,
  totalAutoPoints: 0,
};

// === 分組依題型 ===
const TYPE_LABELS = {
  single: '單選題',
  multiple: '多選題',
  fill: '填充題',
  open: '非選擇題（人工批改）'
};
const TYPE_ORDER = ['single','multiple','fill','open'];

// === 掛載 ===
window.__mountApp = function(){
  const app = document.getElementById('app');
  const btnStart = document.getElementById('btnStart');
  const btnSubmit = document.getElementById('btnSubmit');
  const scoreText = document.getElementById('scoreText');
  const openHint = document.getElementById('openHint');
  const anchors = document.getElementById('anchors');

  // 建立題型 -> 題目 的 map
  const grouped = TYPE_ORDER.reduce((acc,t)=> (acc[t]=[], acc), {});
  state.questions.forEach(q => { if(grouped[q.type]) grouped[q.type].push(q); });

  // 產生題型錨點
  anchors.innerHTML = TYPE_ORDER
    .filter(t => grouped[t].length>0)
    .map(t => `<a href="#sec_${t}">${TYPE_LABELS[t]}</a>`).join('');

  // 渲染每個題型區塊
  app.innerHTML = TYPE_ORDER
    .filter(t => grouped[t].length>0)
    .map(t => renderSection(t, grouped[t]))
    .join('');

  // 初始可見性
  setStarted(false);

  btnStart.addEventListener('click', () => {
    setStarted(true);
    window.rerenderMath && window.rerenderMath();
  });

  btnSubmit.addEventListener('click', () => {
    if (!state.started) { setStarted(true); }
    gradeAll();
  });

  // 計算自動計分的總分（不含 open）
  state.totalAutoPoints = state.questions
    .filter(q => q.type !== 'open')
    .reduce((s,q)=> s + (q.points||0), 0);
  updateScoreboard();

  // 渲染完跑一次數學
  window.rerenderMath && window.rerenderMath();

  // ====== 區塊渲染 ======
  function renderSection(type, list){
    const label = TYPE_LABELS[type] || type;
    return `
      <section class="section" id="sec_${type}">
        <h2>${label}</h2>
        <div class="meta">
          本區共有 ${list.length} 題。
          ${type==='open' ? `<span class="judge-note">＊本區作答不自動計分，交卷後請由老師批改。</span>` : ''}
        </div>
        ${list.map(renderQuestion).join('')}
      </section>
    `;
  }

  function renderQuestion(q, idx){
    const num = getDisplayNumber(q);
    const head = `<div class="qhead">${q.id || ('Q'+num)}．</div>`;
    const body = `<div class="qbody">${q.prompt.replaceAll('\\n','<br>')}</div>`;

    if (q.type==='single'){
      return `
        <article class="qcard" data-qid="${q.id}">
          ${head}${body}
          <div class="opts">
            ${q.choices.map((c,i)=>`
              <label class="opt">
                <input type="radio" name="${q.id}" value="${i}" />
                <span>${c}</span>
              </label>
            `).join('')}
          </div>
        </article>
      `;
    }

    if (q.type==='multiple'){
      return `
        <article class="qcard" data-qid="${q.id}">
          ${head}${body}
          <div class="opts">
            ${q.choices.map((c,i)=>`
              <label class="opt">
                <input type="checkbox" name="${q.id}" value="${i}" />
                <span>${c}</span>
              </label>
            `).join('')}
          </div>
        </article>
      `;
    }

    if (q.type==='fill'){
      return `
        <article class="qcard" data-qid="${q.id}">
          ${head}${body}
          <div class="fill">
            <label>答案：</label>
            <input type="text" name="${q.id}" placeholder="請輸入答案，例如 4+4/x 或 4 + 4/x" />
          </div>
        </article>
      `;
    }

    // 開放題 open（非選擇題，人工批改）
    return `
      <article class="qcard open" data-qid="${q.id}">
        ${head}${body}
        <div style="margin-top:10px">
          <textarea name="${q.id}" placeholder="請在此書寫解題過程、理由與答案；本題需人工批改"></textarea>
        </div>
      </article>
    `;
  }

  // 顯示編號（如果你想各區塊獨立編號，也可改下方邏輯）
  function getDisplayNumber(q){
    const idx = state.questions.findIndex(x => x.id===q.id);
    return idx>=0 ? (idx+1) : '?';
  }

  // ====== 行為 ======
  function setStarted(v){
    state.started = v;
    // 開始前先把所有互動元件 disable
    const inputs = app.querySelectorAll('input,textarea');
    inputs.forEach(el => el.disabled = !v);
  }

  function updateScoreboard(){
    scoreText.textContent = `得分：${state.score} / ${state.totalAutoPoints}（只計單選/多選/填充）`;
    // 開放題提示：若沒有 open 題，隱藏提示
    const hasOpen = state.questions.some(q => q.type==='open');
    openHint.style.display = hasOpen ? 'inline' : 'none';
  }

  function gradeAll(){
    let score = 0;

    for (const q of state.questions){
      if (q.type==='open') continue; // 不自動評分

      if (q.type==='single'){
        const val = getSingleAnswer(q.id);
        if (val !== null && Number(val) === Number(q.answer)) score += (q.points||0);
      }

      if (q.type==='multiple'){
        const arr = getMultipleAnswer(q.id); // [idx, ...]
        const correct = (q.answer || []).map(Number).sort((a,b)=>a-b);
        const mine = arr.map(Number).sort((a,b)=>a-b);
        if (JSON.stringify(correct) === JSON.stringify(mine)) score += (q.points||0);
      }

      if (q.type==='fill'){
        const val = app.querySelector(`input[name="${q.id}"]`)?.value ?? '';
        const ans = Array.isArray(q.answer) ? q.answer : [q.answer];
        const ok = ans.some(a => normalize(a) === normalize(val));
        if (ok) score += (q.points||0);
      }
    }

    state.score = score;
    state.submitted = true;
    updateScoreboard();
    highlightResults();
  }

  function getSingleAnswer(qid){
    const el = app.querySelector(`input[name="${qid}"]:checked`);
    return el ? el.value : null;
  }
  function getMultipleAnswer(qid){
    return Array.from(app.querySelectorAll(`input[name="${qid}"]:checked`)).map(x=>x.value);
  }

  function highlightResults(){
    if (!state.submitted) return;
    // 簡單標示（正確綠、錯誤紅；open 不處理）
    for (const q of state.questions){
      const card = app.querySelector(`.qcard[data-qid="${q.id}"]`);
      if (!card) continue;
      if (q.type==='open') continue;

      let correct = false;
      if (q.type==='single'){
        const v = getSingleAnswer(q.id);
        correct = (v !== null && Number(v) === Number(q.answer));
      }else if (q.type==='multiple'){
        const mine = getMultipleAnswer(q.id).map(Number).sort((a,b)=>a-b);
        const corr = (q.answer||[]).map(Number).sort((a,b)=>a-b);
        correct = JSON.stringify(mine)===JSON.stringify(corr);
      }else if (q.type==='fill'){
        const val = app.querySelector(`input[name="${q.id}"]`)?.value ?? '';
        const ans = Array.isArray(q.answer) ? q.answer : [q.answer];
        correct = ans.some(a => normalize(a) === normalize(val));
      }
      card.style.borderColor = correct ? '#16a34a' : '#dc2626';
    }
  }
};
