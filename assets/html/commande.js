let cart = [];

document.addEventListener('DOMContentLoaded', function () {
    const products = document.querySelectorAll('.product');
    const cartContainer = document.createElement('div');
    cartContainer.className = 'cart-container';
    document.body.appendChild(cartContainer);

    updateCartDisplay();
    initializeCarousel();

    products.forEach(product => {
        const minusBtn = product.querySelector('.minus');
        const plusBtn = product.querySelector('.plus');
        const quantitySpan = product.querySelector('.quantity');
        const addToCartBtn = product.querySelector('.add-to-cart');

        let quantity = 1;

        minusBtn.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                quantitySpan.textContent = quantity;
            }
        });

        plusBtn.addEventListener('click', () => {
            quantity++;
            quantitySpan.textContent = quantity;
        });

        addToCartBtn.addEventListener('click', () => {
            const productName = product.querySelector('h3').textContent;
            const productPrice = parseFloat(product.querySelector('.price').textContent.replace('€', '').trim());
            addToCart(productName, productPrice, quantity);
            quantity = 1;
            quantitySpan.textContent = quantity;
        });
    });
});

function addToCart(name, price, quantity) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ name, price, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartContainer = document.querySelector('.cart-container');
    cartContainer.innerHTML = '<h2>Panier</h2>';

    if (cart.length === 0) {
        cartContainer.innerHTML += '<p>Votre panier est vide</p>';
    } else {
        const ul = document.createElement('ul');
        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} x${item.quantity} - ${(item.price * item.quantity).toFixed(2)} €`;
            ul.appendChild(li);
        });
        cartContainer.appendChild(ul);

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const totalElement = document.createElement('p');
        totalElement.textContent = `Total: ${total.toFixed(2)} €`;
        cartContainer.appendChild(totalElement);

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Vider le panier';
        clearButton.addEventListener('click', clearCart);
        cartContainer.appendChild(clearButton);

        const checkoutButton = document.createElement('button');
        checkoutButton.textContent = 'Passer à la caisse';
        checkoutButton.addEventListener('click', () => {
            window.location.href = '/assets/html/panier.html';
        });
        cartContainer.appendChild(checkoutButton);
    }
}

function clearCart() {
    cart = [];
    localStorage.removeItem('cart');
    updateCartDisplay();
}

function initializeCarousel() {
    const images = document.querySelectorAll('.carousel .hero-image');
    let currentIndex = 0;

    function showNextImage() {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    }

    setInterval(showNextImage, 5000); // Change image every 5 seconds
}

