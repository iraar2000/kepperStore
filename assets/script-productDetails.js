import * as api from "./script-api.js";

// the product details rendering class
class productDetails {
    constructor(product) {
        this.product = product;
    }
    productDetailsInfo() {
        const detailsContainer = document.createElement("div");
        // name and price setting
        const name = "<p class='product-name'>" + this.product.title + "</p>";
        const priceContainer = document.createElement("div")
        priceContainer.innerHTML = `<p class='current-price'>RWF${this.product.currentPrice}</p>
                                    <p class='previous-price'>RWF${this.product.previousPrice}</p>`;

        detailsContainer.innerHTML = name;

        detailsContainer.setAttribute("class", "details-container");
        priceContainer.setAttribute("class", "price-container");

        const currPrice = priceContainer.querySelector('.current-price')
        if (this.product.currentPrice > this.product.previousPrice) currPrice.classList.toggle("increased");
        else if (this.product.currentPrice < this.product.previousPrice) currPrice.classList.toggle("decreased");

        // details setting
        const description = document.createElement("div");
        const descriptionData = this.product.descriptions.split(',');
        const descriptionList = document.createElement("ul");
        if (description.length != 0) {
            descriptionData.forEach(description => {
                const listElement = document.createElement("li");
                listElement.textContent = description;
                listElement.setAttribute("class", "description-element")
                descriptionList.appendChild(listElement);
            })
        }

        description.appendChild(descriptionList);

        descriptionList.setAttribute("class", "description-list");
        description.setAttribute("class", "description-container");

        // gift and delivery notification section
        const notificationContainer = document.createElement("div")
        let notifications = "";
        if (this.product.isGift == "yes") notifications += "<div class='info-card info-redCard'>free Gift</div>";
        if (this.product.shipping == 0) notifications += "<div class='info-card info-greenCard'>free shipping</div>";
        notificationContainer.setAttribute("class", "shipping-gift-container");

        notificationContainer.innerHTML = notifications;
        detailsContainer.append(priceContainer, description, notificationContainer);

        return detailsContainer;
    }

    productDetailsCharacteristics() {
        const controls = document.createElement("div");
        const content = document.createElement("div");
        const charKeys = (this.product.characteristics == null || !this.product.characteristics) ? [] : Object.keys(this.product.characteristics).map(key => key.toLowerCase());

        // for color
        if (charKeys.includes("color")) {
            if (this.product.characteristics?.color.length > 0) {

                const colors = new characteristic("COLOR");
                // characteristic content
                let controllContent = document.createElement("div");
                let colorString = "";
                this.product.characteristics.color.forEach((color, index) => {
                    if (index == 0) colors.setSubTitle(color);
                    const clr = `<div class='content-container ${(index == 0) ? "active" : ""}'>
                                        <div data-name="${color}" class="color" style="background-color:#${color}">
                                        </div>
                                    </div>`;
                    colorString += clr;
                })
                controllContent.innerHTML = colorString;
                controllContent.setAttribute("class", "product-colors controll-content");
                colors.setContent(controllContent);
                controls.appendChild(colors.render());
            }
        }

        // for memory size
        if (charKeys.includes("memory size")) {
            if (this.product.characteristics["memory size"]?.length > 0) {

                const memorySize = new characteristic("MEMORY SIZE");
                // characteristic content
                let controllContent = document.createElement("div");
                let sizeString = "";
                this.product.characteristics['memory size'].forEach((size, index) => {
                    if (index == 0) memorySize.setSubTitle(size + "GB");
                    const sizeContent = `<div class='content-container ${(index == 0) ? "active" : ""}'>
                                            <div data-name='${size}GB' class='memory-size size-value ${(index == 0) ? "active" : ""}'>${size}GB</div>
                                        </div>`;
                    sizeString += sizeContent;
                })
                controllContent.innerHTML = sizeString;
                controllContent.setAttribute("class", "product-memorySize controll-content");
                memorySize.setContent(controllContent);
                controls.appendChild(memorySize.render());

            }
        }

        // characteristic keys 
        charKeys.forEach(key => {
            if (key == "color" || key == "memory size") return;
            if (Array.isArray(this.product.characteristics[key])) {
                const charact = new characteristic(key.toUpperCase());
                // characteristic content
                let controllContent = document.createElement("div");
                let itemString = "";
                this.product.characteristics[key].forEach((item) => {
                    const itemContent = `<div class='content-container'>
                                            <div data-name='${item}' class='${key.replace(" ", "-")}'>${item}</div>
                                        </div>`;
                    itemString += itemContent;
                })
                controllContent.innerHTML = itemString;
                controllContent.setAttribute("class", `product-${key.replace(" ", "")} controll-content`);
                charact.setContent(controllContent);
                content.appendChild(charact.render());
            } else {
                const charact = new characteristic(key.toUpperCase());
                charact.setSubTitle(this.product.characteristics[key]);
                content.appendChild(charact.render());
            };
        })
        controls.setAttribute("class", "details-container controll-characteristics");
        content.setAttribute("class", "details-container content-characteristics");
        return { controls, content };
    }
}

// characteristics section rendering class
class characteristic {
    constructor(title) {
        this.title = title;
    }

    setSubTitle(subTitle) { this.subTitle = subTitle; }

    setContent(content) { this.content = content; }

    render() {
        const mainContainer = document.createElement("div");
        const titleContainer = document.createElement("div");
        const contentContainer = document.createElement("div");

        const title = `<p class='title'>${this.title}:</p>`;
        const subtitle = `<p class='subtitle'>${(this.subTitle) ? this.subTitle : ""}</p>`;
        titleContainer.innerHTML = title + subtitle;

        if (this.content) { contentContainer.append(this.content); };

        mainContainer.append(titleContainer, contentContainer)

        mainContainer.setAttribute("class", "controll-characteristic");
        titleContainer.setAttribute("class", "characteristic-title");
        contentContainer.setAttribute("class", "characteristic-content");
        titleContainer.title = this.subTitle;

        return mainContainer;
    }
}

// add to cart and check out controlls rendering class
class cartAndCheckout {
    constructor(cartPrice, discount, stockQuantity) {
        this.cartPrice = cartPrice;
        this.discount = discount;
        this.stockQuantity = stockQuantity;
    }

    createCartPrice() {
        // price container
        const cartPriceWrapper = document.createElement("div");
        const title = `<p class="title">total price</p>`;
        const price = `<p class="cart-price">RWF${this.cartPrice * this.stockQuantity}</p>`
        cartPriceWrapper.innerHTML = title + price;

        // visualized cart and discount levels
        const cartStatus = document.createElement('div');

        cartStatus.innerHTML = ` 
                        <div class='discount-container'>
                            ${(this.discount == 0) ? "" : `<p class='discount-value ${(this.discount < 0) ? "decreased" : "increased"}'>${this.discount}%</p>`}
                        </div>
                        <a class='cart-navigator' href='/pages/shopcart'>
                            view cart  <i class="fa fa-arrow-right" aria-hidden="true"></i>
                        </a>`;

        cartPriceWrapper.appendChild(cartStatus);
        cartStatus.setAttribute('class', 'cart-status');
        cartPriceWrapper.setAttribute("class", "cart-price-container action-content");
        return cartPriceWrapper;
    }

    createCartAndCheckoutBtnHandlers() {
        const cartCheckoutContainer = document.createElement("div");
        const productDetails = document.querySelector('.main-container .productDetails-container'); // details container

        // add to cart controlls
        const productInfo = document.createElement("div");
        const stockStatus = `${(this.stockQuantity > 0)
            ? "<div class='icon-info normal-info'><p class='info'>in stock</p></div>"
            : "<div class='black-info'><p class='info'>out of stock</p></div>"}`;

        productInfo.innerHTML = stockStatus;

        productInfo.setAttribute('class', 'product-status-info');
        cartCheckoutContainer.setAttribute('class', 'action-content cart-checkout-controls');

        // cart and checkout btn controlls
        const controlls = document.createElement("div");

        // changed
        // price updator function as product quantity changes
        const updatePrice = (qty) => {
            const priceContainer = document.querySelector('.cart-price-container .cart-price');
            priceContainer.textContent = 'RWF' + (this.cartPrice * qty);

            // the product quantity updating
            productDetails.dataset.productquantity = qty;
        }

        productDetails.dataset.productquantity = 1;

        // the controll button creation and rendering
        const quantintyCounter = (new counter(this.stockQuantity, updatePrice)).render();
        const addtoCartBtn = (new controllButton(undefined, "add to cart", () => { })).render();
        const checkOutBtn = (new controllButton(icons.mtn, "buy with", () => { }, "yellow")).render(); // mtn payment

        controlls.append(quantintyCounter, addtoCartBtn, checkOutBtn);
        controlls.setAttribute('class', "cart-checkout-btns");

        cartCheckoutContainer.append(productInfo, controlls);

        return cartCheckoutContainer
    }

    render() {
        const cartCheckoutContainer = document.createElement("div");

        // section 1 : cart price
        cartCheckoutContainer.appendChild(this.createCartPrice())

        // section 2 : product insert in cart and check out
        cartCheckoutContainer.appendChild(this.createCartAndCheckoutBtnHandlers())
        // section 3 : assition information  

        cartCheckoutContainer.setAttribute("class", "cart-checkout-wrapper");

        return cartCheckoutContainer;
    }
}

// integer counter component
class counter {
    constructor(value = 0, onChange) {
        this.value = value;
        this.onChange = onChange
    }

    incrementor() {
        this.value += 1;
        this.onChange(this.value);
    }

    decrementor() {
        if (this.value > 0) {
            this.value -= 1;
            this.onChange(this.value);
        }
    }

    render() {
        const counter = document.createElement('div');
        const leftBtn = document.createElement('button');
        const rightBtn = document.createElement('button');
        const content = document.createElement('div');

        leftBtn.onclick = () => {
            this.decrementor();
            content.textContent = this.value;
        };

        rightBtn.onclick = () => {
            this.incrementor();
            content.textContent = this.value;
        };

        content.innerHTML = `<p class='value'>${this.value}</p>`;
        leftBtn.textContent = "-";
        rightBtn.textContent = "+";

        counter.setAttribute('class', "integer-counter");
        rightBtn.setAttribute('class', "counter-leftBtn counter-btn");
        leftBtn.setAttribute('class', 'counter-rightBtn counter-btn');
        content.setAttribute('class', 'counter-content');

        counter.append(leftBtn, content, rightBtn);

        return counter;
    }
}

// controll button component
class controllButton {
    constructor(icon, name, controllFunction, color) {
        this.icon = icon;
        this.name = name;
        this.controllFunc = controllFunction;
        this.color = color;
    }

    render() {
        const cntrlBtn = document.createElement('button');
        cntrlBtn.setAttribute('class', `controls controll-btn ${this.name.replace(/\s+/g, '')}-btn`);

        const name = document.createElement('p');
        name.textContent = this.name;
        cntrlBtn.appendChild(name);

        if (this.icon) {
            const icon = document.createElement('img');
            icon.src = this.icon;
            cntrlBtn.appendChild(icon);
        }

        if (this.color) cntrlBtn.style = `background-color: ${this.color}`;

        // 👉 Attach the control function
        if (this.controllFunc) {
            cntrlBtn.addEventListener('click', this.controllFunc);
        }

        return cntrlBtn;
    }
}

// review details rendering class
class reviewDetails {
    constructor(reviewNbr, reviewContents) {
        this.reviewNbr = reviewNbr;
        this.reviewContents = reviewContents;
    }
    render() {
        // the reviews number
        const reviewsNbrTitle = document.querySelector(".productDetails-reviewsContainer .review-title .reviews-nbr");
        reviewsNbrTitle.textContent = `(${this.reviewNbr})`;

        // reviews contents
        const container_reviewContent = document.querySelector(".productDetails-reviewsContainer .review-contents");
        container_reviewContent.appendChild(this.reviewContents);
    }
}

// review component class
class review {
    constructor(user, review) {
        this.user = user;
        this.review = review;
    }

    render() {
        const reviewContainer = document.createElement("div");
        const reviewWrapper = document.createElement("div");
        const reviewMessage = document.createElement("div");
        const reviewUser = document.createElement("div");

        // createing the user profile section
        let userProfile = `<div class='profile-container'>
            <div class='profileImage-container'>
                <div class='profileImage-wrapper'>
                    <img src='${this.user.image}' alt='user-profile'/>
                </div>
            </div>
            <div class='profileDetails-container'>
                <div class='profileTitle-container'>
                    <p class='user-name'>${this.user.name}</p>
                    <p class='title'>${this.user.title}</p>
                </div>
                <div class='profileRating-container'>`

        for (var i = 0; i < 5; i++) {
            if (i <= this.review.rating) userProfile += `<i class="fa-solid fa-star" style="color: #FFD43B;"></i>`
            else userProfile += `<i class="fa-solid fa-star" style="color:rgb(207, 207, 207);"></i>`
        }

        userProfile += `</div> </div > </div > `;
        reviewUser.innerHTML = userProfile;
        reviewMessage.innerHTML = `<p class='message'>${this.review.comment}</p>`;
        reviewWrapper.append(reviewMessage, reviewUser);
        reviewContainer.appendChild(reviewWrapper);

        // console.log(reviewContainer);

        reviewUser.setAttribute('class', 'review-user');
        reviewMessage.setAttribute('class', 'review-message');
        reviewWrapper.setAttribute('class', 'review-wrapper');
        reviewContainer.setAttribute('class', 'review-container');

        return reviewContainer;
    }
}

// the product details setting function
async function productDetailsInfo(product) {
    // featured image
    const imageContainer = document.querySelector(".productDetails-imageContainer .image-container");
    const featuredImage = document.createElement("div");
    featuredImage.innerHTML = `<img loading="lazy" src="${product.image}" alt='featured-image' class='featured-image'/>`
    featuredImage.setAttribute('class', 'featured-image-container');

    imageContainer.querySelector(".productDetails-topImageInfo .stockState-btn").innerHTML = (product.quantity > 0) ? "<p class='state'>IN STOCK</p>" : "<p class='state'>OUT OF STOCK</p>";
    imageContainer.appendChild(featuredImage);

    // product details information and characteristic rendering
    const detailsContainer = document.querySelector('.productDetails-infoContainer');
    const prodDetails = new productDetails(product);
    detailsContainer.appendChild(prodDetails.productDetailsInfo());

    // characteristics appending
    const { controls, content } = prodDetails.productDetailsCharacteristics();
    detailsContainer.append(controls, content);

    // cart and checkout rendering funtion calling
    await productCartAndCheckout(product);

    // controlls
    characteristicControll("product-colors");
    characteristicControll("product-memorySize");

}

// the cart and checkout section on product display
async function productCartAndCheckout(product) {
    const controllsContainer = document.querySelector('.productDetails-actionsContainer .cart-checkout-section');
    const totalCartValue = product.currentPrice;
    const discount = 0;

    // creating the quantity of the product
    const cart = await api.fetchCart();
    const cartData = cart.items;
    const existing = (cartData) ? cartData.find(item => item.handle === product.handle) : "";

    // setting the quantity
    let quantity = 1;
    if (existing != "" && existing) quantity = existing.quantity;

    // the rendering of cart controllers
    const cartCheckout = new cartAndCheckout(totalCartValue, discount, quantity);
    controllsContainer.appendChild(cartCheckout.render());
}

// characteristic controlls
function characteristicControll(characteristicContainer) {
    const contents = document.querySelectorAll(`.${characteristicContainer} .content-container`);
    contents.forEach(cont => {
        cont.addEventListener('click', (event) => {
            event.stopPropagation();

            // removing the active class
            document.querySelectorAll(`.${characteristicContainer} .content-container`).forEach(actContent => {
                actContent.classList.remove("active");
            });

            // getting the parent of the content
            const name = cont.querySelector("div").dataset.name;
            const title = cont.closest(".controll-characteristic").querySelector(".characteristic-title");
            title.querySelector('.subtitle').textContent = name;
            cont.classList.toggle("active");
        })
    })
}

// reviews rendering function
function reviewsRendering(reviews, users) {
    // review content wrapper creation
    const reviewContentWrapper = document.createElement("div");
    reviewContentWrapper.setAttribute('class', 'review-content-wrapper')


    // creating the review data and inserting the review in the review content wrapper
    reviews.forEach(rvw => {
        const reviewData = new review(users[rvw.userId], rvw);
        reviewContentWrapper.appendChild(reviewData.render());
    })

    // rendering the review contents details
    const reviewContainer = new reviewDetails(reviews.length, reviewContentWrapper);
    reviewContainer.render();
}

export async function main(product, icons, reviews, users) {

    // accessing product data using the product id
    const productDetails = document.querySelector('.main-container .productDetails-container');
    productDetails.dataset.producthandle = product.handle;
    productDetails.dataset.variantid = product.variantId;
    await productDetailsInfo(product);

    // // reviews filtering to the ones related to the product
    // const reviewsData = []
    // const userData = {}
    // reviews["reviews"].forEach(review => {
    //     if (review.productId == product.id) {
    //         users["accounts"].forEach(user => {
    //             if (user.id == review.userId) {
    //                 userData[user.id] = user;
    //             }
    //         })
    //         reviewsData.push(review);
    //     }
    // })

    // reviewsRendering(reviewsData, userData);
}