        let currentRole = 'superadmin';
        let currentGameName = 'Royal Revolt 2 (iOS)';

        const GAMES = [
            { name: 'Royal Revolt 2', color: '#4f46e5', platforms: ['iOS', 'Android', 'Webstore'] },
            { name: 'Smurf Village', color: '#10b981', platforms: ['iOS', 'Android', 'Webstore'] },
            { name: 'EMHQ', color: '#f59e0b', platforms: ['iOS', 'Android', 'Webstore'] },
            { name: 'War of Nations', color: '#e11d48', platforms: ['iOS', 'Android', 'Webstore'] },
            { name: 'Kitchen Scramble', color: '#8b5cf6', platforms: ['iOS', 'Android', 'Webstore'] },
        ];

        function renderGameDD() {
            const list = document.getElementById('game-dd-list');
            if (!list) return;
            // Game admin: only show their own game's projects
            const currentGameBase = currentGameName.replace(/ \(.*\)$/, '');
            const visibleGames = currentRole === 'gameadmin'
                ? GAMES.filter(g => g.name === currentGameBase)
                : GAMES;
            list.innerHTML = visibleGames.flatMap(g => {
                const sdkEntries = ['iOS', 'Android'].map(p => {
                    const label = `${g.name} (${p})`;
                    const isActive = label === currentGameName ? ' active' : '';
                    return `<div class="dd-item${isActive}" onclick="selectGame('${label}')">
                        <span class="g-dot" style="background:${g.color}"></span> ${label}
                    </div>`;
                });
                const wsLabel = `${g.name} (Webstore)`;
                const wsActive = wsLabel === currentGameName ? ' active' : '';
                const wsEntry = `<div class="dd-item${wsActive}" onclick="selectGame('${wsLabel}')" style="color:var(--text-secondary);">
                    <span class="g-dot" style="background:${g.color};opacity:0.5;"></span> ${wsLabel}
                </div>`;
                return [...sdkEntries, wsEntry];
            }).join('');
        }
