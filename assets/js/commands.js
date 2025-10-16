// Mark page as JS-enabled for CSS fallbacks
// document.documentElement.classList.add('js');

function copyCommand(btn) {
  const cmd = btn.getAttribute('data-command') || '';
  navigator.clipboard.writeText(cmd)
    .then(() => {
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 2000);
    })
    .catch(() => {
      // If clipboard fails, reveal the fallback textarea (last resort)
      const block = btn.closest('.command-block');
      if (!block) return;
      const fallback = block.querySelector('.copy-fallback');
      if (fallback) {
        fallback.style.display = 'block';
        fallback.focus();
        fallback.select();
      }
    });
}
