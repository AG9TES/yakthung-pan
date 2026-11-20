/**
 * Yakthung Pan • Mode A: Finger-Tracing Pad Engine
 * Restored 1:1 from old.html baseline:
 * - Terracotta reddish-orange dashed guide outline (rgba(200, 75, 49, 0.45), fill rgba(200, 75, 49, 0.09))
 * - Notebook parchment alignment guidelines (#ece3d0 and #dfd0b3)
 * - 14px thick hit-zone mask with 4px shadowBlur for natural finger/pen stroke matching
 * - Real-time 60% accuracy threshold gating, matchMeterBar & matchMeterText updates, and Next unlock
 */

// Canvas & Offscreen Pixel-Mask Buffers
let canvas = null, ctx = null;
let targetMaskCanvas = null, targetMaskCtx = null;
let userStrokeCanvas = null, userStrokeCtx = null;
let targetPixelSet = new Uint8Array(0);
let totalTargetPixels = 0;
let isDrawing = false;
let lastX = 0, lastY = 0;

// Authentic Vector Paths for 8 Limbu Matras (eliminates fallback dotted circles)
const MATRA_SVG_PATHS = {
    "m_aa": {
        "id": "m_aa",
        "name": "Amma",
        "width": 465,
        "height": 221,
        "d": "M0 111Q0 80 15.5 55.0Q31 30 57.0 15.0Q83 0 114 0Q161 0 192.0 28.5Q223 57 223 102Q223 132 213 153H465L441 221H109Q63 221 31.5 189.0Q0 157 0 111ZM72 100Q72 124 84.5 138.5Q97 153 122 153Q144 153 157.5 139.0Q171 125 171 101Q171 79 156.5 65.5Q142 52 118 52Q99 52 85.5 66.0Q72 80 72 100Z"
    },
    "m_i": {
        "id": "m_i",
        "name": "Iksu",
        "width": 509,
        "height": 334,
        "d": "M312 334Q338 288 352.5 245.0Q367 202 367 164Q367 152 364.0 136.5Q361 121 347.0 106.5Q333 92 300.0 82.0Q267 72 208 72Q144 72 109.5 84.0Q75 96 62.5 113.5Q50 131 50 149Q50 183 74 210L24 223Q0 186 0 147Q0 110 19.5 76.5Q39 43 84.5 21.5Q130 0 208 0Q302 0 359.5 38.5Q417 77 417 154Q417 191 410.0 221.0Q403 251 396 262H509L484 334Z"
    },
    "m_u": {
        "id": "m_u",
        "name": "Uksu",
        "width": 521,
        "height": 251,
        "d": "M151 251Q119 251 84.0 242.5Q49 234 24.5 211.0Q0 188 0 145Q0 104 27.5 79.0Q55 54 93 54Q128 54 154.0 78.5Q180 103 180 141Q180 160 173 179Q220 175 273.5 157.5Q327 140 380.5 103.0Q434 66 482 5L521 0Q453 118 355.5 184.5Q258 251 151 251ZM90 181Q106 181 116.5 170.0Q127 159 127 144Q127 128 116.5 117.0Q106 106 90 106Q75 106 64.0 117.0Q53 128 53 144Q53 159 64.0 170.0Q75 181 90 181Z"
    },
    "m_e": {
        "id": "m_e",
        "name": "Ettu",
        "width": 257,
        "height": 590,
        "d": "M29 590 0 573Q76 472 116.0 378.5Q156 285 162 212Q140 220 116 220Q85 220 60.5 205.0Q36 190 22.0 165.5Q8 141 8 113Q8 66 39.5 33.0Q71 0 120 0Q174 0 203.5 23.5Q233 47 245.0 83.5Q257 120 257 160Q257 221 227.0 292.0Q197 363 145.5 438.5Q94 514 29 590ZM118 167Q142 167 159.0 150.5Q176 134 176 110Q176 86 159.0 69.0Q142 52 118 52Q94 52 77.0 69.0Q60 86 60 110Q60 134 77.0 150.5Q94 167 118 167Z"
    },
    "m_ai": {
        "id": "m_ai",
        "name": "Ainu",
        "width": 532,
        "height": 590,
        "d": "M192 590 168 565Q239 508 298.5 445.5Q358 383 395.5 323.0Q433 263 436 214Q415 222 391 222Q345 222 314.0 190.5Q283 159 283 113Q283 66 314.0 33.0Q345 0 395 0Q449 0 478.5 23.5Q508 47 520.0 83.5Q532 120 532 160Q532 233 488.5 305.5Q445 378 368.5 449.0Q292 520 192 590ZM29 590 0 573Q76 472 116.0 379.5Q156 287 162 214Q140 222 116 222Q70 222 39.0 190.5Q8 159 8 113Q8 66 39.5 33.0Q71 0 120 0Q174 0 203.5 23.5Q233 47 245.0 83.5Q257 120 257 160Q257 221 227.0 292.0Q197 363 145.5 438.5Q94 514 29 590ZM116 174Q143 174 159.0 155.5Q175 137 175 112Q175 86 159.5 66.5Q144 47 117 47Q90 47 74.0 66.5Q58 86 58 111Q58 136 73.5 155.0Q89 174 116 174ZM391 174Q418 174 434.0 155.5Q450 137 450 112Q450 86 434.5 66.5Q419 47 392 47Q365 47 349.0 66.5Q333 86 333 111Q333 136 348.5 155.0Q364 174 391 174Z"
    },
    "m_o": {
        "id": "m_o",
        "name": "Tumo",
        "width": 751,
        "height": 882,
        "d": "M109 221Q63 221 31.5 189.0Q0 157 0 111Q0 80 16.0 55.0Q32 30 58.0 15.0Q84 0 114 0Q160 0 191.0 27.5Q222 55 222 102Q222 113 219.5 128.5Q217 144 213 153H465L441 221ZM122 153Q144 153 157.0 139.0Q170 125 170 101Q170 76 153.5 64.0Q137 52 117 52Q95 52 83.0 68.5Q71 85 71 100Q71 124 84.5 138.5Q98 153 122 153ZM523 882 494 865Q570 764 610.0 671.5Q650 579 656 506Q634 514 610 514Q564 514 533.0 482.5Q502 451 502 405Q502 358 533.5 325.0Q565 292 614 292Q668 292 697.5 315.5Q727 339 739.0 375.5Q751 412 751 452Q751 513 721.0 584.0Q691 655 639.5 730.5Q588 806 523 882ZM610 466Q637 466 653.0 447.5Q669 429 669 404Q669 378 653.5 358.5Q638 339 611 339Q584 339 568.0 358.5Q552 378 552 403Q552 428 567.5 447.0Q583 466 610 466Z"
    },
    "m_au": {
        "id": "m_au",
        "name": "Tumbo",
        "width": 1026,
        "height": 882,
        "d": "M109 221Q63 221 31.5 189.0Q0 157 0 111Q0 80 16.0 55.0Q32 30 58.0 15.0Q84 0 114 0Q160 0 191.0 27.5Q222 55 222 102Q222 113 219.5 128.5Q217 144 213 153H465L441 221ZM122 153Q144 153 157.0 139.0Q170 125 170 101Q170 76 153.5 64.0Q137 52 117 52Q95 52 83.0 68.5Q71 85 71 100Q71 124 84.5 138.5Q98 153 122 153ZM686 882 662 857Q733 800 792.5 737.5Q852 675 889.5 615.0Q927 555 930 506Q909 514 885 514Q839 514 808.0 482.5Q777 451 777 405Q777 358 808.0 325.0Q839 292 889 292Q943 292 972.5 315.5Q1002 339 1014.0 375.5Q1026 412 1026 452Q1026 525 982.5 597.5Q939 670 862.5 741.0Q786 812 686 882ZM523 882 494 865Q570 764 610.0 671.5Q650 579 656 506Q634 514 610 514Q564 514 533.0 482.5Q502 451 502 405Q502 358 533.5 325.0Q565 292 614 292Q668 292 697.5 315.5Q727 339 739.0 375.5Q751 412 751 452Q751 513 721.0 584.0Q691 655 639.5 730.5Q588 806 523 882ZM610 466Q637 466 653.0 447.5Q669 429 669 404Q669 378 653.5 358.5Q638 339 611 339Q584 339 568.0 358.5Q552 378 552 403Q552 428 567.5 447.0Q583 466 610 466ZM885 466Q912 466 928.0 447.5Q944 429 944 404Q944 378 928.5 358.5Q913 339 886 339Q859 339 843.0 358.5Q827 378 827 403Q827 428 842.5 447.0Q858 466 885 466Z"
    },
    "m_ae": {
        "id": "m_ae",
        "name": "Pechwa",
        "width": 331,
        "height": 222,
        "d": "M298 222 0 48 27 0 331 163Z"
    }
};

// Authentic Vector Paths for 7 Limbu Chuk-sak Half Letters (eliminates dotted circles & tofu)
const CHUK_SVG_PATHS = {
    "c_k": {
        "id": "c_k",
        "name": "Chuk-k",
        "deva": "\u0915\u094d",
        "width": 478,
        "height": 362,
        "d": "M224 362Q189 362 152.5 353.5Q116 345 85.5 327.0Q55 309 36.0 278.5Q17 248 17 205Q17 162 47.0 128.0Q77 94 117 72H0L24 0H478L454 72H186Q139 100 119.0 129.5Q99 159 99 185Q99 228 120.5 250.5Q142 273 174.0 281.0Q206 289 236 289Q290 289 343.5 275.5Q397 262 435 243L454 268Q440 280 406.0 302.5Q372 325 325.5 343.5Q279 362 224 362Z"
    },
    "c_ng": {
        "id": "c_ng",
        "name": "Chuk-ng",
        "deva": "\u0919\u094d",
        "width": 240,
        "height": 239,
        "d": "M119 239Q64 239 32.0 204.0Q0 169 0 120Q0 70 34.0 35.0Q68 0 125 0Q179 0 209.5 31.5Q240 63 240 113Q240 145 226.0 174.0Q212 203 185.0 221.0Q158 239 119 239ZM129 177Q158 177 172.5 157.5Q187 138 187 110Q187 81 169.0 65.0Q151 49 125 49Q97 49 81.0 67.5Q65 86 65 116Q65 144 83.0 160.5Q101 177 129 177Z"
    },
    "c_t": {
        "id": "c_t",
        "name": "Chuk-t",
        "deva": "\u0924\u094d",
        "width": 368,
        "height": 163,
        "d": "M23 163 0 139Q12 122 31.5 98.5Q51 75 78.0 52.5Q105 30 139.5 15.0Q174 0 216 0Q264 0 303.5 21.0Q343 42 368 84L305 148Q288 107 258.5 90.0Q229 73 191 73Q130 73 89.0 102.0Q48 131 23 163Z"
    },
    "c_n": {
        "id": "c_n",
        "name": "Chuk-n",
        "deva": "\u0928\u094d",
        "width": 487,
        "height": 375,
        "d": "M309 375Q235 375 185.0 354.0Q135 333 104.0 300.0Q73 267 55.5 228.0Q38 189 29.0 152.0Q20 115 14.5 87.0Q9 59 0 48L26 0Q43 26 53.5 62.0Q64 98 76.5 137.5Q89 177 110.5 212.0Q132 247 169.0 271.5Q206 296 267 302Q246 268 246 229Q246 184 278.0 151.0Q310 118 371 118Q419 118 453.0 149.0Q487 180 487 233Q487 280 463.0 311.5Q439 343 399.0 359.0Q359 375 309 375ZM359 292Q385 292 404.0 273.5Q423 255 423 229Q423 203 404.0 184.5Q385 166 359 166Q333 166 314.5 184.5Q296 203 296 229Q296 255 314.5 273.5Q333 292 359 292Z"
    },
    "c_p": {
        "id": "c_p",
        "name": "Chuk-p",
        "deva": "\u092a\u094d",
        "width": 480,
        "height": 586,
        "d": "M399 586V353Q383 365 355.5 376.5Q328 388 295.0 395.0Q262 402 231 402Q149 402 116.0 361.5Q83 321 83 256V154Q83 107 69.5 92.0Q56 77 39 77H0L24 5H47Q97 5 122.0 22.0Q147 39 156.0 76.5Q165 114 165 174V246Q165 302 188.0 328.0Q211 354 255 354Q285 354 324.5 345.0Q364 336 399 311V24L480 0V561Z"
    },
    "c_m": {
        "id": "c_m",
        "name": "Chuk-m",
        "deva": "\u092e\u094d",
        "width": 493,
        "height": 589,
        "d": "M235 589V324Q163 319 123.0 285.5Q83 252 83 167V144Q83 105 69.5 92.5Q56 80 39 80H0L24 8H47Q102 8 116.5 44.5Q131 81 131 149V168Q131 211 158.0 229.0Q185 247 235 251V208Q235 149 258.5 102.0Q282 55 317.5 27.5Q353 0 389 0Q413 0 437.0 10.5Q461 21 477.0 49.5Q493 78 493 131Q493 192 465.0 232.5Q437 273 395.5 294.5Q354 316 315 323V564ZM315 251Q352 244 381.5 218.0Q411 192 411 136Q411 104 395.5 88.0Q380 72 362 72Q348 72 331.5 87.5Q315 103 315 153Z"
    },
    "c_r": {
        "id": "c_r",
        "name": "Chuk-r",
        "deva": "\u0930\u094d",
        "width": 209,
        "height": 245,
        "d": "M166 245 0 47 61 0 209 213Z"
    },
    "c_l": {
        "id": "c_l",
        "name": "Chuk-l",
        "deva": "\u0932\u094d",
        "width": 299,
        "height": 329,
        "d": "M134 329Q71 329 35.5 299.0Q0 269 0 199V24L80 0V166Q80 234 95.5 257.5Q111 281 143 281Q176 281 197.5 258.0Q219 235 219 167V24L299 0V127Q299 186 275.5 231.5Q252 277 214.5 303.0Q177 329 134 329Z"
    }
};

function getGlyphSvgPath(letter) {
    if (!letter) return null;
    if (letter.id && MATRA_SVG_PATHS[letter.id]) return MATRA_SVG_PATHS[letter.id];
    if (letter.id && CHUK_SVG_PATHS[letter.id]) return CHUK_SVG_PATHS[letter.id];
    return null;
}

function setupCanvasEvents() {
    canvas = document.getElementById('tracingCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    targetMaskCanvas = document.createElement('canvas');
    targetMaskCtx = targetMaskCanvas.getContext('2d', { willReadFrequently: true });

    userStrokeCanvas = document.createElement('canvas');
    userStrokeCtx = userStrokeCanvas.getContext('2d', { willReadFrequently: true });

    // Desktop Mouse Listeners
    canvas.addEventListener('mousedown', onPointerDown);
    canvas.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    // Mobile / Tablet Touch Listeners (touch-action: none with passive: false)
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (e.touches && e.touches.length > 0) {
            onPointerDown(e.touches[0]);
        }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (e.touches && e.touches.length > 0) {
            onPointerMove(e.touches[0]);
        }
    }, { passive: false });

    canvas.addEventListener('touchend', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    // If webfonts finish loading later, recalculate the mask once
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            const box = document.getElementById('canvasBox');
            if (box && canvas && canvas.width > 0 && !session.stepPassed && session.currentAccuracy === 0) {
                initTracingBuffers();
            }
        });
    }
}

function initTracingBuffers() {
    const box = document.getElementById('canvasBox');
    if (!box) return;
    if (!canvas || !targetMaskCanvas || !userStrokeCanvas) {
        setupCanvasEvents();
    }
    if (!canvas) return;

    const rect = box.getBoundingClientRect();
    const w = Math.max(280, Math.floor(rect.width));
    const h = Math.max(180, Math.floor(rect.height));

    canvas.width = w;
    canvas.height = h;
    targetMaskCanvas.width = w;
    targetMaskCanvas.height = h;
    userStrokeCanvas.width = w;
    userStrokeCanvas.height = h;

    buildTargetGlyphMask(w, h);
    resetTracingCanvas();
}

function getGlyphDrawPos(context, text, w, h) {
    try {
        const metrics = context.measureText(text);
        if (typeof metrics.actualBoundingBoxRight === 'number' && typeof metrics.actualBoundingBoxLeft === 'number' &&
            typeof metrics.actualBoundingBoxAscent === 'number' && typeof metrics.actualBoundingBoxDescent === 'number') {
            const visualCenterX = (metrics.actualBoundingBoxRight - metrics.actualBoundingBoxLeft) / 2;
            const visualCenterY = (metrics.actualBoundingBoxDescent - metrics.actualBoundingBoxAscent) / 2;
            return {
                x: (w / 2) - visualCenterX,
                y: (h / 2 + 20) - visualCenterY
            };
        }
    } catch (e) { }
    return { x: w / 2, y: h / 2 + 20 };
}

function buildTargetGlyphMask(w, h) {
    const letter = getCurrentLetterObj();
    if (!letter || !targetMaskCtx) return;
    const isCombined = letter.char && letter.char.length > 1;
    const fontSize = isCombined
        ? Math.min(w * 0.56, h * 0.64, 220)
        : Math.min(w * 0.72, h * 0.76, 265);

    targetMaskCtx.clearRect(0, 0, w, h);
    targetMaskCtx.save();

    const glyphSvg = getGlyphSvgPath(letter);
    if (glyphSvg && typeof Path2D !== 'undefined') {
        const path = new Path2D(glyphSvg.d);
        // Moderately smaller scale (matches user 'smaller' feedback for Level 14 and comfortable sizing for Level 15)
        const scale = Math.min((w * 0.36) / glyphSvg.width, (h * 0.32) / glyphSvg.height, 0.28);
        const offsetX = (w - glyphSvg.width * scale) / 2;
        const offsetY = (h - glyphSvg.height * scale) / 2;

        targetMaskCtx.translate(offsetX, offsetY);
        targetMaskCtx.scale(scale, scale);
        targetMaskCtx.lineJoin = 'round';
        targetMaskCtx.lineCap = 'round';
        targetMaskCtx.lineWidth = 18 / scale;
        targetMaskCtx.strokeStyle = '#000000';
        targetMaskCtx.fillStyle = '#000000';
        targetMaskCtx.stroke(path);
        targetMaskCtx.fill(path);
    } else {
        targetMaskCtx.font = `${fontSize}px "Noto Sans Limbu", sans-serif`;
        targetMaskCtx.textAlign = 'center';
        targetMaskCtx.textBaseline = 'middle';

        const pos = getGlyphDrawPos(targetMaskCtx, letter.char, w, h);

        // Tight 14px hit-zone mask with shadowBlur = 4 (exact match to old.html)
        targetMaskCtx.lineJoin = 'round';
        targetMaskCtx.lineCap = 'round';
        targetMaskCtx.lineWidth = 14;
        targetMaskCtx.shadowColor = '#000000';
        targetMaskCtx.shadowBlur = 4;
        targetMaskCtx.strokeStyle = '#000000';
        targetMaskCtx.fillStyle = '#000000';

        targetMaskCtx.strokeText(letter.char, pos.x, pos.y);
        targetMaskCtx.fillText(letter.char, pos.x, pos.y);
    }
    targetMaskCtx.restore();

    const imgData = targetMaskCtx.getImageData(0, 0, w, h).data;
    const totalSamples = Math.ceil((w * h) / 4);
    targetPixelSet = new Uint8Array(totalSamples);
    let count = 0;
    let sampleIdx = 0;

    for (let y = 0; y < h; y += 2) {
        for (let x = 0; x < w; x += 2) {
            const alpha = imgData[(y * w + x) * 4 + 3];
            if (alpha > 25) {
                targetPixelSet[sampleIdx] = 1;
                count++;
            }
            sampleIdx++;
        }
    }
    totalTargetPixels = Math.max(1, count);
}

function drawVisualGuide(w, h) {
    const letter = getCurrentLetterObj();
    if (!letter || !ctx) return;
    const isCombined = letter.char && letter.char.length > 1;
    const fontSize = isCombined
        ? Math.min(w * 0.56, h * 0.64, 220)
        : Math.min(w * 0.72, h * 0.76, 265);

    ctx.clearRect(0, 0, w, h);

    // Parchment notebook alignment lines
    ctx.save();
    ctx.strokeStyle = '#ece3d0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(18, h * 0.16);
    ctx.lineTo(w - 18, h * 0.16);
    ctx.moveTo(18, h * 0.84);
    ctx.lineTo(w - 18, h * 0.84);
    ctx.stroke();

    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = '#dfd0b3';
    ctx.beginPath();
    ctx.moveTo(18, h * 0.5);
    ctx.lineTo(w - 18, h * 0.5);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    const glyphSvg = getGlyphSvgPath(letter);
    if (glyphSvg && typeof Path2D !== 'undefined') {
        const path = new Path2D(glyphSvg.d);
        // Moderately smaller scale (matches user 'smaller' feedback for Level 14 and comfortable sizing for Level 15)
        const scale = Math.min((w * 0.36) / glyphSvg.width, (h * 0.32) / glyphSvg.height, 0.28);
        const offsetX = (w - glyphSvg.width * scale) / 2;
        const offsetY = (h - glyphSvg.height * scale) / 2;

        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);

        if (session.ghostMode) {
            ctx.fillStyle = 'rgba(200, 75, 49, 0.04)';
            ctx.fill(path);
        } else {
            // Light terracotta fill with clean dashed outline (matching user attachment)
            ctx.fillStyle = 'rgba(200, 75, 49, 0.10)';
            ctx.fill(path);
            ctx.setLineDash([4 / scale, 4 / scale]);
            ctx.lineWidth = 1.8 / scale;
            ctx.strokeStyle = 'rgba(200, 75, 49, 0.60)';
            ctx.stroke(path);
        }
    } else {
        // Sleek dashed outline (lineWidth = 1.5, [4, 4] dash, subtle 0.09 fill opacity in terracotta/orange-red)
        ctx.font = `${fontSize}px "Noto Sans Limbu", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const pos = getGlyphDrawPos(ctx, letter.char, w, h);

        if (session.ghostMode) {
            ctx.fillStyle = 'rgba(200, 75, 49, 0.04)';
            ctx.fillText(letter.char, pos.x, pos.y);
        } else {
            ctx.fillStyle = 'rgba(200, 75, 49, 0.09)';
            ctx.fillText(letter.char, pos.x, pos.y);
            ctx.setLineDash([4, 4]);
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = 'rgba(200, 75, 49, 0.45)';
            ctx.strokeText(letter.char, pos.x, pos.y);
        }
    }
    ctx.restore();
}

function resetTracingCanvas() {
    session.currentAccuracy = 0;
    session.stepPassed = false;

    if (userStrokeCanvas && userStrokeCtx) {
        userStrokeCtx.clearRect(0, 0, userStrokeCanvas.width, userStrokeCanvas.height);
    }
    if (canvas) {
        drawVisualGuide(canvas.width, canvas.height);
    }
    updateAccuracyUI(0, false);
}

function getPointerXY(ev) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (ev.clientX - rect.left) * (canvas.width / rect.width),
        y: (ev.clientY - rect.top) * (canvas.height / rect.height)
    };
}

function onPointerDown(ev) {
    if (!canvas) return;
    isDrawing = true;
    const pt = getPointerXY(ev);
    lastX = pt.x;
    lastY = pt.y;
}

function onPointerMove(ev) {
    if (!isDrawing || !canvas || !ctx || !targetMaskCtx || !userStrokeCtx) return;
    const pt = getPointerXY(ev);

    const sx = Math.min(canvas.width - 1, Math.max(0, Math.round(pt.x)));
    const sy = Math.min(canvas.height - 1, Math.max(0, Math.round(pt.y)));
    const isNearLetter = targetMaskCtx.getImageData(sx, sy, 1, 1).data[3] > 20;

    // 16px crisp black pen ink (#0f172a) on-target, rose (#f43f5e) stray warning
    ctx.save();
    ctx.strokeStyle = isNearLetter ? '#0f172a' : '#f43f5e';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    ctx.restore();

    userStrokeCtx.save();
    userStrokeCtx.strokeStyle = '#000000';
    userStrokeCtx.lineWidth = 16;
    userStrokeCtx.lineCap = 'round';
    userStrokeCtx.lineJoin = 'round';
    userStrokeCtx.beginPath();
    userStrokeCtx.moveTo(lastX, lastY);
    userStrokeCtx.lineTo(pt.x, pt.y);
    userStrokeCtx.stroke();
    userStrokeCtx.restore();

    lastX = pt.x;
    lastY = pt.y;
}

function onPointerUp() {
    if (!isDrawing) return;
    isDrawing = false;
    evaluateShapeSimilarity();
}

function evaluateShapeSimilarity() {
    if (!userStrokeCanvas || !userStrokeCtx || !targetPixelSet || totalTargetPixels === 0) return;
    const w = userStrokeCanvas.width;
    const h = userStrokeCanvas.height;
    const userData = userStrokeCtx.getImageData(0, 0, w, h).data;

    let matchedTargetPixels = 0;
    let strayUserPixels = 0;
    let totalUserPixels = 0;
    let sampleIdx = 0;

    for (let y = 0; y < h; y += 2) {
        for (let x = 0; x < w; x += 2) {
            const userAlpha = userData[(y * w + x) * 4 + 3];
            const isUserInk = userAlpha > 30;
            const isTarget = targetPixelSet[sampleIdx] === 1;

            if (isUserInk) {
                totalUserPixels++;
                if (isTarget) matchedTargetPixels++;
                else strayUserPixels++;
            }
            sampleIdx++;
        }
    }

    if (totalUserPixels < 8) {
        updateAccuracyUI(0, false);
        return;
    }

    const rawCoverage = matchedTargetPixels / Math.max(1, totalTargetPixels);
    const boostedCoverage = Math.min(1, Math.pow(rawCoverage, 0.72));
    const strayRatio = strayUserPixels / Math.max(1, totalUserPixels);

    const strayPenalty = strayRatio > 0.25 ? (strayRatio - 0.25) * 1.4 : 0;
    let score = Math.round(Math.max(0, Math.min(100, (boostedCoverage - strayPenalty) * 100)));

    if (strayRatio > 0.55) {
        score = Math.min(score, 32);
    }

    session.currentAccuracy = score;
    const passed = score >= 60 && strayRatio <= 0.50;
    session.stepPassed = passed;

    updateAccuracyUI(score, passed, strayRatio > 0.50);
}

function updateAccuracyUI(score, passed, tooMessy = false) {
    const badge = document.getElementById('accuracyBadge');
    const bar = document.getElementById('matchMeterBar');
    const txt = document.getElementById('matchMeterText');
    const nextBtn = document.getElementById('nextLetterBtn');
    const nextLbl = document.getElementById('nextLetterLabel');

    if (bar) bar.style.width = `${score}%`;
    if (txt) txt.textContent = `${score}%`;

    if (passed) {
        if (badge) {
            badge.textContent = `Great Match: ${score}% ✓`;
            badge.className = 'text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800';
        }
        if (bar) bar.className = 'h-full bg-emerald-500 transition-all duration-150';

        const total = session.isSinglePractice ? 1 : (session.activeLevel && session.activeLevel.letterIds ? session.activeLevel.letterIds.length : 1);
        const isLast = session.stepIdx >= total - 1;

        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.className = 'flex-1 py-3 px-4 rounded-xl font-extrabold text-xs bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow transition-all flex items-center justify-center gap-1.5';
        }
        if (nextLbl) {
            nextLbl.textContent = session.isSinglePractice
                ? 'Done Practicing'
                : (isLast ? 'Complete Level' : 'Next Letter');
        }
    } else {
        if (badge) {
            badge.textContent = tooMessy
                ? `Off-Target (${score}%) • Stay on Lines`
                : `Accuracy: ${score}% (Goal: 60%)`;
            badge.className = tooMessy
                ? 'text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800'
                : 'text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800';
        }
        if (bar) {
            bar.className = tooMessy
                ? 'h-full bg-rose-500 transition-all duration-150'
                : 'h-full bg-goldaccent-400 transition-all duration-150';
        }
        if (nextBtn) {
            nextBtn.disabled = true;
            nextBtn.className = 'flex-1 py-3 px-4 rounded-xl font-extrabold text-xs bg-slate-300 text-slate-500 cursor-not-allowed transition-all flex items-center justify-center gap-1.5';
        }
        if (nextLbl) {
            nextLbl.textContent = 'Trace 60% to Unlock';
        }
    }
}

function toggleGhostMode() {
    session.ghostMode = !session.ghostMode;
    const btn = document.getElementById('ghostToggleBtn');
    const txt = document.getElementById('ghostText');
    const ico = document.getElementById('ghostIcon');

    if (session.ghostMode) {
        if (btn) btn.className = 'text-[11px] font-bold px-2.5 py-1 rounded-xl border bg-slatebrand-900 border-slatebrand-900 text-goldaccent-400 flex items-center gap-1 transition';
        if (txt) txt.textContent = 'Ghost: On';
        if (ico) ico.textContent = '👻';
    } else {
        if (btn) btn.className = 'text-[11px] font-bold px-2.5 py-1 rounded-xl border bg-parchment-50 border-parchment-300 text-slatebrand-800 flex items-center gap-1 transition';
        if (txt) txt.textContent = 'Ghost: Off';
        if (ico) ico.textContent = '👁️';
    }
    resetTracingCanvas();
}

function loadCurrentTraceCard() {
    const total = session.isSinglePractice ? 1 : (session.activeLevel && session.activeLevel.letterIds ? session.activeLevel.letterIds.length : 1);
    const letter = getCurrentLetterObj();
    if (!letter) return;

    const titleEl = document.getElementById('lessonHeaderTitle');
    if (titleEl) {
        titleEl.textContent = session.isSinglePractice
            ? session.activeLevel.title
            : `Level ${session.activeLevel.levelNum} • ${session.activeLevel.title}`;
    }
    const counterEl = document.getElementById('lessonStepCounter');
    if (counterEl) counterEl.textContent = `${session.stepIdx + 1} / ${total}`;

    const progressEl = document.getElementById('lessonProgressBar');
    if (progressEl) progressEl.style.width = `${Math.round(((session.stepIdx + 1) / total) * 100)}%`;

    const glyphEl = document.getElementById('cardLimbuGlyph');
    const glyphSvg = getGlyphSvgPath(letter);
    if (glyphEl) {
        if (glyphSvg) {
            glyphEl.innerHTML = `<svg viewBox="0 0 ${glyphSvg.width} ${glyphSvg.height}" class="w-9 h-9 fill-slate-800 inline-block"><path d="${glyphSvg.d}" /></svg>`;
        } else {
            glyphEl.textContent = letter.char;
        }
    }

    // Top Equivalence Header (Matras for Level 14, Chuk-sak for Level 15)
    const matraBar = document.getElementById('traceMatraRelationBar');
    const matraNepali = document.getElementById('matraNepaliText');
    const matraLimbu = document.getElementById('matraLimbuText');
    const isChuk = letter.id && (letter.id.startsWith('c_') || letter.category === 'Chuk-sak Half Letter');

    if (isChuk) {
        if (matraBar) matraBar.classList.remove('hidden');
        if (matraNepali) {
            matraNepali.textContent = `${letter.fullLetter || ''} (${letter.fullDeva || ''}) ➔ ${letter.char} (${letter.deva || ''})`;
        }
        if (matraLimbu) {
            matraLimbu.textContent = `चुक्-साक् (${letter.matraName || letter.latin})`;
        }
    } else if (letter.nepaliMatra || letter.limbuMatra) {
        if (matraBar) matraBar.classList.remove('hidden');
        const nepaliVowelMap = {
            'm_aa': 'आ', 'm_i': 'इ', 'm_u': 'उ', 'm_e': 'ए',
            'm_ai': 'ऐ', 'm_o': 'ओ', 'm_au': 'औ', 'm_ae': 'ए़'
        };
        const vowelHint = nepaliVowelMap[letter.id] || letter.deva || '';
        if (matraNepali) {
            matraNepali.textContent = vowelHint ? `${letter.nepaliMatra || ''} (${vowelHint})` : (letter.nepaliMatra || '');
        }
        if (matraLimbu) matraLimbu.textContent = letter.limbuMatra || '';
    } else {
        if (matraBar) matraBar.classList.add('hidden');
    }

    const latinEl = document.getElementById('cardLatinSound');
    if (latinEl) latinEl.textContent = letter.latin;

    const devaEl = document.getElementById('cardDevaSound');
    if (devaEl) devaEl.textContent = letter.deva;

    const hintEl = document.getElementById('cardPhoneticHint');
    if (hintEl) {
        if (isChuk) {
            hintEl.textContent = `Chuk-sak • 8 Half Letters (${letter.matraName || letter.latin})`;
        } else if (letter.nepaliMatra) {
            hintEl.textContent = `Saknam • 8 Matras (${letter.matraName || letter.latin})`;
        } else {
            hintEl.textContent = `Row ${letter.row || 1} • ${letter.category || 'Consonant'}`;
        }
    }

    const chartBtn = document.getElementById('traceChukChartToggleBtn');
    if (chartBtn) {
        if (isChuk) {
            chartBtn.classList.remove('hidden');
            chartBtn.classList.add('inline-flex');
        } else {
            chartBtn.classList.add('hidden');
            chartBtn.classList.remove('inline-flex');
            const chartBox = document.getElementById('traceChukChartBox');
            if (chartBox) chartBox.classList.add('hidden');
        }
    }

    const emojiEl = document.getElementById('cardPictureEmoji');
    if (emojiEl) emojiEl.textContent = letter.emoji || '✦';

    const anchorLimbuEl = document.getElementById('cardAnchorLimbu');
    if (anchorLimbuEl) anchorLimbuEl.textContent = letter.wordLimbu || letter.char;

    const anchorLatinEl = document.getElementById('cardAnchorLatin');
    if (anchorLatinEl) anchorLatinEl.textContent = letter.wordLatin || letter.latin;

    const anchorMeaningEl = document.getElementById('cardAnchorMeaning');
    if (anchorMeaningEl) {
        anchorMeaningEl.textContent = letter.matraName ? `Limbu: ${letter.matraName}` : (letter.meaning || '');
    }

    setTimeout(() => {
        initTracingBuffers();
    }, 25);
}

function advanceTraceStep() {
    if (!session.stepPassed) return;

    const currentLetter = getCurrentLetterObj();
    if (currentLetter && !progress.masteredChars.includes(currentLetter.id)) {
        progress.masteredChars.push(currentLetter.id);
    }
    session.stepAccuracies.push(session.currentAccuracy);
    saveProgress();

    if (session.isSinglePractice) {
        playTone(523.25, 'success');
        showToast(`Practiced ${currentLetter.latin} (${currentLetter.char})!`, '✓');
        closeLessonModal();
        return;
    }

    const total = session.activeLevel.letterIds.length;
    if (session.stepIdx < total - 1) {
        playTone(587.33, 'note');
        session.stepIdx++;
        loadCurrentTraceCard();
    } else {
        const avgAcc = session.stepAccuracies.reduce((a, b) => a + b, 0) / Math.max(1, session.stepAccuracies.length);
        const stars = avgAcc >= 85 ? 3 : (avgAcc >= 72 ? 2 : 1);
        completeLevelWithStars(stars, 40, `Average tracing accuracy: ${Math.round(avgAcc)}%`);
    }
}

function startSingleLetterPractice(item) {
    session.activeLevel = {
        type: 'trace',
        title: `${item.latin} (${item.deva}) Practice`,
        singleItem: item
    };
    session.isSinglePractice = true;
    session.stepIdx = 0;
    session.stepAccuracies = [];

    const chartModal = document.getElementById('chartModal');
    if (chartModal) chartModal.classList.add('hidden');

    const modal = document.getElementById('lessonModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.setProperty('display', 'flex', 'important');
    }
    showLessonWorkspace('tracingWorkspace');
    loadCurrentTraceCard();
}

function toggleTraceChukChart() {
    const box = document.getElementById('traceChukChartBox');
    if (!box) return;
    box.classList.toggle('hidden');
}
if (typeof window !== 'undefined') window.toggleTraceChukChart = toggleTraceChukChart;
