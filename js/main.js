// =========================
// main.js — Funcionalidades
// =========================

// Menu Elements
const menuToggleBtn = document.getElementById("menu-toggle");
const menuList = document.getElementById("menu-list");

// Voltar ao topo
const backToTopBtn = document.getElementById("voltar-topo");

// Promoções
const publicPromoSection = document.getElementById("secao-promocoes-publica");
const urlParams = new URLSearchParams(window.location.search);
const isAdminMode = urlParams.get("admin") === "true";
const promoForm = document.getElementById("formPromocao");
const adminPromoList = document.getElementById("listaPromocoes");

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initBackToTop();
  initModals();
  initPromoAdmin();
  renderPublicPromotions();
});

// =========================
// MENU RESPONSIVO
// =========================
function initMenu() {
  if (!menuToggleBtn || !menuList) return;

  menuToggleBtn.addEventListener("click", () => {
    menuList.classList.toggle("show");
    menuToggleBtn.innerHTML = menuList.classList.contains("show")
      ? "&times;"
      : "&#9776;";
  });

  // Fecha menu ao clicar em links (mobile)
  document.querySelectorAll("#menu-list a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        menuList.classList.remove("show");
        menuToggleBtn.innerHTML = "&#9776;";
      }
    });
  });

  // Remove menu aberto ao redimensionar para desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      menuList.classList.remove("show");
      menuToggleBtn.innerHTML = "&#9776;";
    }
  });
}

// =========================
// VOLTAR AO TOPO
// =========================
function initBackToTop() {
  if (!backToTopBtn) return;
  window.addEventListener("scroll", () => {
    backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// =========================
// MODAIS
// =========================
function initModals() {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.add("hidden");
        document.body.style.overflow = "auto";
      }
    });
  });
}

window.openModal = function (id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

window.closeModal = function (id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
};

// =========================
// ADMIN PROMOÇÕES
// =========================
function initPromoAdmin() {
  if (!isAdminMode || !promoForm || !adminPromoList) return;

  document.getElementById("adminArea").classList.remove("hidden");
  promoForm.addEventListener("submit", handlePromoFormSubmit);
  renderAdminPromotions();
}

function handlePromoFormSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("titulo").value.trim();
  const price = document.getElementById("preco").value.trim();
  const description = document.getElementById("descricao").value.trim();
  const imageInput = document.getElementById("imagem");
  const file = imageInput.files[0];

  if (!title || !price) {
    showToast("Preencha título e preço!", "erro");
    return;
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      savePromotion({ title, price, description, image: reader.result });
      promoForm.reset();
      renderAdminPromotions();
      renderPublicPromotions();
      showToast("Promoção adicionada!", "sucesso");
    };
    reader.readAsDataURL(file);
  } else {
    savePromotion({ title, price, description, image: "" });
    promoForm.reset();
    renderAdminPromotions();
    renderPublicPromotions();
    showToast("Promoção adicionada!", "sucesso");
  }
}

// =========================
// LOCALSTORAGE HELPERS
// =========================
function getStoredPromotions() {
  return JSON.parse(localStorage.getItem("promocoes") || "[]");
}

function savePromotions(promos) {
  localStorage.setItem("promocoes", JSON.stringify(promos));
}

function savePromotion(promo) {
  const list = getStoredPromotions();
  list.push({ id: Date.now(), ...promo });
  savePromotions(list);
}

// =========================
// RENDER ADMIN PROMOÇÕES
// =========================
function renderAdminPromotions() {
  const promos = getStoredPromotions();
  adminPromoList.innerHTML = "";

  if (promos.length === 0) {
    adminPromoList.innerHTML = "<p>Nenhuma promoção cadastrada.</p>";
    return;
  }

  promos.forEach((promo) => {
    const div = document.createElement("div");
    div.className = "promo-card";
    div.innerHTML = `
      <h3>${promo.title}</h3>
      <p>R$ ${promo.price}</p>
      <p>${promo.description}</p>
      ${promo.image ? `<img src="${promo.image}" alt="Promoção: ${promo.title}">` : ""}
      <button class="btn-excluir" onclick="deletePromo(${promo.id})">🗑 Excluir</button>
    `;
    adminPromoList.appendChild(div);
  });
}

window.deletePromo = function (id) {
  if (!confirm("Deseja excluir esta promoção?")) return;
  const filtered = getStoredPromotions().filter((p) => p.id !== id);
  savePromotions(filtered);
  renderAdminPromotions();
  renderPublicPromotions();
  showToast("Promoção excluída!", "sucesso");
};

// =========================
// RENDER PUBLIC PROMOÇÕES
// =========================
function renderPublicPromotions() {
  if (!publicPromoSection) return;

  const promos = getStoredPromotions();
  publicPromoSection.innerHTML = "";

  if (promos.length === 0) {
    publicPromoSection.innerHTML = "<p>Nenhuma promoção disponível.</p>";
    return;
  }

  promos.forEach((promo) => {
    const card = document.createElement("div");
    card.className = "card-cardapio";
    card.innerHTML = `
      ${promo.image ? `<img src="${promo.image}" alt="Promoção: ${promo.title}">` : ""}
      <h3>${promo.title}</h3>
      <p>R$ ${promo.price}</p>
      <p>${promo.description}</p>
    `;
    publicPromoSection.appendChild(card);
  });
}

// =========================
// TOASTS (Notificações)
// =========================
function showToast(message, type = "sucesso") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", "status");
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3500);
}
