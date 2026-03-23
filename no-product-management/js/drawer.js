        // ── Drawer ───────────────────────────────────────────────
        function openDrawer() {
            document.getElementById('drawer-overlay').classList.add('open');
            document.getElementById('create-drawer').classList.add('open');
        }

        function closeDrawer() {
            document.getElementById('drawer-overlay').classList.remove('open');
            document.getElementById('create-drawer').classList.remove('open');
        }

        function selectRole(el, role) {
            document.querySelectorAll('.radio-opt').forEach(r => r.classList.remove('sel'));
            el.classList.add('sel');
            const gameField = document.getElementById('game-assign-field');
            gameField.style.display = role === 'gameadmin' ? 'block' : 'none';
        }

        function generatePass() {
            const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefghjkmnpqrstwxyz23456789!@#';
            const pass = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
            document.getElementById('temp-pass').value = pass;
        }

        function createUser() {
            closeDrawer();
            // In real app: POST to API
            alert('User created and credentials email sent.');
        }
