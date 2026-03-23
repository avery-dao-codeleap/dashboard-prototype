        // ── Config tabs ──────────────────────────────────────────
        function switchTab(btn, tab) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('tab-xsolla').style.display = tab === 'xsolla' ? 'block' : 'none';
            document.getElementById('tab-appcharge').style.display = tab === 'appcharge' ? 'block' : 'none';
        }

        // ── Endpoint field show/hide ─────────────────────────────
        function toggleEpField(id, btn) {
            const f = document.getElementById(id);
            if (f.type === 'password') { f.type = 'text'; btn.textContent = 'Hide'; }
            else { f.type = 'password'; btn.textContent = 'Show'; }
        }
