/* Girlfriend's Day 2026 photo-booth surprise.
 * Extracted verbatim from index.html (was lines 1317-1809). Pairs with css/gfs-2026.css.
 *
 * Loaded BEFORE the page's inline script so its top-level function declarations
 * (notably maybeShowGfsSurprise) are global by the time showMainContent() runs
 * on DOMContentLoaded. Its own listener bindings need the DOM, so this tag must
 * sit at the end of <body>, not in <head>.
 */
// ==================== GIRLFRIEND'S DAY 2026 SURPRISE ====================
const GFS_STORAGE_KEY = 'gfsDay2026Seen';
// Each frame holds one or two photos. `aside` renders on its own line in the
// handwriting font, so parentheticals never orphan a stray "(" on a wrapped line.
const GFS_PHOTOS = [
    {
        srcs: ['images/gfs-day-2026/cute.jpeg', 'images/gfs-day-2026/special.jpeg'],
        caption: "A special day for the most special woman in my life",
        aside: ""
    },
    {
        srcs: ['images/gfs-day-2026/pagupit.jpeg'],
        caption: "An awaited moment haha",
        aside: "sinamahan moko sa mumurahing barbershop and not Bruno's :P"
    },
    {
        srcs: ['images/gfs-day-2026/love.jpeg'],
        caption: "BUT you loved it.. look oh ang cute natin",
        aside: "I miss you!"
    },
    {
        srcs: ['images/gfs-day-2026/kiss.jpeg'],
        caption: "Kiniss mo pa nga ako jejeje",
        aside: ""
    },
    {
        srcs: ['images/gfs-day-2026/from-beanbean.jpeg'],
        caption: "Happy Girlfriend's Day to you my love.. -From this cute guy",
        aside: "Kinikilig ako pag inii-screenshot mo ako hihi"
    },
];

const GFS_LETTER = [
    { text: "Hi love..", type: 'greeting' },
    { text: "I know this is a bit overdue, and I apologize. I was working on this website and it needed some fixing ehh hehe..", type: 'body' },
    { text: "But just because I don't say anything or don't always show it doesn't mean you're not special to me. Rather, I wanted to do something different — something that would make you see just how special you are to me.", type: 'body' },
    { text: "You are my source of strength, my sunshine, and my motivation to work harder and keep pushing myself so I can build our future together.", type: 'body' },
    { text: "It may be late, but you already know my lines haha. You, Elieza Marie, are special to me, and every day is your day.", type: 'body' },
    { text: "Mahal na mahal kita. ❤️", type: 'finale' },
];

const GFS_LETTER_CLASSES = {
    greeting: 'font-handwriting text-3xl md:text-4xl text-rose-500 mb-6',
    body: 'font-sans text-base md:text-lg text-charcoal-700 leading-relaxed mb-4',
    finale: 'font-handwriting text-4xl md:text-5xl text-rose-500 text-center mt-8',
};

const GFS_TYPE_SPEED = { greeting: 55, body: 22, finale: 95 };

let gfsFrameIndex = 0;
let gfsTypeTimer = null;
let gfsLetterTimers = [];
let gfsLetterDone = false;

// ---------- Sound (synthesized, no audio files needed) ----------
let gfsAudioCtx = null;
let gfsMuted = false;
let gfsPrevMusicVolume = null;

function gfsAudio() {
    if (gfsMuted) return null;
    try {
        if (!gfsAudioCtx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return null;
            gfsAudioCtx = new AC();
        }
        if (gfsAudioCtx.state === 'suspended') gfsAudioCtx.resume();
        return gfsAudioCtx;
    } catch (e) {
        return null;
    }
}

function gfsNoise(ctx, seconds) {
    const len = Math.max(1, Math.floor(ctx.sampleRate * seconds));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
}

// Mechanical whirr + stepper buzz while the paper feeds out
function playGfsPrintSound(duration = 1.9) {
    const ctx = gfsAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    const src = ctx.createBufferSource();
    src.buffer = gfsNoise(ctx, duration);

    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 1250;
    band.Q.value = 0.9;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 0.10);
    gain.gain.setValueAtTime(0.045, now + duration - 0.30);
    gain.gain.linearRampToValueAtTime(0.0001, now + duration);

    // Stepper-motor pulsing on top of the noise bed
    const lfo = ctx.createOscillator();
    lfo.type = 'square';
    lfo.frequency.value = 46;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.022;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    src.connect(band);
    band.connect(gain);
    gain.connect(ctx.destination);

    src.start(now);
    lfo.start(now);
    src.stop(now + duration);
    lfo.stop(now + duration);
}

// Short key-strike click for the typewriter
function playGfsTick(volume = 0.06) {
    const ctx = gfsAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    const src = ctx.createBufferSource();
    src.buffer = gfsNoise(ctx, 0.022);

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1800;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

    src.connect(hp);
    hp.connect(gain);
    gain.connect(ctx.destination);
    src.start(now);
    src.stop(now + 0.03);
}

// Carriage-return bell when the letter finishes
function playGfsBell() {
    const ctx = gfsAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    [1320, 1980].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const gain = ctx.createGain();
        const peak = i === 0 ? 0.10 : 0.04;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(peak, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.5);
    });
}

function duckGfsMusic(duck) {
    const bg = document.getElementById('background-music');
    if (!bg) return;
    if (duck) {
        if (gfsPrevMusicVolume === null) gfsPrevMusicVolume = bg.volume;
        bg.volume = Math.min(bg.volume, 0.18);
    } else if (gfsPrevMusicVolume !== null) {
        bg.volume = gfsPrevMusicVolume;
        gfsPrevMusicVolume = null;
    }
}

function toggleGfsMute() {
    gfsMuted = !gfsMuted;
    document.getElementById('gfs-mute-icon').textContent = gfsMuted ? '🔇' : '🔊';
    duckGfsMusic(!gfsMuted);
}

function maybeShowGfsSurprise() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('resetSurprise')) {
        localStorage.removeItem(GFS_STORAGE_KEY);
    }
    if (localStorage.getItem(GFS_STORAGE_KEY) === 'true') return;

    // Only auto-open while Girlfriend's Day 2026 is the active occasion.
    // Without this the envelope would still ambush her in 2027.
    const active = window.MK_ACTIVE_OCCASION;
    if (!active || active.id !== 'gfs-2026' || !active.autoPopup) return;

    const dimOverlay = document.getElementById('gfs-dim-overlay');
    const teaser = document.getElementById('gfs-envelope-teaser');
    if (!dimOverlay || !teaser) return;

    setTimeout(() => {
        dimOverlay.classList.remove('hidden');
        dimOverlay.classList.add('flex');
        requestAnimationFrame(() => {
            dimOverlay.classList.remove('opacity-0');
            dimOverlay.classList.add('opacity-100');
        });

        setTimeout(() => {
            teaser.classList.remove('hidden');
            teaser.classList.add('flex');
        }, 700);
    }, 900);
}

function openGfsSurprise() {
    localStorage.setItem(GFS_STORAGE_KEY, 'true');

    document.getElementById('gfs-envelope-teaser').classList.add('hidden');
    document.getElementById('gfs-dim-overlay').classList.add('hidden');

    const modal = document.getElementById('gfs-surprise-modal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Reset to the film strip in case this is a replay from "Special Surprises"
    document.getElementById('gfs-strip-stage').classList.remove('hidden');
    document.getElementById('gfs-letter-stage').classList.add('hidden');
    document.getElementById('gfs-skip-typing').classList.remove('hidden');
    gfsLetterDone = false;

    duckGfsMusic(true);

    gfsFrameIndex = 0;
    renderGfsFrame();
}

function renderGfsFrame() {
    const frameData = GFS_PHOTOS[gfsFrameIndex];
    const slot = document.getElementById('gfs-photo-slot');
    const photoWrap = document.getElementById('gfs-photo-wrap');
    const printHead = document.getElementById('gfs-print-head');
    const frame = document.getElementById('gfs-strip-frame');
    const captionEl = document.getElementById('gfs-frame-caption');
    const asideEl = document.getElementById('gfs-frame-aside');
    const counter = document.getElementById('gfs-frame-counter');
    const hint = document.getElementById('gfs-strip-hint');

    // Build this frame's photo(s) — a frame can hold one or two side by side
    slot.innerHTML = '';
    frameData.srcs.forEach(src => {
        const cell = document.createElement('div');
        cell.className = 'relative overflow-hidden rounded-sm flex-1 min-w-0';
        const img = document.createElement('img');
        img.src = src;
        img.alt = frameData.caption;
        img.className = 'w-full aspect-[3/4] object-cover bg-charcoal-800';
        cell.appendChild(img);
        slot.appendChild(cell);
    });

    // Restart the "paper feeding out of the printer" animation
    photoWrap.classList.remove('gfs-printing');
    printHead.classList.remove('gfs-print-head');
    frame.classList.remove('gfs-feed-jitter');
    void photoWrap.offsetWidth;

    photoWrap.classList.add('gfs-printing');
    printHead.classList.add('gfs-print-head');
    frame.classList.add('gfs-feed-jitter');
    playGfsPrintSound(1.9);

    counter.textContent = `${gfsFrameIndex + 1} / ${GFS_PHOTOS.length}`;

    clearInterval(gfsTypeTimer);
    clearTimeout(gfsTypeTimer);
    captionEl.textContent = '';
    asideEl.textContent = '';

    // Once printing finishes: start the slow drift, then type the caption
    gfsTypeTimer = setTimeout(() => {
        slot.querySelectorAll('img').forEach(img => img.classList.add('gfs-kenburns'));

        let i = 0;
        gfsTypeTimer = setInterval(() => {
            captionEl.textContent = frameData.caption.slice(0, i + 1);
            if (i % 2 === 0) playGfsTick(0.05);
            i++;
            if (i >= frameData.caption.length) {
                clearInterval(gfsTypeTimer);
                if (frameData.aside) {
                    asideEl.textContent = `( ${frameData.aside} )`;
                    asideEl.classList.add('animate-fade-in-up');
                    setTimeout(() => asideEl.classList.remove('animate-fade-in-up'), 900);
                }
            }
        }, 26);
    }, 1900);

    document.getElementById('gfs-prev').style.visibility = gfsFrameIndex === 0 ? 'hidden' : 'visible';
    hint.textContent = gfsFrameIndex === GFS_PHOTOS.length - 1
        ? 'tap → to read your letter 💌'
        : 'tap the arrows or swipe to continue';
}

function gfsNextFrame() {
    if (gfsFrameIndex < GFS_PHOTOS.length - 1) {
        gfsFrameIndex++;
        renderGfsFrame();
    } else {
        showGfsLetter();
    }
}

function gfsPrevFrame() {
    if (gfsFrameIndex > 0) {
        gfsFrameIndex--;
        renderGfsFrame();
    }
}

function showGfsLetter() {
    document.getElementById('gfs-strip-stage').classList.add('hidden');
    document.getElementById('gfs-letter-stage').classList.remove('hidden');
    typeGfsLetter();
}

function clearGfsLetterTimers() {
    gfsLetterTimers.forEach(t => { clearTimeout(t); clearInterval(t); });
    gfsLetterTimers = [];
}

function buildGfsLetterParagraphs() {
    const body = document.getElementById('gfs-letter-body');
    body.innerHTML = '';
    return GFS_LETTER.map(line => {
        const p = document.createElement('p');
        p.className = GFS_LETTER_CLASSES[line.type];
        body.appendChild(p);
        return p;
    });
}

function typeGfsLetter() {
    clearGfsLetterTimers();
    gfsLetterDone = false;

    const paragraphs = buildGfsLetterParagraphs();
    const signature = document.getElementById('gfs-letter-signature');
    signature.classList.add('opacity-0');
    signature.classList.remove('opacity-60');

    const cursor = document.createElement('span');
    cursor.className = 'gfs-cursor';
    cursor.innerHTML = '&nbsp;';

    let lineIndex = 0;

    function typeLine() {
        if (lineIndex >= GFS_LETTER.length) {
            cursor.remove();
            gfsLetterDone = true;
            playGfsBell();
            signature.classList.remove('opacity-0');
            signature.classList.add('opacity-60');
            document.getElementById('gfs-skip-typing').classList.add('hidden');
            return;
        }

        const line = GFS_LETTER[lineIndex];
        const el = paragraphs[lineIndex];
        const speed = GFS_TYPE_SPEED[line.type];
        el.appendChild(cursor);

        let charIndex = 0;
        const timer = setInterval(() => {
            charIndex++;
            el.textContent = line.text.slice(0, charIndex);
            el.appendChild(cursor);
            if (line.text[charIndex - 1] !== ' ') {
                playGfsTick(line.type === 'finale' ? 0.075 : 0.05);
            }
            // Keep the newest text in view as the letter grows
            el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

            if (charIndex >= line.text.length) {
                clearInterval(timer);
                lineIndex++;
                const pause = setTimeout(typeLine, line.type === 'finale' ? 0 : 550);
                gfsLetterTimers.push(pause);
            }
        }, speed);
        gfsLetterTimers.push(timer);
    }

    typeLine();
}

function revealWholeGfsLetter() {
    if (gfsLetterDone) return;
    clearGfsLetterTimers();

    const body = document.getElementById('gfs-letter-body');
    body.innerHTML = '';
    GFS_LETTER.forEach(line => {
        const p = document.createElement('p');
        p.className = GFS_LETTER_CLASSES[line.type];
        p.textContent = line.text;
        body.appendChild(p);
    });

    const signature = document.getElementById('gfs-letter-signature');
    signature.classList.remove('opacity-0');
    signature.classList.add('opacity-60');
    document.getElementById('gfs-skip-typing').classList.add('hidden');
    gfsLetterDone = true;
    playGfsBell();
}

function closeGfsSurprise() {
    spawnGfsHearts();
    clearInterval(gfsTypeTimer);
    clearTimeout(gfsTypeTimer);
    clearGfsLetterTimers();

    setTimeout(() => {
        document.getElementById('gfs-surprise-modal').classList.add('hidden');
        document.body.style.overflow = '';
        duckGfsMusic(false);

        // Reset stages so replaying from "Special Surprises" starts clean
        document.getElementById('gfs-strip-stage').classList.remove('hidden');
        document.getElementById('gfs-letter-stage').classList.add('hidden');
        document.getElementById('gfs-letter-body').innerHTML = '';
        document.getElementById('gfs-photo-slot').innerHTML = '';
        document.getElementById('gfs-skip-typing').classList.remove('hidden');
        gfsLetterDone = false;
    }, 900);
}

function spawnGfsHearts() {
    const layer = document.getElementById('gfs-hearts-layer');
    const hearts = ['💕', '💖', '✨', '💗'];
    for (let i = 0; i < 12; i++) {
        const el = document.createElement('span');
        el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        el.className = 'gfs-heart-rise absolute text-2xl';
        el.style.left = `${10 + Math.random() * 80}%`;
        el.style.bottom = '10%';
        el.style.animationDelay = `${Math.random() * 0.6}s`;
        layer.appendChild(el);
        setTimeout(() => el.remove(), 4200);
    }
}

(function initGfsSwipe() {
    const stage = document.getElementById('gfs-strip-frame');
    if (!stage) return;
    let touchStartX = 0;
    stage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    stage.addEventListener('touchend', (e) => {
        const delta = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(delta) < 40) return;
        if (delta < 0) gfsNextFrame(); else gfsPrevFrame();
    }, { passive: true });
})();

document.getElementById('gfs-open-envelope')?.addEventListener('click', openGfsSurprise);
document.getElementById('gfs-next')?.addEventListener('click', gfsNextFrame);
document.getElementById('gfs-prev')?.addEventListener('click', gfsPrevFrame);
document.getElementById('gfs-close')?.addEventListener('click', closeGfsSurprise);
document.getElementById('gfs-skip-typing')?.addEventListener('click', revealWholeGfsLetter);
document.getElementById('gfs-mute')?.addEventListener('click', toggleGfsMute);
// Replay is wired by renderArchive() in index.html, which builds the "Special
// Surprises" card from the occasion registry and dispatches via runOccasionAction().
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('gfs-surprise-modal');
    if (!modal || modal.classList.contains('hidden')) return;

    const onLetter = !document.getElementById('gfs-letter-stage').classList.contains('hidden');
    if (e.key === 'Escape') closeGfsSurprise();
    if (onLetter) {
        if (e.key === 'Enter' || e.key === ' ') revealWholeGfsLetter();
        return;
    }
    if (e.key === 'ArrowRight') gfsNextFrame();
    if (e.key === 'ArrowLeft') gfsPrevFrame();
});

// Dev helper: run resetGfsDaySurprise() in the browser console,
// or load the page with ?resetSurprise to force the popup again.
window.resetGfsDaySurprise = function() {
    localStorage.removeItem(GFS_STORAGE_KEY);
    console.log('GFS Day 2026 surprise reset. Reloading...');
    location.reload();
};
