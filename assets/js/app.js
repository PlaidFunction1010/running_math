import { buildSidebar } from './sidebar.js';
import { initKatexAutoRender } from './katex-init.js';
export function initPage(){
  buildSidebar('sidebar', location.pathname);
  const fs = localStorage.getItem('fontSize') || 'large';
  const content = document.getElementById('content'); content.classList.add(fs === 'small' ? 'fs-small' : 'fs-large');
  initKatexAutoRender();
}
