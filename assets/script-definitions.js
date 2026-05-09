// display product class
class productDisplay {
    constructor(title, menu, products, isViewAll) {
        this.title = title;
        this.menu = menu;
        this.products = products;
        this.isViewAll = isViewAll;
    }

    render() {
        const displayTemplate = document.querySelector('.display-template').content.cloneNode(true);
        const displayHeader = displayTemplate.querySelector('.display-header');
        const headerContainer = displayHeader.querySelector('.header-container');
        const title = "<p class='title'>" + this.title + "</p>"
        if (this.title) headerContainer.innerHTML = title;
        return displayTemplate;
    }
}

// category card class
class collectionCard {
    constructor(name, items, image) {
        this.name = name;
        this.items = items;
        this.image = image;
    }

    imageCreator() {
        const image = document.createElement('img');
        if (this.image) image.src = this.image;
        else image.src = '../images/default.png';
        image.classList.toggle('collection-image')
        return image;
    }

    descriptionContent() {
        const title = document.createElement('p');
        const itemsDescription = document.createElement('p');

        // toggle class name to the create elements
        title.classList.toggle('collection-title');
        itemsDescription.classList.toggle('collection-items');

        // assigning data and text content
        title.textContent = this.name;
        itemsDescription.textContent = this.items + ' items';

        return { title, itemsDescription }
    }

    render() {
        const collectionTemplate = document.querySelector('.collectionCard-template').content.cloneNode(true);
        const cardDescription = collectionTemplate.querySelector('.collection-card .card-description');
        const cardImage = collectionTemplate.querySelector('.collection-card .card-image');

        // the image appending on the container
        cardImage.appendChild(this.imageCreator());

        // the decription appending in the container
        const { title, itemsDescription } = this.descriptionContent();
        cardDescription.append(title, itemsDescription);
        return collectionTemplate;
    }
}

// info card class
class infoCard {
    constructor() {
        this.container = document.createElement('div');
    }
    withIconCard(text, icon) {
        const infoName = document.createElement('p');
        const infoIcon = document.createElement('object');

        infoName.textContent = text;
        infoIcon.type = 'image/svg+xml';
        infoIcon.data = icon;
        this.container.append(infoIcon, infoName);

        this.container.classList.toggle("info-card");
        infoName.classList.toggle('info-name');

        return this.container;
    }
    withoutIconCard(text) {
        this.container.textContent = text;
        this.container.classList.toggle("info-card");
        return this.container;
    }
}

// product card class
class productCard {
    constructor(id, name, description, image, prodUrl, currPrice, prevPrice, toSave, stock_days, quantity, shipping, isGift) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.prodUrl = prodUrl;
        this.currPrice = currPrice;
        this.prevPrice = prevPrice;
        this.toSave = toSave;
        this.stock_days = stock_days;
        this.quantity = quantity;
        this.shipping = shipping;
        this.isGift = isGift;
    }

    productInfo(icons) {
        const infoContainer = document.createElement('div');
        const shippingGift = document.createElement('div');
        const inStockContact = document.createElement('div');

        // shipping info section
        if (this.shipping && this.shipping == 0) {
            const infCard = new infoCard();
            const shippingCard = infCard.withoutIconCard("FREE SHIPPING")
            shippingCard.classList.toggle("info-greenCard");
            shippingGift.appendChild(shippingCard);
            infoContainer.appendChild(shippingGift);
        }
        else if (this.shipping && this.shipping != 0) {
            const infCard = new infoCard();
            const shippingCard = infCard.withoutIconCard("RWF" + this.shipping + " DELIVERY")
            shippingCard.classList.toggle("info-grayCard");
            shippingGift.appendChild(shippingCard);
            infoContainer.appendChild(shippingGift);
        }

        // gift info section
        if (this.isGift == 'yes') {
            const infCard = new infoCard();
            const giftCard = infCard.withoutIconCard("FREE GIFT")
            giftCard.classList.toggle("info-redCard");
            shippingGift.appendChild(giftCard);
        }

        // contact and instock info section
        if (this.quantity == 0) {
            const infCard = new infoCard();
            const contactCard = infCard.withIconCard("CONTACT", icons.contact)
            inStockContact.appendChild(contactCard);
            infoContainer.appendChild(inStockContact);
        }
        else {
            const infCard = new infoCard();
            const inStock = infCard.withIconCard("INSTOCK", icons.instock)
            inStockContact.appendChild(inStock);
            infoContainer.appendChild(inStockContact);
        };

        // assigning the class names
        infoContainer.classList.toggle('info-container');
        shippingGift.classList.toggle('shipping-gift-container');
        inStockContact.classList.toggle('instock-contact-container');

        return infoContainer;
    }

    productState(container) {
        // adding the favorite icon to the product image
        const stateContainer = document.createElement('div');

        // adding the product state to the product image
        const state = container.querySelector('.state');
        // console.log(this.uploaded_at);
        if (this.toSave > 0) {
            state.innerHTML = "<p class='state-title'>SAVE</p><p class='state-content'>RWF" + this.toSave + "</p>";
            state.classList.toggle('save-state');
        }
        else if (this.stock_days < 7 || this.quantity == 0) {
            if (this.stock_days < 7 && this.quantity > 0) state.innerHTML = "<p class='state-content'>NEW</p>";
            else if (this.quantity == 0) state.innerHTML = "<p class='state-content'>OUT OF STOCK</p>";
            state.classList.toggle('announce-state');
        }
    }

    productPrice(container) {
        const currPrice = document.createElement('p');
        const prevPrice = document.createElement('p');

        // appending the children to parent and assigning data
        currPrice.textContent = "RWF" + this.currPrice;
        prevPrice.textContent = "RWF" + this.prevPrice;
        container.appendChild(currPrice);

        // assigning class lists
        if (this.prevPrice && this.prevPrice != 0) {
            container.appendChild(prevPrice);
            if (this.currPrice > this.prevPrice) currPrice.classList.toggle('priceIncrease');
            else if (this.currPrice < this.prevPrice) currPrice.classList.toggle('priceDecrease');
        }

        currPrice.classList.toggle('currPrice');
        prevPrice.classList.toggle('prevPrice');
    }

    productImage(container) {
        const image = document.createElement('img');
        const link = document.createElement('a');

        // assigning data
        link.href = this.prodUrl;
        image.src = this.image;
        image.loading = "lazy";

        // append the child to parents
        link.appendChild(image);
        container.appendChild(link);

        // product assign the class name to the container
        link.classList.toggle('product-image-link');
        image.classList.toggle('image');
    }

    productDescription(container) {
        const link = document.createElement('a');
        const nameTag = document.createElement('p');
        const descripTag = document.createElement('p');

        link.href = this.prodUrl;
        if (this.name != "") nameTag.textContent = this.name;
        if (this.description != "") descripTag.textContent = this.description;


        link.append(nameTag, descripTag);
        container.appendChild(link);

        nameTag.classList.toggle('name');
        descripTag.classList.toggle('description');
        link.classList.toggle('product-link');
    }

    render(icons) {
        const prodTemplate = document.querySelector('.productCard-template').content.cloneNode(true);
        const prodCont = prodTemplate.querySelector('.product');

        // image appending
        this.productImage(prodCont.querySelector('.product-image'));

        // appending the product state
        this.productState(prodCont.querySelector('.product-image .state-container'));

        // appending the description
        this.productDescription(prodCont.querySelector('.product-description'));

        // appending the product price
        this.productPrice(prodCont.querySelector('.product-price'));

        // product info appending
        prodCont.querySelector('.info-container').appendChild(this.productInfo(icons));
        return prodCont;
    }
}

// group card class
class groupDisplay {
    constructor(title) {
        this.title = title.replace("-", " & ");
    }

    addCardFormation(add_title, add_subTitle, add_imageURL) {
        const addCardImage = document.createElement('div');
        console.log(add_title, add_subTitle, add_imageURL)
        const addImage = "<img src='" + add_imageURL + "' class='image' alt='add image'>"
        addCardImage.innerHTML = addImage;

        const addCardInfo = document.createElement('div');
        const infoTitle = "<p class='info-title'>" + add_title + "</p>";
        const subInfoTitle = "<p class='info-subTitle'>" + add_subTitle + ".</p>";
        const shopButton = "<div class='btn btn-md shop-button'>shop now</div>";

        // creating the class name
        addCardInfo.classList.toggle('add-info');
        addCardImage.classList.toggle('add-image');

        // appending to the parent container
        addCardInfo.innerHTML = infoTitle + '\n' + subInfoTitle + '\n' + shopButton;

        return { addCardImage, addCardInfo };
    }

    groupCollectionFormation(collectionData) {
        const collectionContainer = document.createElement('div');

        // looping and creating collection element
        let categLimit = 9;
        collectionData.forEach(collection => {
            if (categLimit == 0) return;
            const categories = new collectionCard(collection.title, collection.products_count, collection.image.src);
            collectionContainer.appendChild(categories.render());
            categLimit -= 1;
        })
        collectionContainer.classList.toggle('group-collection');
        return collectionContainer;
    }

    productListing(products, icons) {
        const prodListContainer = document.createElement('div');
        prodListContainer.classList.toggle('product-container');
        products.forEach(product => {
            // console.log(product);
            // the product card
            const prodCard = new productCard(
                product.id,
                product.title,
                "",
                product.image,
                'pages/product-details?handle=' + product.handle,
                product.currentPrice,
                product.previousPrice,
                product.toSave,
                product.stock_days,
                product.quantity,
                product.shipping,
                product.isGift
            );

            // rendering a product
            const prodRender = prodCard.render(icons);

            prodListContainer.appendChild(prodRender);
        })
        return prodListContainer;
    }

    render(addCardImage, addCardInfo, collectionContainer, prodListing) {
        const groupTemplate = document.querySelector('.group-template').content.cloneNode(true);
        const groupHeader = groupTemplate.querySelector('.group-container .group-header');
        const groupProducts = groupTemplate.querySelector('.group-container .group-products');
        const viewAllBtn = groupHeader.querySelector('.group-title .viewbtn');

        // set the view all button link
        viewAllBtn.href = "/pages/products?type=collection&collection=" + this.title.replace(" & ", "-").toLowerCase();

        // setting the group title and viewbtn
        groupHeader.querySelector('.group-title .title').textContent = this.title;

        // setting the add and categories of the selected group
        const addCard = groupHeader.querySelector('.group-header-content .add-card');
        const collectionSection = groupHeader.querySelector('.group-header-content .collection-section');

        // add card creation area
        addCard.append(addCardImage, addCardInfo);

        // collection section creation 
        collectionSection.appendChild(collectionContainer);

        // product listing container
        groupProducts.appendChild(prodListing)

        return groupTemplate;
    }
}

// navigation card display 
class navigationCard {
    constructor() { }

    navigationMenu(template, menuList) {
        const navMenuContainer = template.querySelector('.navigation-menu .navigation-container');
        navMenuContainer.dataset.activemenu = menuList[0];
        menuList.forEach(menu => {
            const menuNav = document.createElement('div');
            const underLine = document.createElement('div');
            const navigator = document.createElement('p');

            if (navMenuContainer.dataset.activemenu == menu) menuNav.classList.toggle('active');
            menuNav.classList.toggle("menu");
            underLine.classList.toggle('underliner');

            menuNav.dataset.menuName = menu;
            navigator.textContent = menu;

            menuNav.appendChild(navigator);
            menuNav.appendChild(underLine);
            navMenuContainer.appendChild(menuNav);
        })
    }

    productListing(products, icons) {
        const prodListContainer = document.querySelector('.navigation-displayer .product-container');

        products.forEach(product => {

            // the product card
            const prodCard = new productCard(
                product.id,
                product.title,
                "",
                product.image,
                'pages/product-details?handle=' + product.handle,
                product.currentPrice,
                product.previousPrice,
                product.toSave,
                product.stock_days,
                product.quantity,
                product.shipping,
                product.isGift
            );

            // rendering a product
            const prodRender = prodCard.render(icons);

            prodListContainer.appendChild(prodRender);
        })
        return prodListContainer;
    }

    render(menuList) {
        const template = document.querySelector('.navDisplay-template').content.cloneNode(true);
        const contentContainer = document.querySelector('.content-container');
        this.navigationMenu(template, menuList);
        contentContainer.appendChild(template);
    }
}

// check box class for product listing screen filter displayer
class checkBox {
    constructor(itemName) {
        this.itemName = itemName;
    }

    renderContent(content) {
        const checkbox = document.createElement('div');
        const checkImage = document.createElement('div');
        const checkContent = document.createElement('div');
        checkContent.appendChild(content);

        checkContent.classList.toggle('check-content');
        checkImage.classList.toggle('check-image');
        checkbox.classList.toggle('checkbox')
        checkbox.classList.toggle(this.itemName);

        checkImage.innerHTML = "<div></div>"
        checkbox.append(checkImage, checkContent);
        return checkbox;

    }

    renderTitle(name) {
        const checkbox = document.createElement('div');
        const checkImage = document.createElement('div');
        const checkTitle = document.createElement('p');
        checkTitle.textContent = name;

        checkTitle.classList.toggle('check-title');
        checkImage.classList.toggle('check-image');
        checkbox.classList.toggle('checkbox')
        checkbox.classList.toggle(this.itemName);

        checkImage.innerHTML = "<div></div>"
        checkbox.append(checkImage, checkTitle);

        return checkbox;
    }
}

// product listing screen filter displayer class
class productProperties {
    constructor(mainCategory) {
        this.mainCategory = mainCategory;
    }

    byPrice(min, max) {
        const propertyContainer = document.createElement('div');
        const title = document.createElement('p');
        const priceContainer = document.createElement('div');
        const minPrice = document.createElement('div');
        const maxPrice = document.createElement('div');
        const separator = document.createElement('div');
        const setterButton = document.createElement('div');

        minPrice.innerHTML = "<p class='currency'>RWF</p><input value=" + min + " class='minPrice'/>"
        maxPrice.innerHTML = "<p class='currency'>RWF</p><input value=" + max + " class='maxPrice'/>"
        setterButton.textContent = "Go";
        title.textContent = "By price";

        priceContainer.append(minPrice, separator, maxPrice, setterButton);
        propertyContainer.append(title, priceContainer);

        propertyContainer.setAttribute("class", "property categProp-listing");
        priceContainer.setAttribute("class", "price-container property-content");
        title.setAttribute("class", "categProp-SubTitle property-title");
        minPrice.setAttribute("class", "price");
        maxPrice.setAttribute("class", "price");
        separator.setAttribute("class", "separator");
        setterButton.setAttribute("class", "setter");

        return propertyContainer;
    }

    byBrand(brandList) {
        const propertyContainer = document.createElement('div');
        const title = document.createElement('p');
        const brandContainer = document.createElement('div');

        title.textContent = "By brand";
        propertyContainer.append(title, brandContainer);


        propertyContainer.setAttribute("class", "property categProp-listing");
        title.setAttribute("class", "categProp-SubTitle property-title");
        brandContainer.setAttribute("class", "brand-container property-content");

        return propertyContainer;
    }

    byRating() {
        const propertyContainer = document.createElement('div');
        const title = document.createElement('p');
        const rateContainer = document.createElement('div');

        title.textContent = "By rating";

        for (let index = 0; index < 5; index++) {
            const content = document.createElement('div');
            let contentHtml = "";
            for (let i = index; i < 5; i++) {
                contentHtml += `
                    <div class='rate-star'>
                        <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.92453 10.4479L11.2039 13L10.0683 8.19L13.8491 4.95368L8.87032 4.52947L6.92453 0L4.97874 4.52947L0 4.95368L3.77387 8.19L2.64517 13L6.92453 10.4479Z" fill="#FFBF00"/>
                        </svg>
                    </div>
                `;
            }
            content.innerHTML = contentHtml;
            content.classList.toggle('rate-content');

            const rateCheckBox = new checkBox('rateContent-item');
            const rateContent = rateCheckBox.renderContent(content);
            const checkContent = rateContent.querySelector('.check-content')

            const quantity = document.createElement('div');
            quantity.classList.toggle('quantity');
            quantity.textContent = "(" + 0 + ")";

            checkContent.dataset.rate = 5 - index;

            checkContent.appendChild(quantity);
            rateContainer.appendChild(rateContent);
        }

        propertyContainer.append(title, rateContainer);

        propertyContainer.setAttribute("class", "property categProp-listing");
        title.setAttribute("class", "categProp-SubTitle property-title");
        rateContainer.setAttribute("class", "rate-container property-content");

        return propertyContainer;
    }

    byColor() {
        const propertyContainer = document.createElement('div');
        const title = document.createElement('p');
        const colorContainer = document.createElement('div');

        title.textContent = "By Color";
        propertyContainer.append(title, colorContainer);

        propertyContainer.setAttribute("class", "property categProp-listing");
        title.setAttribute("class", "categProp-SubTitle property-title");
        colorContainer.setAttribute("class", "color-container property-content");

        return propertyContainer
    }

}

// product listing displayer class
class productDisplayer {
    constructor(filterSettings, productData) {
        this.filterSettings = filterSettings;
        this.productData = productData;
    }

    // category matching function
    isCategoryMatched(product) {
        for (const category of this.filterSettings.categories) {
            if (category.toLowerCase() == product.subcollection.title.toLowerCase()) {
                return true;
            }
        }
        return false;
    }

    // properties matching function
    isPropertyMatched(product) {
        // price filtering
        if (this.filterSettings.properties["price"]) {
            const { min, max } = this.filterSettings.properties["price"];
            if (product.currentPrice < min || product.currentPrice > max) {
                return false;
            }
        }

        // rating filtering
        if (this.filterSettings.properties["rating"]?.length > 0) {
            console.log(this.filterSettings.properties["rating"], Math.floor(product.rate));
            if (!this.filterSettings.properties["rating"].includes(Math.floor(product.rate).toString())) {
                return false;
            }
        }

        return true;
    }

    // this function handles product filtering by category and properties setting
    productFilteringHandler() {
        // filtering by category
        const filteredByCategory = this.productData.filter(product => {
            return this.isCategoryMatched(product);
        });

        // filter by properties
        const filteredByProperties = filteredByCategory.filter(product => {
            return this.isPropertyMatched(product);
        });

        // Display the filtered products
        return filteredByProperties;
    }

    productListing(products, icons) {
        const productListingContainer = document.createElement('div');

        products.forEach(product => {
            // the product card
            const prodCard = new productCard(
                product.id,
                product.title,
                "",
                product.image,
                'product-details?handle=' + product.handle,
                product.currentPrice,
                product.previousPrice,
                product.toSave,
                product.stock_days,
                product.quantity,
                product.shipping,
                product.isGift
            );

            // rendering a product
            const prodRender = prodCard.render(icons);

            productListingContainer.appendChild(prodRender);
        })

        productListingContainer.setAttribute("class", "productDisplay-container");
        return productListingContainer;
    }

    productDisplay(icons) {
        const prodDisplay = document.querySelector('.main-container .product-container');
        prodDisplay.innerHTML = "";

        let productList = this.productData;
        if (this.filterSettings.categories.length > 1 || Object.keys(this.filterSettings.properties).length > 0) {
            productList = this.productFilteringHandler();
        } else {
            productList = this.productData;
        }

        console.log("filtered product list: ", productList);
        const listing = this.productListing(productList, icons);
        prodDisplay.appendChild(listing);
    };
}