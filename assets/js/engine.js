import { pickValidator } from './validator.js';

export function renderProblem(container, problem, idx, total) {
  const card = document.createElement('div');
  card.className = 'card';

  const title = document.createElement('h2');
  title.textContent = `第 ${idx+1} 題 / 共 ${total} 題`;
  card.appendChild(title);

  const stem = document.createElement('div');
  stem.className = 'stem';
  stem.innerHTML = problem.stemHtml || '';
  card.appendChild(stem);

  const mi = createMathInput();
  card.appendChild(mi.root);

  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '0.5rem';
  actions.style.marginTop = '0.5rem';

  const btnCheck = document.createElement('button');
  btnCheck.className = 'btn';
  btnCheck.textContent = '驗證答案';
  const result = document.createElement('span');
  result.style.marginLeft = '.5rem';

  btnCheck.onclick = () => {
    const vfn = pickValidator(problem.validator || 'numeric');
    const ok = vfn(mi.getLatex(), problem.answer);
    result.className = ok ? 'result-ok' : 'result-bad';
    result.textContent = ok ? '✔ 正確' : '✘ 再試試看';
  };

  const btnSol = document.createElement('button');
  btnSol.className = 'btn';
  btnSol.textContent = '看詳解';

  const solBox = document.createElement('div');
  solBox.style.display = 'none';
  solBox.style.marginTop = '.5rem';
  solBox.className = 'solution';

  let solHtml = '';
  if (problem.solutionMode === 'key-final') {
    solHtml += `<div><strong>關鍵步驟：</strong></div>`;
    (problem.keySteps || []).forEach(s => {
      solHtml += `<div>\(${s}\)</div>`;
    });
    solHtml += `<div style="margin-top:.5rem;"><strong>最終式：</strong> \(${problem.finalLatex || ''}\)</div>`;
  } else {
    // fallback simple
    solHtml += `<div>\(${problem.finalLatex || ''}\)</div>`;
  }
  solBox.innerHTML = solHtml;

  btnSol.onclick = () => {
    solBox.style.display = solBox.style.display === 'none' ? 'block' : 'none';
    if (window.renderMathInElement) window.renderMathInElement(solBox, {
      delimiters:[{left:"\(",right:"\)",display:false},{left:"\[",right:"\]",display:true}],
      throwOnError:false
    });
  };

  actions.appendChild(btnCheck);
  actions.appendChild(btnSol);
  actions.appendChild(result);
  card.appendChild(actions);

  container.appendChild(card);

  // Render math in stem
  if (window.renderMathInElement) window.renderMathInElement(card, {
    delimiters:[{left:"\(",right:"\)",display:false},{left:"\[",right:"\]",display:true}],
    throwOnError:false
  });
}

export function createMathInput() {
  const root = document.createElement('div');
  root.className = 'math-input';

  const ta = document.createElement('textarea');
  ta.className = 'input-area';
  ta.placeholder = '在此輸入答案，可用 LaTeX（例如 \\sqrt{2}, \\frac{a}{b}, \\log_2 8）';
  root.appendChild(ta);

  const preview = document.createElement('div');
  preview.className = 'preview';
  root.appendChild(preview);

  const kb = document.createElement('div');
  kb.className = 'kb';
  const keys = [
    { label: '√', insert: '\\sqrt{}', cursor: -1 },
    { label: '^', insert: '^{}', cursor: -1 },
    { label: 'frac', insert: '\\frac{}{}', cursor: -3 },
    { label: 'log', insert: '\\log_{}{}', cursor: -3 },
    { label: 'ln', insert: '\\ln{}', cursor: -1 },
    { label: 'π', insert: '\\pi', cursor: 0 },
  ];
  keys.forEach(k => {
    const b = document.createElement('button');
    b.textContent = k.label;
    b.onclick = () => {
      const start = ta.selectionStart ?? ta.value.length;
      const end = ta.selectionEnd ?? ta.value.length;
      const before = ta.value.slice(0, start);
      const after = ta.value.slice(end);
      ta.value = before + k.insert + after;
      const pos = start + k.insert.length + (k.cursor||0);
      ta.focus();
      ta.setSelectionRange(pos, pos);
      updatePreview();
    };
    kb.appendChild(b);
  });
  root.appendChild(kb);

  function getLatex(){ return ta.value; }
  function updatePreview(){
    preview.innerHTML = '';
    const span = document.createElement('span');
    span.textContent = '$' + (ta.value || ' ') + '$';
    preview.appendChild(span);
    if (window.renderMathInElement) window.renderMathInElement(preview, {
      delimiters:[{left:'$', right:'$', display:false}], throwOnError:false
    });
  }
  ta.addEventListener('input', updatePreview);
  updatePreview();

  return { root, getLatex };
}
