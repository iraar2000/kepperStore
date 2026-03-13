import * as dropdown from './dropdown.js';
import * as fetcher from './fetchingHandler.js';
import * as search from './searchbar.js';


const collections = await fetcher.fetchCollections();
search.insertCategory(collections);

searchEventHandler();
dropDownButtonEventHandler();
productCategoryInitializer(collections.collections);
productCategoryEventHandler();

// search category fetching and insertion to the category content
async function searchEventHandler() {
    // handle the search event when user clicks on search button
    const searchbar = document.querySelector('.searchbar');
    const searchButton = searchbar.querySelector('.search-button');
    searchButton.addEventListener('click', async () => {
        const productName = searchbar.querySelector('.searchbar-input input').value;
        const category = searchbar.querySelector('.dropdown p').textContent;
        window.location.href = "/pages/products?type=search&product=" + productName + "&category=" + category;
    })
}

// dropdown setting handling
function dropDownButtonEventHandler() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdown.dropdownHandler(dropdowns);
    document.addEventListener('click', () => {
        dropdown.dropdownDiactivatorOnoutsideClick(dropdowns);
    })
}

// to product category navigator function
function productCategoryInitializer(collectionList) {
    if (!collectionList) return;
    const categoryContent = document.querySelector(".category-content");
    let categoryItems = "";

    // creating main category items
    collectionList.forEach(collection => {
        const collDescription = collection.description.replace(/<\/?p>/g, "");
        if (collDescription === "main-category") {
            let categoryItem = "<div class='category-item btn-shadow'>\n";
            // category icon image
            const icon = icons[collection.title.toLowerCase()];
            if (icon) categoryItem += `<img src="${icon}" class="category-icon">\n`;

            // category title
            categoryItem += "<p>" + collection.title + "</p>\n";

            // category quantity
            categoryItem += `
            <div class="category-quantity">
                <p>${collection.products_count}</p>
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
function productCategoryEventHandler() {
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(categoryItem => {
        categoryItem.addEventListener('click', (event) => {
            event.stopPropagation()
            const category = categoryItem.querySelector("p").textContent;
            window.location.href = "/pages/products?type=search&product=all&category=" + category.toLowerCase();
        })
    })
};