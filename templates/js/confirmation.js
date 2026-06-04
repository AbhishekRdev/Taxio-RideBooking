document.addEventListener('DOMContentLoaded', function () {
    const idEl = document.getElementById('confirmation-id');
    const copyBtn = document.getElementById('copy-btn');
    if (!idEl || !copyBtn) return;

    copyBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const text = idEl.innerText.trim();
        if (!text) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                const original = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => copyBtn.textContent = original, 2000);
            }).catch(() => {
                alert('Could not copy confirmation ID.');
            });
        } else {
            // Fallback for older browsers
            const input = document.createElement('input');
            input.value = text;
            document.body.appendChild(input);
            input.select();
            try {
                document.execCommand('copy');
                const original = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => copyBtn.textContent = original, 2000);
            } catch (e) {
                alert('Could not copy confirmation ID.');
            }
            document.body.removeChild(input);
        }
    });
});
