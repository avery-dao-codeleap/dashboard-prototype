        // ── Callback management ──────────────────────────────────
        function cbFindCallback(cbId) { return callbacks.find(c => c.id === cbId); }
        function cbFindStepIn(cbId, stepId) {
            const cb = cbFindCallback(cbId);
            return cb ? cb.steps.find(s => s.id === stepId) : null;
        }
        function cbAddCallback() {
            callbacks.push({ id: ++cbNextId, name: 'New Callback', steps: [{ id: ++cbNextId, method: 'POST', url: '', headers: [], body: [] }] });
            cbRender();
        }
        function cbRemoveCallback(cbId) { callbacks = callbacks.filter(c => c.id !== cbId); cbRender(); }
        function cbUpdateCallbackName(cbId, v) { const cb = cbFindCallback(cbId); if (cb) cb.name = v; }
        function cbsAddStep(cbId) {
            const cb = cbFindCallback(cbId); if (!cb) return;
            cb.steps.push({ id: ++cbNextId, method: 'POST', url: '', headers: [], body: [] }); cbRender();
        }
        function cbsRemoveStep(cbId, stepId) {
            const cb = cbFindCallback(cbId); if (!cb) return;
            cb.steps = cb.steps.filter(s => s.id !== stepId); cbRender();
        }
        function cbsUpdateMethod(cbId, stepId, v) { const s = cbFindStepIn(cbId, stepId); if (s) s.method = v; }
        function cbsUpdateUrl(cbId, stepId, v) { const s = cbFindStepIn(cbId, stepId); if (s) s.url = v; }
        function cbsUpdateKey(cbId, stepId, sec, fid, v) {
            const s = cbFindStepIn(cbId, stepId); if (!s) return;
            const f = s[sec].find(f => f.id === fid); if (f) f.key = v;
        }
        function cbsAddField(cbId, stepId, sec) {
            const s = cbFindStepIn(cbId, stepId); if (!s) return;
            s[sec].push({ id: ++cbNextId, key: '', val: cbDefaultVal() }); cbRender();
        }
        function cbsRemoveField(cbId, stepId, sec, fid) {
            const s = cbFindStepIn(cbId, stepId); if (!s) return;
            s[sec] = s[sec].filter(f => f.id !== fid); cbRender();
        }
        function cbsSetPred(cbId, stepId, sec, fid, pIdx, v) {
            const s = cbFindStepIn(cbId, stepId); if (!s) return;
            const f = s[sec].find(f => f.id === fid); if (!f) return;
            if (pIdx != null) { if (f.val.mode === 'function') f.val.params[pIdx] = { mode: 'predefined', val: v }; }
            else { f.val = { mode: 'predefined', val: v }; }
            cbRender();
        }
        function cbsSetCustom(cbId, stepId, sec, fid, pIdx, v) {
            const s = cbFindStepIn(cbId, stepId); if (!s) return;
            const f = s[sec].find(f => f.id === fid); if (!f) return;
            if (pIdx != null) { if (f.val.mode === 'function') f.val.params[pIdx] = { mode: 'custom', val: v }; }
            else { if (f.val.mode !== 'function') f.val = { mode: 'custom', val: v }; }
        }
        function cbsSetFn(cbId, stepId, sec, fid, fnName) {
            const s = cbFindStepIn(cbId, stepId); if (!s) return;
            const f = s[sec].find(f => f.id === fid); if (!f) return;
            f.val = { mode: 'function', fn: fnName, params: cbDefaultFnParams(fnName) };
            cbRender();
        }
        function cbsActivateFn(cbId, stepId, sec, fid, pid) {
            const s = cbFindStepIn(cbId, stepId); if (!s) return;
            const f = s[sec].find(f => f.id === fid); if (!f) return;
            if (f.val.mode !== 'function') {
                cbsSetFn(cbId, stepId, sec, fid, CB_FUNCTIONS[0].name);
            } else {
                cbPickTab(pid, 'fn');
            }
        }
        function cbsSetStepResponse(cbId, stepId, sec, fid, refStepId) {
            const s = cbFindStepIn(cbId, stepId); if (!s) return;
            const f = s[sec].find(f => f.id === fid); if (!f) return;
            const path = f.val.mode === 'step_response' ? f.val.path : '';
            f.val = { mode: 'step_response', stepId: refStepId, path };
            cbRender();
        }
        function cbsSetStepResponsePath(cbId, stepId, sec, fid, path) {
            const s = cbFindStepIn(cbId, stepId); if (!s) return;
            const f = s[sec].find(f => f.id === fid); if (!f) return;
            if (f.val.mode === 'step_response') f.val.path = path;
        }

        // ── Callback step: source object builder helpers ──────────
        function _cbsGetSourceParam(cbId, stepId, sec, fid, pIdx) {
            const s = cbFindStepIn(cbId, stepId); if (!s) return null;
            const f = s[sec].find(f => f.id === fid); if (!f) return null;
            if (f.val.mode !== 'function') return null;
            return f.val.params[pIdx] || null;
        }
        function cbsSetSourceObjectType(cbId, stepId, sec, fid, pIdx, objectType) {
            const s = cbFindStepIn(cbId, stepId); if (!s) return;
            const f = s[sec].find(f => f.id === fid); if (!f || f.val.mode !== 'function') return;
            const p = f.val.params[pIdx];
            if (p && p.mode === 'object') p.objectType = objectType;
            else f.val.params[pIdx] = { mode: 'object', objectType, fields: [] };
            cbRender();
        }
        function cbsSetSourceFrom(cbId, stepId, sec, fid, pIdx, value) {
            const s = cbFindStepIn(cbId, stepId); if (!s) return;
            const f = s[sec].find(f => f.id === fid); if (!f || f.val.mode !== 'function') return;
            if (value.startsWith('step_response_')) {
                const refStepId = +value.replace('step_response_', '');
                f.val.params[pIdx] = { mode: 'step_response', stepId: refStepId, path: '' };
            } else {
                f.val.params[pIdx] = { mode: 'object', objectType: value, fields: [] };
            }
            cbRender();
        }
        function cbsSetSourceStepPath(cbId, stepId, sec, fid, pIdx, path) {
            const p = _cbsGetSourceParam(cbId, stepId, sec, fid, pIdx); if (!p || p.mode !== 'step_response') return;
            p.path = path;
        }
        function cbsAddSourceField(cbId, stepId, sec, fid, pIdx) {
            const p = _cbsGetSourceParam(cbId, stepId, sec, fid, pIdx); if (!p || p.mode !== 'object') return;
            p.fields.push({ id: ++cbNextId, key: '', field: '' }); cbRender();
        }
        function cbsRemoveSourceField(cbId, stepId, sec, fid, pIdx, fieldIdx) {
            const p = _cbsGetSourceParam(cbId, stepId, sec, fid, pIdx); if (!p || p.mode !== 'object') return;
            p.fields.splice(fieldIdx, 1); cbRender();
        }
        function cbsSetSourceFieldKey(cbId, stepId, sec, fid, pIdx, fieldIdx, key) {
            const p = _cbsGetSourceParam(cbId, stepId, sec, fid, pIdx); if (!p || p.mode !== 'object') return;
            if (p.fields[fieldIdx]) p.fields[fieldIdx].key = key;
        }
        function cbsSetSourceFieldVal(cbId, stepId, sec, fid, pIdx, fieldIdx, field) {
            const p = _cbsGetSourceParam(cbId, stepId, sec, fid, pIdx); if (!p || p.mode !== 'object') return;
            if (p.fields[fieldIdx]) p.fields[fieldIdx].field = field;
        }

        function cbTogglePicker(pid) {
            const picker = document.getElementById(pid);
            if (!picker) return;
            const isOpen = picker.classList.contains('open');
            // Close all others
            document.querySelectorAll('.cb-picker.open').forEach(p => {
                p.classList.remove('open');
                const b = p.previousElementSibling;
                if (b && b.classList.contains('cb-val-btn')) b.classList.remove('active');
            });
            if (!isOpen) {
                picker.classList.add('open');
                const b = picker.previousElementSibling;
                if (b && b.classList.contains('cb-val-btn')) b.classList.add('active');
            }
        }

        function cbPickTab(pid, tab) {
            const picker = document.getElementById(pid);
            if (!picker) return;
            picker.querySelectorAll('.cb-ptab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
            picker.querySelector('.cb-pbody-value').style.display = tab === 'value' ? 'block' : 'none';
            const fnPane = picker.querySelector('.cb-pbody-fn');
            if (fnPane) fnPane.style.display = tab === 'fn' ? 'block' : 'none';
            const respPane = picker.querySelector('.cb-pbody-resp');
            if (respPane) respPane.style.display = tab === 'step-response' ? 'block' : 'none';
        }

        function cbSetPred(sid, sec, fid, pIdx, v) {
            const s = cbFindStep(sid); if (!s) return;
            const f = s[sec].find(f => f.id === fid); if (!f) return;
            if (pIdx != null) { if (f.val.mode === 'function') f.val.params[pIdx] = { mode: 'predefined', val: v }; }
            else { f.val = { mode: 'predefined', val: v }; }
            cbRender();
        }
        function cbSetCustom(sid, sec, fid, pIdx, v) {
            const s = cbFindStep(sid); if (!s) return;
            const f = s[sec].find(f => f.id === fid); if (!f) return;
            if (pIdx != null) { if (f.val.mode === 'function') f.val.params[pIdx] = { mode: 'custom', val: v }; }
            else { if (f.val.mode !== 'function') f.val = { mode: 'custom', val: v }; }
            // no re-render (preserve focus)
        }
        function cbSetFn(sid, sec, fid, fnName) {
            const s = cbFindStep(sid); if (!s) return;
            const f = s[sec].find(f => f.id === fid); if (!f) return;
            f.val = { mode: 'function', fn: fnName, params: cbDefaultFnParams(fnName) };
            cbRender();
        }
        function cbActivateFn(sid, sec, fid, pid) {
            const s = cbFindStep(sid); if (!s) return;
            const f = s[sec].find(f => f.id === fid); if (!f) return;
            if (f.val.mode !== 'function') {
                cbSetFn(sid, sec, fid, CB_FUNCTIONS[0].name);
            } else {
                cbPickTab(pid, 'fn');
            }
        }

        function cbChip(valExpr, prevSteps) {
            if (!valExpr) return '';
            if (valExpr.mode === 'predefined') {
                const p = CB_PREDEFINED.find(p => p.val === valExpr.val);
                return `<span class="cb-chip cb-chip-pred">${p ? p.label : valExpr.val}</span>`;
            }
            if (valExpr.mode === 'custom') {
                return `<span class="cb-chip cb-chip-cust">${valExpr.val || 'custom…'}</span>`;
            }
            if (valExpr.mode === 'function') {
                const fn = CB_FUNCTIONS.find(f => f.name === valExpr.fn);
                return `<span class="cb-chip cb-chip-fn">${fn ? fn.label : valExpr.fn}(…)</span>`;
            }
            if (valExpr.mode === 'step_response') {
                const stepIdx = prevSteps ? prevSteps.findIndex(s => s.id === valExpr.stepId) : -1;
                const stepLabel = stepIdx >= 0 ? `Step ${stepIdx + 1}` : 'Step Response';
                const pathLabel = valExpr.path ? ` › ${valExpr.path}` : '';
                return `<span class="cb-chip cb-chip-resp">${stepLabel}${pathLabel}</span>`;
            }
            return '';
        }

        function cbPredList(sid, sec, fid, pIdx, curVal) {
            return CB_PREDEFINED.map(p => {
                const sel = curVal && curVal.mode === 'predefined' && curVal.val === p.val ? 'sel' : '';
                return `<div class="cb-pval-opt ${sel}" onclick="cbSetPred(${sid},'${sec}',${fid},${pIdx},'${p.val}')">
        <div class="cb-pval-radio"></div>
        <span class="cb-pval-name">${p.label}</span>
        <span class="cb-pval-code">${p.val}</span>
      </div>`;
            }).join('');
        }

        function cbObjectBuilder(sid, sec, fid, pIdx, val) {
            const objDef = CB_SOURCE_OBJECTS.find(o => o.name === val.objectType) || CB_SOURCE_OBJECTS[0];
            const rows = val.fields.map((f, i) => `
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
        <input class="cb-key" type="text" placeholder="key" value="${f.key}"
          oninput="cbSetSourceFieldKey(${sid},'${sec}',${fid},${pIdx},${i},this.value)"
          style="width:90px;flex-shrink:0;">
        <span style="font-size:11px;color:var(--text-tertiary);flex-shrink:0;">:</span>
        <select style="flex:1;font-size:12px;padding:3px 6px;border:1px solid var(--border);border-radius:var(--r-sm);font-family:var(--font);background:var(--surface);"
          onchange="cbSetSourceFieldVal(${sid},'${sec}',${fid},${pIdx},${i},this.value)">
          <option value="">-- field --</option>
          ${objDef.fields.map(field => `<option value="${field}" ${f.field === field ? 'selected' : ''}>${field}</option>`).join('')}
        </select>
        <button class="btn-icon" onclick="cbRemoveSourceField(${sid},'${sec}',${fid},${pIdx},${i})"
          style="flex-shrink:0;font-size:15px;color:var(--text-tertiary);padding:0 4px;">×</button>
      </div>`).join('');
            return `<div style="padding:8px;background:var(--bg);border:1px solid var(--border);border-radius:var(--r-sm);">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
        <span style="font-size:11px;color:var(--text-tertiary);flex-shrink:0;">From</span>
        <select style="font-size:12px;padding:3px 6px;border:1px solid var(--border);border-radius:var(--r-sm);font-family:var(--font);background:var(--surface);"
          onchange="cbSetSourceObjectType(${sid},'${sec}',${fid},${pIdx},this.value)">
          ${CB_SOURCE_OBJECTS.map(o => `<option value="${o.name}" ${val.objectType === o.name ? 'selected' : ''}>${o.label}</option>`).join('')}
        </select>
      </div>
      ${rows}
      <button class="btn btn-ghost btn-sm" onclick="cbAddSourceField(${sid},'${sec}',${fid},${pIdx})"
        style="margin-top:4px;">+ Add Field</button>
    </div>`;
        }

        function cbParamPicker(sid, sec, fid, pIdx, pName, pVal) {
            if (pName === 'expression' || pName === 'query') {
                const strVal = (pVal && pVal.mode === 'custom') ? pVal.val : '';
                return `<div class="cb-fn-prow">
      <span class="cb-fn-pname">${pName}</span>
      <input type="text" placeholder="${pName}…" value="${strVal}"
        oninput="cbSetCustom(${sid},'${sec}',${fid},${pIdx},null,this.value)"
        style="flex:1;height:32px;padding:0 8px;border:1px solid var(--border);border-radius:var(--r-sm);font-family:var(--mono);font-size:12px;background:var(--surface);outline:none;">
    </div>`;
            }
            if (pName === 'source') {
                const val = (pVal && pVal.mode === 'object') ? pVal : cbDefaultSourceVal();
                return `<div class="cb-fn-prow" style="align-items:flex-start;">
      <span class="cb-fn-pname">${pName}</span>
      <div style="flex:1;">${cbObjectBuilder(sid, sec, fid, pIdx, val)}</div>
    </div>`;
            }
            const pid = `cbp-${sid}-${sec}-${fid}-p${pIdx}`;
            const isCust = pVal && pVal.mode === 'custom';
            return `<div class="cb-fn-prow">
      <span class="cb-fn-pname">${pName}</span>
      <div class="cb-val-wrap" style="flex:1;">
        <button class="cb-val-btn" onclick="cbTogglePicker('${pid}')">${cbChip(pVal)}<span style="margin-left:auto;font-size:10px;color:var(--text-tertiary);">▾</span></button>
        <div class="cb-picker" id="${pid}">
          <div class="cb-ptabs">
            <button class="cb-ptab active" data-tab="value" onclick="cbPickTab('${pid}','value')">Value</button>
          </div>
          <div class="cb-pbody">
            <div class="cb-pbody-value">
              <div class="cb-pval-list">${cbPredList(sid, sec, fid, pIdx, pVal)}</div>
              <div class="cb-pcustom">
                <div class="cb-pval-radio ${isCust ? 'sel' : ''}"></div>
                <input class="cb-pcustom-in" type="text" placeholder="Custom…" value="${isCust ? pVal.val : ''}"
                  oninput="cbSetCustom(${sid},'${sec}',${fid},${pIdx},this.value)"
                  onfocus="cbSetCustom(${sid},'${sec}',${fid},${pIdx},this.value)">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
        }

        function cbValPicker(sid, sec, fid, valExpr) {
            const pid = `cbp-${sid}-${sec}-${fid}`;
            const isFn = valExpr.mode === 'function';
            const isCust = valExpr.mode === 'custom';
            const curFnDef = isFn ? CB_FUNCTIONS.find(f => f.name === valExpr.fn) : CB_FUNCTIONS[0];
            const fnOpts = CB_FUNCTIONS.map(f =>
                `<option value="${f.name}" ${isFn && valExpr.fn === f.name ? 'selected' : ''}>${f.label}</option>`
            ).join('');
            const fnParams = isFn && curFnDef
                ? curFnDef.params.map((pn, i) => cbParamPicker(sid, sec, fid, i, pn, valExpr.params[i] || cbDefaultVal())).join('')
                : '';

            return `<div class="cb-val-wrap">
      <button class="cb-val-btn" onclick="cbTogglePicker('${pid}')">${cbChip(valExpr)}<span style="margin-left:auto;font-size:10px;color:var(--text-tertiary);">▾</span></button>
      <div class="cb-picker" id="${pid}">
        <div class="cb-ptabs">
          <button class="cb-ptab ${!isFn ? 'active' : ''}" data-tab="value" onclick="cbPickTab('${pid}','value')">Value</button>
          <button class="cb-ptab ${isFn ? 'active' : ''}" data-tab="fn" onclick="cbActivateFn(${sid},'${sec}',${fid},'${pid}')">Function</button>
        </div>
        <div class="cb-pbody">
          <div class="cb-pbody-value" style="display:${!isFn ? 'block' : 'none'}">
            <div class="cb-pval-list">${cbPredList(sid, sec, fid, null, valExpr)}</div>
            <div class="cb-pcustom">
              <div class="cb-pval-radio ${isCust ? 'sel' : ''}"></div>
              <input class="cb-pcustom-in" type="text" placeholder="Custom value…" value="${isCust ? valExpr.val : ''}"
                oninput="cbSetCustom(${sid},'${sec}',${fid},null,this.value)"
                onfocus="cbSetCustom(${sid},'${sec}',${fid},null,this.value)">
            </div>
          </div>
          <div class="cb-pbody-fn" style="display:${isFn ? 'block' : 'none'}">
            <select class="cb-fn-sel" onchange="cbSetFn(${sid},'${sec}',${fid},this.value)">${fnOpts}</select>
            <div class="cb-fn-params">${fnParams}</div>
          </div>
        </div>
      </div>
    </div>`;
        }

        function cbRenderSection(step, sec, label) {
            const rows = step[sec].map(f => `
      <div class="cb-kv">
        <input class="cb-key" type="text" placeholder="key" value="${f.key}"
          oninput="cbUpdateKey(${step.id},'${sec}',${f.id},this.value)">
        ${cbValPicker(step.id, sec, f.id, f.val)}
        <button class="btn-icon" onclick="cbRemoveField(${step.id},'${sec}',${f.id})" title="Remove" style="flex-shrink:0;font-size:15px;color:var(--text-tertiary);padding:0 4px;">×</button>
      </div>`).join('');
            return `<div class="cb-sec">
      <div class="cb-sec-head">
        <span class="cb-sec-label">${label}</span>
        <button class="btn btn-ghost btn-sm" onclick="cbAddField(${step.id},'${sec}')">+ Add</button>
      </div>
      ${rows}
    </div>`;
        }

        // cbRenderStep: renders the validation step (single step, uses cb* functions)
        function cbRenderStep(step) {
            return `
      <div class="cb-step">
        <div class="cb-step-head">
          <input class="cb-name" type="text" value="${step.name}" oninput="cbUpdateName(${step.id},this.value)">
          <select class="cb-method" onchange="cbUpdateMethod(${step.id},this.value)">
            ${['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(m => `<option ${step.method === m ? 'selected' : ''}>${m}</option>`).join('')}
          </select>
          <button class="btn btn-primary btn-sm" onclick="cbExecuteStep(${step.id},this)" style="margin-left:auto;flex-shrink:0;">Execute</button>
        </div>
        <div class="cb-step-body">
          <div class="cb-url-row">
            <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-tertiary);flex-shrink:0;">URL</span>
            <input class="cb-url" type="text" placeholder="https://…" value="${step.url}" oninput="cbUpdateUrl(${step.id},this.value)">
          </div>
          ${cbRenderSection(step, 'headers', 'Headers')}
          ${cbRenderSection(step, 'body', 'Body')}
        </div>
      </div>`;
        }

        function cbExecuteStep(stepId, btn) {
            btn.disabled = true;
            btn.textContent = 'Running…';
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = 'Execute';
                const panel = document.getElementById('mock-resp-' + stepId);
                if (panel) { panel.style.display = 'block'; const chev = document.getElementById('mock-chev-' + stepId); if (chev) chev.style.transform = 'rotate(90deg)'; }
            }, 800);
        }

        function cbsExecuteStep(cbId, stepId, btn) {
            btn.disabled = true;
            btn.textContent = 'Running…';
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = 'Execute';
                const panel = document.getElementById('mock-resp-' + stepId);
                if (panel) { panel.style.display = 'block'; const chev = document.getElementById('mock-chev-' + stepId); if (chev) chev.style.transform = 'rotate(90deg)'; }
            }, 800);
        }

        // ── Callback render functions (cbs* uses cbId + stepId) ──────
        function cbsPredList(cbId, stepId, sec, fid, pIdx, curVal) {
            return CB_PREDEFINED.map(p => {
                const sel = curVal && curVal.mode === 'predefined' && curVal.val === p.val ? 'sel' : '';
                return `<div class="cb-pval-opt ${sel}" onclick="cbsSetPred(${cbId},${stepId},'${sec}',${fid},${pIdx != null ? pIdx : 'null'},'${p.val}')">
        <div class="cb-pval-radio"></div>
        <span class="cb-pval-name">${p.label}</span>
        <span class="cb-pval-code">${p.val}</span>
      </div>`;
            }).join('');
        }

        function cbsObjectBuilder(cbId, stepId, sec, fid, pIdx, val, prevSteps) {
            const isStepResp = val.mode === 'step_response';
            const objOptions = CB_SOURCE_OBJECTS.map(o =>
                `<option value="${o.name}" ${!isStepResp && val.objectType === o.name ? 'selected' : ''}>${o.label}</option>`
            ).join('');
            const stepRespOptions = prevSteps && prevSteps.length > 0
                ? `<optgroup label="Step Responses">${prevSteps.map((ps, i) =>
                    `<option value="step_response_${ps.id}" ${isStepResp && val.stepId === ps.id ? 'selected' : ''}>Step ${i + 1} Response${ps.url ? ' \u2014 ' + ps.url : ''}</option>`
                  ).join('')}</optgroup>`
                : '';
            const fromDropdown = `<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
        <span style="font-size:11px;color:var(--text-tertiary);flex-shrink:0;">From</span>
        <select style="font-size:12px;padding:3px 6px;border:1px solid var(--border);border-radius:var(--r-sm);font-family:var(--font);background:var(--surface);"
          onchange="cbsSetSourceFrom(${cbId},${stepId},'${sec}',${fid},${pIdx},this.value)">
          ${objOptions}${stepRespOptions}
        </select>
      </div>`;
            if (isStepResp) {
                return `<div style="padding:8px;background:var(--bg);border:1px solid var(--border);border-radius:var(--r-sm);">
      ${fromDropdown}
    </div>`;
            }
            const objDef = CB_SOURCE_OBJECTS.find(o => o.name === val.objectType) || CB_SOURCE_OBJECTS[0];
            const rows = val.fields.map((f, i) => `
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
        <input class="cb-key" type="text" placeholder="key" value="${f.key}"
          oninput="cbsSetSourceFieldKey(${cbId},${stepId},'${sec}',${fid},${pIdx},${i},this.value)"
          style="width:90px;flex-shrink:0;">
        <span style="font-size:11px;color:var(--text-tertiary);flex-shrink:0;">:</span>
        <select style="flex:1;font-size:12px;padding:3px 6px;border:1px solid var(--border);border-radius:var(--r-sm);font-family:var(--font);background:var(--surface);"
          onchange="cbsSetSourceFieldVal(${cbId},${stepId},'${sec}',${fid},${pIdx},${i},this.value)">
          <option value="">-- field --</option>
          ${objDef.fields.map(field => `<option value="${field}" ${f.field === field ? 'selected' : ''}>${field}</option>`).join('')}
        </select>
        <button class="btn-icon" onclick="cbsRemoveSourceField(${cbId},${stepId},'${sec}',${fid},${pIdx},${i})"
          style="flex-shrink:0;font-size:15px;color:var(--text-tertiary);padding:0 4px;">×</button>
      </div>`).join('');
            return `<div style="padding:8px;background:var(--bg);border:1px solid var(--border);border-radius:var(--r-sm);">
      ${fromDropdown}
      ${rows}
      <button class="btn btn-ghost btn-sm" onclick="cbsAddSourceField(${cbId},${stepId},'${sec}',${fid},${pIdx})"
        style="margin-top:4px;">+ Add Field</button>
    </div>`;
        }

        function cbsParamPicker(cbId, stepId, sec, fid, pIdx, pName, pVal, prevSteps) {
            if (pName === 'expression' || pName === 'query') {
                const strVal = (pVal && pVal.mode === 'custom') ? pVal.val : '';
                return `<div class="cb-fn-prow">
      <span class="cb-fn-pname">${pName}</span>
      <input type="text" placeholder="${pName}…" value="${strVal}"
        oninput="cbsSetCustom(${cbId},${stepId},'${sec}',${fid},${pIdx},null,this.value)"
        style="flex:1;height:32px;padding:0 8px;border:1px solid var(--border);border-radius:var(--r-sm);font-family:var(--mono);font-size:12px;background:var(--surface);outline:none;">
    </div>`;
            }
            if (pName === 'source') {
                const val = (pVal && (pVal.mode === 'object' || pVal.mode === 'step_response')) ? pVal : cbDefaultSourceVal();
                return `<div class="cb-fn-prow" style="align-items:flex-start;">
      <span class="cb-fn-pname">${pName}</span>
      <div style="flex:1;">${cbsObjectBuilder(cbId, stepId, sec, fid, pIdx, val, prevSteps)}</div>
    </div>`;
            }
            const pid = `cbsp-${cbId}-${stepId}-${sec}-${fid}-p${pIdx}`;
            const isCust = pVal && pVal.mode === 'custom';
            return `<div class="cb-fn-prow">
      <span class="cb-fn-pname">${pName}</span>
      <div class="cb-val-wrap" style="flex:1;">
        <button class="cb-val-btn" onclick="cbTogglePicker('${pid}')">${cbChip(pVal)}<span style="margin-left:auto;font-size:10px;color:var(--text-tertiary);">▾</span></button>
        <div class="cb-picker" id="${pid}">
          <div class="cb-ptabs">
            <button class="cb-ptab active" data-tab="value" onclick="cbPickTab('${pid}','value')">Value</button>
          </div>
          <div class="cb-pbody">
            <div class="cb-pbody-value">
              <div class="cb-pval-list">${cbsPredList(cbId, stepId, sec, fid, pIdx, pVal)}</div>
              <div class="cb-pcustom">
                <div class="cb-pval-radio ${isCust ? 'sel' : ''}"></div>
                <input class="cb-pcustom-in" type="text" placeholder="Custom…" value="${isCust ? pVal.val : ''}"
                  oninput="cbsSetCustom(${cbId},${stepId},'${sec}',${fid},${pIdx},this.value)"
                  onfocus="cbsSetCustom(${cbId},${stepId},'${sec}',${fid},${pIdx},this.value)">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
        }

        function cbsValPicker(cbId, stepId, sec, fid, valExpr, prevSteps) {
            const pid = `cbsp-${cbId}-${stepId}-${sec}-${fid}`;
            const isFn = valExpr.mode === 'function';
            const isCust = valExpr.mode === 'custom';
            const isResp = valExpr.mode === 'step_response';
            const hasPrev = prevSteps && prevSteps.length > 0;
            const activeTab = isFn ? 'fn' : (isResp ? 'step-response' : 'value');
            const curFnDef = isFn ? CB_FUNCTIONS.find(f => f.name === valExpr.fn) : CB_FUNCTIONS[0];
            const fnOpts = CB_FUNCTIONS.map(f =>
                `<option value="${f.name}" ${isFn && valExpr.fn === f.name ? 'selected' : ''}>${f.label}</option>`
            ).join('');
            const fnParams = isFn && curFnDef
                ? curFnDef.params.map((pn, i) => cbsParamPicker(cbId, stepId, sec, fid, i, pn, valExpr.params[i] || cbDefaultVal(), prevSteps)).join('')
                : '';
            const stepOpts = hasPrev ? prevSteps.map((ps, i) =>
                `<option value="${ps.id}" ${isResp && valExpr.stepId === ps.id ? 'selected' : ''}>Step ${i + 1}${ps.url ? ' \u2014 ' + ps.url : ''}</option>`
            ).join('') : '';
            const respPane = hasPrev ? `
          <div class="cb-pbody-resp" style="display:${activeTab === 'step-response' ? 'block' : 'none'}">
            <div style="padding:8px;">
              <div style="margin-bottom:8px;">
                <label style="font-size:11px;font-weight:600;color:var(--text-tertiary);display:block;margin-bottom:4px;">From Step</label>
                <select style="width:100%;font-size:12px;padding:4px 6px;border:1px solid var(--border);border-radius:var(--r-sm);font-family:var(--font);background:var(--surface);"
                  onchange="cbsSetStepResponse(${cbId},${stepId},'${sec}',${fid},+this.value)">${stepOpts}</select>
              </div>
              <div>
                <label style="font-size:11px;font-weight:600;color:var(--text-tertiary);display:block;margin-bottom:4px;">Path (JMESPath)</label>
                <input type="text" placeholder="e.g. data.token" value="${isResp ? valExpr.path || '' : ''}"
                  style="width:100%;box-sizing:border-box;font-size:12px;padding:4px 8px;border:1px solid var(--border);border-radius:var(--r-sm);font-family:var(--mono);background:var(--surface);outline:none;"
                  oninput="cbsSetStepResponsePath(${cbId},${stepId},'${sec}',${fid},this.value)">
              </div>
            </div>
          </div>` : '';
            return `<div class="cb-val-wrap">
      <button class="cb-val-btn" onclick="cbTogglePicker('${pid}')">${cbChip(valExpr, prevSteps)}<span style="margin-left:auto;font-size:10px;color:var(--text-tertiary);">▾</span></button>
      <div class="cb-picker" id="${pid}">
        <div class="cb-ptabs">
          <button class="cb-ptab ${activeTab === 'value' ? 'active' : ''}" data-tab="value" onclick="cbPickTab('${pid}','value')">Value</button>
          <button class="cb-ptab ${activeTab === 'fn' ? 'active' : ''}" data-tab="fn" onclick="cbsActivateFn(${cbId},${stepId},'${sec}',${fid},'${pid}')">Function</button>
        </div>
        <div class="cb-pbody">
          <div class="cb-pbody-value" style="display:${activeTab === 'value' ? 'block' : 'none'}">
            <div class="cb-pval-list">${cbsPredList(cbId, stepId, sec, fid, null, valExpr)}</div>
            <div class="cb-pcustom">
              <div class="cb-pval-radio ${isCust ? 'sel' : ''}"></div>
              <input class="cb-pcustom-in" type="text" placeholder="Custom value…" value="${isCust ? valExpr.val : ''}"
                oninput="cbsSetCustom(${cbId},${stepId},'${sec}',${fid},null,this.value)"
                onfocus="cbsSetCustom(${cbId},${stepId},'${sec}',${fid},null,this.value)">
            </div>
          </div>
          <div class="cb-pbody-fn" style="display:${activeTab === 'fn' ? 'block' : 'none'}">
            <select class="cb-fn-sel" onchange="cbsSetFn(${cbId},${stepId},'${sec}',${fid},this.value)">${fnOpts}</select>
            <div class="cb-fn-params">${fnParams}</div>
          </div>
          ${respPane}
        </div>
      </div>
    </div>`;
        }

        function cbsRenderSection(cb, step, stepIdx, sec, label) {
            const prevSteps = cb.steps.slice(0, stepIdx);
            const rows = step[sec].map(f => `
      <div class="cb-kv">
        <input class="cb-key" type="text" placeholder="key" value="${f.key}"
          oninput="cbsUpdateKey(${cb.id},${step.id},'${sec}',${f.id},this.value)">
        ${cbsValPicker(cb.id, step.id, sec, f.id, f.val, prevSteps)}
        <button class="btn-icon" onclick="cbsRemoveField(${cb.id},${step.id},'${sec}',${f.id})" title="Remove" style="flex-shrink:0;font-size:15px;color:var(--text-tertiary);padding:0 4px;">×</button>
      </div>`).join('');
            return `<div class="cb-sec">
      <div class="cb-sec-head">
        <span class="cb-sec-label">${label}</span>
        <button class="btn btn-ghost btn-sm" onclick="cbsAddField(${cb.id},${step.id},'${sec}')">+ Add</button>
      </div>
      ${rows}
    </div>`;
        }

        function cbsRenderStep(cb, step, stepIdx) {
            const canRemove = cb.steps.length > 1;
            const respId = `mock-resp-${step.id}`;
            const chevId = `mock-chev-${step.id}`;
            return `
      <div class="cb-step" style="margin-bottom:8px;border-left:2px solid var(--border-subtle);padding-left:12px;">
        <div class="cb-step-head">
          <span style="font-size:11px;font-weight:700;color:var(--text-tertiary);flex-shrink:0;">Step ${stepIdx + 1}</span>
          <select class="cb-method" onchange="cbsUpdateMethod(${cb.id},${step.id},this.value)">
            ${['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(m => `<option ${step.method === m ? 'selected' : ''}>${m}</option>`).join('')}
          </select>
          <button class="btn btn-primary btn-sm" onclick="cbsExecuteStep(${cb.id},${step.id},this)" style="margin-left:auto;flex-shrink:0;">Execute</button>
          ${canRemove ? `<button class="btn-icon" onclick="cbsRemoveStep(${cb.id},${step.id})" title="Remove step" style="font-size:15px;color:var(--text-tertiary);padding:0 4px;">×</button>` : ''}
        </div>
        <div class="cb-step-body">
          <div class="cb-url-row">
            <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-tertiary);flex-shrink:0;">URL</span>
            <input class="cb-url" type="text" placeholder="https://…" value="${step.url}" oninput="cbsUpdateUrl(${cb.id},${step.id},this.value)">
          </div>
          ${cbsRenderSection(cb, step, stepIdx, 'headers', 'Headers')}
          ${cbsRenderSection(cb, step, stepIdx, 'body', 'Body')}
          ${step.mockResponse ? `
          <div style="margin-top:10px;">
            <button onclick="var p=document.getElementById('${respId}'),c=document.getElementById('${chevId}'),open=p.style.display!=='none';p.style.display=open?'none':'block';c.style.transform=open?'':'rotate(90deg)';"
              style="display:flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.07em;background:none;border:none;cursor:pointer;padding:0;">
              <span id="${chevId}" style="font-size:9px;transition:transform 0.15s;">▶</span>
              Response
            </button>
            <div id="${respId}" style="display:none;margin-top:6px;background:#f8fafc;border:1px solid var(--border);border-radius:var(--r-sm);padding:10px;overflow:auto;max-height:220px;">
              <pre style="margin:0;font-size:11px;font-family:var(--mono);color:#334155;line-height:1.6;">${JSON.stringify(step.mockResponse, null, 2)}</pre>
            </div>
          </div>` : ''}
        </div>
      </div>`;
        }

        function cbRenderCallback(cb) {
            return `
      <div class="cb-step" style="margin-bottom:16px;">
        <div class="cb-step-head">
          <input class="cb-name" type="text" value="${cb.name}" oninput="cbUpdateCallbackName(${cb.id},this.value)">
          <button class="btn-icon" onclick="cbRemoveCallback(${cb.id})" title="Remove callback" style="margin-left:auto;font-size:15px;color:var(--text-tertiary);padding:0 4px;">×</button>
        </div>
        <div class="cb-step-body">
          ${cb.steps.map((step, i) => cbsRenderStep(cb, step, i)).join('')}
          <button class="btn btn-ghost btn-sm" onclick="cbsAddStep(${cb.id})" style="margin-top:8px;">+ Add Step</button>
        </div>
      </div>`;
        }

        function cbRender() {
            // Remember open pickers before re-render
            const open = new Set([...document.querySelectorAll('.cb-picker.open')].map(p => p.id));

            // Render validation step inside Validation Rules section
            const vContainer = document.getElementById('user-validation-step');
            if (vContainer) {
                vContainer.innerHTML = cbRenderStep(validationStep);
            }

            // Render callbacks inside Callbacks section
            const container = document.getElementById('cb-steps');
            if (container) {
                container.innerHTML = callbacks.map(cb => cbRenderCallback(cb)).join('');
            }

            // Re-open pickers that were open before re-render
            open.forEach(id => {
                const p = document.getElementById(id);
                if (p) {
                    p.classList.add('open');
                    const b = p.previousElementSibling;
                    if (b && b.classList.contains('cb-val-btn')) b.classList.add('active');
                }
            });
        }

        // Close pickers on outside click
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.cb-val-wrap')) {
                document.querySelectorAll('.cb-picker.open').forEach(p => {
                    p.classList.remove('open');
                    const b = p.previousElementSibling;
                    if (b && b.classList.contains('cb-val-btn')) b.classList.remove('active');
                });
            }
        });
