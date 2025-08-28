<!-- auth.js -->
<script>
(function () {
  const KEY = 'app.session';
  const DEFAULT_TTL_MIN = 480; // 8h

  function now() { return Date.now(); }
  function minutes(n) { return n * 60 * 1000; }

  // Lê sessão do storage
  function getSession() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      if (!s || !s.token || !s.exp) return null;
      if (now() > s.exp) { localStorage.removeItem(KEY); return null; }
      return s;
    } catch { return null; }
  }

  // Salva sessão com expiração (minutos)
  function setSession({ user, token, ttlMin = DEFAULT_TTL_MIN }) {
    const exp = now() + minutes(ttlMin);
    localStorage.setItem(KEY, JSON.stringify({ user, token, exp }));
  }

  // Apaga sessão
  function clearSession() {
    localStorage.removeItem(KEY);
  }

  // Exposto globalmente
  window.Auth = {
    isLoggedIn: () => !!getSession(),
    getUser: () => (getSession() || {}).user || null,
    loginOk: (user, token, ttlMin) => setSession({ user, token, ttlMin }),
    logout: () => { clearSession(); location.replace('index.html'); },

    // Protege páginas: se não logado, redireciona pro index (login)
    protect: () => {
      const s = getSession();
      if (!s) {
        // Evita "flash" do conteúdo
        document.documentElement.classList.add('preauth');
        location.replace('index.html?next=' + encodeURIComponent(location.pathname + location.search));
      } else {
        document.documentElement.classList.remove('preauth');
      }
    }
  };
})();
</script>
