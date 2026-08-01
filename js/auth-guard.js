/* Shared guard for secondary pages (anniversary-2026.html, monthsary-27.html, ...).
 *
 * index.html owns the actual login form. Secondary pages only need to require an
 * existing session, so they include this one file instead of duplicating the gate.
 * Previously surprise.html / monthsary-20.html / anniversary.html had NO protection
 * at all — anyone with the URL saw everything.
 *
 * Usage — two lines in <head>, before any content renders:
 *     <script src="js/auth-guard.js"></script>
 *
 * Note this is the same strength as the existing gate: client-side only. It keeps
 * casual visitors out, it is not real access control.
 */
(function () {
    var ok = localStorage.getItem('marie-kevin-logged-in') === 'true'
          || sessionStorage.getItem('marie-kevin-logged-in') === 'true';

    if (ok) {
        // Honour the same 30-day expiry index.html uses.
        var t = parseInt(localStorage.getItem('marie-kevin-login-time'), 10);
        if (t && (Date.now() - t) / 86400000 >= 30) ok = false;
    }

    if (!ok) {
        window.location.replace('index.html');   // send them to the front door
    }
})();
