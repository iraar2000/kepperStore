//  these are parameters sent when navigating to the product page
const params = new URLSearchParams(window.location.search);
const type = params.get('type');
const product = params.get('product');
const categories = params.get('category');

console.log(type, product, categories)