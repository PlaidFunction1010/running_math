export function mountShell(){
  const header = document.getElementById('site-header');
  if (header) header.innerHTML = `<div class="inner"><div class="brand"><div class="logo"></div><div>高中數學練習平台</div></div>
  <div class="header-actions"><a class="btn" href="./index.html">首頁</a><a class="btn" href="./g11/unit1/tri-extrema3.html">高二·三角函數</a></div></div>`;
  const footer = document.getElementById('site-footer');
  if (footer) footer.innerHTML = `<div class="inner">© ${new Date().getFullYear()} 高中數學練習平台 · KaTeX · Noto Sans TC</div>`;
}
