const shopify_store = "k6xyq6-f8";
const collectionList = getCollectionsJson();

// function calls
getPopularCollections(collectionList);

function getPopularCollections(collections) {
    collections.forEach(collection => {
        console.log(collection.id)
    });
}