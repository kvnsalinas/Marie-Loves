/* Occasion registry — the single source of truth for what the homepage features.
 *
 * The homepage reads this on every load and decides, purely from today's date:
 *   - which occasion owns the hero (title, subtitle, background photos)
 *   - which occasion gets the "featured" call-to-action band
 *   - which occasions have passed and become archive cards in "Special Surprises"
 *
 * TO ADD A NEW OCCASION (e.g. the 27th Monthsary) you do exactly two things:
 *   1. add an object to MK.occasions.list below
 *   2. create its page (copy an existing one) if `action.type === 'page'`
 * On its `start` date it takes over the hero by itself. On the day after `end`
 * it becomes an archive card by itself. No edit is needed on the day.
 *
 * DATES are plain 'YYYY-MM-DD' strings compared as strings against MK.today(),
 * which resolves "today" in Asia/Singapore. String comparison on zero-padded ISO
 * dates is exact and avoids the Date() parsing/UTC traps this repo already hit
 * (three different conventions existed across the old countdown code).
 */

window.MK = window.MK || {};

MK.today = function () {
    // 'en-CA' formats as YYYY-MM-DD, which is what we compare against.
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Singapore' }).format(new Date());
};

MK.param = function (name) {
    return new URLSearchParams(window.location.search).get(name);
};

MK.occasions = {};

MK.occasions.list = [
    {
        id: 'gfs-2026',
        label: "2026 Girlfriend's Day",
        start: '2026-08-01',
        end: '2026-08-08',
        hero: {
            kicker: "Happy Girlfriend's Day",
            title: 'Elieza Marie',
            subtitle: 'and every single day is your day',
            images: [
                { src: 'images/marie/web/marie01.jpg', position: 'center 30%' },
                { src: 'images/marie/web/marie05.jpg', position: 'center 30%' },
                { src: 'images/marie/web/marie07.jpg', position: 'center 30%' },
                { src: 'images/marie/web/marie09.jpg', position: 'center 30%' },
                { src: 'images/marie/web/marie12.jpg', position: 'center 30%' },
                { src: 'images/marie/web/marie13.jpg', position: 'center 30%' },
            ],
        },
        featured: {
            eyebrow: 'Today',
            blurb: 'I have something for you...',
            cta: 'Open your surprise 💌',
        },
        autoPopup: true,
        action: { type: 'modal', open: 'gfs2026' },
        card: { emoji: '📸', title: "2026 Girlfriend's Day", blurb: 'Your photo booth & letter' },
    },
    {
        id: 'anniversary-2',
        label: '2nd Anniversary',
        start: '2026-05-25',
        end: '2026-06-01',
        hero: {
            kicker: 'Happy 2nd Anniversary',
            title: 'Marie & Kevin',
            subtitle: '2 years of love, laughter, and endless memories',
            images: [
                { src: 'images/hero/hero1.jpg', position: 'center 50%' },
                { src: 'images/hero/hero2.jpg', position: 'center 25%' },
            ],
        },
        featured: { eyebrow: 'Today', blurb: 'Two years of us.', cta: 'Open our anniversary 💕' },
        action: { type: 'page', href: 'anniversary-2026.html' },
        card: { emoji: '💕', title: 'Our 2nd Anniversary', blurb: 'Two years, in one place' },
    },
    {
        id: 'monthsary-20',
        label: '20th Monthsary',
        start: '2026-01-25',
        end: '2026-01-27',
        action: { type: 'page', href: 'monthsary-20.html' },
        card: { emoji: '✨', title: '20th Surprise', blurb: 'Something special for you' },
    },
    {
        id: 'gfs-2025',
        label: "2025 Girlfriend's Day",
        start: '2025-08-01',
        end: '2025-08-03',
        action: { type: 'page', href: 'surprise.html' },
        card: { emoji: '👸', title: "2025 Girlfriend's Day", blurb: 'A special celebration' },
    },

    /* The monthsary is NOT listed here — it is generated. See below. */
];

/* ===================== MONTHSARY (generated, never hardcoded) =====================
 *
 * You got together 2024-05-25, so a monthsary falls on the 25th of every month.
 * Rather than adding an entry per month forever, the current one is computed from
 * today's date and injected into the list. On 2026-08-25 that is the 27th; the
 * month after it becomes the 28th on its own, and so on indefinitely.
 *
 * One shared page (monthsary.html) reads the same helper and renders whatever
 * number is current, so there is no monthsary-27.html / -28.html / -29.html sprawl.
 */
MK.START_DATE = '2024-05-25';
MK.MONTHSARY_DAY = 25;

/* How many whole months from START_DATE to the 25th of the given month. */
MK.monthsaryNumber = function (year, month /* 0-11 */) {
    var s = MK.START_DATE.split('-');
    return (year - parseInt(s[0], 10)) * 12 + (month - (parseInt(s[1], 10) - 1));
};

MK.ordinal = function (n) {
    var s = ['th', 'st', 'nd', 'rd'], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

/* Builds the monthsary occasion for whichever one is nearest `today`.
 * Celebrated on the 25th and the two days after, matching the other entries. */
MK.occasions.currentMonthsary = function (today) {
    today = today || MK.today();
    var p = today.split('-').map(Number);
    var y = p[0], m = p[1] - 1, d = p[2];

    // Before the 25th, the relevant monthsary is still this month's; after the
    // window closes, look ahead to next month so "Coming up" stays correct.
    if (d > MK.MONTHSARY_DAY + 2) { m += 1; if (m > 11) { m = 0; y += 1; } }

    var n = MK.monthsaryNumber(y, m);
    if (n < 1) return null;                       // before the relationship started

    var pad = function (x) { return (x < 10 ? '0' : '') + x; };
    var start = y + '-' + pad(m + 1) + '-' + pad(MK.MONTHSARY_DAY);
    var endD = new Date(Date.UTC(y, m, MK.MONTHSARY_DAY + 2));
    var end = endD.getUTCFullYear() + '-' + pad(endD.getUTCMonth() + 1) + '-' + pad(endD.getUTCDate());
    var label = MK.ordinal(n) + ' Monthsary';

    return {
        id: 'monthsary-' + n,
        label: label,
        start: start,
        end: end,
        generated: true,
        hero: {
            kicker: 'Happy ' + label,
            title: 'Marie & Kevin',
            subtitle: n + ' months of you and me',
            images: [
                { src: 'images/hero/hero1.jpg', position: 'center 50%' },
                { src: 'images/hero/hero2.jpg', position: 'center 25%' },
            ],
        },
        featured: { eyebrow: 'Today', blurb: n + ' months with you.', cta: 'Open it 💐' },
        action: { type: 'page', href: 'monthsary.html' },
        card: { emoji: '💐', title: label, blurb: n + ' months of us' },
    };
};

/* The list the rest of the site sees: the fixed entries plus the live monthsary.
 *
 * The monthsary is suppressed whenever a hand-written occasion already covers the
 * same day. Anniversaries land on the 25th too (May 25), and without this the
 * generated "24th Monthsary" would outrank the 2nd Anniversary and hide it. A
 * hand-written entry always wins over the generated one. */
MK.occasions.resolved = function (today) {
    var m = MK.occasions.currentMonthsary(today);
    if (!m) return MK.occasions.list.slice();

    var overlaps = MK.occasions.list.some(function (o) {
        return o.start <= m.end && m.start <= o.end;   // date ranges intersect
    });
    return overlaps ? MK.occasions.list.slice() : MK.occasions.list.concat([m]);
};

/* Shown whenever no occasion is active, so the site never looks broken
 * in the gaps between celebrations. */
MK.occasions.fallback = {
    hero: {
        kicker: 'For my Elieza',
        title: 'Marie & Kevin',
        subtitle: 'every ordinary day with you',
        images: [
            { src: 'images/hero/hero1.jpg', position: 'center 50%' },
            { src: 'images/hero/hero2.jpg', position: 'center 25%' },
        ],
    },
};

MK.occasions.statusOf = function (o, today) {
    today = today || MK.today();
    if (today < o.start) return 'upcoming';
    if (today > o.end) return 'past';
    return 'active';
};

/* If windows ever overlap, the latest-starting one wins — deterministic. */
MK.occasions.getActive = function (today) {
    today = today || MK.today();
    return MK.occasions.resolved(today)
        .filter(function (o) { return MK.occasions.statusOf(o, today) === 'active'; })
        .sort(function (a, b) { return a.start < b.start ? -1 : 1; })
        .pop() || null;
};

MK.occasions.getPast = function (today) {
    today = today || MK.today();
    return MK.occasions.resolved(today)
        .filter(function (o) { return MK.occasions.statusOf(o, today) === 'past'; })
        .sort(function (a, b) { return a.start < b.start ? 1 : -1; });   // newest first
};

MK.occasions.getUpcoming = function (today) {
    today = today || MK.today();
    return MK.occasions.resolved(today)
        .filter(function (o) { return MK.occasions.statusOf(o, today) === 'upcoming'; })
        .sort(function (a, b) { return a.start < b.start ? -1 : 1; });   // soonest first
};

MK.occasions.byId = function (id, today) {
    return MK.occasions.resolved(today).filter(function (o) { return o.id === id; })[0] || null;
};

/* Console helper: preview what the homepage shows on any set of dates.
 * Usage:  MK.preview('2026-08-15', '2026-08-25', '2026-09-25')  */
MK.preview = function () {
    var dates = Array.prototype.slice.call(arguments);
    if (!dates.length) dates = [MK.today()];
    dates.forEach(function (d) {
        var a = MK.occasions.getActive(d);
        var up = MK.occasions.getUpcoming(d)[0];
        console.log(d + '  hero: ' + (a ? a.hero.kicker : 'For my Elieza (fallback)')
            + '  |  next: ' + (up ? up.label : '-')
            + '  |  archive: ' + MK.occasions.getPast(d).map(function (o) { return o.id; }).join(', '));
    });
};
