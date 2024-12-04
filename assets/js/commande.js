document.addEventListener('DOMContentLoaded', function () {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    document.querySelectorAll('.product').forEach(product => {
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
            const name = product.querySelector('h3').textContent;
            const price = parseFloat(product.querySelector('.price').textContent.replace('€', '').trim());

            const existingItemIndex = cart.findIndex(item => item.name === name);

            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity += quantity;
            } else {
                cart.push({ name, price, quantity });
            }

            updateCart();
            quantity = 1;
            quantitySpan.textContent = quantity;
            alert(`${quantity} ${name}(s) ajouté(s) au panier !`);
        });
    });

    // Mise à jour du nombre d'articles dans l'icône du panier
    function updateCartIcon() {
        const cartIcon = document.querySelector('nav figure:last-child figcaption');
        if (cartIcon) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartIcon.textContent = `Panier (${totalItems})`;
        }
    }

    // Appel initial pour mettre à jour l'icône du panier
    updateCartIcon();

    // Mettre à jour l'icône du panier chaque fois que le panier est modifié
    const originalUpdateCart = updateCart;
    updateCart = function () {
        originalUpdateCart();
        updateCartIcon();
    };
});
