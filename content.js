function createToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = '#333';
    toast.style.color = 'white';
    toast.style.padding = '10px 15px';
    toast.style.borderRadius = '5px';
    toast.style.fontSize = '14px';
    toast.style.zIndex = 9999;
    toast.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    document.body.appendChild(toast);
  
    setTimeout(() => toast.remove(), duration);
  }
  
  function createSpinner() {
    const spinner = document.createElement('span');
    spinner.classList.add('loader');
    spinner.style.marginLeft = '8px';
    spinner.style.border = '2px solid #fff';
    spinner.style.borderTop = '2px solid transparent';
    spinner.style.borderRadius = '50%';
    spinner.style.width = '12px';
    spinner.style.height = '12px';
    spinner.style.display = 'inline-block';
    spinner.style.animation = 'spin 1s linear infinite';
    return spinner;
  }
  
  function fetchAndCopySolution(questionNumber, btn) {
    const originalText = btn.textContent;
    btn.textContent = 'Fetching...';
    const spinner = createSpinner();
    btn.appendChild(spinner);
  
    const url = `https://walkccc.me/LeetCode/problems/${questionNumber}/`;
  
    fetch(url)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const codeTag = doc.querySelector('code');
  
        if (!codeTag) {
          createToast(`No code found for Q#${questionNumber}`);
          btn.textContent = originalText;
          return;
        }
  
        const codeText = codeTag.textContent;
  
        navigator.clipboard.writeText(codeText)
          .then(() => {
            createToast('✅ Solution copied & ready to paste!');
  
            // Optional: insert into editor
            const editor = document.querySelector('div[data-key="editor"] textarea');
            if (editor) {
              editor.focus();
              editor.value = codeText;
              editor.dispatchEvent(new Event('input', { bubbles: true }));
            }
            btn.textContent = "Copied!";
          })
          .catch(() => {
            createToast('❌ Failed to copy code.');
            btn.textContent = originalText;

          });
      })
      .catch(() => {
        createToast(`❌ Could not fetch solution for Q#${questionNumber}`);
        btn.textContent = originalText;
      });
  }
  
  window.addEventListener('load', () => {
    const interval = setInterval(() => {
      const problemLink = document.querySelector('a[href^="/problems/"]');
  
      if (problemLink && problemLink.textContent.match(/^\d+\./)) {
        clearInterval(interval);
  
        const text = problemLink.textContent.trim();
        const match = text.match(/^(\d+)\./);
  
        if (!match) return;
        const questionNumber = match[1];
  
        const btn = document.createElement('button');
        btn.textContent = 'Get WalkCCC Solution';
        btn.style.marginLeft = '10px';
        btn.style.padding = '6px 12px';
        btn.style.fontSize = '14px';
        btn.style.cursor = 'pointer';
        btn.style.backgroundColor = '#28a745';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.color = 'white';
        btn.style.zIndex = 9999;
        btn.style.display = 'inline-flex';
        btn.style.alignItems = 'center';
        btn.style.gap = '6px';
  
        btn.addEventListener('click', () => fetchAndCopySolution(questionNumber, btn));
        problemLink.parentElement?.appendChild(btn);
      }
    }, 500);
  });
  
  // Inject CSS spinner animation
  const style = document.createElement('style');
  style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  `;
  document.head.appendChild(style);
  