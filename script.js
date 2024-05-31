document.addEventListener('DOMContentLoaded', () => {
    const filterButtonsContainer = document.querySelector('.filters');
    const jobListingsContainer = document.querySelector('.job-listings');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const clearFiltersContainer = document.querySelector('.clear-filters-container');

    const filters = new Set();
    let jobListings = [];

    function createJobCard(job) {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.innerHTML = `
            <div class="header">
                <img src="${job.logo}" alt="${job.company} logo">
                <div class="company-info">
                    <div class="company">${job.company}</div>
                    <div class="tags">
                        ${job.new ? '<span class="tag">New!</span>' : ''}
                        ${job.featured ? '<span class="tag">Featured</span>' : ''}
                    </div>
                </div>
            </div>
            <div class="details">
                <div class="position">${job.position}</div>
                <div class="meta">
                    <span>${job.postedAt}</span>
                    <span>${job.contract}</span>
                    <span>${job.location}</span>
                </div>
                <div class="tags">
                    ${[job.role, job.level, ...job.languages, ...job.tools].map(tag => `
                        <span class="filter-btn">${tag}</span>
                    `).join('')}
                </div>
            </div>
        `;
        return jobCard;
    }

    function createFilterButton(filter) {
        const button = document.createElement('button');
        button.classList.add('filter-btn');
        button.innerHTML = `${filter} <span class="clear-individual-btn">&times;</span>`;
        button.addEventListener('click', (event) => {
            if (event.target.classList.contains('clear-individual-btn')) {
                filters.delete(filter);
                updateFiltersUI();
            }
        });
        return button;
    }

    function renderJobListings() {
        jobListingsContainer.innerHTML = '';
        jobListings
            .filter(job => {
                const jobTags = new Set([job.role, job.level, ...job.languages, ...job.tools]);
                return [...filters].every(filter => jobTags.has(filter));
            })
            .forEach(job => {
                jobListingsContainer.appendChild(createJobCard(job));
            });
    }

    function renderFilterButtons() {
        filterButtonsContainer.innerHTML = '';
        filters.forEach(filter => {
            filterButtonsContainer.appendChild(createFilterButton(filter));
        });
    }

    function updateFiltersUI() {
        renderFilterButtons();
        renderJobListings();
        clearFiltersContainer.style.display = filters.size > 0 ? 'block' : 'none';
    }

    clearFiltersBtn.addEventListener('click', () => {
        filters.clear();
        updateFiltersUI();
    });

    jobListingsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('filter-btn')) {
            const filter = event.target.textContent.trim();
            filters.has(filter) ? filters.delete(filter) : filters.add(filter);
            updateFiltersUI();
        }
    });

    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            jobListings = data;
            renderJobListings();
        })
        .catch(error => console.error('Error fetching data:', error));

    updateFiltersUI();
});