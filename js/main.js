// ======================================
// MENU MOBILE - SIMPLES E CONFIÁVEL
// ======================================

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const menuMobile = document.getElementById("menuMobile");

  // Segurança: garante que os elementos existem
  if (!menuToggle || !menuMobile) {
    console.error("Menu mobile: elementos não encontrados no DOM");
    return;
  }

  // Abrir / fechar menu
  menuToggle.addEventListener("click", () => {
    menuMobile.classList.toggle("active");
    document.body.style.overflow =
      menuMobile.classList.contains("active") ? "hidden" : "";
  });

  // Fechar menu ao clicar em qualquer link
  menuMobile.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menuMobile.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
});
