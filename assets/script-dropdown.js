export function dropdownLayout(icons) {

}

// this function handles the action performed on the dropdown
export function dropdownHandler(dropdowns) {
    dropdowns.forEach((dropdown) => {
        const title = dropdown.querySelector('.dropdown-title');
        const items = dropdown.querySelectorAll('.dropdown-item');

        // set value to the early saved value
        const savedTitle = localStorage.getItem(dropdown.dataset.name);
        if (savedTitle) title.querySelector("p").textContent = savedTitle;

        // handle activating the dropdown and diactivating the dropdown
        title.addEventListener('click', (event) => {
            event.stopPropagation();

            // remove active from other dropdowns
            dropdowns.forEach((d) => {
                const ttl = d.querySelector('.dropdown-title');
                if (ttl != title) ttl.classList.remove('btn-active');
                if (d != dropdown) d.classList.remove("active");
            });

            // open dropdown first
            dropdown.classList.toggle("active");
            title.classList.toggle('btn-active');

            // now measure
            const dropdown_content = dropdown.querySelector('.dropdown-content');

            requestAnimationFrame(() => {
                const rect = dropdown_content.getBoundingClientRect();
                const viewPort = window.innerWidth;

                if (rect.right > viewPort) {
                    dropdown_content.style.right = "0";
                    dropdown_content.style.left = "auto";
                }
                else if (rect.left < 0) {
                    dropdown_content.style.left = "0";
                    dropdown_content.style.right = "auto";
                }
            });
        });

        // handling the item selection
        items.forEach((item) => {
            item.addEventListener('click', (event) => {
                event.stopPropagation();

                // select component
                const select = dropdown.querySelector('select');
                const titleP = title.querySelector('p');

                // updating the component and the textContent
                const selectedVal = item.dataset.value;
                titleP.textContent = selectedVal;

                if (select) {
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
}


// Close dropdowns when clicking outside
export function dropdownDiactivatorOnoutsideClick(dropdowns) {
    dropdowns.forEach(dropdown => {
        dropdown.querySelector('.dropdown-title').classList.remove('btn-active');
        dropdown.classList.remove('active')
    });
}
