const dropdowns = document.querySelectorAll(".dropdown");


dropdowns.forEach((dropdown) => {
    const title = dropdown.querySelector('.dropdown-title');
    const items = dropdown.querySelectorAll('.dropdown-item');
    const savedTitle = localStorage.getItem(dropdown.dataset.name);
    if(savedTitle) title.querySelector("p").textContent = savedTitle;

    // handle activating the dropdown and diactivating the dropdown
    title.addEventListener('click', (event) => {
        event.stopPropagation();

        // remove active class from the none clicked dropdowns
        dropdowns.forEach((d) => {
            const ttl = d.querySelector('.dropdown-title');
            if(ttl != title) ttl.classList.remove('btn-active');
            if(d != dropdown) d.classList.remove("active")
        })

        // add the active class to the clicked dropdown
        dropdown.classList.toggle("active");
        title.classList.toggle('btn-active');
    })

    items.forEach((item) => {
        item.addEventListener('click', (event) => {
            event.stopPropagation();

            // select component
            const select = dropdown.querySelector('select');
            const titleP = title.querySelector('p');
            
            // updating the component and the textContent
            const selectedVal = item.dataset.value;
            titleP.textContent = selectedVal;
            console.log("category select val: ", selectedVal);

            if(select) {
                select.value = selectedVal;
                select.form.submit();
            }
            
            // store the values in localstorage
            localStorage.setItem(dropdown.dataset.name, selectedVal);

            // remove the active values
            title.classList.remove('btn-active');
            dropdown.classList.remove('active');
        })
    })
    
})

// Close dropdowns when clicking outside
document.addEventListener('click', () => {
    dropdowns.forEach(dropdown => {
        dropdown.querySelector('.dropdown-title').classList.remove('btn-active');
        dropdown.classList.remove('active')
    });
});