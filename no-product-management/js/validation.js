        let validationStep = {
            id: 1, name: 'User Validation', method: 'POST',
            url: 'https://game.com/api/validate',
            headers: [{ id: 1, key: 'Content-Type', val: { mode: 'custom', val: 'application/json' } }],
            body: [{ id: 2, key: 'user_id', val: { mode: 'predefined', val: '{{user_id}}' } }],
            path: []
        };
        let callbacks = [
            {
                id: 2, name: 'Purchase Callback',
                steps: [{
                    id: 20, method: 'POST',
                    url: 'https://game.com/api/purchase',
                    headers: [{ id: 3, key: 'Content-Type', val: { mode: 'custom', val: 'application/json' } }],
                    body: [
                        { id: 4, key: 'invoice_id', val: { mode: 'predefined', val: '{{invoice_id}}' } },
                        { id: 5, key: 'user_id', val: { mode: 'predefined', val: '{{user_id}}' } },
                    ],
                    path: [],
                    mockResponse: {
                        success: true,
                        transaction_id: "txn_9f3a2c1b4e",
                        invoice_id: "inv_00291847",
                        user_id: "user_sandbox_001",
                        product_sku: "gems_pack_500",
                        amount: 4.99,
                        currency: "USD",
                        status: "completed",
                        platform: "ios",
                        environment: "sandbox",
                        purchased_at: "2026-03-23T10:42:00Z",
                        items: [
                            { sku: "gems_pack_500", quantity: 1, unit_price: 4.99 }
                        ],
                        receipt: {
                            store: "app_store",
                            receipt_id: "AR_2026_00291847",
                            validated: true
                        }
                    }
                }]
            },
            {
                id: 3, name: 'Refund Callback',
                steps: [{
                    id: 21, method: 'POST',
                    url: 'https://game.com/api/refund',
                    headers: [{ id: 6, key: 'Content-Type', val: { mode: 'custom', val: 'application/json' } }],
                    body: [
                        { id: 7, key: 'invoice_id', val: { mode: 'predefined', val: '{{invoice_id}}' } },
                        { id: 8, key: 'reason', val: { mode: 'predefined', val: '{{refund_reason}}' } },
                    ],
                    path: [],
                    mockResponse: {
                        success: true,
                        refund_id: "ref_7d4e1a9c2f",
                        original_transaction_id: "txn_9f3a2c1b4e",
                        invoice_id: "inv_00291847",
                        user_id: "user_sandbox_001",
                        amount_refunded: 4.99,
                        currency: "USD",
                        reason: "customer_request",
                        status: "refunded",
                        platform: "ios",
                        environment: "sandbox",
                        processed_at: "2026-03-23T11:15:00Z",
                        reversal: {
                            gems_removed: 500,
                            balance_before: 1200,
                            balance_after: 700
                        }
                    }
                }]
            },
        ];
        let cbNextId = 30;

        // ── Validation step helpers (single step in Validation Rules) ──
        function cbFindStep(id) { return validationStep.id === id ? validationStep : null; }
        function cbUpdateName(id, v) { const s = cbFindStep(id); if (s) s.name = v; }
        function cbUpdateMethod(id, v) { const s = cbFindStep(id); if (s) s.method = v; }
        function cbUpdateUrl(id, v) { const s = cbFindStep(id); if (s) s.url = v; }
        function cbUpdateKey(sid, sec, fid, v) {
            const s = cbFindStep(sid); if (!s) return;
            const f = s[sec].find(f => f.id === fid); if (f) f.key = v;
        }
        function cbAddField(sid, sec) {
            const s = cbFindStep(sid); if (!s) return;
            s[sec].push({ id: ++cbNextId, key: '', val: cbDefaultVal() }); cbRender();
        }
        function cbRemoveField(sid, sec, fid) {
            const s = cbFindStep(sid); if (!s) return;
            s[sec] = s[sec].filter(f => f.id !== fid); cbRender();
        }
        function cbAddPathField(sid) {
            const s = cbFindStep(sid); if (!s) return;
            const newVal = CB_PREDEFINED[0].val;
            if (!s.path) s.path = [];
            s.path.push({ id: ++cbNextId, val: newVal });
            s.url = s.url.replace(/\/+$/, '') + '/' + newVal;
            cbRender();
        }
        function cbRemovePathField(sid, fid) {
            const s = cbFindStep(sid); if (!s) return;
            const item = (s.path || []).find(f => f.id === fid);
            if (item) s.url = s.url.replace('/' + item.val, '');
            s.path = (s.path || []).filter(f => f.id !== fid);
            cbRender();
        }
        function cbSetPathVal(sid, fid, newVal) {
            const s = cbFindStep(sid); if (!s) return;
            const item = (s.path || []).find(f => f.id === fid); if (!item) return;
            s.url = s.url.replace('/' + item.val, '/' + newVal);
            item.val = newVal;
            cbRender();
        }

        // ── Validation step: source object builder helpers ────────
        function _cbGetSourceParam(sid, sec, fid, pIdx) {
            const s = cbFindStep(sid); if (!s) return null;
            const f = s[sec].find(f => f.id === fid); if (!f) return null;
            if (f.val.mode !== 'function') return null;
            return f.val.params[pIdx] || null;
        }
        function cbSetSourceObjectType(sid, sec, fid, pIdx, objectType) {
            const s = cbFindStep(sid); if (!s) return;
            const f = s[sec].find(f => f.id === fid); if (!f || f.val.mode !== 'function') return;
            const p = f.val.params[pIdx];
            if (p && p.mode === 'object') p.objectType = objectType;
            else f.val.params[pIdx] = { mode: 'object', objectType, fields: [] };
            cbRender();
        }
        function cbAddSourceField(sid, sec, fid, pIdx) {
            const p = _cbGetSourceParam(sid, sec, fid, pIdx); if (!p || p.mode !== 'object') return;
            p.fields.push({ id: ++cbNextId, key: '', field: '' }); cbRender();
        }
        function cbRemoveSourceField(sid, sec, fid, pIdx, fieldIdx) {
            const p = _cbGetSourceParam(sid, sec, fid, pIdx); if (!p || p.mode !== 'object') return;
            p.fields.splice(fieldIdx, 1); cbRender();
        }
        function cbSetSourceFieldKey(sid, sec, fid, pIdx, fieldIdx, key) {
            const p = _cbGetSourceParam(sid, sec, fid, pIdx); if (!p || p.mode !== 'object') return;
            if (p.fields[fieldIdx]) p.fields[fieldIdx].key = key;
        }
        function cbSetSourceFieldVal(sid, sec, fid, pIdx, fieldIdx, field) {
            const p = _cbGetSourceParam(sid, sec, fid, pIdx); if (!p || p.mode !== 'object') return;
            if (p.fields[fieldIdx]) p.fields[fieldIdx].field = field;
        }
