import { pickValidator } from './validator.js';

export function renderProblem(container, problem, idx, total) {
  const card = document.createElement('div'); card.className='card';
  const title = document.createElement('h2'); title.textContent = `第 ${idx+1} 題 / 共 ${total} 題`; card.appendChild(title);
  const stem = document.createElement('div'); stem.className='stem'; stem.innerHTML = problem.stemHtml || ''; card.appendChild(stem);

  const actions = document.createElement('div'); actions.style.display='flex'; actions.style.gap='.5rem'; actions.style.marginTop='.5rem';
  const result = document.createElement('span'); result.style.marginLeft='.5rem';

  const vKind = problem.validator || 'numeric';
  const vfn = pickValidator(vKind);

  // Back-compat: single-answer mode
  const isDual = !!problem.answers && typeof problem.answers === 'object';
  if (!isDual) {
    const mi = createMathInput(); card.appendChild(mi.root);
    const btnCheck = document.createElement('button'); btnCheck.className='btn'; btnCheck.textContent='驗證答案';
    const btnSol = document.createElement('button'); btnSol.className='btn'; btnSol.textContent='看詳解';
    const solBox = document.createElement('div'); solBox.style.display='none'; solBox.style.marginTop='.5rem'; solBox.className='solution';

    let solHtml = '';
    if (problem.solutionMode === 'key-final') {
      solHtml += `<div><strong>關鍵步驟：</strong></div>`;
      (problem.keySteps || []).forEach(s => { solHtml += `<div>\\(${s}\\)</div>`; });
      solHtml += `<div style="margin-top:.5rem;"><strong>最終式：</strong> \\(${problem.finalLatex || ''}\\)</div>`;
    } else {
      solHtml += `<div>\\(${problem.finalLatex || ''}\\)</div>`;
    }
    solBox.innerHTML = solHtml;

    btnCheck.onclick = ()=>{
      const ok = vfn(mi.getLatex(), problem.answer);
      result.className = ok ? 'result-ok' : 'result-bad';
      result.textContent = ok ? '✔ 正確' : '✘ 再試試看';
    };
    btnSol.onclick = ()=>{
      solBox.style.display = solBox.style.display === 'none' ? 'block' : 'none';
      if (window.renderMathInElement) window.renderMathInElement(solBox, {delimiters:[{left:"\\(",right:"\\)",display:false}],throwOnError:false});
    };

    actions.appendChild(btnCheck); actions.appendChild(btnSol); actions.appendChild(result); card.appendChild(actions); card.appendChild(solBox);
    container.appendChild(card);
    if (window.renderMathInElement) window.renderMathInElement(card, {delimiters:[{left:"\\(",right:"\\)",display:false}],throwOnError:false});
    return;
  }

  // Dual-input mode (y_max & y_min) -----------------------
  const block = document.createElement('div');
  block.style.display='grid'; block.style.gridTemplateColumns='1fr 1fr'; block.style.gap='0.75rem';

  const secMax = document.createElement('div');
  const labMax = document.createElement('div'); labMax.textContent = 'y_max'; labMax.style.fontWeight='700';
  const miMax = createMathInput(); secMax.appendChild(labMax); secMax.appendChild(miMax.root);

  const secMin = document.createElement('div');
  const labMin = document.createElement('div'); labMin.textContent = 'y_min'; labMin.style.fontWeight='700';
  const miMin = createMathInput(); secMin.appendChild(labMin); secMin.appendChild(miMin.root);

  block.appendChild(secMax); block.appendChild(secMin);
  card.appendChild(block);

  const btnCheck = document.createElement('button'); btnCheck.className='btn'; btnCheck.textContent='驗證兩者';
  const btnSol = document.createElement('button'); btnSol.className='btn'; btnSol.textContent='看詳解';
  const solBox = document.createElement('div'); solBox.style.display='none'; solBox.style.marginTop='.5rem'; solBox.className='solution';

  // Solution layout for dual: key steps + final lines for each
  let solHtml = '';
  if (problem.solutionMode === 'key-final') {
    solHtml += `<div><strong>關鍵步驟：</strong></div>`;
    (problem.keySteps || []).forEach(s => { solHtml += `<div>\\(${s}\\)</div>`; });
    const finMax = problem.finalLatexMax || problem.finalLatex || '';
    const finMin = problem.finalLatexMin || problem.finalLatex || '';
    solHtml += `<div style="margin-top:.5rem;"><strong>最終：</strong> y_{max}=\\(${finMax}\\), \\quad y_{min}=\\(${finMin}\\)</div>`;
  } else {
    const finMax = problem.finalLatexMax || '';
    const finMin = problem.finalLatexMin || '';
    solHtml += `<div>y_{max}=\\(${finMax}\\), \\; y_{min}=\\(${finMin}\\)</div>`;
  }
  solBox.innerHTML = solHtml;

  btnCheck.onclick = ()=>{
    const okMax = vfn(miMax.getLatex(), problem.answers.max);
    const okMin = vfn(miMin.getLatex(), problem.answers.min);
    const both = okMax && okMin;
    result.className = both ? 'result-ok' : (okMax || okMin ? 'result-bad' : 'result-bad');
    result.textContent = both ? '✔ 兩者皆正確' : (okMax || okMin ? '△ 部分正確' : '✘ 再試試看');
  };
  btnSol.onclick = ()=>{
    solBox.style.display = solBox.style.display === 'none' ? 'block' : 'none';
    if (window.renderMathInElement) window.renderMathInElement(solBox, {delimiters:[{left:"\\(",right:"\\)",display:false}],throwOnError:false});
  };

  actions.appendChild(btnCheck); actions.appendChild(btnSol); actions.appendChild(result);
  card.appendChild(actions); card.appendChild(solBox);
  container.appendChild(card);
  if (window.renderMathInElement) window.renderMathInElement(card, {delimiters:[{left:"\\(",right:"\\)",display:false}],throwOnError:false});
}

export function createMathInput() {
  const root = document.createElement('div'); root.className='math-input';
  const ta = document.createElement('textarea'); ta.className='input-area'; ta.placeholder='在此輸入答案（數值）'; root.appendChild(ta);
  const preview = document.createElement('div'); preview.className='preview'; root.appendChild(preview);
  const kb = document.createElement('div'); kb.className='kb';
  const keys=[{label:'√',insert:'\\\\sqrt{}',cursor:-1},{label:'^',insert:'^{}',cursor:-1},{label:'frac',insert:'\\\\frac{}{}',cursor:-3},{label:'log',insert:'\\\\log_{}{}',cursor:-3},{label:'ln',insert:'\\\\ln{}',cursor:-1},{label:'π',insert:'\\\\pi',cursor:0}];
  keys.forEach(k=>{ const b=document.createElement('button'); b.textContent=k.label; b.onclick=()=>{ const start=ta.selectionStart??ta.value.length; const end=ta.selectionEnd??ta.value.length; const before=ta.value.slice(0,start); const after=ta.value.slice(end); ta.value = before + k.insert + after; const pos = start + k.insert.length + (k.cursor||0); ta.focus(); ta.setSelectionRange(pos,pos); updatePreview(); }; kb.appendChild(b); });
  root.appendChild(kb);
  function getLatex(){ return ta.value; }
  function updatePreview(){ preview.innerHTML=''; const span=document.createElement('span'); span.textContent='$'+(ta.value||' ')+'$'; preview.appendChild(span); if (window.renderMathInElement) window.renderMathInElement(preview,{delimiters:[{left:'$',right:'$',display:false}],throwOnError:false}); }
  ta.addEventListener('input', updatePreview); updatePreview();
  return { root, getLatex };
}
