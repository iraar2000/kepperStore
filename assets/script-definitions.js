// display product class
class productDisplay {
    constructor(title, menu, products, isViewAll) {
        this.title = title;
        this.menu = menu;
        this.products = products;
        this.isViewAll = isViewAll;
    }

    render() {
        const displayTemplate = document.querySelector('.display-template').content.cloneNode(true);
        const headerContainer = displayTemplate.querySelector('.display-card .display-header .header-container');
        const title = "<p class='title'>" + this.title + "</p>"
        if (this.title) headerContainer.innerHTML = title;
        return displayTemplate;
    }
}

// categogry card class
class categoryCard {
    constructor(name, items, image) {
        this.name = name;
        this.items = items;
        this.image = image;
    }

    imageCreator() {
        const image = document.createElement('img');
        if (this.image) image.src = this.image;
        else image.src = '../images/default.png';
        image.classList.toggle('category-image')
        return image;
    }

    descriptionContent() {
        const title = document.createElement('p');
        const itemsDescription = document.createElement('p');

        // toggle class name to the create elements
        title.classList.toggle('category-title');
        itemsDescription.classList.toggle('category-items');

        // assigning data and text content
        title.textContent = this.name;
        itemsDescription.textContent = this.items + ' items';

        return { title, itemsDescription }
    }

    render() {
        const categoryTemplate = document.querySelector('.categoryCard-template').content.cloneNode(true);
        const addCardInfo = categoryTemplate.querySelector('.card-description');
        const addCardImage = categoryTemplate.querySelector('.card-image');

        // the image appending on the container
        addCardImage.appendChild(this.imageCreator());

        // the decription appending in the container
        const { title, itemsDescription } = this.descriptionContent();
        addCardInfo.append(title, itemsDescription);
        return categoryTemplate;
    }
}

// group card class
class groupCard {
    constructor(title, categoryData) {
        this.title = title;
        this.categoryData = categoryData;
    }

    addCardFormation(add_title, add_subTitle, add_imageURL) {
        const addCardImage = document.createElement('div');
        const addImage = "<img src='" + add_imageURL + "' class='image' alt='add image'>"
        addCardImage.innerHTML = addImage;

        const addCardInfo = document.createElement('div');
        const infoTitle = "<p class='info-title'>" + add_title + "</p>";
        const subInfoTitle = "<p class='info-subTitle'>" + add_subTitle + ".</p>";
        const shopButton = "<div class='btn btn-md shop-button'>shop now</div>";

        // creating the class name
        addCardInfo.classList.toggle('add-Info');
        addCardImage.classList.toggle('add-image');

        // appending to the parent container
        addCardInfo.innerHTML = infoTitle + '\n' + subInfoTitle + '\n' + shopButton;

        return { addCardImage, addCardInfo };
    }

    groupCategoryFormation() {
        const categoryContainer = document.createElement('div');

        // looping and creating category element
        this.categoryData.forEach(category => {
            const categories = new categoryCard(category.title, category.products_count, category.image.src);
            console.log(categories);
        })
        categoryContainer.classList.toggle('group-category');
        return categoryContainer;
    }

    render() {
        const groupTemplate = document.querySelector('.group-template').content.cloneNode(true);
        const groupHeader = groupTemplate.querySelector('.group-container .group-header');
        const groupProducts = groupTemplate.querySelector('.group-container .group-products');

        // setting the group title and viewbtn
        groupHeader.querySelector('.group-title .title').textContent = this.title;

        // setting the add and categories of the selected group
        const addCard = groupHeader.querySelector('.group-category .add-card');
        const categorySection = groupHeader.querySelector('.group-category .category-section');

        const { addCardImage, addCardInfo } = this.addCardFormation('redmi note 12 Pro+ 5g', 'Rise to the challenge', useImage["add-image"]);

        // add card creation area
        addCard.append(addCardImage, addCardInfo);

        // category section creation 
        this.groupCategoryFormation();
        categorySection.appendChild(this.groupCategoryFormation());

        return groupTemplate;
    }
}
