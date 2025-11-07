/* ===== COOKIE CONSENT JS ===== */
(function () {
  const COOKIE_KEY = "cookie_consent_preferences";

  function getConsent() {
    try {
      return JSON.parse(localStorage.getItem(COOKIE_KEY)) || null;
    } catch (e) {
      return null;
    }
  }

  function setConsent(data) {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(data));
  }

  function hasConsent() {
    return !!getConsent();
  }

  function inject(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div.firstElementChild);
  }

  const bannerHTML = `
    <div id="cookie-banner">
      <h3>Controle sua privacidade</h3>
      <p>Este site utiliza cookies para personalizar e aprimorar a experiência.</p>
      <div class="buttons">
        <button id="btn-customizar">Customizar</button>
        <button id="btn-rejeitar">Rejeitar</button>
        <button id="btn-aceitar">Aceitar</button>
      </div>
      <div class="links">
        <a href="/privacidade" target="_blank">Aviso de Privacidade</a> |
        <a href="/termos" target="_blank">Termos de Uso</a>
      </div>
    </div>
  `;

  const modalHTML = `
    <div id="cookie-modal">
      <div class="modal-content">
        <h3>Preferências de Cookies</h3>
        <p>Selecione as categorias de cookies que deseja permitir:</p>
        <label><input type="checkbox" checked disabled> Necessários (sempre ativos)</label>
        <label><input id="ck-analytics" type="checkbox"> Analíticos (estatísticas)</label>
        <label><input id="ck-marketing" type="checkbox"> Marketing (anúncios personalizados)</label>
        <div style="display:flex; justify-content:space-between; margin-top:10px;">
          <button id="btn-cancelar">Cancelar</button>
          <button id="btn-salvar">Salvar</button>
        </div>
      </div>
    </div>
  `;

  function openModal() {
    inject(modalHTML);
    document.getElementById("btn-cancelar").onclick = () =>
      document.getElementById("cookie-modal").remove();
    document.getElementById("btn-salvar").onclick = () => {
      const consent = {
        necessary: true,
        analytics: document.getElementById("ck-analytics").checked,
        marketing: document.getElementById("ck-marketing").checked,
      };
      setConsent(consent);
      document.getElementById("cookie-modal").remove();
      const banner = document.getElementById("cookie-banner");
      if (banner) banner.remove();
      activateScripts();
    };
  }

  function activateScripts() {
    const consent = getConsent();
    if (!consent) return;

    // ✅ Google Analytics (somente se permitido)
    if (consent.analytics) {
      const s = document.createElement("script");
      s.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX";
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "G-XXXXXXX");
    }

    // ✅ Scripts de marketing (exemplo)
    if (consent.marketing) {
      console.log("Marketing scripts ativados");
      // aqui você pode carregar pixels ou SDKs de anúncios
    }
  }

  if (!hasConsent()) {
    window.addEventListener("load", () => {
      inject(bannerHTML);
      document.getElementById("btn-customizar").onclick = openModal;
      document.getElementById("btn-rejeitar").onclick = () => {
        setConsent({ necessary: true, analytics: false, marketing: false });
        document.getElementById("cookie-banner").remove();
      };
      document.getElementById("btn-aceitar").onclick = () => {
        setConsent({ necessary: true, analytics: true, marketing: true });
        document.getElementById("cookie-banner").remove();
        activateScripts();
      };
    });
  } else {
    activateScripts();
  }
})();
