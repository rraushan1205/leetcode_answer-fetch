window.addEventListener('load', () => {
    const interval = setInterval(() => {
      const problemLink = document.querySelector('a[href^="/problems/"]');
  
      if (problemLink && problemLink.textContent.match(/^\d+\./)) {
        clearInterval(interval);
  
        const text = problemLink.textContent.trim();
        const match = text.match(/^(\d+)\./);
  
        if (!match) return;
  
        const questionNumber = match[1];
        const url = `https://walkccc.me/LeetCode/problems/${questionNumber}/`;
  
        fetch(url)
          .then(res => res.text())
          .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const codeTag = doc.querySelector('code');
  
            if (!codeTag) {
              alert(`No code found for problem ${questionNumber}`);
              return;
            }
  
            const codeText = codeTag.textContent;
  
            // Copy to clipboard
            navigator.clipboard.writeText(codeText)
              .then(() => {
                alert(`Copied solution for Q#${questionNumber}:\n\n${codeText}`);
              })
              .catch(err => {
                console.error('Clipboard write failed:', err);
                alert('Failed to copy code to clipboard.');
              });
          })
          .catch(err => {
            console.error('Error fetching solution page:', err);
            alert(`Could not fetch solution for problem ${questionNumber}.`);
          });
      }
    }, 500);
  });
  