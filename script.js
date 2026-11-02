/* ===========================================================
   CONFIGURAÇÃO — edite apenas este bloco
   =========================================================== */
const CONFIG = {
  // Plataforma do vídeo: "youtube" ou "vimeo"
  videoProvider: "youtube",
  // ID do vídeo (ex.: youtube.com/watch?v=XXXXXXXXXXX -> "XXXXXXXXXXX")
  videoId: "",
  // Link do checkout (Hotmart, Kiwify, Eduzz, etc.)
  checkoutUrl: "https://pay.exemplo.com/seu-produto",
  // Segundos até liberar o botão e o restante da página (momento do pitch no vídeo).
  // Use 0 para mostrar tudo imediatamente.
  revealAfterSeconds: 0,
  // Minutos do contador da oferta
  countdownMinutes: 15,
};

/* ===========================================================
   Não precisa mexer daqui pra baixo
   =========================================================== */
(function () {
  const video = document.getElementById("video");
  const playBtn = document.getElementById("playBtn");
  const delayedEls = document.querySelectorAll(".delayed");
  const REVEAL_KEY = "metodofiel_revealed";

  function embedUrl() {
    if (!CONFIG.videoId) return null;
    if (CONFIG.videoProvider === "vimeo") {
      return `https://player.vimeo.com/video/${CONFIG.videoId}?autoplay=1&title=0&byline=0&portrait=0`;
    }
    return `https://www.youtube-nocookie.com/embed/${CONFIG.videoId}?autoplay=1&rel=0&modestbranding=1&controls=0&playsinline=1`;
  }

  function reveal() {
    delayedEls.forEach((el) => el.classList.add("show"));
    try { localStorage.setItem(REVEAL_KEY, "1"); } catch (e) {}
  }

  let revealTimer = null;
  function scheduleReveal() {
    if (revealTimer !== null) return;
    revealTimer = setTimeout(reveal, Math.max(0, CONFIG.revealAfterSeconds) * 1000);
  }

  // Quem já viu o pitch antes vê tudo direto
  let alreadyRevealed = false;
  try { alreadyRevealed = localStorage.getItem(REVEAL_KEY) === "1"; } catch (e) {}
  if (alreadyRevealed || CONFIG.revealAfterSeconds <= 0) reveal();

  playBtn.addEventListener("click", function () {
    const url = embedUrl();
    if (url) {
      video.innerHTML = `<iframe src="${url}" title="Vídeo de apresentação" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    } else {
      playBtn.querySelector(".play-text").textContent = "Configure o vídeo em script.js (CONFIG.videoId)";
    }
    scheduleReveal();
  });

  // Links de checkout
  document.querySelectorAll(".js-checkout").forEach((a) => {
    a.href = CONFIG.checkoutUrl;
    a.target = "_blank";
    a.rel = "noopener";
  });

  // Contador
  const countdownEl = document.getElementById("countdown");
  let remaining = CONFIG.countdownMinutes * 60;
  function tick() {
    const m = String(Math.floor(remaining / 60)).padStart(2, "0");
    const s = String(remaining % 60).padStart(2, "0");
    countdownEl.textContent = `${m}:${s}`;
    if (remaining > 0) remaining--;
  }
  tick();
  setInterval(tick, 1000);

  document.getElementById("year").textContent = new Date().getFullYear();
})();
