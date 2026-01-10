document.addEventListener("DOMContentLoaded", function () {
  // MENU HAMBURGUER
  const toggleBtn = document.getElementById("menu-toggle");
  const menuList = document.getElementById("menu-list");
  const iconOpen = document.getElementById("icon-open");
  const iconClose = document.getElementById("icon-close");

  toggleBtn.addEventListener("click", function () {
    menuList.classList.toggle("ativo");
    const ativo = menuList.classList.contains("ativo");
    iconOpen.style.display = ativo ? "none" : "inline";
    iconClose.style.display = ativo ? "inline" : "none";
  });

  // FECHA MENU AO CLICAR EM UM LINK
  const links = menuList.querySelectorAll("a");
  links.forEach(link => {
    link.addEventListener("click", () => {
      menuList.classList.remove("ativo");
      iconOpen.style.display = "inline";
      iconClose.style.display = "none";
    });
  });

  // BOTÃO VOLTAR AO TOPO
  const btnTopo = document.getElementById("voltar-topo");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      btnTopo.style.display = "block";
    } else {
      btnTopo.style.display = "none";
    }
  });

  btnTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// MODAIS LEGAIS
function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}
