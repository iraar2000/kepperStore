// fetch data from the store
export async function fetchCollections() {
    try {
        const response = await fetch('/collections.json');
        const collections = await response.json();
        return collections;
    } catch (error) {
        console.error(error);
    }
}

// search product function handler
export async function fetchProduct(productName, category) {
    // url formation
    try {
        if (category != 'All') {
            const collectionNm = category.toLowerCase().replace(" ", "-");
            let requestUrl = '/collections/' + collectionNm + '/products.json';
            const response = await fetch(requestUrl);
            return await response.json();
        } else {
            let requestUrl = '/search/suggest.json?q=' + productName + '&type=product';
            const response = await fetch(requestUrl);
            return await response.json();
        };
    } catch (error) {
        return error
    }
    // getting the collections and searched product
}