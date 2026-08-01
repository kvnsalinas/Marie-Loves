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

    /* ---------------------------------------------------------------------
     * NEXT UP — 27th Monthsary, Aug 25 2026 (May 25 2024 + 27 months).
     * Uncomment once monthsary-27.html exists and it takes over on its own.
     *
     * {
     *     id: 'monthsary-27',
     *     label: '27th Monthsary',
     *     start: '2026-08-25',
     *     end:   '2026-08-27',
     *     hero: {
     *         kicker: 'Happy 27th Monthsary',
     *         title:  'Marie & Kevin',
     *         subtitle: '27 months of you and me',
     *         images: [ { src: 'images/hero/hero1.jpg', position: 'center 50%' } ],
     *     },
     *     featured: { eyebrow: 'Today', blurb: '27 months with you.', cta: 'Open it 💐' },
     *     action: { type: 'page', href: 'monthsary-27.html' },
     *     card: { emoji: '💐', title: '27th Monthsary', blurb: '27 months of us' },
     * },
     * ------------------------------------------------------------------- */
];

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
    return MK.occasions.list
        .filter(function (o) { return MK.occasions.statusOf(o, today) === 'active'; })
        .sort(function (a, b) { return a.start < b.start ? -1 : 1; })
        .pop() || null;
};

MK.occasions.getPast = function (today) {
    today = today || MK.today();
    return MK.occasions.list
        .filter(function (o) { return MK.occasions.statusOf(o, today) === 'past'; })
        .sort(function (a, b) { return a.start < b.start ? 1 : -1; });   // newest first
};

MK.occasions.getUpcoming = function (today) {
    today = today || MK.today();
    return MK.occasions.list
        .filter(function (o) { return MK.occasions.statusOf(o, today) === 'upcoming'; })
        .sort(function (a, b) { return a.start < b.start ? -1 : 1; });   // soonest first
};

MK.occasions.byId = function (id) {
    return MK.occasions.list.filter(function (o) { return o.id === id; })[0] || null;
};
