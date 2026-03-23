        // ── Auth ────────────────────────────────────────────────
        function doLogin() {
            const u = document.getElementById('login-user').value;
            const p = document.getElementById('login-pass').value;
            if (!u || !p) { alert('Please enter username and password.'); return; }
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('app-shell').classList.add('visible');

            const ul = u.toLowerCase();
            if (ul.includes('nils')) {
                document.getElementById('user-av').textContent = 'NF';
                document.getElementById('user-name').textContent = 'Nils Freitag';
                currentRole = 'superadmin';
            } else if (ul === 'rr2' || ul === 'royalrevolt' || ul === 'rr2team') {
                currentRole = 'gameadmin';
                currentGameName = 'Royal Revolt 2 (Android)';
                document.getElementById('user-av').textContent = 'RR';
                document.getElementById('user-name').textContent = 'Royal Revolt 2 Team';
            } else if (ul === 'smurf') {
                currentRole = 'gameadmin';
                currentGameName = 'Smurf Village (iOS)';
                document.getElementById('user-av').textContent = 'SV';
                document.getElementById('user-name').textContent = 'Smurf Village Team';
            } else if (ul === 'emhq') {
                currentRole = 'gameadmin';
                currentGameName = 'EMHQ (iOS)';
                document.getElementById('user-av').textContent = 'EM';
                document.getElementById('user-name').textContent = 'EMHQ Team';
            } else if (ul === 'warofnations' || ul === 'wow') {
                currentRole = 'gameadmin';
                currentGameName = 'War of Nations (iOS)';
                document.getElementById('user-av').textContent = 'WN';
                document.getElementById('user-name').textContent = 'War of Nations Team';
            } else if (ul === 'kitchen') {
                currentRole = 'gameadmin';
                currentGameName = 'Kitchen Scramble (iOS)';
                document.getElementById('user-av').textContent = 'KS';
                document.getElementById('user-name').textContent = 'Kitchen Scramble Team';
            } else {
                currentRole = 'superadmin';
            }

            applyRoleUI();
        }

        function applyRoleUI() {
            const shell = document.getElementById('app-shell');
            shell.dataset.role = currentRole;
            document.getElementById('game-label').textContent = currentGameName;
            const staticLabel = document.getElementById('game-label-static');
            if (currentRole === 'gameadmin') {
                staticLabel.textContent = currentGameName;
            } else {
                staticLabel.textContent = '';
            }
            renderGameDD();
        }


        function openProductDrawer() {
            // placeholder — drawer coming in next iteration
        }

        function doLogout() {
            currentRole = 'superadmin';
            applyRoleUI();
            document.getElementById('app-shell').classList.remove('visible');
            document.getElementById('login-screen').style.display = 'flex';
            document.getElementById('login-user').value = '';
            document.getElementById('login-pass').value = '';
            document.getElementById('user-av').textContent = 'AD';
            document.getElementById('user-name').textContent = 'Avery Dao';
        }

        function togglePass() {
            const f = document.getElementById('login-pass');
            const btn = f.nextElementSibling;
            if (f.type === 'password') { f.type = 'text'; btn.textContent = 'Hide'; }
            else { f.type = 'password'; btn.textContent = 'Show'; }
        }
