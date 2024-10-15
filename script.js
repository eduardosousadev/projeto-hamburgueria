// ------------------------------VARIÁVEIS------------------------------
const dateSpan = document.getElementById('date-span');
const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const modalTitle = document.getElementById('modal-title');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');
const itensWarnSpan = document.getElementById('itens-warn');
let cart = [];
let numberOfItens = 0;
let newItem = '';

// ------------------------------FUNÇÕES------------------------------
// Função para verificar a hora e manipular o card do horário
const restaurantIsOpen = () => {
    const data = new Date();
    const hora = data.getHours();
    return (hora >= 17 && hora <= 23);
    // return !(hora >= 17 && hora <= 23);
};

// Função para verificar se o restaurante está fechado
const restaurantIsClosed = () => {
    if(!restaurantIsOpen()) {
        Toastify({
            text: "O restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "#ef4444",
            },
            onClick: function(){}
        }).showToast();
    };
};

// Função para verificar se o carrinho está vazio
const checkCartIsEmpty = () => {
    if(cart.length === 0) {
        modalTitle.innerHTML = 'Seu carrinho está vazio!';
        modalTitle.classList.add('text-red-500');
    } else {
        modalTitle.classList.remove('text-red-500');
        modalTitle.innerHTML = 'Seu carrinho';
    };
}

// Função para adicionar erro de endereço
const addErrorAddress = () => {
    addressWarn.innerHTML = 'Digite seu endereço completo!';
    addressInput.classList.add('border-red-500');
};

// Função para remover o erro de endereço
const removeErrorAddress = () => {
    addressWarn.innerHTML = '';
    addressInput.classList.remove('border-red-500');
};

// Função para adicionar erro de carrinho vazio
const addErrorCartIsEmpty = () => {
    itensWarnSpan.innerHTML = 'Adicione itens ao carrinho!';
}

// Função para adicionar item ao carrinho
const addToCart = (name, price) => {
    newItem = name;
    
    const hasItem = cart.find(item => item.name === name);

    if(hasItem) {
        hasItem.quantity++;
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        });
    };

    updateCartModal();
};

// Função para remover item do carrinho
const removeItemCart = (name) => {
    const index = cart.findIndex(item => item.name === name);
    if(index !== -1) {
        const item = cart[index];
        if(item.quantity > 1) {
            item.quantity--;
            updateCartModal();
            return;
        } else {
            cart.splice(index, 1);
            updateCartModal();
        }
    };
};

// Função para limpar carrinho
const cleanCart = () => {
    cart.length = 0;
    updateCartModal();
    addressInput.value = '';
    cartModal.style.display = 'none';
    cartModal.classList.add('hidden');
    cartCounter.textContent = cart.length;
};

// Função para atualizar o carrinho
const updateCartModal = () => {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('flex', 'justify-between', 'items-center', 'mb-2', 'bg-zinc-200', 'p-2', 'rounded', 'hover:bg-zinc-300');

        cartItemElement.innerHTML = `
            <div class="flex items-center gap-[4px] md:gap-2">
                <button class="remove-item-btn bg-red-500 text-white 2xs:text-[8px] xs:text-[12px] md:text-[14px] 2xs:rounded-full 2sm:rounded px-2 py-1 hover:bg-red-900 duration-500" data-name="${item.name}">
                    ${(window.innerWidth < 425) ? document.querySelector('button').value = "X" : document.querySelector('button').value = "Remover"}
                </button>

                <p class="text-[12px] md:text-[14px]">${item.name}</p>
            </div>

            <div class="md:w-[140px] flex md:gap-5 gap-[4px] md:justify-between items-end">
                <p class="text-[12px] md:text-[14px]">Qtd: ${item.quantity}</p>
                
                <p class="text-[12px] md:text-[14px]">R$${item.price.toFixed(2)}</p>
            </div>
        `
        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
    });
    cartTotal.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    cartCounter.innerHTML = `${cart.length} ${cart.length < 2 ? `item` : `itens`}`;
};

restaurantIsOpen() ? dateSpan.classList.add('bg-green-600') : dateSpan.classList.add('bg-red-600');


// ------------------------------EVENTOS------------------------------
// Evento para abrir modal
cartBtn.addEventListener('click', () => {
    checkCartIsEmpty();

    if(!restaurantIsOpen()) {
        restaurantIsClosed();
        return;
    };
    updateCartModal();
    cartModal.style.display = 'flex';
});

// Evento para fechar o modal pelo botão de fechar
closeModalBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
    removeErrorAddress();
    itensWarnSpan.innerHTML = '';
});

// Evento para fechar o modal se clicar fora
cartModal.addEventListener('click', (event) => {
    checkCartIsEmpty();

    if (event.target === cartModal) {
        cartModal.style.display = 'none';
        removeErrorAddress();
        itensWarnSpan.innerHTML = '';
    };
});

// Evento para adicionar item ao carrinho
menu.addEventListener('click', (event) => {
    if(!restaurantIsOpen()) {
        restaurantIsClosed();
        return;
    };
    let parentButton = event.target.closest('.add-to-cart-btn');
    if(parentButton) {
        const name = parentButton.getAttribute('data-name');
        const price = +parentButton.getAttribute('data-price');

        // Adicionar no carrinho
        addToCart(name, price);
    };
});

// Evento para remover item do carrinho
cartItemsContainer.addEventListener('click', (event) => {
    if(event.target.classList.contains('remove-item-btn')) {
        const name = event.target.getAttribute('data-name');
        removeItemCart(name);
    };
});

// Evento para remover o erro do endereço
addressInput.addEventListener('click', () => {
    removeErrorAddress();
    itensWarnSpan.innerHTML = '';
});

// Evento para monitorar o input de endereço
addressInput.addEventListener('input', (event) => {
    let inputValue = event.target.value;

    if(inputValue !== '') removeErrorAddress();
});

// Evento para finalizar o pedido
checkoutBtn.addEventListener('click', () => {
    checkCartIsEmpty();

    if(cart.length === 0 && addressInput.value === '') {
        addErrorAddress();
        addErrorCartIsEmpty();
        return;
    };

    if(cart.length === 0) {
        addErrorCartIsEmpty();
        return;
    };

    if(addressInput.value === '') {
        addErrorAddress();
        return;
    };

    // Enviar o pedido para API do whatsapp
    const itens = cart.map(item => {
        return (
            `- ${item.name} | Quantidade: (${item.quantity}) | Preço: R$${item.price.toFixed(2)}`
        );
    }).join('\n');
    
    const message = 'Olá, gostaria de fazer o pedido:\n\n' + itens + '\n\nO meu endereço é ' + addressInput.value + '.';
    const phoneNumber = '5585999999999';
    const order = encodeURIComponent(message);

    window.open(`https://wa.me/${phoneNumber}?text=${order}`);

    cleanCart();
});

