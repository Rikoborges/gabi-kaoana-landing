// =========================
// main.js — Script principal
// =========================

// ---- ELEMENTOS GERAIS ----
const menuToggleBtn = document.getElementById("menu-toggle");
const menuList = document.getElementById("menu-list");
const backToTopBtn = document.getElementById("voltar-topo");
const publicPromoSection = document.getElementById("secao-promocoes-publica");

const urlParams = new URLSearchParams(window.location.search);
const isAdminMode = urlParams.get("admin") === "true";

// Elementos do admin (se existirem)
const promoForm = document.getElementById("formPromocao");
const adminPromoList = document.getElementById("listaPromocoes");

// ---- INICIALIZAÇÃO ----
document.addEventListener("DOMContentLoaded", () => {
  initMenuLateral();
  initBackToTop();
  initModals();
  initPromoAdmin();
  renderPublicPromotions();
});

// =========================
// MENU LATERAL (Mobile)
// =========================
function initMenuLateral() {
  menuToggleBtn.addEventListener("click", () => {
    menuList.classList.toggle("show");
    menuToggleBtn.innerHTML = menuList.classList.contains("show") ? "&times;" : "&#9776;";
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      menuList.classList.remove("show");
      menuToggleBtn.innerHTML = "&#9776;";
    }
  });
}

function closeSlideMenu() {
  menuList.classList.remove("show");
  menuToggleBtn.innerHTML = "&#9776;";
}

window.closeSlideMenu = closeSlideMenu;

// =========================
// BOTÃO VOLTAR AO TOPO
// =========================
function initBackToTop() {
  window.addEventListener("scroll", () => {
    backToTopBtn.style.display = window.scrollY > 350 ? "block" : "none";
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// =========================
// MODAIS (Políticas)
// =========================
function initModals() {
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

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.add("hidden");
        document.body.style.overflow = "auto";
      }
    });
  });
}

// =========================
// MODO ADMIN - PROMOÇÕES
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

function createPromoObject({ title, price, description, image }) {
  return { id: Date.now(), title, price, description, image };
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
  list.push(createPromoObject(promo));
  savePromotions(list);
}

// =========================
// ADMIN — RENDER PROMOÇÕES
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
      <div class="promo-info">
        <h3>${promo.title}</h3>
        <p><strong>R$</strong> ${promo.price}</p>
        <p>${promo.description}</p>
      </div>
      ${promo.image ? `<img src="${promo.image}" alt="Foto da promoção: ${promo.title}">` : ""}
      <button class="btn-excluir" onclick="deletePromo(${promo.id})">🗑 Excluir</button>
    `;
    adminPromoList.appendChild(div);
  });
}

window.deletePromo = function (id) {
  if (!confirm("Tem certeza que deseja excluir esta promoção?")) return;
  const filtered = getStoredPromotions().filter((p) => p.id !== id);
  savePromotions(filtered);
  renderAdminPromotions();
  renderPublicPromotions();
  showToast("Promoção excluída!", "sucesso");
};

// =========================
// PÚBLICO — RENDER PROMOÇÕES
// =========================
function renderPublicPromotions() {
  if (!publicPromoSection) return;

  const promos = getStoredPromotions();
  publicPromoSection.innerHTML = "";

  if (promos.length === 0) {
    publicPromoSection.innerHTML = "<p>Nenhuma promoção disponível no momento.</p>";
    return;
  }

  promos.forEach((promo) => {
    const card = document.createElement("div");
    card.className = "card-cardapio";
    card.innerHTML = `
      ${promo.image ? `<img src="${promo.image}" alt="Foto da promoção: ${promo.title}">` : ""}
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

  setTimeout(() => {
    toast.remove();
  }, 3500);
}
