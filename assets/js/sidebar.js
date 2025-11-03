import { ROUTES } from './routes.js';
function saveState(key, val){ try{localStorage.setItem(key, JSON.stringify(val));}catch(e){} }
function loadState(key, fallback){ try{const v=JSON.parse(localStorage.getItem(key)); return v ?? fallback;}catch(e){return fallback;} }

export function buildSidebar(containerId, currentPath) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';

  const mkGrade = (g)=>{
    const wrap = document.createElement('div');
    wrap.style.marginBottom = '.25rem';
    const key = `nav_expand_grade_${g.key}`;
    let expanded = loadState(key, g.key==='g11'); // 預設展開高二
    const btn = document.createElement('button');
    btn.className = 'btn'; btn.style.width='100%'; btn.style.justifyContent='space-between'; btn.style.fontWeight='800';
    btn.innerHTML = `<span>${g.grade}</span><span>${expanded?'▾':'▸'}</span>`;
    const list = document.createElement('div'); list.style.display = expanded?'block':'none'; list.style.marginTop = '.5rem';

    btn.onclick = ()=>{ expanded=!expanded; saveState(key, expanded); btn.innerHTML = `<span>${g.grade}</span><span>${expanded?'▾':'▸'}</span>`; list.style.display = expanded?'block':'none'; };

    g.units.forEach(u=>{
      const uKey = `nav_expand_${g.key}_${u.key}`;
      let uExp = loadState(uKey, u.key==='unit1');
      const uBtn = document.createElement('button');
      uBtn.className = 'btn'; uBtn.style.width='100%'; uBtn.style.justifyContent='space-between'; uBtn.style.fontWeight='600'; uBtn.style.background='#f9fafb';
      uBtn.innerHTML = `<span>${u.name}</span><span style="opacity:.7">${uExp?'▾':'▸'}</span>`;
      const topicsBox = document.createElement('div'); topicsBox.style.display = uExp?'block':'none'; topicsBox.style.paddingLeft = '.5rem'; topicsBox.style.marginTop = '.25rem';
      uBtn.onclick = ()=>{ uExp=!uExp; saveState(uKey, uExp); uBtn.innerHTML = `<span>${u.name}</span><span style="opacity:.7">${uExp?'▾':'▸'}</span>`; topicsBox.style.display = uExp?'block':'none'; };

      if (!u.topics || u.topics.length===0){
        const p = document.createElement('div'); p.textContent='（尚未建立主題）'; p.style.fontSize='.9em'; p.style.color='#64748b'; p.style.padding='.25rem .4rem'; topicsBox.appendChild(p);
      } else {
        u.topics.forEach(t=>{
          const a = document.createElement('a');
          a.href = t.path; a.textContent = '・ ' + t.name; a.style.display='block'; a.style.padding='0.25rem 0.4rem'; a.style.borderRadius='0.375rem'; a.style.textDecoration='none';
          if (currentPath.endsWith(t.path)) { a.style.background='#e5e7eb'; a.style.fontWeight='700'; } else { a.style.color='#111827'; }
          topicsBox.appendChild(a);
        });
      }
      list.appendChild(uBtn); list.appendChild(topicsBox);
    });
    wrap.appendChild(btn); wrap.appendChild(list);
    return wrap;
  };

  ROUTES.forEach(g=> el.appendChild(mkGrade(g)) );

  const hr = document.createElement('hr'); hr.style.margin='1rem 0'; el.appendChild(hr);

  const sizeLabel = document.createElement('div'); sizeLabel.textContent='字體大小'; sizeLabel.style.fontWeight='600'; el.appendChild(sizeLabel);
  const row = document.createElement('div'); row.style.display='flex'; row.style.gap='.5rem'; row.style.marginTop='.5rem';
  const small = document.createElement('button'); small.className='btn'; small.textContent='小（14pt）'; small.onclick=()=>{localStorage.setItem('fontSize','small'); const c=document.getElementById('content'); c.classList.remove('fs-large'); c.classList.add('fs-small');};
  const large = document.createElement('button'); large.className='btn'; large.textContent='大（20pt）'; large.onclick=()=>{localStorage.setItem('fontSize','large'); const c=document.getElementById('content'); c.classList.remove('fs-small'); c.classList.add('fs-large');};
  row.appendChild(small); row.appendChild(large); el.appendChild(row);
}
