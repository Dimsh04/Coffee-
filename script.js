// Сайт розроблено студентом Пригорницький Дмитро, група 4-11

const menuItems = [
    { id: 1, name: "Еспресо (Double)", price: 55, img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400" },
    { id: 2, name: "Капучино", price: 75, img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400" },
    { id: 3, name: "Лате-мак'ято", price: 85, img: "latte.jpg" },
    { id: 4, name: "Американо", price: 60, img: "americano.webp" },
    { id: 5, name: "Тірамісу", price: 125, img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400" },
    { id: 6, name: "Чорний Шоколад", price: 80, img: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400" }
];

// Перемикання сторінок (SPA)
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + pageId);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
    }
}

// Ініціалізація меню
function initMenu() {
    const container = document.getElementById('menu-container');
    if (!container) return;
    container.innerHTML = '';
    menuItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item card';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.price} грн</p>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                <input type="number" id="qty-${item.id}" class="qty-input" value="0" readonly>
                <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            </div>`;
        container.appendChild(div);
    });
}

// Зміна кількості в головному меню
function changeQty(id, delta) {
    const input = document.getElementById('qty-' + id);
    let val = parseInt(input.value) + delta;
    if (val < 0) val = 0;
    input.value = val;
    updateBar();
}

// Оновлення нижньої плашки замовлення
function updateBar() {
    let total = 0;
    menuItems.forEach(item => {
        const input = document.getElementById('qty-' + item.id);
        if(input) total += parseInt(input.value) * item.price;
    });
    document.getElementById('total-price-bar').innerText = total;
    document.getElementById('checkout-bar').classList.toggle('hidden', total === 0);
}

// Показ цифрового чека
function showCheckoutConfirmation() {
    const list = document.getElementById('cart-items-list');
    list.innerHTML = '';
    let total = 0;
    let hasItems = false;
    
    menuItems.forEach(item => {
        const qty = parseInt(document.getElementById('qty-' + item.id).value) || 0;
        if (qty > 0) {
            hasItems = true;
            total += qty * item.price;
            list.innerHTML += `
                <div class="cart-item">
                    <span class="cart-item-name">${item.name}</span>
                    <div class="cart-qty-control">
                        <button class="cart-qty-btn" onclick="changeQtyInCart(${item.id}, -1)">-</button>
                        <span>${qty}</span>
                        <button class="cart-qty-btn" onclick="changeQtyInCart(${item.id}, 1)">+</button>
                    </div>
                    <span class="cart-item-price">${qty * item.price} грн</span>
                </div>`;
        }
    });
    
    document.getElementById('modal-total-price').innerText = total;
    if (!hasItems) {
        list.innerHTML = '<p style="text-align:center; padding:20px; color:#999;">Кошик порожній</p>';
        setTimeout(closeModal, 1000);
    }
    
    document.getElementById('modal-stage-cart').classList.remove('hidden');
    document.getElementById('modal-stage-status').classList.add('hidden');
    document.getElementById('order-modal').classList.remove('hidden');
}

// Зміна кількості ПРЯМО В ЧЕКУ
function changeQtyInCart(id, delta) {
    changeQty(id, delta);
    showCheckoutConfirmation();
}

function closeModal() { document.getElementById('order-modal').classList.add('hidden'); }

// Підтвердження та імітація процесу готування
function placeOrder() {
    document.getElementById('modal-stage-cart').classList.add('hidden');
    document.getElementById('modal-stage-status').classList.remove('hidden');
    document.getElementById('order-id').innerText = '#' + Math.floor(1000 + Math.random() * 9000);
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        document.getElementById('progress-bar').style.width = progress + '%';
        
        const icon = document.getElementById('status-icon');
        const text = document.getElementById('status-text');

        if (progress === 20) { icon.innerText = '⏳'; text.innerText = 'Замовлення прийнято...'; }
        if (progress === 60) { icon.innerText = '☕'; text.innerText = 'Бариста готує каву...'; }
        if (progress === 100) { 
            icon.innerText = '✅'; text.innerText = 'Готово! Можна забирати Там.'; 
            clearInterval(interval);
            setTimeout(() => {
                document.querySelectorAll('.qty-input').forEach(i => i.value = 0);
                updateBar();
                closeModal();
            }, 3000);
        }
    }, 1000);
}

// Запуск
initMenu();