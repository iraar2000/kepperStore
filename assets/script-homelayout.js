// to product category navigator function
export function productMainCategoryInitializer(categorData) {
    if (!categorData) return;
    const categoryContent = document.querySelector(".category-content");
    let categoryItems = "";

    // creating main category items
    categorData.forEach(category => {
        console.log(category);
        if (category.type === "main") {
            let categoryItem = "<div class='category-item btn-shadow'>\n";
            // category icon image
            const icon = icons[category.handle];
            if (icon) categoryItem += `<img src="${icon}" class="category-icon">\n`;

            // category title
            categoryItem += "<p>" + category.title + "</p>\n";

            // category quantity
            categoryItem += `
            <div class="category-quantity">
                <p>${category.products_count}</p>
            </div>
        </div>
        `;
            categoryItems += categoryItem + "\n\n";
        }
    });

    // assign new content of the category designed
    if (!categoryItems) return;
    categoryContent.innerHTML = categoryItems;
}

// event handler when the product category is clicked
export function productMainCategoryEventHandler() {
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(categoryItem => {
        categoryItem.addEventListener('click', (event) => {
            event.stopPropagation()
            const category = categoryItem.querySelector("p").textContent;
            window.location.href = "/pages/products?type=search&product=all&category=" + category.toLowerCase();
        })
    })
};

// popular category displayer
export function popularCategoryDisplayer(categoryData) {
    // this is where the body container is initialized
    const bodyContainer = document.querySelector('.content-container');
    const popularProduct = new productDisplay("POPULAR PRODUCTS", "", "", true);
    const displayTemplate = popularProduct.render();
    const prodDisplay = displayTemplate.querySelector('.display-products');

    if (!categoryData) console.log("no category data!");
    else {
        categoryData.forEach(category => {
            if (category.type != 'sub') return;
            const categCard = new categoryCard(category.title, category.products_count, category.image.src);
            prodDisplay.appendChild(categCard.render());
        });
    }
    bodyContainer.appendChild(displayTemplate);
}

// the group displayer function 
export function groupDisplayer(name, categoryData) {
    const bodyContainer = document.querySelector('.content-container');
    const categByName = [];

    // the category data by group name creation
    categoryData.forEach(category => {
        if (!category.parent) return;
        console.log(name, category.parent);
        if (category.parent.title.toLowerCase() == name.toLowerCase()) {
            console.log(name, category.parent);
        }
    })
    // const group = new groupCard(groupName);
    // bodyContainer.appendChild(group.render());
}

