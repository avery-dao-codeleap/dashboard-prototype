        // ── Transaction timeline ─────────────────────────────────
        function tlItem(dotClass, title, meta, badge) {
            return `<div class="timeline-item">
      <div class="tl-dot ${dotClass}"></div>
      <div class="tl-content">
        <div class="flex items-center gap-8"><span class="tl-title">${title}</span>${badge ? `<span class="${badge.cls}">${badge.text}</span>` : ''}</div>
        <div class="tl-meta">${meta}</div>
      </div>
    </div>`;
        }

        function renderTimeline(status) {
            const el = document.getElementById('txn-timeline');
            if (!el) return;
            let html = '';
            if (status === 'paid') {
                html += tlItem('filled', 'Game server notified', 'Jun 14, 2025 · 09:32 UTC', { cls: 'tl-ok', text: '✓ 200 OK' });
                html += tlItem('success', 'Paid', 'Jun 14, 2025 · 09:32 UTC', null);
            } else if (status === 'refunded') {
                html += tlItem('filled', 'Game server notified (refund)', 'Jun 15, 2025 · 14:10 UTC', { cls: 'tl-ok', text: '✓ 200 OK' });
                html += tlItem('', 'Refunded', 'Jun 15, 2025 · 14:10 UTC', null);
                html += tlItem('filled', 'Game server notified', 'Jun 14, 2025 · 09:32 UTC', { cls: 'tl-ok', text: '✓ 200 OK' });
                html += tlItem('success', 'Paid', 'Jun 14, 2025 · 09:32 UTC', null);
            } else if (status === 'cancelled') {
                html += tlItem('', 'Cancelled', 'Jun 14, 2025 · 09:33 UTC', null);
            }
            el.innerHTML = html;
        }

        function setTxnStatus(status) {
            const badge = document.getElementById('txn-status-badge');
            badge.className = 'badge badge-' + status;
            badge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            renderTimeline(status);
        }
