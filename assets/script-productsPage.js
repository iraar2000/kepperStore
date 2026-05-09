//  these are parameters sent when navigating to the product page
const params = new URLSearchParams(window.location.search);
const type = params.get('type');
const product = params.get('product');
const collections = params.get('collection');

console.log(type, product, collections)