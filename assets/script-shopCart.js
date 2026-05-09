import * as api from "./script-api.js";

// checkbox object 
class checkBox {
    constructor(title) {
        this.title = title;
    }

    render() {
        const checkBox = document.createElement('div');
        const checkIcon = document.createElement('div');

        checkIcon.innerHTML = `<div class='icon-container'><i class='fa-solid fa-check'></i></div>`;
        checkBox.appendChild(checkIcon);

        // if checkbox has title then set title 
        if (this.title) {
            const checkTitle = document.createElement('div');
            checkTitle.innerHTML = `<p class='title'>${this.title}</p>`;
            checkBox.appendChild(checkTitle);
            checkTitle.setAttribute('class', 'check-title');
        }

        // set the class names
        checkIcon.setAttribute('class', 'check-icon');
        checkBox.setAttribute('class', `check-box ${this.title?.toLowerCase().replace(" ", "-")}`);

        return checkBox;
    }
}

// quantity counter object
class orderQuantityCounter {
    constructor(quantity, onChange) {
        this.quantity = quantity;
        this.onChange = onChange;
    }

    incrementor() {
        this.quantity += 1;
        this.onChange?.(this.quantity);
    }

    decrementor() {
        if (this.quantity > 0) this.quantity -= 1;
        this.onChange?.(this.quantity);
    }

    render() {
        const counter = document.createElement('div');
        const leftBtn = document.createElement('button');
        const rightBtn = document.createElement('button');
        const quantity = document.createElement('div');

        leftBtn.onclick = () => {
            this.decrementor();
            quantity.textContent = this.quantity;
            counter.dataset.quantity = this.quantity;
        };

        rightBtn.onclick = () => {
            this.incrementor();
            quantity.textContent = this.quantity;
            counter.dataset.quantity = this.quantity;
        };

        quantity.innerHTML = `<p class='quantity'>${this.quantity}</p>`;
        leftBtn.textContent = "-";
        rightBtn.textContent = "+";

        counter.setAttribute('class', "qtyCntr-container");
        rightBtn.setAttribute('class', "qtyCntr-leftBtn qtyCntr-btn");
        leftBtn.setAttribute('class', 'qtyCntr-rightBtn qtyCntr-btn');
        quantity.setAttribute('class', 'qtyCntr-content');

        counter.append(leftBtn, quantity, rightBtn);
        return counter;
    }
}

// this is the product object display in cart
class orderContent {
    constructor(prodVariantId, prodImage, prodName, prodDescription, prodQuantity, prodCurrPrice, prodPrevPrice) {
        this.prodVariantId = prodVariantId;
        this.prodImage = prodImage;
        this.prodName = prodName;
        this.prodDescription = prodDescription;
        this.prodCurrPrice = prodCurrPrice;
        this.prodPrevPrice = prodPrevPrice;
        this.prodQuantity = prodQuantity;
    }

    render() {
        const contentContainer = document.createElement('div');
        const contImage = document.createElement('div');
        const contDetails = document.createElement('div');
        const contQuantity = document.createElement('div');
        const contPrice = document.createElement('div');

        // image creating
        const chkBox = new checkBox();
        contImage.innerHTML = `<div class='image-container'><img src='${this.prodImage}'/></div>`
        contImage.appendChild(chkBox.render());

        // details creating
        contDetails.innerHTML = `
            <div class='product-detail'>
                <p class='product-name'>${this.prodName}</p>
                <p class='product-description'>${this.prodDescription}</p>
            </div>
            <div class='content-controllers'>
                <div class='controller-container'>
                    <i class='favorite content-controller fa-solid fa-heart'></i>
                    <i class='delete content-controller fa-solid fa-trash'></i>
                    <i class='share content-controller fa-solid fa-share'></i>
                </div>
            </div>`;

        // price creating
        let currentTotal = this.prodCurrPrice * this.prodQuantity;
        let prevTotal = this.prodPrevPrice * this.prodQuantity;

        // setting color function
        const applyPriceColor = (qty) => {
            currentPriceEl.classList.remove('green', 'red');

            if (qty > 0 && this.prodPrevPrice > 0) {
                if (this.prodCurrPrice < this.prodPrevPrice) {
                    currentPriceEl.classList.add('green');
                } else if (this.prodCurrPrice > this.prodPrevPrice) {
                    currentPriceEl.classList.add('red');
                }
            }
        };

        // price updator at product quantity change
        const updatePrice = async (qty) => {
            currentTotal = this.prodCurrPrice * qty;
            prevTotal = this.prodPrevPrice * qty;

            // setting the content price
            currentPriceEl.textContent = (qty > 0 ? currentTotal : 0) + "RF";
            prevPriceEl.textContent = ((this.prodPrevPrice > 0 && qty > 0) ? prevTotal + "RF" : "");

            await api.updateCart(this.prodVariantId, parseInt(qty));

            // dataset updating
            contentContainer.dataset.currprice = currentTotal ? currentTotal : 0;
            contentContainer.dataset.prevprice = prevTotal ? prevTotal : 0;
            console.log(currentTotal, prevTotal);

            // setting the price color
            applyPriceColor(qty);

            const cartData = await api.fetchCart();

            // setting the total price
            updateTotalValue(cartData);
        };

        // creating the price content container
        const currentPriceEl = document.createElement('div');
        const prevPriceEl = document.createElement('div');
        const priceContainer = document.createElement('div');

        // setting the price content class
        currentPriceEl.className = `current-price ${(this.prodCurrPrice > this.prodPrevPrice && this.prodPrevPrice > 0) ? "red" : (this.prodPrevPrice > 0) ? "green" : ""}`;
        prevPriceEl.className = "previous-price";
        priceContainer.className = "price-container";

        // setting the price content
        currentPriceEl.textContent = currentTotal.toLocaleString() + "RF";
        prevPriceEl.textContent = (this.prodPrevPrice > 0 ? prevTotal.toLocaleString() : 0) + "RF";

        priceContainer.appendChild(currentPriceEl);
        if (prevPriceEl && prevPriceEl > 0) priceContainer.appendChild(prevPriceEl);
        contPrice.appendChild(priceContainer);

        // quantity creating
        const counter = new orderQuantityCounter(this.prodQuantity, updatePrice);
        contQuantity.appendChild(counter.render());

        contentContainer.append(contImage, contDetails, contQuantity, contPrice);

        contentContainer.dataset.currprice = parseFloat(currentPriceEl.textContent);
        contentContainer.dataset.prevprice = parseFloat(prevPriceEl.textContent);
        contentContainer.dataset.variantid = this.prodVariantId;

        contentContainer.setAttribute('class', 'content');
        contImage.setAttribute('class', 'content-image');
        contDetails.setAttribute('class', 'content-details');
        contQuantity.setAttribute('class', 'content-quantity');
        contPrice.setAttribute('class', 'content-price');

        return contentContainer;
    }
}

// checkbox managing function
function checkBoxManager() {
    document.addEventListener('click', event => {
        event.stopPropagation();
        const checkButton = event.target.closest('.check-box');

        if (checkButton) {
            checkButton.classList.toggle('checked');
            if (checkButton.classList.contains('select-all')) {
                const contents = document.querySelectorAll('.cart-body .content-container .content');

                // checking all the products check boxes
                contents.forEach(content => {
                    content.querySelector('.content-image .check-box').classList.toggle('checked');
                    content.querySelector('.content-image .check-box .check-icon .icon-container').classList.toggle('checked');
                })
                console.log('select all clicked')
            };

            // the icon container visualisation
            const iconContainer = checkButton.querySelector('.check-icon .icon-container');
            iconContainer.classList.toggle('checked');

            // setting the checked data
            if (!checkButton.dataset.checked) checkButton.dataset.checked = true;
            else checkButton.dataset.checked = false;
        }
    })
}

// appending the checkbox in the structure
function shoppingCartLayout(orderList) {
    // header content elements
    const checker = new checkBox("SELECT ALL");
    const contentHeader = document.querySelector('.cartContent-container .cart-header');
    contentHeader.appendChild(checker.render());

    // body content elements
    // const products = await fetchData(url, 'products.json');
    const contentBody = document.querySelector('.cartContent-container .cart-body');
    const contentContainer = document.createElement('div');
    contentContainer.setAttribute('class', 'content-container');
    contentBody.appendChild(contentContainer);

    // appending product data to cart
    orderList.forEach(item => {
        if (!item) return;
        console.log(item);
        const content = new orderContent(item.key, item.image, item.product_title, item.product_description, item.quantity, item.presentment_price, item.previousPrice);
        contentContainer.appendChild(content.render());
    });

}

// quantity change manager
function cartEventManager() {
    document.addEventListener('click', (event) => {
        event.stopPropagation();
        const parent = event.target.closest('.content');
        const contentContainer = document.querySelector('.cart-body .content-container');
        const elClasslist = event.target.classList;

        // delete the product from cart
        if (elClasslist.contains('delete')) {
            contentContainer.removeChild(parent);
        } else if (elClasslist.contains('favorite')) {
            event.target.classList.toggle('isFavorite');
            parent.dataset.isfavorite = true;
        } else if (elClasslist.contains('share')) {
            const sharingContainer = document.querySelector('.sharing-container');
            sharingContainer.classList.toggle('active');
        }

        // selecting all products

    })
}

// the cart total value displayer
function updateTotalValue(cart) {
    const contents = document.querySelectorAll('.content-container .content');
    const totalContainer = document.querySelector('.cartValue-container');
    updatingMenuCartStatus(cart);

    if (!totalContainer) {
        return
    };

    const cartData = cart.items;
    const valueChange = totalContainer.querySelector('.valueChange-container');
    const total = totalContainer.querySelector('.total-value')

    // the value components
    let realValue = 0, changeValue = 0, totalValue = 0;
    cartData.forEach((item) => {
        console.log(item);
        realValue += (item.price / 100) * item.quantity;
    })

    // the change updator values
    valueChange.querySelector('.real-value .value-price').textContent = realValue + " RF";
    valueChange.querySelector('.change-value .value-price').textContent = changeValue + " RF";
    total.querySelector('.total-price').textContent = realValue + changeValue + " RF";

    // if the change is greater then that is not good
    valueChange.querySelector('.change-value .value-price').classList.add((changeValue > 0) ? 'red' : 'green');
}

// sharing a particular product on social media handler function
function sharingManager() {
    // navigating to social medias
    document.addEventListener('click', event => {
        const shareComponent = event.target.closest('.share-component');
        let url = "";
        if (shareComponent?.classList.contains('email')) url += 'https://mail.google.com/mail/#compose';
        else if (shareComponent?.classList.contains('whatsapp')) url += 'https://open.wa.link';
        else if (shareComponent?.classList.contains('twitter')) url += 'https://x.com';
        else if (shareComponent?.classList.contains('telegram')) url += 'https://web.telegram.org/k/'
        else if (shareComponent?.classList.contains('instagram')) url += 'https://www.instagram.com';
        if (shareComponent) window.open(url, '_blank');
    })

    // closing the screen
    const closeBtn = document.querySelector('.sharing-container .top-controller .close-button');
    closeBtn.addEventListener('click', event => {
        event.stopPropagation();
        const sharingContainer = document.querySelector('.sharing-container');
        sharingContainer.classList.toggle('active');
    })
}

// this function updates the wishlist in the menu to the current status of the cart
export function updatingMenuCartStatus(cartData) {
    const cartWishList = document.querySelector(".main-menu-container .cart-wishlist-card");

    // updating the quantity
    const cartPopupQuantity = cartWishList.querySelector(".wishlist-iconContainer .wishlist-popup");
    cartPopupQuantity.textContent = cartData.item_count;

    // updating price
    const cartTotalPrice = cartWishList.querySelector(".wishlist-description .main");
    cartTotalPrice.textContent = "RWF" + (cartData.total_price / 100);
}

// save cart to localstorage
export class cartManager {
    constructor() { }

    // load cart from localstorage
    async loadCart() {
        const cartData = await api.fetchCart();
        return cartData ? cartData : {};
    }

    // empty cart data
    async clearCart() {
        await api.clearCart();
        const cartData = await this.loadCart();
        updateTotalValue(cartData)
    }

    // update product cart quantity
    async updateQuantity(product) {
        await api.updateCart(product.variantid, product.quantity); // in shopify
        const cartData = await this.loadCart();
        updateTotalValue(cartData);
    }

    // add to cart function
    async addToCart(product) {
        let cart = await this.loadCart();
        const existing = cart.items.find(item => item.handle === product.handle);

        if (existing) {
            console.log('updating cart!');
            await this.updateQuantity(product);
        } else {
            await api.addToCart(product.variantid, product.quantity); // on shopify side
            cart = await this.loadCart();
            updateTotalValue(cart);
        }
    }

    // removing product from cart
    async removeFromCart(variantid) {
        await api.removeFromCart(variantid) // on shopify side
        const cart = await this.loadCart();
        updateTotalValue(cart);
    }
}

// main function
export function main(cartData) {
    checkBoxManager();

    console.log("cart data: ", cartData);

    // appending
    shoppingCartLayout(cartData.items);

    // the cart manager function
    cartEventManager();

    // the cart updater function
    updateTotalValue(cartData);

    // the sharing manager function
    sharingManager();
}
