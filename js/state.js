        let currentRole = 'superadmin';
        let currentGameName = 'Royal Revolt 2 (iOS)';

        const GAMES = [
            { name: 'Royal Revolt 2', color: '#4f46e5', platforms: ['iOS', 'Android'] },
            { name: 'Smurf Village', color: '#10b981', platforms: ['iOS', 'Android'] },
            { name: 'EMHQ', color: '#f59e0b', platforms: ['iOS', 'Android'] },
            { name: 'War of Nations', color: '#e11d48', platforms: ['iOS', 'Android'] },
            { name: 'Kitchen Scramble', color: '#8b5cf6', platforms: ['iOS', 'Android'] },
        ];

        function renderGameDD() {
            const list = document.getElementById('game-dd-list');
            if (!list) return;
            list.innerHTML = GAMES.flatMap(g =>
                g.platforms.map(p => {
                    const label = `${g.name} (${p})`;
                    const isActive = label === currentGameName ? ' active' : '';
                    return `<div class="dd-item${isActive}" onclick="selectGame('${label}')">
                        <span class="g-dot" style="background:${g.color}"></span> ${label}
                    </div>`;
                })
            ).join('');
        }
