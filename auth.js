// Chave usada no localStorage pelo login:
const AUTH_KEY = 'auth:session'; // ajuste se usar outro nome

const Auth = {
  // Detecta o base path ("/", ou "/repo/", ex: "/appFrotaQA/")
  base() {
    const segs = location.pathname.split('/').filter(Boolean);
    // Em GitHub Pages de projeto, o primeiro segmento é o nome do repositório
    // Ex.: /appFrotaQA/telaPrincipal.html -> base = "/appFrotaQA/"
    return segs.length ? `/${segs[0]}/` : '/';
  },

  isLogged() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (!raw) return false;
      const s = JSON.parse(raw);
      // Regras mínimas: token/string e (opcional) validade
      if (!s || (!s.token && !s.user)) return false;
      if (s.expiresAt && Date.now() > Number(s.expiresAt)) return false;
      return true;
    } catch {
      return false;
    }
  },

  // Protege página: se não logado, manda para index (login)
  protect() {
    if (!this.isLogged()) {
      const url = this.base() + 'index.html'; // sua página de login
      // usa replace para evitar voltar com "voltar"
      location.replace(url);
      return false;
    }
    // remove o "preauth" se você estiver ocultando o body até validar
    document.documentElement.classList.remove('preauth');
    return true;
  },

  // Faz logout e volta para o login
  logout() {
    localStorage.removeItem(AUTH_KEY);
    location.replace(this.base() + 'index.html');
  }
};

window.Auth = Auth;
