// function which handles the search of a product
export async function filterProducts(fetched_products, productName) {
    console.log(productName, fetched_products);
}

// the function which the available categories
export function insertCategory(categories) {
    const searchbar_category = document.querySelector('.searchbar .dropdown');
    const category_content = searchbar_category.querySelector(".dropdown-content");
    if (!categories && categories.length == 0) return;

    // loop and create the appendable category elements
    let itemsStructure = "<div class='dropdown-item' data-value='All'>All Category</div>";
    categories.forEach(category => {
        itemsStructure += "<div class='dropdown-item' data-value='" + category.title + "'>" + category.title + "</div>"
    });
    category_content.innerHTML = itemsStructure;
}