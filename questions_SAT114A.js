/* ==========================================================
   SAT 114A 題庫與渲染（支援四種題型 + 題型分區塊）
   題型(type)： 'single'｜'multiple'｜'fill'｜'open'
   計分：只自動計 single/multiple/fill；open 交由人工批改
   ※ 元件 class 命名全面對齊 styles.css（card/qtext/options/opt/answerRow/btn...）
========================================================== */

// DEMO 題庫（替換成你的實際題庫即可）
const QUESTIONS = [
  // 單選
  {
    id: 'Q1', type: 'single', points: 2,
    prompt: '已知 $f(x)=x^2-4x+5$，則 $f(2)$ 等於？',
    choices: ['-1', '1', '3', '5'],
    answer: 1
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
    answer: [0,1]
  },

  // 填充
  {
    id: 'Q4', type: 'fill', points: 3,
    prompt: '化簡 $\\dfrac{(x+2)^2 - x^2}{x}$，$x\\ne 0$，結果為：',
    answer: ['4+4/x','4+\\frac{4}{x}','4 + 4/x','4 + \\frac{4}{x}']
  },

  // 非選擇題（人工批改）
  {
    id: 'Q5', type: 'open', points: 0,
    prompt: '設 $\\triangle ABC$ 為銳角三角形，試證明其外心位於三角形內部。\\n（請完整敘述理由與步驟）'
  },
  {
    id: 'Q6', type: 'open', points: 0,
    prompt: '已知向量 $\\vec{a},\\vec{b}$，試以向量方法證明平行四邊形對角線互相平分。'
  }
];

// ===== 狀態 =====
const state = {
  questions: QUESTIONS,
  started: false,
  submitted: false,
  score: 0,
  totalAutoPoints: 0,
};

// ===== 工具：填充題答案標準化 =====
function normalize(s){
  return String(s||'').trim()
    .replace(/\s+/g,'')
    .replace(/，/g,',')
    .replace(/（/g,'(').replace(/）/g,')')
    .toLowerCase();
}

// ===== 題型順序 / 題型標籤 =====
const TYPE_ORDER  = ['single','multiple','fill','open'];
const TYPE_LABELS = {
  single:  '單選題',
  multiple:'多選題',
  fill:    '填充題',
  open:    '非選擇題（人工批改）'
};

// ===== 掛載 App =====
window.__mountApp = function(){
  const app          = document.getElementById('app');
  const btnStart     = document.getElementById('btnStart');
  const btnSubmit    = document.getElementById('btnSubmit');
  const scoreText    = document.getElementById('scoreText');
  const anchorsWrap  = document.getElementById('anchors');
  const modal        = document.getElementById('resultModal');
  const resultText   = document.getElementById('resultText');
  const btnCloseModal= document.getElementById('btnCloseModal');

  // 依題型分組
  const grouped = TYPE_ORDER.reduce((acc,t)=>(acc[t]=[],acc),{});
  state.questions.forEach(q => { if(grouped[q.type]) grouped[q.type].push(q); });

  // 題型錨點（沿用 .toolbar 樣式）
  anchorsWrap.innerHTML = `
    <div class="meta"><span>題型快速跳轉</span></div>
    <div class="toolbar">
      ${
        TYPE_ORDER.filter(t=>grouped[t].length>0)
        .map(t => `<a class="btn" href="#sec_${t}">${TYPE_LABELS[t]}（${grouped[t].length}）</a>`)
        .join('')
      }
      <span class="small" style="margin-left:auto">＊非選擇題需人工批改</span>
    </div>
  `;

  // 渲染每個題型分區塊（用 .panel 包住多張 .card）
  app.innerHTML = TYPE_ORDER
    .filter(t => grouped[t].length>0)
    .map(t => renderSection(t, grouped[t]))
    .join('');

  // 初始：未開始 -> disable inputs
  setStarted(false);

  // 綁定按鈕
  btnStart.addEventListener('click', () => {
    setStarted(true);
    window.rerenderMath && window.rerenderMath();
  });
  btnSubmit.addEventListener('click', () => {
    if (!state.started) setStarted(true);
    gradeAll();
    showResult();
  });
  btnCloseModal.addEventListener('click', hideResult);
  modal.addEventListener('click', (e)=>{ if(e.target===modal) hideResult(); });

  // 自動計分總分（不含 open）
  state.totalAutoPoints = state.questions
    .filter(q => q.type !== 'open')
    .reduce((s,q)=> s + (q.points||0), 0);
  updateScoreboard();

  // 首次排版數學
  window.rerenderMath && window.rerenderMath();

  // ===== 區塊與題目渲染 =====
  function renderSection(type, list){
    return `
      <section id="sec_${type}" class="panel">
        <div class="meta">
          <span class="tag">${TYPE_LABELS[type]}</span>
          <span>本區 ${list.length} 題</span>
          ${type==='open' ? `<span class="small">（本區不自動計分）</span>` : ''}
        </div>
        ${list.map(renderQuestion).join('')}
      </section>
    `;
  }

  function renderQuestion(q){
    // header meta
    const meta = `
      <div class="meta">
        <span>#${q.id || ''}</span>
        ${q.points ? `<span class="tag">${q.points} 分</span>` : `<span class="tag">不計分</span>`}
        <span class="small">${TYPE_LABELS[q.type] || q.type}</span>
      </div>
    `;

    const qtext = `<div class="qtext">${(q.prompt||'').replaceAll('\\n','<br>')}</div>`;

    // 依題型輸出內容
    if (q.type==='single'){
      return `
        <article class="card" data-qid="${q.id}">
          ${meta}
          ${qtext}
          <div class="options">
            ${q.choices.map((c,i)=>`
              <label class="opt">
                <input type="radio" name="${q.id}" value="${i}"/>
                <span>${c}</span>
              </label>
            `).join('')}
          </div>
        </article>
      `;
    }

    if (q.type==='multiple'){
      return `
        <article class="card" data-qid="${q.id}">
          ${meta}
          ${qtext}
          <div class="options">
            ${q.choices.map((c,i)=>`
              <label class="opt">
                <input type="checkbox" name="${q.id}" value="${i}"/>
                <span>${c}</span>
              </label>
            `).join('')}
          </div>
        </article>
      `;
    }

    if (q.type==='fill'){
      return `
        <article class="card" data-qid="${q.id}">
          ${meta}
          ${qtext}
          <div class="answerRow">
            <span>答案：</span>
            <input class="answer" type="text" name="${q.id}" placeholder="請輸入答案（例如 4+4/x）"/>
          </div>
        </article>
      `;
    }

    // 非選擇題（open）
    return `
      <article class="card" data-qid="${q.id}">
        ${meta}
        ${qtext}
        <div class="answerRow" style="width:100%">
          <textarea class="answer" name="${q.id}" placeholder="請在此書寫解題過程與答案；此題需人工批改" style="width:100%;min-height:140px"></textarea>
        </div>
      </article>
    `;
  }

  // ===== 行為 / 計分 =====
  function setStarted(v){
    state.started = v;
    const inputs = app.querySelectorAll('input,textarea,button.option');
    inputs.forEach(el => el.disabled = !v);
  }

  function updateScoreboard(){
    scoreText.textContent = `得分：${state.score} / ${state.totalAutoPoints}（只計單選/多選/填充）`;
  }

  function gradeAll(){
    let score = 0;

    for (const q of state.questions){
      if (q.type==='open') continue; // 不自動評分

      if (q.type==='single'){
        const val = getSingle(q.id);
        if (val !== null && Number(val) === Number(q.answer)) score += (q.points||0);
      }

      if (q.type==='multiple'){
        const mine = getMultiple(q.id).map(Number).sort((a,b)=>a-b);
        const corr = (q.answer||[]).map(Number).sort((a,b)=>a-b);
        if (JSON.stringify(mine)===JSON.stringify(corr)) score += (q.points||0);
      }

      if (q.type==='fill'){
        const val = (app.querySelector(`input[name="${q.id}"]`)?.value ?? '');
        const answers = Array.isArray(q.answer)? q.answer : [q.answer];
        const ok = answers.some(a => normalize(a) === normalize(val));
        if (ok) score += (q.points||0);
      }
    }

    state.score = score;
    state.submitted = true;
    updateScoreboard();
    colorizeResults();
  }

  function getSingle(qid){
    const el = app.querySelector(`input[name="${qid}"]:checked`);
    return el ? el.value : null;
  }
  function getMultiple(qid){
    return Array.from(app.querySelectorAll(`input[name="${qid}"]:checked`)).map(x=>x.value);
  }

  // 交卷後：用邊框顏色提示正誤（沿用你 panel/card 色系邏輯，不額外加 class）
  function colorizeResults(){
    for (const q of state.questions){
      if (q.type==='open') continue;
      const card = app.querySelector(`.card[data-qid="${q.id}"]`);
      if (!card) continue;

      let correct = false;
      if (q.type==='single'){
        const v = getSingle(q.id);
        correct = (v !== null && Number(v) === Number(q.answer));
      }else if (q.type==='multiple'){
        const mine = getMultiple(q.id).map(Number).sort((a,b)=>a-b);
        const corr = (q.answer||[]).map(Number).sort((a,b)=>a-b);
        correct = JSON.stringify(mine)===JSON.stringify(corr);
      }else if (q.type==='fill'){
        const val = app.querySelector(`input[name="${q.id}"]`)?.value ?? '';
        const answers = Array.isArray(q.answer)? q.answer : [q.answer];
        correct = answers.some(a => normalize(a) === normalize(val));
      }
      card.style.borderColor = correct ? 'var(--ok)' : '#8b1c1c';
    }
  }

  // 成績彈窗
  function showResult(){
    const openCount = state.questions.filter(q=>q.type==='open').length;
    resultText.innerHTML = `
      本次自動計分：<b>${state.score} / ${state.totalAutoPoints}</b><br/>
      另有 <b>${openCount}</b> 題非選擇題需人工批改。
    `;
    modal.classList.remove('hidden');
    window.rerenderMath && window.rerenderMath();
  }
  function hideResult(){ modal.classList.add('hidden'); }
};
