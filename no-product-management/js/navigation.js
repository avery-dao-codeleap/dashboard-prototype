        // ── Navigation ──────────────────────────────────────────
        function navigate(page) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

            const pageEl = document.getElementById('page-' + page);
            if (pageEl) pageEl.classList.add('active');

            const navEl = document.getElementById('nav-' + page);
            if (navEl) navEl.classList.add('active');

            closeGameDD();
        }

        // ── Game switcher ────────────────────────────────────────
        function toggleGameDD() {
            document.getElementById('game-dd').classList.toggle('open');
        }

        function closeGameDD() {
            document.getElementById('game-dd').classList.remove('open');
        }

        function selectGame(name) {
            currentGameName = name;
            document.getElementById('game-label').textContent = name;
            renderGameDD();
            closeGameDD();
        }

        document.addEventListener('click', function (e) {
            if (!document.getElementById('game-sw').contains(e.target)) closeGameDD();
        });

        // ── Environment ──────────────────────────────────────────
        function setEnv(env) {
            const sbBtn = document.getElementById('env-sandbox');
            const prodBtn = document.getElementById('env-prod');
            const banner = document.getElementById('sb-banner');
            const ovLabel = document.getElementById('ov-env-label');
            const cfgLabel = document.getElementById('cfg-env-label');
            const prodLabel = document.getElementById('prod-env-label');

            if (env === 'sandbox') {
                sbBtn.classList.add('active');
                prodBtn.classList.remove('active');
                banner.classList.add('visible');
                if (ovLabel) ovLabel.textContent = 'Sandbox';
                if (cfgLabel) cfgLabel.textContent = 'Sandbox';
                if (prodLabel) prodLabel.textContent = 'Sandbox';
            } else {
                prodBtn.classList.add('active', 'prod');
                sbBtn.classList.remove('active');
                banner.classList.remove('visible');
                if (ovLabel) ovLabel.textContent = 'Production';
                if (cfgLabel) cfgLabel.textContent = 'Production';
                if (prodLabel) prodLabel.textContent = 'Production';
            }
        }
