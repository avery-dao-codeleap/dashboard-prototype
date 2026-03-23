        // ── Modal ────────────────────────────────────────────────
        function openModal(id) {
            document.getElementById(id).classList.add('open');
        }

        function closeModal(id) {
            document.getElementById(id).classList.remove('open');
        }

        // Close modal on overlay click
        document.querySelectorAll('.modal-ov').forEach(ov => {
            ov.addEventListener('click', function (e) {
                if (e.target === ov) ov.classList.remove('open');
            });
        });
