        // ── Navigation ──────────────────────────────────────────
        function navigate(page) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.querySelectorAll('.nav-item, .nav-sub-item').forEach(n => n.classList.remove('active'));

            const pageEl = document.getElementById('page-' + page);
            if (pageEl) pageEl.classList.add('active');

            const navEl = document.getElementById('nav-' + page);
            if (navEl) navEl.classList.add('active');

            const productPages = ['sdk-catalog', 'webstore-catalog', 'webstore-rules'];
            if (productPages.includes(page)) {
                document.getElementById('nav-group-products').classList.add('open');
            }

            closeGameDD();
        }

        function toggleProductsGroup() {
            document.getElementById('nav-group-products').classList.toggle('open');
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
            updateProductsNav();
            closeGameDD();
        }

        function updateProductsNav() {
            var isWebstore = currentGameName.endsWith('(Webstore)');
            document.getElementById('nav-sdk-items').style.display = isWebstore ? 'none' : 'block';
            document.getElementById('nav-ws-items').style.display = isWebstore ? 'block' : 'none';
            var gameBase = currentGameName.replace(/ \(.*\)$/, '');
            var platform = (currentGameName.match(/\((.+)\)/) || [])[1] || '';
            var gameLabel = document.getElementById('nav-label-game');
            var projLabel = document.getElementById('nav-label-project');
            if (gameLabel) gameLabel.textContent = gameBase;
            if (projLabel) projLabel.textContent = platform;
        }

        document.addEventListener('click', function (e) {
            if (!document.getElementById('game-sw').contains(e.target)) closeGameDD();
        });

        // ── Environment ──────────────────────────────────────────
        function setEnv(env) {
            const sbBtn = document.getElementById('env-sandbox');
            const prodBtn = document.getElementById('env-prod');
            const label = env === 'sandbox' ? 'Sandbox' : 'Production';
            if (env === 'sandbox') {
                sbBtn.classList.add('active');
                prodBtn.classList.remove('active');
                document.getElementById('sb-banner').classList.add('visible');
            } else {
                prodBtn.classList.add('active', 'prod');
                sbBtn.classList.remove('active');
                document.getElementById('sb-banner').classList.remove('visible');
            }
            ['ov-env-label','cfg-env-label','sdk-env-label','ws-env-label','ws-rules-env-label'].forEach(function(id) {
                var el = document.getElementById(id);
                if (el) el.textContent = label;
            });
        }
