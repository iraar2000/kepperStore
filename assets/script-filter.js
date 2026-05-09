import * as api from "./script-api.js";

export async function getCollectionByType(collectionList, type) {
    const filtered = collectionList.filter(coll => coll.type === type);
    const collectionByType = await Promise.all(
        filtered.map(coll => api.fetchCollection(coll.handle))
    );
    return collectionByType;
}

export async function getSubCollection(collection) {
    const subCollections = await Promise.all(
        collection.subcollections.map(subColl => api.fetchCollection(subColl))
    );
    return subCollections;
}

export async function getCollectionProducts(collection) {
    const productData = await Promise.all(
        collection.products.map(product => api.fetchProducts(product))
    )
    return productData;
}
