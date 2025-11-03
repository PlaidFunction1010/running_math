export function mountShell() {
  const header = document.getElementById('site-header');
  if (header) header.innerHTML = `
    <div class="inner">
      <div class="brand">
        <div class="logo"></div>
        <div>高中數學練習平台</div>
      </div>
      <div class="header-actions">
        <a class="btn" href="./index.html">首頁</a>
        <a class="btn" href="./g10/unit1/topic1.html">高一·指數與對數</a>
        <a class="btn" href="./g10/unit1/topic2.html">對數方程</a>
      </div>
    </div>
  `;

  const footer = document.getElementById('site-footer');
  if (footer) footer.innerHTML = `
    <div class="inner">
      <div>© ${new Date().getFullYear()} 高中數學練習平台 · KaTeX · Noto Sans TC</div>
    </div>
  `;
}
