/**
 * Yakthung Pan • 5-Tab Sirijonga Sak-sak Chart Modal
 * Explores Consonants, Vowels, Naukhari Matrix, Marks, and Numerals.
 */

/**
         * 7. 5-TAB SIRIJONGA SAK-SAK CHART MODAL
         */
        function openChartModal() {
            document.getElementById('chartModal').classList.remove('hidden');
            switchChartTab(session.activeChartTab || 'consonants');
        }

        function closeChartModal(silent = false) {
            const modal = document.getElementById('chartModal');
            if (modal) modal.classList.add('hidden');
            if (!silent && typeof setNavTabActive === 'function') setNavTabActive('trail');
        }

        function switchChartTab(tabName) {
            session.activeChartTab = tabName;
            ['consonants', 'vowels', 'naukhari', 'marks', 'numbers'].forEach(t => {
                const btn = document.getElementById(`chartTab_${t}`);
                if (!btn) return;
                if (t === tabName) {
                    btn.className = 'py-1.5 px-1 rounded-xl text-[10px] font-extrabold bg-slatebrand-900 text-goldaccent-400 shadow-xs transition leading-tight';
                } else {
                    btn.className = 'py-1.5 px-1 rounded-xl text-[10px] font-extrabold bg-white text-slate-700 border border-parchment-300 transition leading-tight';
                }
            });

            const body = document.getElementById('chartTabBody');
            body.innerHTML = '';

            if (tabName === 'consonants') {
                // Tab 1: Exact 25-Consonant Kudhuku-sak Chart
                const card = document.createElement('div');
                card.className = 'bg-white rounded-3xl p-3 border border-parchment-300 shadow-sm space-y-2';
                card.innerHTML = `<div class="text-[11px] font-extrabold text-slatebrand-900 px-1">Kudhuku-sak • 25 Consonants (Tap any letter to trace)</div>`;
                const grid = document.createElement('div');
                grid.className = 'grid grid-cols-4 gap-2';

                SIRIJONGA_25.forEach((item, idx) => {
                    const isMastered = progress.masteredChars.includes(item.id);
                    const isLastCentered = idx === 24;
                    const btn = document.createElement('button');
                    btn.className = `${isLastCentered ? 'col-start-2 col-span-2' : ''} relative rounded-2xl p-2 bg-parchment-50/70 border ${
                        isMastered ? 'border-emerald-500 bg-emerald-50/60' : 'border-parchment-300'
                    } hover:border-emerald-600 active:scale-95 shadow-xs flex flex-col items-center justify-center gap-0.5 transition`;
                    btn.innerHTML = `
                        ${isMastered ? '<span class="absolute top-1 right-1.5 text-[10px] font-extrabold text-emerald-600">✓</span>' : ''}
                        <div class="flex items-center justify-center gap-1.5">
                            <span class="font-limbu text-3xl text-slatebrand-900 leading-none">${item.char}</span>
                            <div class="flex flex-col items-start leading-tight">
                                <span class="font-deva text-xs font-bold text-emerald-700">${item.deva}</span>
                                <span class="text-[10px] font-extrabold text-slate-700">${item.latin}</span>
                            </div>
                        </div>
                        <span class="text-[9px] font-semibold text-slate-500 truncate max-w-full">${item.wordLatin} • ${item.meaning.split('/')[0].trim()}</span>
                    `;
                    btn.onclick = () => {
                        closeChartModal();
                        AudioSystem.playItem(item);
                        startSingleLetterPractice(item);
                    };
                    grid.appendChild(btn);
                });
                card.appendChild(grid);
                body.appendChild(card);

            } else if (tabName === 'vowels') {
                // Tab 2: Kubung-sak 9 Vowels in exact 3x3 grid
                const card = document.createElement('div');
                card.className = 'bg-white rounded-3xl p-3.5 border border-parchment-300 shadow-sm space-y-2.5';
                card.innerHTML = `<div class="text-[11px] font-extrabold text-slatebrand-900 px-1">Kubung-sak • 9 Core Vowels (3×3 Grid • Tap to trace)</div>`;
                const grid = document.createElement('div');
                grid.className = 'grid grid-cols-3 gap-2.5';

                KUBUNG_VOWELS_9.forEach(item => {
                    const isMastered = progress.masteredChars.includes(item.id);
                    const btn = document.createElement('button');
                    btn.className = `relative rounded-2xl p-3 bg-parchment-50/70 border ${
                        isMastered ? 'border-emerald-500 bg-emerald-50/60' : 'border-parchment-300'
                    } hover:border-emerald-600 active:scale-95 shadow-xs flex flex-col items-center justify-center gap-1 transition`;
                    btn.innerHTML = `
                        ${isMastered ? '<span class="absolute top-1.5 right-2 text-[10px] font-extrabold text-emerald-600">✓</span>' : ''}
                        <span class="font-limbu text-4xl text-slatebrand-900 leading-none">${item.char}</span>
                        <div class="flex items-center gap-1.5">
                            <span class="font-deva text-sm font-bold text-emerald-700">${item.deva}</span>
                            <span class="text-xs font-extrabold text-slate-700">${item.latin}</span>
                        </div>
                        <span class="text-[9px] font-semibold text-slate-500">${item.wordLatin} (${item.meaning.split('/')[0].trim()})</span>
                    `;
                    btn.onclick = () => {
                        closeChartModal();
                        AudioSystem.playItem(item);
                        startSingleLetterPractice(item);
                    };
                    grid.appendChild(btn);
                });
                card.appendChild(grid);
                body.appendChild(card);

            } else if (tabName === 'naukhari') {
                // Tab 3: Interactive 9-Form Naukhari (Saknam-bhan) Explorer
                const selectedCons = SIRIJONGA_25.find(c => c.id === session.selectedNaukhariConsonantId) || SIRIJONGA_25[0];
                const stemLatin = selectedCons.latin.slice(0, -1);

                const explorerCard = document.createElement('div');
                explorerCard.className = 'bg-white rounded-3xl p-3.5 border border-parchment-300 shadow-sm space-y-3';

                const headerHtml = document.createElement('div');
                headerHtml.className = 'flex items-center justify-between gap-2';
                headerHtml.innerHTML = `
                    <div>
                        <div class="text-xs font-extrabold text-slatebrand-900">Saknam-bhan (Naukhari 9-Form)</div>
                        <p class="text-[10px] text-slate-500 font-semibold">Pick a consonant below, then tap any 3×3 syllable to hear it</p>
                    </div>
                    <div class="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-1.5 shrink-0">
                        <span class="font-limbu text-xl text-emerald-700 font-bold">${selectedCons.char}</span>
                        <span class="text-xs font-extrabold text-slatebrand-900">${selectedCons.latin}</span>
                    </div>
                `;
                explorerCard.appendChild(headerHtml);

                const pillBar = document.createElement('div');
                pillBar.className = 'flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1';
                SIRIJONGA_25.forEach(c => {
                    const isSelected = c.id === selectedCons.id;
                    const pill = document.createElement('button');
                    pill.className = isSelected
                        ? 'px-2.5 py-1.5 rounded-xl bg-slatebrand-900 text-goldaccent-400 border border-slatebrand-900 shadow-xs flex items-center gap-1 shrink-0 transition'
                        : 'px-2.5 py-1.5 rounded-xl bg-parchment-50 hover:bg-parchment-100 text-slatebrand-900 border border-parchment-300 flex items-center gap-1 shrink-0 transition';
                    pill.innerHTML = `
                        <span class="font-limbu text-base leading-none">${c.char}</span>
                        <span class="text-[10px] font-extrabold">${c.latin}</span>
                    `;
                    pill.onclick = () => {
                        session.selectedNaukhariConsonantId = c.id;
                        playTone(c.freq, 'note');
                        switchChartTab('naukhari');
                    };
                    pillBar.appendChild(pill);
                });
                explorerCard.appendChild(pillBar);

                const matrixGrid = document.createElement('div');
                matrixGrid.className = 'grid grid-cols-3 gap-2.5 pt-1';

                NAUKHARI_FORMS.forEach(form => {
                    const combinedLimbu = `${selectedCons.char}${form.limbuMatra}`;
                    const combinedDeva = `${selectedCons.devaBase}${form.devaMatra}`;
                    const combinedLatin = `${stemLatin}${form.latinSuffix}`;
                    const noteFreq = Math.min(1150, selectedCons.freq + form.toneOffset);

                    const cell = document.createElement('button');
                    cell.className = 'rounded-2xl p-2.5 bg-parchment-50/80 hover:bg-emerald-50/70 border border-parchment-300 hover:border-emerald-500 active:scale-95 shadow-xs flex flex-col items-center justify-center gap-1 transition';
                    cell.innerHTML = `
                        <span class="text-[9px] font-bold uppercase tracking-wider text-slate-400">${form.name}</span>
                        <span class="font-limbu text-3xl text-slatebrand-900 leading-tight">${combinedLimbu}</span>
                        <div class="flex items-center gap-1.5">
                            <span class="font-deva text-xs font-bold text-emerald-700">${combinedDeva}</span>
                            <span class="text-xs font-extrabold text-slate-800">${combinedLatin}</span>
                        </div>
                    `;
                    cell.onclick = () => {
                        speakText(combinedDeva, 'hi-IN', noteFreq);
                    };
                    matrixGrid.appendChild(cell);
                });

                explorerCard.appendChild(matrixGrid);
                body.appendChild(explorerCard);

            } else if (tabName === 'marks') {
                // Tab 4: Saknam-sak 8 Matras, Chuk-sak Finals, Ektum-sak Conjuncts & Kusek-sak Marks
                const matraCard = document.createElement('div');
                matraCard.className = 'bg-white rounded-3xl p-3 border border-parchment-300 shadow-sm space-y-2';
                matraCard.innerHTML = `<div class="text-[11px] font-extrabold text-slatebrand-900">Saknam-sak • 8 Vowel Matras (Tap to Hear)</div>`;
                const matraGrid = document.createElement('div');
                matraGrid.className = 'grid grid-cols-2 gap-2';
                SAKNAM_MATRAS.forEach(m => {
                    const b = document.createElement('button');
                    b.className = 'p-2.5 rounded-2xl bg-parchment-50/70 border border-parchment-200 hover:border-emerald-500 flex items-center justify-between text-left active:scale-95 transition';
                    b.innerHTML = `
                        <div>
                            <div class="text-xs font-extrabold text-slatebrand-900">${m.name}</div>
                            <div class="font-deva text-[10px] text-slate-500">${m.nepali}</div>
                        </div>
                        <div class="text-right">
                            <span class="font-limbu text-2xl text-emerald-700 font-bold">${m.demo}</span>
                            <span class="block text-[10px] font-bold text-slate-600">${m.latin}</span>
                        </div>
                    `;
                    b.onclick = () => speakText(m.deva, 'hi-IN', 420);
                    matraGrid.appendChild(b);
                });
                matraCard.appendChild(matraGrid);
                body.appendChild(matraCard);

                const chukCard = document.createElement('div');
                chukCard.className = 'bg-white rounded-3xl p-3 border border-parchment-300 shadow-sm space-y-2';
                chukCard.innerHTML = `<div class="text-[11px] font-extrabold text-slatebrand-900">Chuk-sak • 7 Half / Subjoined Final Consonants</div>`;
                const chukGrid = document.createElement('div');
                chukGrid.className = 'grid grid-cols-4 gap-1.5';
                CHUK_FINALS.forEach(c => {
                    const div = document.createElement('div');
                    div.className = 'p-2 rounded-xl bg-parchment-50/70 border border-parchment-200 text-center';
                    div.innerHTML = `
                        <div class="font-limbu text-xl text-slatebrand-900">${c.demo}</div>
                        <div class="font-deva text-[10px] font-bold text-emerald-700">${c.sound}</div>
                    `;
                    chukGrid.appendChild(div);
                });
                chukCard.appendChild(chukGrid);
                body.appendChild(chukCard);

                const ekCard = document.createElement('div');
                ekCard.className = 'bg-white rounded-3xl p-3 border border-parchment-300 shadow-sm space-y-2';
                ekCard.innerHTML = `<div class="text-[11px] font-extrabold text-slatebrand-900">Ektum-sak (Conjuncts) & Kusek-sak (Sound Marks)</div>`;
                const list = document.createElement('div');
                list.className = 'space-y-1.5';
                [...EKTUM_CONJUNCTS, ...KUSEK_MARKS].forEach(item => {
                    const row = document.createElement('div');
                    row.className = 'p-2.5 rounded-xl bg-parchment-50/70 border border-parchment-200 flex items-center justify-between';
                    row.innerHTML = `
                        <div>
                            <div class="text-xs font-extrabold text-slatebrand-900">${item.name}</div>
                            <div class="text-[10px] text-slate-600">${item.meaning}</div>
                        </div>
                        <span class="font-limbu text-xl text-emerald-700 font-bold">${item.demo}</span>
                    `;
                    list.appendChild(row);
                });
                ekCard.appendChild(list);
                body.appendChild(ekCard);

            } else if (tabName === 'numbers') {
                // Tab 5: Khanin Limbu Numerals 0–10
                const card = document.createElement('div');
                card.className = 'bg-white rounded-3xl p-3.5 border border-parchment-300 shadow-sm space-y-2.5';
                card.innerHTML = `<div class="text-[11px] font-extrabold text-slatebrand-900 px-1">Khanin • Limbu Numerals 0–10 (Tap any digit to trace)</div>`;
                const grid = document.createElement('div');
                grid.className = 'grid grid-cols-3 gap-2.5';

                KHANIN_NUMBERS.forEach(item => {
                    const isMastered = progress.masteredChars.includes(item.id);
                    const btn = document.createElement('button');
                    btn.className = `relative rounded-2xl p-3 bg-parchment-50/70 border ${
                        isMastered ? 'border-emerald-500 bg-emerald-50/60' : 'border-parchment-300'
                    } hover:border-emerald-600 active:scale-95 shadow-xs flex flex-col items-center justify-center gap-1 transition`;
                    btn.innerHTML = `
                        ${isMastered ? '<span class="absolute top-1.5 right-2 text-[10px] font-extrabold text-emerald-600">✓</span>' : ''}
                        <span class="font-limbu text-3xl text-slatebrand-900 leading-none">${item.char}</span>
                        <span class="text-xs font-extrabold text-emerald-700">${item.latin}</span>
                        <span class="font-limbu text-xs text-slate-500">${item.wordLimbu} (${item.wordLatin})</span>
                    `;
                    btn.onclick = () => {
                        closeChartModal();
                        AudioSystem.playItem(item);
                        startSingleLetterPractice(item);
                    };
                    grid.appendChild(btn);
                });
                card.appendChild(grid);
                body.appendChild(card);
            }
        }
