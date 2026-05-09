// store url
const url = window.location.href
console.log("main url: ", url);

// fetching helper functions
async function fetchCollection(collHandle) {
    const response = await fetch(`/collections/${collHandle}?view=collectionJson`);
    const collectionsData = await response.json();
    return collectionsData;
}

async function fetchProductByHandle(prodHandle) {
    try {
        const response = await fetch(`/products/${prodHandle}?view=productJson`);

        if (!response.ok) {
            throw new Error(`Failed to fetch product: ${prodHandle}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Product fetch error:", error);
        return null;
    }
}

// this function fetches products from shopify store using the specified limit
export async function fetchProducts(limit) {
    try {
        let productHandle = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const res = await fetch(`/products.json?limit=${limit}&page=${page}`);
            const data = await res.json();
            const newHandle = data.products.map(product => product.handle);
            productHandle = [...productHandle, ...newHandle];

            if (data.products.length < 250) {
                hasMore = false;
            } else {
                page++;
            }
        }

        return productHandle;

    } catch (error) {
        console.log("failed to fetch many products at once products! error: ", error);
    }
}

export async function fetchSubCategories() {
    try {
        const response = await fetch("/collections.json");
        console.log("Subcategories response: ", response);
        const data = await response.json();
        console.log("Fetched subcategories: ", data.collections);
        return data.collections;
    } catch (error) {
        console.log("Failed to fetch subcategories with error: ", error);
        return [];
    }
}

export async function fetchCart() {
    try {
        const response = await fetch("/cart.js");
        return await response.json();
    } catch (error) {
        console.log("Failed to fetch cart items with error: ", error);
        return null;
    }
}

// api request functions
export async function getCollectionByType(collectionList, type) {
    const filtered = collectionList.filter(coll => coll.type === type);
    const collectionByType = await Promise.all(
        filtered.map(coll => fetchCollection(coll.handle))
    );
    return collectionByType;
}

export async function getCollectionSubCollection(collection) {
    const subCollections = await Promise.all(
        collection.subcollections.map(subColl => fetchCollection(subColl))
    );
    return subCollections;
}

export async function getCollectionProducts(collection) {
    const productData = await Promise.all(
        collection.products.map(product => fetchProductByHandle(product))
    )
    return productData;
}

export async function getCollectionByHandel(collHandle) {
    const productData = await fetchCollection(collHandle);
    return productData;
}

export async function getProductByHandle(prodHandle) {
    const product = await fetchProductByHandle(prodHandle);
    return product;
}

// cart management functions for adding, updating, removing and clearing cart items
export async function addToCart(productid, quantity) {
    try {
        const response = await fetch("/cart/add.js", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: productid,
                quantity: quantity
            })
        })
        console.log("Item added to cart successfully: ", await response.json());
    } catch (error) {
        console.error("Failed to add item to cart: ", error);
    }
}

export async function updateCart(lineItemId, quantity) {
    try {
        const response = await fetch("/cart/change.js", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: lineItemId,
                quantity: quantity
            })
        })
        console.log("Cart item updated successfully: ", await response.json());
    }
    catch (error) {
        console.error("Failed to update cart item: ", error);
    }
}

export async function removeFromCart(lineItemId) {
    try {
        console.log(lineItemId);
        const response = await fetch("/cart/change.js", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: lineItemId,
                quantity: 0
            })
        })
        console.log("Item removed from cart successfully: ", await response.json());
    }
    catch (error) {
        console.error("Failed to remove item from cart: ", error);
    }
}

export async function clearCart() {
    try {
        const response = await fetch("/cart/clear.js", {
            method: "POST"
        });
        console.log("Cart cleared successfully: ", await response.json());
    }
    catch (error) {
        console.error("Failed to clear cart: ", error);
    }
}