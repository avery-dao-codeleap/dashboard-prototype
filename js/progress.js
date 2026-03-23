        // ── Configuration Progress ──────────────────────────────
        function updateConfigProgress() {
            const checks = {
                'validation-rule': () => {
                    const val = document.getElementById('validation-rule')?.value || '';
                    return val.trim().length > 0 && val !== '`user-properties`.country == \'US\' && `user-properties`.age >= `18`';
                },
                'user-validation-curl': () => {
                    const val = document.getElementById('ep-validation-curl')?.value || '';
                    return val.trim().length > 0 && !val.includes('game.com/api/validate');
                },
                'valid-test-user-id': () => {
                    const val = document.getElementById('valid-test-user-id')?.value || '';
                    return val.trim().length > 0 && val !== 'user_sandbox_001';
                },
                'invalid-test-user-id': () => {
                    const val = document.getElementById('invalid-test-user-id')?.value || '';
                    return val.trim().length > 0;
                },
                'purchase-callback': () => {
                    const val = document.getElementById('ep-purchase-curl')?.value || '';
                    return val.trim().length > 0 && !val.includes('game.com/api/purchase');
                },
                'refund-callback': () => {
                    const val = document.getElementById('ep-refund-curl')?.value || '';
                    return val.trim().length > 0 && !val.includes('game.com/api/refund');
                },
                'ios-credentials': () => {
                    const iosCard = document.querySelector('.plat-card');
                    if (!iosCard) return false;
                    const inputs = iosCard.querySelectorAll('.cf-input');
                    return inputs.length >= 3 &&
                        inputs[0]?.value?.trim().length > 0 &&
                        inputs[1]?.value?.trim().length > 0 &&
                        inputs[2]?.value?.trim().length > 0;
                },
                'android-credentials': () => {
                    const cards = document.querySelectorAll('.plat-card');
                    if (cards.length < 2) return false;
                    const androidCard = cards[1];
                    const inputs = androidCard.querySelectorAll('.cf-input');
                    return inputs.length >= 3 &&
                        inputs[0]?.value?.trim().length > 0 &&
                        inputs[1]?.value?.trim().length > 0 &&
                        inputs[2]?.value?.trim().length > 0;
                }
            };

            let completed = 0;
            const total = Object.keys(checks).length;

            Object.keys(checks).forEach(field => {
                const item = document.querySelector(`.progress-item[data-field="${field}"]`);
                if (!item) return;

                const isCompleted = checks[field]();
                const icon = item.querySelector('.progress-icon');

                if (isCompleted) {
                    item.classList.add('completed');
                    icon.textContent = '✓';
                    completed++;
                } else {
                    item.classList.remove('completed');
                    icon.textContent = '○';
                }
            });

            // Update progress bar
            const percent = Math.round((completed / total) * 100);
            document.getElementById('progress-bar').style.width = `${percent}%`;
            document.getElementById('progress-text').textContent = `${completed}/${total} completed`;
            document.getElementById('progress-percent').textContent = `${percent}%`;
        }

        function scrollToField(fieldId) {
            let targetElement;

            switch (fieldId) {
                case 'validation-rule':
                    targetElement = document.getElementById('validation-rule');
                    break;
                case 'user-validation-curl':
                    targetElement = document.getElementById('ep-validation-curl');
                    break;
                case 'valid-test-user-id':
                    targetElement = document.getElementById('valid-test-user-id');
                    break;
                case 'invalid-test-user-id':
                    targetElement = document.getElementById('invalid-test-user-id');
                    break;
                case 'purchase-callback':
                    targetElement = document.getElementById('ep-purchase-curl');
                    break;
                case 'refund-callback':
                    targetElement = document.getElementById('ep-refund-curl');
                    break;
                case 'ios-credentials':
                    targetElement = document.querySelector('.plat-card');
                    break;
                case 'android-credentials': {
                    const cards = document.querySelectorAll('.plat-card');
                    targetElement = cards.length > 1 ? cards[1] : null;
                    break;
                }
            }

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetElement.focus();
            }
        }

        // Initialize on page load
        window.addEventListener('DOMContentLoaded', () => {
            renderGameDD();
            renderTimeline('paid');
            cbRender();
            updateConfigProgress();

            // Add event listeners to all inputs to update progress in real-time
            document.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('input', updateConfigProgress);
                input.addEventListener('change', updateConfigProgress);
            });
        });

        function exportRookConfig() {
            // Base configuration shared across all files
            const baseConfig = {
                game: "Pixel Odyssey",
                appId: 12,
                validationRule: document.getElementById('validation-rule')?.value || "",
                endpoints: {
                    userValidationCurl: document.querySelector('input[value*="curl"]')?.value || "",
                    purchaseCallback: document.querySelectorAll('.ep-input')[1]?.value || "",
                    refundCallback: document.querySelectorAll('.ep-input')[2]?.value || "",
                    testUserId: document.querySelectorAll('.ep-input')[3]?.value || ""
                },
                exportedAt: new Date().toISOString()
            };

            // Platform and environment specific configurations
            const configs = [
                {
                    filename: 'ios-sandbox-RookConfig.json',
                    platform: 'iOS',
                    environment: 'Sandbox',
                    config: {
                        ...baseConfig,
                        platform: 'iOS',
                        environment: 'Sandbox',
                        provider: {
                            name: 'Xsolla',
                            loginProjectId: 'login-royalrevolt2-ios-sb',
                            merchantId: 'merchant_rr2_ios_123',
                            xsollaProjectId: 'xsolla-royalrevolt2-ios-sb',
                            webhookUrl: 'https://rook.io/wh/ios/rr2-sb'
                        }
                    }
                },
                {
                    filename: 'ios-production-RookConfig.json',
                    platform: 'iOS',
                    environment: 'Production',
                    config: {
                        ...baseConfig,
                        platform: 'iOS',
                        environment: 'Production',
                        provider: {
                            name: 'Xsolla',
                            loginProjectId: 'login-royalrevolt2-ios-prod',
                            merchantId: 'merchant_rr2_ios_prod',
                            xsollaProjectId: 'xsolla-royalrevolt2-ios-prod',
                            webhookUrl: 'https://rook.io/wh/ios/rr2-prod'
                        }
                    }
                },
                {
                    filename: 'android-sandbox-RookConfig.json',
                    platform: 'Android',
                    environment: 'Sandbox',
                    config: {
                        ...baseConfig,
                        platform: 'Android',
                        environment: 'Sandbox',
                        provider: {
                            name: 'Xsolla',
                            loginProjectId: 'login-royalrevolt2-android-sb',
                            merchantId: 'merchant_rr2_android_456',
                            xsollaProjectId: 'xsolla-royalrevolt2-android-sb',
                            webhookUrl: 'https://rook.io/wh/android/rr2-sb'
                        }
                    }
                },
                {
                    filename: 'android-production-RookConfig.json',
                    platform: 'Android',
                    environment: 'Production',
                    config: {
                        ...baseConfig,
                        platform: 'Android',
                        environment: 'Production',
                        provider: {
                            name: 'Xsolla',
                            loginProjectId: 'login-royalrevolt2-android-prod',
                            merchantId: 'merchant_rr2_android_prod',
                            xsollaProjectId: 'xsolla-royalrevolt2-android-prod',
                            webhookUrl: 'https://rook.io/wh/android/rr2-prod'
                        }
                    }
                }
            ];

            // Download each config file with a slight delay between downloads
            configs.forEach((item, index) => {
                setTimeout(() => {
                    const json = JSON.stringify(item.config, null, 2);
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.href = url;
                    a.download = item.filename;
                    a.click();

                    // Clean up
                    URL.revokeObjectURL(url);
                }, index * 200); // 200ms delay between each download
            });
        }
