// 114 學測 數學A v2 — 內建 Q1~Q12 官方答案（自動評分）；Q13~Q17 僅收答
const KEY_SINGLE = { // 單選
  1:'5', 2:'2', 3:'4', 4:'3', 5:'1', 6:'3'
};
const KEY_MULTI = { // 多選（正確選項序號陣列）
  7:['2','4'],
  8:['3','5'],
  9:['2','4','5'],
  10:['1','4','5'],
  11:['3','4','5'],
  12:['1','3','4','5']
};
const SCORE_SINGLE = 5, SCORE_MULTI = 5;

const state = { items: [] };

function latex(html){ return html; }
function rerenderMath(){
  if (window.renderMathInElement) {
    window.renderMathInElement(document.body, {
      delimiters:[{left:'$$', right:'$$', display:true},{left:'\\(', right:'\\)', display:false},{left:'$', right:'$', display:false}], throwOnError:false
    });
  }
}

function buildItems(){
  const S = [];
  // Q1~Q6 單選
  S.push({id:1, type:'single', html: latex(`袋中藍、綠球各若干，標號 1 或 2。表如下：<br>
  <table class="small"><tr><td></td><td>藍</td><td>綠</td></tr><tr><td>1號</td><td>2</td><td>4</td></tr><tr><td>2號</td><td>3</td><td>k</td></tr></table>
  已知「抽藍」與「抽 1號」獨立，求 \\(k\\)。`), options:['2','3','4','5','6']});
  S.push({id:2, type:'single', html: latex(`平面上 \\(P(a,0), a>0\\)。過 P 的兩直線斜率分別 \\(-\\tfrac43\\)、\\(-\\tfrac32\\)。
    它們各與座標軸圍成的兩直角三角形面積差為 3，求 \\(a\\)。`), options:['$3\\sqrt2$','6','$6\\sqrt2$','9','$8\\sqrt2$']});
  S.push({id:3, type:'single', html: latex(`鋼琴5、小提琴4、歌唱3，共12曲；同類必相鄰；歌唱須排在鋼琴或小提琴之後。問排列數？`), options:['$5!4!3!$',' $2\\cdot5!4!3!$',' $3\\cdot5!4!3!$',' $4\\cdot5!4!3!$',' $6\\cdot5!4!3!$']});
  S.push({id:4, type:'single', html: latex(`在 \\(y=\\log_2 x\\)、x軸與 \\(x=\\tfrac{61}{2}\\) 所圍有界區域內部（不含邊界）有多少格子點？`), options:['88','89','90','91','92']});
  S.push({id:5, type:'single', html: latex(`設 \\(0\\le \\theta\\le 2\\pi\\)。滿足 \\(\\sin2\\theta>\\sin\\theta\\) 且 \\(\\cos2\\theta>\\cos\\theta\\) 的 \\(\\theta\\) 可表為 \\(a\\pi<\\theta<b\\pi\\)，求 \\(b-a\\)。`), options:['$\\tfrac13$','$\\tfrac12$','$\\tfrac23$','$\\tfrac34$','1']});
  S.push({id:6, type:'single', html: latex(`空間中三向量 \\(\\vec u,\\vec v,\\vec w\\) 互相垂直。已知 \\(\\overrightarrow{(2,-1,0)}=\\vec u-\\vec v\\)，且 \\(\\overrightarrow{(-1,2,3)}=\\vec v-\\vec w\\)。求其所張平行六面體體積。`),
    options:['$2\\sqrt5$','$\\sqrt{20}$','$2\\sqrt{10}$','$4\\sqrt5$','$\\sqrt{40}$']});
  // Q7~Q12 多選
  S.push({id:7, type:'multi', html: latex(`數列 \\(\\langle a_n\\rangle\\) 滿足 \\(a_{n+1}=a_n+\\tfrac1n\\)，且 \\(a_1=2\\)。令 \\(b_n=\\tfrac32 a_n-\\tfrac{n}{4}\\)。試選正確。`),
    options:['$a_2=2$','$b_2=\\tfrac34$','\\(\\langle b_n\\rangle\\) 為公比 \\(\\tfrac23\\) 等比','對任意正整數 \\(n\\)，\\(3^n a_n\\) 皆為整數','$b_{10}<10^4$']});
  S.push({id:8, type:'multi', html: latex(`考慮滿足 \\(\\dfrac{y^2}{x^2}-\\dfrac{4}{x}=\\dfrac{8}{2}\\) 的點 \\((x,y)\\)。試選正確。`),
    options:['當 \\(x=3\\) 時解有2個','若 \\((a,b)\\) 滿足則 \\((-a,-b)\\) 也滿足','所有點構成圓','可能在直線 \\(4x+y=4\\) 上','\\(x-y\\) 的最大值為 \\(1+2\\sqrt2\\)']});
  S.push({id:9, type:'multi', html: latex(`二次式 \\(x^2+bx+c=0\\) 有實根，但 \\(x^2+b(x+2)+c=0\\) 無實根。試選正確。`),
    options:['$c<0$','$b<0$','\\(x^2+b(x+1)+c=0\\) 有實根','\\(x^2+b(x+2)+c-4=0\\) 有實根','\\(x^2+b(x+2)-c=0\\) 有實根']});
  S.push({id:10, type:'multi', html: latex(`令 \\(\\Gamma: y=\\sin(\\pi x),\\ 0\\le x\\le 3\\)。水平直線 \\(y=k\\) 與 \\(\\Gamma\\) 相交於三點 \\(x_1<x_2<x_3\\)。試選正確。`),
    options:['$k>0$','交點恰有3個','$x_1+x_2<1$','若 \\(PQ=QR\\) 則 \\(k=\\tfrac12\\)','所有交點的 x 坐標和大於 5']});
  S.push({id:11, type:'multi', html: latex(`在 \\(\\triangle ABC\\) 中，\\(AB=6, AC=5, BC=4\\)。令 \\(D\\) 為 \\(AB\\) 中點，\\(P\\) 為 \\(\\angle ABC\\) 的角平分線與 \\(CD\\) 之交。試選正確。`),
    options:['$CP=\\tfrac37 CD$','$AP=\\tfrac37 AB+\\tfrac27 AC$','\\(\\cos\\angle BAC=\\tfrac34\\)','面積 \\(\\triangle ACP=\\tfrac{15}{14}\\)','內積 \\(\\vec{AP}\\cdot\\vec{AC}=\\tfrac{120}{7}\\)']});
  S.push({id:12, type:'multi', html: latex(`合金甲乙比例：原數據 \\((x_k,y_k)\\) 迴歸直線 \\(y=21.3x-40\\)。轉成乙占比 \\(u\\)、波長 \\(v\\)（微米）。得到 \\(v=au+b\\)。試選正確。`),
    options:['$u_k=100-x_k$','$v_k=1000y_k$','\\(u\\) 的標準差等於 \\(x\\) 的標準差','\\(b=2.09\\)','加入一筆新點在直線上，迴歸線不變']});
  // Q13~Q17 選填（僅收答）
  S.push({id:13, type:'fill', html: latex(`實係數三次多項式 \\(f(x)\\) 除以 \\(x+6\\) 餘數 3。若商式 \\(q(x)\\) 在 \\(x=-6\\) 有最大值 8，則 \\(y=f(x)\\) 的對稱中心座標為 \\(\\big(\\_\\_{13-1\\sim13-2},\\ \\_\\_{13-3}\\big)\\)。`), blanks: 3});
  S.push({id:14, type:'fill', html: latex(`空間中，點 \\(A(a,b,c)\\) 皆為負數，且到三平面 \\(E_1:y+z=4\\)、\\(E_2:3y+4z=-5\\)、\\(E_3:x+y+z=-2\\) 的距離皆為 6。求 \\(a+b+c=\\_\\_{14-1\\sim14-3}\\)。`), blanks: 3});
  S.push({id:15, type:'fill', html: latex(`擲公平硬幣至多5次，首次累積達3個正面的時點決定價格（240/320/400/480）。購得一個玩偶之期望金額（元）= \\_\\_{15-1\\sim15-3}`), blanks: 3});
  S.push({id:16, type:'fill', html: latex(`兩直線 \\(L_1,L_2\\) 過 \\((3,1)\\)，斜率分別為 \\(m,-m\\)。圓 \\(\\Gamma\\) 圓心在原點，與 \\(L_1\\) 交於相異兩點 \\(A,B\\)，且圓心到 \\(L_1\\) 的距離為 1，又 \\(\\Gamma\\) 與 \\(L_2\\) 相切。求弦 \\(AB\\) 長度（最簡分數）= \\_\\_{16-1\\sim16-3}`), blanks: 3});
  S.push({id:17, type:'fill', html: latex(`\\(\\triangle ABC\\) 中，\\(AB=BC=3\\)，\\(\\cos\\angle ABC=-\\tfrac18\\)。外接圓上一點 \\(D\\) 使 \\(BD=4\\) 且 \\(AD\\le CD\\)。求 \\(CD=\\_\\_{17-1}+\\_\\_{17-2}\\)（最簡根式）。`), blanks: 2});
  state.items = S;
}

function render(){
  const root = document.getElementById('app'); root.innerHTML=''; buildItems();
  state.items.forEach(item=>{
    const card=document.createElement('div'); card.className='card';
    const meta=document.createElement('div'); meta.className='meta';
    meta.innerHTML=`<span class="tag">第 ${item.id} 題</span><span class="tag">${item.type==='single'?'單選':item.type==='multi'?'多選':'選填'}</span>`;
    const qtext=document.createElement('div'); qtext.className='qtext'; qtext.innerHTML=item.html;
    card.appendChild(meta); card.appendChild(qtext);
    if (item.type==='single'){
      const ops=document.createElement('div'); ops.className='options';
      item.options.forEach((opt,idx)=>{
        const o=document.createElement('label'); o.className='opt';
        o.innerHTML=`<input type="radio" name="q${item.id}" value="${idx+1}"/> <span>${opt}</span>`;
        ops.appendChild(o);
      }); card.appendChild(ops);
    } else if (item.type==='multi'){
      const ops=document.createElement('div'); ops.className='options';
      item.options.forEach((opt,idx)=>{
        const o=document.createElement('label'); o.className='opt';
        o.innerHTML=`<input type="checkbox" name="q${item.id}" value="${idx+1}"/> <span>${opt}</span>`;
        ops.appendChild(o);
      }); card.appendChild(ops);
      const small=document.createElement('div'); small.className='small'; small.textContent='多選：採全對得分；或使用者可改為教師自訂規則版本。'; card.appendChild(small);
    } else {
      const row=document.createElement('div'); row.className='answerRow';
      for(let i=0;i<item.blanks;i++){ const inp=document.createElement('input'); inp.className='answer'; inp.placeholder=`${item.id}-${i+1}`; row.appendChild(inp); }
      card.appendChild(row);
      const small=document.createElement('div'); small.className='small'; small.textContent='選填題本系統不自動評分。'; card.appendChild(small);
    }
    root.appendChild(card);
  });
  rerenderMath();
}

function submitAndReport(){
  // 計 Q1~Q12 分
  let score = 0, detail=[];
  // 單選
  for (const [qid, ans] of Object.entries(KEY_SINGLE)){
    const sel = document.querySelector(`input[name="q${qid}"]:checked`);
    const ok = sel && sel.value===ans;
    score += ok? SCORE_SINGLE: 0;
    detail.push({id: Number(qid), type:'單選', ok, award: ok?SCORE_SINGLE:0});
  }
  // 多選（採全對得分；可在之後擴充為部份給分）
  for (const [qid, arr] of Object.entries(KEY_MULTI)){
    const ch = Array.from(document.querySelectorAll(`input[name="q${qid}"]:checked`)).map(x=>x.value);
    const setA = new Set(arr), setU = new Set(ch);
    let ok = setA.size===setU.size && arr.every(x=> setU.has(x));
    score += ok? SCORE_MULTI: 0;
    detail.push({id: Number(qid), type:'多選', ok, award: ok?SCORE_MULTI:0});
  }

  // 蒐集 Q13~Q17 作答
  const fills = [];
  for (let q=13;q<=17;q++){
    const inps = Array.from(document.querySelectorAll(`.card .answerRow input`)).filter(inp=> inp.placeholder.startsWith(`${q}-`));
    if (inps.length){
      fills.push({id:q, answers: inps.map(i=>i.value)});
    }
  }

  // 顯示成績單
  document.getElementById('result').classList.remove('hidden');
  document.getElementById('scoreline').innerHTML = `<p>選擇題總分：<b>${score} / 60</b></p>`;
  const box = document.getElementById('breakdown');
  let html = '<h3>細項</h3>';
  detail.sort((a,b)=>a.id-b.id).forEach(r=>{
    html += `<div>Q${r.id}（${r.type}）：${r.ok?'✔ 正確':'✖ 錯誤'}　+${r.award}</div>`;
  });
  html += '<hr/><h3>選填題作答（教師批改）</h3>';
  fills.forEach(f=>{
    html += `<div>Q${f.id}：${f.answers.map((x,i)=>`(${f.id}-${i+1}=${x||'未填'})`).join(' ')}</div>`;
  });
  box.innerHTML = html;
  window.scrollTo({top:0, behavior:'smooth'});
}

window.__mountApp = function(){
  render();
  document.getElementById('btn-submit').onclick = submitAndReport;
};
