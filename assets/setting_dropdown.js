// JavaScript to handle dropdown-setting functionality
document.querySelectorAll('.dropdown-setting').forEach((dropdown) => {
  const titleWrapper = dropdown.querySelector('.dropdown-setting-title');
  const titleText = titleWrapper.querySelector('p');
  const items = dropdown.querySelectorAll('.dropdown-setting-item');
  const selector = dropdown.querySelector('select'); // Use 'select', not '.setting-select'

  // Restore selection from localStorage or current Shopify value
  const savedValue = localStorage.getItem(selector.name);
  if (savedValue) {
    selector.value = savedValue;
    const selectedItem = Array.from(items).find(item => item.dataset.value === savedValue);
    if (selectedItem) titleText.textContent = selectedItem.textContent;
  } else {
    // Show Shopify current value if no localStorage
    const currentItem = Array.from(items).find(item => item.dataset.value === selector.value);
    if (currentItem) titleText.textContent = currentItem.textContent;
  }

  // Toggle dropdown open/close
  titleWrapper.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.dropdown-setting.active').forEach((otherDropdown) => {
      if (otherDropdown !== dropdown) {
        otherDropdown.classList.remove('active');
      }
    });
    dropdown.classList.toggle('active');
  });

  // Handle item clicks
  items.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      titleText.textContent = item.textContent;
      selector.value = item.dataset.value; // Update hidden select
      localStorage.setItem(selector.name, selector.value); // Save selection
      const form = selector.closest('form');
      if (form) form.submit(); // Submit Shopify localization form
      dropdown.classList.remove('active');
    });
  });
});

// Close dropdowns when clicking outside
document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown-setting.active').forEach((dropdown) => {
    dropdown.classList.remove('active');
  });
});