document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.nav-list > li');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const dropdown = item.querySelector('.dropdown');
            if (dropdown) {
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            }
        });
    });
});
