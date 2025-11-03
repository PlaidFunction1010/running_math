import { ROUTES } from './routes.js';

function saveState(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e){}
}
function loadState(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch(e){ return fallback; }
}

export function buildSidebar(containerId, currentPath) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';

  const mkGradeHeader = (g) => {
    const wrap = document.createElement('div');
    wrap.style.marginBottom = '0.25rem';

    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.style.width = '100%';
    btn.style.justifyContent = 'space-between';
    btn.style.fontWeight = '800';

    const key = `nav_expand_grade_${g.key}`;
    let expanded = loadState(key, false);

    btn.innerHTML = `<span>${g.grade}</span><span>${expanded ? '▾' : '▸'}</span>`;
    btn.onclick = () => {
      expanded = !expanded;
      saveState(key, expanded);
      btn.innerHTML = `<span>${g.grade}</span><span>${expanded ? '▾' : '▸'}</span>`;
      list.style.display = expanded ? 'block' : 'none';
    };

    const list = document.createElement('div');
    list.style.display = expanded ? 'block' : 'none';
    list.style.marginTop = '.5rem';

    g.units.forEach(u => {
      const unitWrap = document.createElement('div');
      unitWrap.style.marginBottom = '.25rem';

      const uKey = `nav_expand_${g.key}_${u.key}`;
      let uExpanded = loadState(uKey, false);

      const uBtn = document.createElement('button');
      uBtn.className = 'btn';
      uBtn.style.width = '100%';
      uBtn.style.justifyContent = 'space-between';
      uBtn.style.fontWeight = '600';
      uBtn.style.background = '#f9fafb';

      uBtn.innerHTML = `<span>${u.name}</span><span style="opacity:.7">${uExpanded ? '▾' : '▸'}</span>`;
      uBtn.onclick = () => {
        uExpanded = !uExpanded;
        saveState(uKey, uExpanded);
        uBtn.innerHTML = `<span>${u.name}</span><span style="opacity:.7">${uExpanded ? '▾' : '▸'}</span>`;
        topicsBox.style.display = uExpanded ? 'block' : 'none';
      };

      const topicsBox = document.createElement('div');
      topicsBox.style.display = uExpanded ? 'block' : 'none';
      topicsBox.style.paddingLeft = '.5rem';
      topicsBox.style.marginTop = '.25rem';

      if (!u.topics || u.topics.length === 0) {
        const p = document.createElement('div');
        p.textContent = '（尚未建立主題）';
        p.style.fontSize = '.9em';
        p.style.color = '#64748b';
        p.style.padding = '.25rem .4rem';
        topicsBox.appendChild(p);
      } else {
        u.topics.forEach(t => {
          const a = document.createElement('a');
          a.href = t.path;
          a.textContent = '・ ' + t.name;
          a.style.display = 'block';
          a.style.padding = '0.25rem 0.4rem';
          a.style.borderRadius = '0.375rem';
          a.style.textDecoration = 'none';
          if (currentPath.endsWith(t.path)) {
            a.style.background = '#e5e7eb';
            a.style.fontWeight = '700';
          } else {
            a.style.color = '#111827';
          }
          topicsBox.appendChild(a);
        });
      }

      unitWrap.appendChild(uBtn);
      unitWrap.appendChild(topicsBox);
      list.appendChild(unitWrap);
    });

    wrap.appendChild(btn);
    wrap.appendChild(list);
    return wrap;
  };

  ROUTES.forEach(g => {
    el.appendChild(mkGradeHeader(g));
  });

  const hr = document.createElement('hr');
  hr.style.margin = '1rem 0';
  el.appendChild(hr);

  // Global controls
  const sizeLabel = document.createElement('div');
  sizeLabel.textContent = '字體大小';
  sizeLabel.style.fontWeight = '600';
  el.appendChild(sizeLabel);

  const btnRow = document.createElement('div');
  btnRow.style.display = 'flex';
  btnRow.style.gap = '0.5rem';
  btnRow.style.marginTop = '0.5rem';

  const small = document.createElement('button');
  small.className = 'btn';
  small.textContent = '小（14pt）';
  small.onclick = () => {
    localStorage.setItem('fontSize', 'small');
    document.getElementById('content').classList.remove('fs-large');
    document.getElementById('content').classList.add('fs-small');
  };

  const large = document.createElement('button');
  large.className = 'btn';
  large.textContent = '大（20pt）';
  large.onclick = () => {
    localStorage.setItem('fontSize', 'large');
    document.getElementById('content').classList.remove('fs-small');
    document.getElementById('content').classList.add('fs-large');
  };

  btnRow.appendChild(small);
  btnRow.appendChild(large);
  el.appendChild(btnRow);
}
