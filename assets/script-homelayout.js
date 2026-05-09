import * as api from "./script-api.js";

// // to product collection navigator function
export async function productMainCollectionInitializer(collectionList) {
    const collectionData = await api.getCollectionByType(collectionList, "main");

    if (!collectionData) return;
    const collectionContent = document.querySelector(".collection-content");
    let collectionItems = "";

    // creating main collection items
    collectionData.forEach(collection => {
        if (collection.type === "main") {
            let collectionItem = "<div class='collection-item btn-shadow'>\n";
            // collection icon image
            const icon = icons[collection.handle];
            if (icon) collectionItem += `<img src="${icon}" class="collection-icon">\n`;

            // collection title
            collectionItem += "<p>" + collection.title + "</p>\n";

            // collection quantity
            collectionItem += `
            <div class="collection-quantity">
                <p>${collection.products_count}</p>
            </div>
        </div>
        `;
            collectionItems += collectionItem + "\n\n";
        }
    });

    // assign new content of the collection designed
    if (!collectionItems) return;
    collectionContent.innerHTML = collectionItems;
}

// main function runner 
export async function main(collectionList, icons) {
    // initializing the collection card
    const group = "phones-tablets";
    let collData = await api.getCollectionByHandel(group);

    // displaying the category
    await collectionDisplayer(collectionList);

    // getting the data using promise all function 
    const data = await Promise.all([
        api.getCollectionSubCollection(collData),
        api.getCollectionProducts(collData)
    ])

    // add data, collection data, product data
    await groupDisplayer(group, collData.advertisment, data[0], data[1], icons);

    // the menu product displayer here we will display all products and the filters
    await navigationDisplayer(data[1], icons);
}

// popular collection displayer
async function collectionDisplayer(collectionList) {
    const collectionData = await api.getCollectionByType(collectionList, "sub");

    // this is where the body container is initialized
    const bodyContainer = document.querySelector('.content-container');
    const content = document.createElement('div');
    const productDisplayer = new productDisplay("PRODUCT CATEGORY", "", "", true);
    const displayTemplate = productDisplayer.render();
    const prodDisplay = displayTemplate.querySelector('.display-products');

    //
    if (!collectionData) console.log("no collection data!");
    else {
        collectionData.forEach(collection => {
            if (collection.type == 'main' || collection.type == "add") return;
            const categCard = new collectionCard(collection.title, collection.products_count, collection.image?.src);
            prodDisplay.appendChild(categCard.render());
        });
    }

    content.classList.toggle('content');

    content.appendChild(displayTemplate);
    bodyContainer.appendChild(content);
}

// the group displayer function 
async function groupDisplayer(name, addData, collectionData, prodData, icons) {
    const content = document.createElement('div');
    const bodyContainer = document.querySelector('.content-container');
    const categByName = [];
    let start = 0
    let finnish = 7

    // the collection data by group name creation
    collectionData.forEach(collection => {
        if (!collection.parent.handle) return;
        if (collection.parent.handle.toLowerCase() == name.toLowerCase()) categByName.push(collection)
    })

    const group = new groupDisplay(name);
    const { addCardImage, addCardInfo } = group.addCardFormation(addData.title, addData.description, addData.image);
    const collectionContainer = group.groupCollectionFormation(categByName);
    const prodListing = group.productListing(prodData.slice(start, finnish), icons);
    const groupRender = group.render(addCardImage, addCardInfo, collectionContainer, prodListing);
    content.appendChild(groupRender);

    content.classList.toggle('content');
    bodyContainer.appendChild(content);

    // product displaying controllers
    const prodGroupContainer = document.querySelector('.group-products');

    function renderProducts() {
        const oldContainer = prodGroupContainer.querySelector('.product-container');
        if (oldContainer) oldContainer.remove();

        const newProducts = prodData.slice(start, start + finnish);
        const listing = group.productListing(newProducts, icons);

        prodGroupContainer.appendChild(listing);
    }

    // 🔥 responsive logic
    function updateFinish() {
        const width = window.innerWidth;

        if (width < 700) finnish = 2;
        else if (width < 900) finnish = 3;
        else if (width < 1110) finnish = 4;
        else if (width < 1290) finnish = 5;
        else finnish = 6;

        // adjust start if overflow
        if (start + finnish > prodData.length) {
            start = Math.max(0, prodData.length - finnish);
        }

        renderProducts();
    }

    // attach resize listener
    window.addEventListener("resize", updateFinish);

    // initial render
    updateFinish();

    // looping through the control buttons to listen to the clicked one
    document.addEventListener('click', (event) => {
        const btn = event.target.closest('.disp-button');
        if (!btn) return;

        const move = parseInt(btn.dataset.mover);
        const step = 1;

        let newStart = start + move * step;
        let newFinish = finnish + move * step;

        if (newStart < 0) {
            newStart = 0;
            newFinish = step;
        }

        if (newFinish > prodData.length) {
            newFinish = prodData.length;
            newStart = prodData.length - step;
            if (newStart < 0) newStart = 0;
        }

        if ((newFinish - newStart) < 5) return;

        start = newStart;
        finnish = newFinish;

        const oldContainer = prodGroupContainer.querySelector('.product-container');
        if (oldContainer) oldContainer.remove();

        const newProducts = prodData.slice(start, finnish);
        prodGroupContainer.appendChild(group.productListing(newProducts, icons));
    });


}

// the navigational card displayer card
async function navigationDisplayer(prodData, iconData) {
    const navCard = new navigationCard();
    const menuList = ["FOR YOU", "IN NEW"];
    navCard.render(menuList);

    // fetching products many products to display
    const recProductsHandle = await api.fetchProducts(100);
    prodData = await Promise.all(
        recProductsHandle.map(handle => api.getProductByHandle(handle))
    );

    // the initial products data by group name
    navCard.productListing(prodData, iconData);

    // the menu navigation controller script
    const navMenuList = document.querySelectorAll(".navigation-menu .menu");
    let activeMenu = document.querySelector(".navigation-menu .menu.active");
    navMenuList.forEach(menu => {
        menu.addEventListener('click', (event) => {
            event.stopPropagation();
            if (activeMenu != menu) {
                activeMenu.classList.remove('active');
                menu.classList.toggle('active');
                activeMenu = menu;

                const menuTitle = menu.querySelector("p").textContent;

                // filter menu navigation
                prodData.forEach(product => {
                    if (menuTitle.toLowerCase() == "in new" && product.stock_days < 7) products.push(product);
                });

                if (products.length == 0 && menuTitle.toLowerCase() == "for you") products.push(...prodData);

                // creating new product listing
                document.querySelector('.navigation-displayer .product-container').innerHTML = "";
                navCard.productListing(products, iconData);
            }
        })
    })
}