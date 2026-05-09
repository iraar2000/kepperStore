// function which handles the search of a product
export async function filterProducts(fetched_products, productName) {
    console.log(productName, fetched_products);
}

// the function which the available categories
export function insertCollection(categories) {
    const searchbar_collection = document.querySelector('.searchbar .dropdown');
    const collection_content = searchbar_collection.querySelector(".dropdown-content");
    if (!categories && categories.length == 0) return;

    // loop and create the appendable collection elements
    let itemsStructure = "<div class='dropdown-item' data-value='All'>All Collection</div>";
    categories.forEach(collection => {
        itemsStructure += "<div class='dropdown-item' data-value='" + collection.title + "'>" + collection.title + "</div>"
    });
    collection_content.innerHTML = itemsStructure;
}