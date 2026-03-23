        // ── Field helpers ────────────────────────────────────────
        function toggleField(id, btn) {
            const f = document.getElementById(id);
            if (f.type === 'password') { f.type = 'text'; f.classList.remove('masked'); btn.textContent = 'Hide'; }
            else { f.type = 'password'; f.classList.add('masked'); btn.textContent = 'Show'; }
        }

        function copyText(text, btn) {
            navigator.clipboard.writeText(text).then(() => {
                const orig = btn.textContent;
                btn.textContent = '✓';
                btn.style.color = 'var(--success)';
                setTimeout(() => { btn.textContent = orig; btn.style.color = ''; }, 1500);
            });
        }


        function tryItOut(btn) {
            const row = btn.closest('.ep-row');
            const curlInput = row.querySelector('.ep-input') || document.getElementById('ep-validation-curl');
            const curlCommand = curlInput.value;
            const responsePanel = document.getElementById('curl-response');
            const statusEl = document.getElementById('curl-status');
            const bodyEl = document.getElementById('curl-body');
            const validationRuleInput = document.getElementById('validation-rule');

            btn.textContent = 'Executing…';
            btn.disabled = true;

            // Simulate cURL execution (in real implementation, this would call backend)
            setTimeout(() => {
                const mockResponse = {
                    status: 200,
                    body: {
                        "user-properties": {
                            "country": "US",
                            "age": 20,
                            "user_id": "user_sandbox_001"
                        },
                        "valid": true
                    }
                };

                // Show response panel
                responsePanel.style.display = 'block';

                // Show response code
                if (mockResponse.status === 200) {
                    statusEl.innerHTML = `<span class="test-result ok">✓ ${mockResponse.status} OK</span>`;
                } else {
                    statusEl.innerHTML = `<span class="test-result err">✗ ${mockResponse.status}</span>`;
                }

                // Apply validation rule if it exists
                const validationRule = validationRuleInput.value.trim();
                if (validationRule && mockResponse.status === 200) {
                    try {
                        const validationResult = evaluateJMESPath(validationRule, mockResponse.body);
                        if (validationResult === true) {
                            statusEl.innerHTML += `<span class="test-result ok" style="margin-left:12px;">✓ Rule validated: true</span>`;
                        } else if (validationResult === false) {
                            statusEl.innerHTML += `<span class="test-result err" style="margin-left:12px;">✗ Rule validated: false</span>`;
                        } else {
                            statusEl.innerHTML += `<span class="test-result err" style="margin-left:12px;">✗ Rule returned non-boolean: ${validationResult}</span>`;
                        }
                    } catch (error) {
                        statusEl.innerHTML += `<span class="test-result err" style="margin-left:12px;">✗ Invalid JMESPath syntax: ${error.message}</span>`;
                    }
                }

                // Update body with syntax highlighting
                bodyEl.textContent = JSON.stringify(mockResponse.body, null, 2);

                btn.textContent = 'Try it out';
                btn.disabled = false;
            }, 1000);
        }

        // Simple JMESPath evaluator (basic implementation for demo)
        // In production, use a proper JMESPath library
        function evaluateJMESPath(expression, data) {
            // This is a simplified evaluator for demo purposes
            // Replace with actual JMESPath library in production

            // Handle backtick-quoted literals (like `18`, `US`) and property access (like `user-properties`)
            let evalExpression = expression.replace(/`([^`]+)`/g, (match, content) => {
                // If it's a number, return as-is
                if (!isNaN(content)) {
                    return content;
                }
                // If it looks like a property name (contains -, or special chars), treat as data access
                return `data["${content}"]`;
            });

            // Handle property access with dots after data references
            evalExpression = evalExpression.replace(/data\["([^"]+)"\]\.(\w+)/g, 'data["$1"]?.["$2"]');

            // Replace comparison operators
            evalExpression = evalExpression
                .replace(/=="([^"]+)"/g, '==="$1"')  // String comparison
                .replace(/=='([^']+)'/g, "==='$1'")  // String comparison
                .replace(/>=/g, '>=')
                .replace(/<=/g, '<=')
                .replace(/!=/g, '!==')
                .replace(/&&/g, '&&')
                .replace(/\|\|/g, '||');

            // For the example rule: `user-properties`.country == 'US' && `user-properties`.age >= `18`
            // Should become: data["user-properties"]?.["country"] === "US" && data["user-properties"]?.["age"] >= 18

            // Safer eval using Function constructor
            try {
                const func = new Function('data', `return ${evalExpression}`);
                return func(data);
            } catch (e) {
                throw new Error(e.message);
            }
        }

        function copyResponseBody() {
            const bodyEl = document.getElementById('curl-body');
            navigator.clipboard.writeText(bodyEl.textContent).then(() => {
                // Show brief confirmation
                const btn = event.target;
                const originalText = btn.textContent;
                btn.textContent = '✓';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 1000);
            });
        }

        function testEndpoint(btn) {
            btn.textContent = 'Testing…';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = 'Test';
                btn.disabled = false;
                // Show result next to button
                const row = btn.closest('.ep-row');
                const result = row.querySelector('.test-result');
                if (result) {
                    result.className = 'test-result ok';
                    result.textContent = '✓ 200 OK';
                }
            }, 800);
        }
