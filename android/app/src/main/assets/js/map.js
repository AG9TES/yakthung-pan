/**
 * Yakthung Pan • Winding Mountain Adventure Map
 * Renders the winding trail, chapter banners, and interactive nodes (Levels 1 to 21).
 */

// Helper to evaluate locked state:
// When devMode is true: ALL levels are open!
// When devMode is false: Normal sequential progression (previous level must have stars or level is <= unlocked level).
function isLevelLocked(lvl) {
    if (devMode) return false;
    const num = Number(lvl.levelNum);
    if (num <= 1) return false;

    // A level is unlocked if its number is within the player's unlocked level
    const effective = (typeof getEffectiveUnlockedLevel === 'function') 
        ? getEffectiveUnlockedLevel() 
        : (Number(progress.unlockedLevel) || 1);

    if (num <= effective) {
        return false;
    }

    // Check if previous level has stars
    const idx = ADVENTURE_LEVELS.findIndex(l => Number(l.levelNum) === num);
    if (idx <= 0) return false;
    const prevLvl = ADVENTURE_LEVELS[idx - 1];
    return !Boolean(progress.levelStars[prevLvl.levelNum] || progress.levelStars[String(prevLvl.levelNum)]);
}

function renderWindingMap(targetLvlOverride) {
    const container = document.getElementById('windingMapContainer');
    if (!container || typeof ADVENTURE_LEVELS === 'undefined' || !ADVENTURE_LEVELS.length) return;
    container.innerHTML = '';

    // Bottom-to-top progression (Level 1 at bottom, highest level at summit)
    const reversedLevels = [...ADVENTURE_LEVELS].reverse();
    const stepHeight = 126;
    const topPad = 120;
    const bottomPad = 140;
    const totalHeight = topPad + (reversedLevels.length - 1) * stepHeight + bottomPad;

    container.style.height = `${totalHeight}px`;
    container.className = 'relative w-full bg-gradient-to-b from-[#e0f2fe] via-[#f1f5f9] to-[#ecfdf5] overflow-hidden';

    // Explicit X-coordinates for serpentine mountain trail (Levels 1-21)
    const levelXMap = {
        1: 50,
        2: 75,
        3: 48,
        4: 24,
        5: 52,
        6: 76,
        7: 48,
        8: 24,
        9: 52,
        10: 75,
        11: 48,
        12: 24,
        13: 48,
        14: 72,
        15: 48,
        16: 24,
        17: 50,
        18: 75,
        19: 48,
        20: 24,
        21: 50
    };

    const coords = reversedLevels.map((lvl, idx) => {
        const x = levelXMap[lvl.levelNum] ?? levelXMap[String(lvl.levelNum)] ?? 50;
        return {
            lvl,
            xPct: x,
            yPx: topPad + idx * stepHeight
        };
    });

    // Draw SVG Winding Mountain Trail
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 100 ${totalHeight}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.className = 'absolute inset-0 w-full h-full pointer-events-none z-10';

    let d = '';
    coords.forEach((c, i) => {
        if (i === 0) {
            d += `M ${c.xPct} ${c.yPx}`;
        } else {
            const prev = coords[i - 1];
            const midY = (prev.yPx + c.yPx) / 2;
            d += ` C ${prev.xPct} ${midY}, ${c.xPct} ${midY}, ${c.xPct} ${c.yPx}`;
        }
    });

    // 1. Lush emerald outer grassy border
    const trailBorder = document.createElementNS(svgNS, 'path');
    trailBorder.setAttribute('d', d);
    trailBorder.setAttribute('fill', 'none');
    trailBorder.setAttribute('stroke', '#059669');
    trailBorder.setAttribute('stroke-width', '22');
    trailBorder.setAttribute('stroke-linecap', 'round');
    trailBorder.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(trailBorder);

    // 2. Warm cream mountain path surface
    const trailBody = document.createElementNS(svgNS, 'path');
    trailBody.setAttribute('d', d);
    trailBody.setAttribute('fill', 'none');
    trailBody.setAttribute('stroke', '#fef3c7');
    trailBody.setAttribute('stroke-width', '16');
    trailBody.setAttribute('stroke-linecap', 'round');
    trailBody.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(trailBody);

    // 3. Delicate emerald dashed guideline
    const trailDash = document.createElementNS(svgNS, 'path');
    trailDash.setAttribute('d', d);
    trailDash.setAttribute('fill', 'none');
    trailDash.setAttribute('stroke', '#10b981');
    trailDash.setAttribute('stroke-opacity', '0.45');
    trailDash.setAttribute('stroke-width', '1.6');
    trailDash.setAttribute('stroke-dasharray', '3 4');
    trailDash.setAttribute('stroke-linecap', 'round');
    svg.appendChild(trailDash);

    container.appendChild(svg);

    // Decorative Himalayan pine tree accents on mountain slopes
    const treeCoords = [
        { x: 10, y: 160, s: '🌲' },
        { x: 88, y: 260, s: '🌲' },
        { x: 12, y: 420, s: '🌲' },
        { x: 86, y: 540, s: '🌲' },
        { x: 14, y: 700, s: '🌲' },
        { x: 85, y: 860, s: '🌲' },
        { x: 10, y: 1020, s: '🌲' },
        { x: 88, y: 1180, s: '🌲' },
        { x: 12, y: 1360, s: '🌲' },
        { x: 85, y: 1520, s: '🌲' },
        { x: 10, y: 1700, s: '🌲' },
        { x: 88, y: 1880, s: '🌲' },
        { x: 14, y: 2040, s: '🌲' },
        { x: 85, y: 2220, s: '🌲' },
        { x: 10, y: 2400, s: '🌲' }
    ];
    treeCoords.forEach(t => {
        const tree = document.createElement('div');
        tree.className = 'absolute text-xl sm:text-2xl opacity-40 select-none pointer-events-none z-10';
        tree.style.left = `${t.x}%`;
        tree.style.top = `${t.y}px`;
        tree.textContent = t.s;
        container.appendChild(tree);
    });

    // Dynamically Render Chapter Banner Headers above each chapter's top-most node
    const chapterTopNodes = {};
    if (typeof CHAPTERS !== 'undefined') {
        CHAPTERS.forEach(chap => {
            const chapCoords = coords.filter(c => c.lvl.chapter === chap.id);
            if (chapCoords.length > 0) {
                chapterTopNodes[chap.id] = chapCoords[0];
            }
        });

        Object.entries(chapterTopNodes).forEach(([chapId, nodeCoord]) => {
            if (!nodeCoord) return;
            const chap = CHAPTERS.find(ch => ch.id === Number(chapId));
            if (!chap) return;
            const banner = document.createElement('div');
            banner.className = 'absolute left-1/2 -translate-x-1/2 z-20 w-[88%] max-w-[380px] pointer-events-none';
            banner.style.top = `${Math.max(12, nodeCoord.yPx - 78)}px`;
            banner.innerHTML = `
                <div class="bg-white/95 backdrop-blur-xs border border-parchment-300 rounded-2xl px-3.5 py-1.5 shadow-sm flex items-center justify-between gap-2">
                    <div>
                        <div class="text-[11px] font-extrabold text-slatebrand-900 leading-tight">${chap.title}</div>
                        <div class="text-[10px] font-semibold text-slate-500">${chap.subtitle}</div>
                    </div>
                    <span class="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${chap.badgeColor}">
                        Unit ${chap.id}
                    </span>
                </div>
            `;
            container.appendChild(banner);
        });
    }

    // Render Interactive Level Nodes
    const effectiveUnlocked = (typeof getEffectiveUnlockedLevel === 'function') 
        ? getEffectiveUnlockedLevel() 
        : (progress.unlockedLevel || 1);

    coords.forEach(({ lvl, xPct, yPx }) => {
        const numKey = lvl.levelNum;
        const isDone = (Number(numKey) < Number(effectiveUnlocked)) || Boolean(progress.levelStars[numKey] || progress.levelStars[String(numKey)]);
        const isCurrent = String(lvl.levelNum) === String(effectiveUnlocked);
        const isLocked = isLevelLocked(lvl);
        let stars = progress.levelStars[numKey] || progress.levelStars[String(numKey)] || 0;
        if (isDone && stars === 0) stars = 3;

        const wrapper = document.createElement('div');
        wrapper.className = 'absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center';
        wrapper.style.left = `${xPct}%`;
        wrapper.style.top = `${yPx}px`;

        // Floating PLAY callout on current active unlocked node (glowing gold with cheerful PLAY pill)
        if (isCurrent && !devMode && !isLocked) {
            const badge = document.createElement('div');
            badge.className = 'float-play-badge absolute -top-8 left-1/2 bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg border-2 border-white whitespace-nowrap z-30 select-none';
            badge.textContent = 'PLAY';
            wrapper.appendChild(badge);

            const pulse = document.createElement('div');
            pulse.className = 'active-node-ring absolute top-0 w-20 h-20 rounded-full bg-amber-400/35 pointer-events-none';
            wrapper.appendChild(pulse);
        }

        const btn = document.createElement('button');
        let btnColors = '';
        if (isLocked) {
            btnColors = 'bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 border-[3.5px] border-slate-100 text-slate-500 shadow-[0_6px_0_#94a3b8]';
        } else if (lvl.isBoss) {
            // Boss levels ALWAYS retain their majestic purple / indigo Boss styling!
            btnColors = 'bg-gradient-to-b from-purple-500 via-indigo-600 to-purple-800 border-[3.5px] border-amber-300 text-white shadow-[0_6px_0_#312e81] hover:brightness-105';
        } else if (isDone) {
            btnColors = 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 border-[3.5px] border-white text-white shadow-[0_6px_0_#065f46] hover:brightness-105';
        } else if (isCurrent) {
            btnColors = 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 border-[3.5px] border-white text-slatebrand-900 shadow-[0_6px_0_#b45309] hover:brightness-105';
        } else if (devMode) {
            btnColors = 'bg-gradient-to-b from-emerald-500 to-teal-700 border-[3.5px] border-white text-white shadow-[0_6px_0_#064e3b] hover:brightness-105';
        } else {
            btnColors = 'bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 border-[3.5px] border-slate-100 text-slate-500 shadow-[0_6px_0_#94a3b8]';
        }

        const sizeClass = lvl.isBoss ? 'w-[74px] h-[74px]' : 'w-[68px] h-[68px]';
        btn.className = `node-3d relative ${sizeClass} rounded-full flex flex-col items-center justify-center ${btnColors} transition transform active:scale-95 cursor-pointer select-none`;

        if (isLocked) {
            btn.innerHTML = `
                <span class="text-lg">🔒</span>
                <span class="text-[9px] font-extrabold leading-none mt-0.5">Lvl ${lvl.levelNum}</span>
            `;
            btn.onclick = () => {
                btn.classList.remove('shake-locked');
                void btn.offsetWidth;
                btn.classList.add('shake-locked');
                playTone(150, 'error');
                showToast(`Level ${lvl.levelNum} locked. Clear previous levels or tap "🔓 Dev Mode" to unlock all!`, '🔒');
            };
        } else {
            // Open Level: Display character glyph
            const iconStyle = (lvl.type === 'trace' || lvl.type === 'saknam') ? 'font-limbu text-2xl' : 'text-2xl';
            btn.innerHTML = `
                ${isDone ? '<span class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-900 border-2 border-white text-[10px] font-black flex items-center justify-center shadow">✓</span>' : ''}
                <span class="${iconStyle} leading-none font-bold drop-shadow-xs">${lvl.icon}</span>
                <span class="text-[9px] font-black uppercase mt-0.5 tracking-tight">Lvl ${lvl.levelNum}</span>
            `;
            btn.onclick = () => {
                playTone(440, 'note');
                startAdventureLevel(lvl);
            };
        }

        wrapper.appendChild(btn);

        // 3-Star Pill underneath node
        const starRow = document.createElement('div');
        starRow.className = 'mt-2 px-2.5 py-0.5 rounded-full bg-white/95 border border-slate-200/80 shadow-xs flex items-center gap-0.5 text-xs select-none';
        for (let s = 1; s <= 3; s++) {
            const st = document.createElement('span');
            st.textContent = '★';
            st.className = s <= stars ? 'text-amber-400 drop-shadow-2xs' : 'text-slate-300';
            starRow.appendChild(st);
        }
        wrapper.appendChild(starRow);

        // Level Title Tag
        const lbl = document.createElement('span');
        lbl.className = `mt-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md whitespace-nowrap shadow-xs select-none ${
            isLocked ? 'text-slate-400 bg-white/70' : 'text-slate-800 bg-white/95 border border-slate-100'
        }`;
        lbl.textContent = lvl.title;
        wrapper.appendChild(lbl);

        container.appendChild(wrapper);
    });

    // Auto-scroll smoothly to active level (with secondary pass to guarantee mobile stability)
    const scrollToTarget = () => {
        const mapEl = document.getElementById('mapView');
        let targetLevelNum = targetLvlOverride;
        if (!targetLevelNum) {
            targetLevelNum = (typeof getEffectiveUnlockedLevel === 'function')
                ? getEffectiveUnlockedLevel()
                : (progress.unlockedLevel || 1);
        }
        const targetNode = coords.find(c => String(c.lvl.levelNum) === String(targetLevelNum)) || coords[coords.length - 1];
        if (mapEl && targetNode) {
            const targetY = Math.max(0, targetNode.yPx - (mapEl.clientHeight / 2));
            mapEl.scrollTo({
                top: targetY,
                behavior: 'smooth'
            });
        }
    };
    setTimeout(scrollToTarget, 50);
    setTimeout(scrollToTarget, 250);
}
