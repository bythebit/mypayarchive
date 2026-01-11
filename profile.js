document.addEventListener('DOMContentLoaded', () => {
    const archiveToggleBtn = document.getElementById('archive-toggle-btn');
    const archiveGrid = document.querySelector('.archive-grid');

    if (archiveToggleBtn && archiveGrid) {
        archiveToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (archiveGrid.style.display === 'none') {
                archiveGrid.style.display = 'grid';
            } else {
                archiveGrid.style.display = 'none';
            }
        });
    }
});