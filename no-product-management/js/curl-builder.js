        // ── CURL Builder ─────────────────────────────────────────

        const CB_PREDEFINED = [
            { label: '{{user_id}}', val: '{{user_id}}' },
            { label: '{{invoice_id}}', val: '{{invoice_id}}' },
            { label: '{{product_sku}}', val: '{{product_sku}}' },
            { label: '{{platform}}', val: '{{platform}}' },
            { label: '{{environment}}', val: '{{environment}}' },
            { label: '{{amount}}', val: '{{amount}}' },
            { label: '{{currency}}', val: '{{currency}}' },
            { label: '{{app_id}}', val: '{{app_id}}' },
            { label: '{{refund_reason}}', val: '{{refund_reason}}' },
        ];

        const CB_FUNCTIONS = [
            { name: 'jmespath_query', label: 'JMESPath Query', params: ['query', 'source'] },
            { name: 'jq_query', label: 'jq Query', params: ['expression', 'source'] },
            { name: 'datetime_to_utc_string', label: 'datetime_to_utc_string', params: ['dt'] },
        ];

        const CB_SOURCE_OBJECTS = [
            { name: 'orders', label: 'Orders', fields: ['id', 'user_id', 'invoice_id', 'amount', 'currency', 'status', 'created_at'] },
        ];

        function cbDefaultVal() { return { mode: 'predefined', val: '{{user_id}}' }; }
        function cbDefaultSourceVal() {
            return { mode: 'object', objectType: CB_SOURCE_OBJECTS[0].name, fields: [] };
        }

        function cbDefaultFnParams(fnName) {
            const fn = CB_FUNCTIONS.find(f => f.name === fnName);
            return (fn ? fn.params : []).map(pName => {
                if (pName === 'source') return cbDefaultSourceVal();
                if (pName === 'expression' || pName === 'query') return { mode: 'custom', val: '' };
                if (pName === 'dt') return { mode: 'object', objectType: 'orders', fields: [{ key: 'dt', field: 'created_at' }] };
                return cbDefaultVal();
            });
        }
