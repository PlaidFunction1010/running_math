import { buildSidebar } from './sidebar.js';
import { initKatexAutoRender } from './katex-init.js';

export function initPage() {
  // Sidebar
  buildSidebar('sidebar', location.pathname);

  // Font size preference
  const fs = localStorage.getItem('fontSize') || 'large';
  const content = document.getElementById('content');
  content.classList.add(fs === 'small' ? 'fs-small' : 'fs-large');

  // KaTeX autorender (for any static math present)
  initKatexAutoRender();
}
