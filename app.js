// Número de WhatsApp (formato internacional sin +)
const WHATSAPP_NUMBER = "5492262629001";

// Productos mínimos para carrito (podés ampliar)
const products = [
    { id: "remera-oversize", name: "Remera Oversize Negra", price: 15000 },
    { id: "remera-estampada", name: "Remera Estampada Street", price: 17500 },
    { id: "buzo-hoodie-fucsia", name: "Buzo Hoodie Fucsia", price: 28000 },
    { id: "zapatillas-chunky", name: "Zapatillas Chunky Fucsia", price: 39000 },
    { id: "jogger-cargo", name: "Jogger Cargo Beige", price: 29900 },
    { id: "zapatillas-blancas", name: "Zapatillas Blancas Minimal", price: 42000 },
];

let cart = [];

function formatCurrency(value) {
    return "$ " + value.toLocaleString("es-AR");
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    renderCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

function clearCart() {
    cart = [];
    renderCart();
}

function renderCart() {
    const itemsEl = document.getElementById("cartItems");
    const emptyEl = document.getElementById("cartEmpty");
    const totalEl = document.getElementById("cartTotal");
    const countEl = document.getElementById("cartCount");
    const bubbleEl = document.getElementById("cartCountBubble");

    if (!itemsEl || !emptyEl || !totalEl || !countEl || !bubbleEl) return;

    itemsEl.innerHTML = "";

    if (cart.length === 0) {
        emptyEl.style.display = "block";
        totalEl.textContent = "$ 0";
        countEl.textContent = "0";
        bubbleEl.textContent = "0";
        return;
    }

    emptyEl.style.display = "none";

    let total = 0;
    let count = 0;

    cart.forEach(item => {
        const li = document.createElement("li");
        li.classList.add("cart-item");

        const left = document.createElement("div");
        left.classList.add("cart-item-info");

        const title = document.createElement("span");
        title.classList.add("cart-item-title");
        title.textContent = item.name;

        const meta = document.createElement("span");
        meta.classList.add("cart-item-meta");
        const subtotal = item.price * item.qty;
        meta.textContent = `x${item.qty} · ${formatCurrency(item.price)} = ${formatCurrency(subtotal)}`;

        left.appendChild(title);
        left.appendChild(meta);

        const btnRemove = document.createElement("button");
        btnRemove.classList.add("cart-item-remove");
        btnRemove.textContent = "Eliminar";
        btnRemove.addEventListener("click", () => removeFromCart(item.id));

        li.appendChild(left);
        li.appendChild(btnRemove);

        itemsEl.appendChild(li);

        total += subtotal;
        count += item.qty;
    });

    totalEl.textContent = formatCurrency(total);
    countEl.textContent = count.toString();
    bubbleEl.textContent = count.toString();
}

function buildWhatsAppMessage() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío. Agregá productos antes de finalizar el pedido.");
        return null;
    }

    let msg = "Hola, quiero hacer este pedido desde la tienda de ropa:\n\n";
    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        msg += `• ${item.name} (x${item.qty}) - ${formatCurrency(subtotal)}\n`;
    });

    const total = cart.reduce((acc, it) => acc + it.price * it.qty, 0);
    msg += `\nTotal estimado: ${formatCurrency(total)}\n`;
    msg += "Envío a coordinar según mi ubicación. Gracias.";

    return msg;
}

function sendWhatsAppOrder() {
    const message = buildWhatsAppMessage();
    if (!message) return;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}

/* NAV responsive */
function setupMenu() {
    const toggle = document.getElementById("menuToggle");
    const navOverlay = document.getElementById("navOverlay");
    const nav = document.getElementById("mainNav");
    if (!toggle || !navOverlay || !nav) return;

    function openMenu() {
        document.body.classList.add("menu-open");
    }

    function closeMenu() {
        document.body.classList.remove("menu-open");
    }

    toggle.addEventListener("click", () => {
        if (document.body.classList.contains("menu-open")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navOverlay.addEventListener("click", closeMenu);

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => closeMenu());
    });
}

/* Carrito flotante */
function setupCartPanel() {
    const cartBtn = document.getElementById("cartFloatingBtn");
    const cartPanel = document.getElementById("cartPanel");
    const cartBackdrop = document.getElementById("cartBackdrop");
    const cartCloseBtn = document.getElementById("cartCloseBtn");
    if (!cartBtn || !cartPanel || !cartBackdrop || !cartCloseBtn) return;

    function openCart() {
        document.body.classList.add("cart-open");
        cartPanel.setAttribute("aria-hidden", "false");
    }

    function closeCart() {
        document.body.classList.remove("cart-open");
        cartPanel.setAttribute("aria-hidden", "true");
    }

    cartBtn.addEventListener("click", openCart);
    cartBackdrop.addEventListener("click", closeCart);
    cartCloseBtn.addEventListener("click", closeCart);
}

/* Carruseles: scroll left/right */
function setupCarousels() {
    document.querySelectorAll(".carousel").forEach(carousel => {
        const track = carousel.querySelector(".carousel-track");
        if (!track) return;

        const leftBtn = carousel.querySelector(".carousel-arrow.left");
        const rightBtn = carousel.querySelector(".carousel-arrow.right");

        // Creamos botón right si no está
        if (!rightBtn) {
            const newRight = document.createElement("button");
            newRight.className = "carousel-arrow right";
            newRight.dataset.dir = "next";
            newRight.textContent = "›";
            carousel.appendChild(newRight);
        }

        const finalRightBtn = carousel.querySelector(".carousel-arrow.right");

        function scrollByDir(dir) {
            const card = track.querySelector(".card");
            const amount = card ? card.offsetWidth + 16 : 250;
            track.scrollBy({
                left: dir === "next" ? amount : -amount,
                behavior: "smooth"
            });
        }

        if (leftBtn) {
            leftBtn.addEventListener("click", () => scrollByDir("prev"));
        }
        if (finalRightBtn) {
            finalRightBtn.addEventListener("click", () => scrollByDir("next"));
        }
    });
}

/* Marcar algunos botones "Agregar al carrito" (opcional) */
function attachCartButtons() {
    // Ejemplo: tomamos algunas tarjetas por data-product-id que podés agregar a mano luego
    document.querySelectorAll("[data-product-id]").forEach(btn => {
        const id = btn.getAttribute("data-product-id");
        btn.addEventListener("click", () => addToCart(id));
    });
}

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
    setupMenu();
    setupCartPanel();
    setupCarousels();
    attachCartButtons();
    renderCart();
});
