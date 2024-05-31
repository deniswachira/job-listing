document.addEventListener('DOMContentLoaded', () => {
    const jobListings = [
        {
            "id": 1,
            "company": "Photosnap",
            "logo": "./images/photosnap.svg",
            "new": true,
            "featured": true,
            "position": "Senior Frontend Developer",
            "role": "Frontend",
            "level": "Senior",
            "postedAt": "1d ago",
            "contract": "Full Time",
            "location": "USA Only",
            "languages": ["HTML", "CSS", "JavaScript"],
            "tools": []
        },
        {
            "id": 2,
            "company": "Manage",
            "logo": "./images/manage.svg",
            "new": true,
            "featured": true,
            "position": "Fullstack Developer",
            "role": "Fullstack",
            "level": "Midweight",
            "postedAt": "1d ago",
            "contract": "Part Time",
            "location": "Remote",
            "languages": ["Python"],
            "tools": ["React"]
        },
        // ... (other job listings)
    ];

    const filterButtonsContainer = document.querySelector('.filters');
    const jobListingsContainer = document.querySelector('.job-listings');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const clearFiltersContainer = document.querySelector('.clear-filters-container');

    const filters = new Set();

    function renderJobListings(jobs) {
        jobListingsContainer.innerHTML = '';
        jobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.classList.add('job-card');

            const jobTags = job.languages.concat(job.tools).concat([job.role, job.level]);

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
                        ${jobTags.map(tag => `<span class="filter-btn">${tag}</span>`).join('')}
                    </div>
                </div>
            `;

            jobListingsContainer.appendChild(jobCard);
        });

        addFilterButtonListeners();
    }

    function renderFilterButtons(categories) {
        filterButtonsContainer.innerHTML = '';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.classList.add('filter-btn');
            button.innerText = category;
            button.addEventListener('click', () => {
                if (filters.has(category)) {
                    filters.delete(category);
                    button.classList.remove('active');
                } else {
                    filters.add(category);
                    button.classList.add('active');
                }
                updateFiltersUI();
                filterJobListings();
            });
            filterButtonsContainer.appendChild(button);
        });
    }

    function filterJobListings() {
        if (filters.size === 0) {
            renderJobListings(jobListings);
        } else {
            const filteredJobs = jobListings.filter(job =>
                [...filters].every(filter => job.languages.includes(filter) || job.tools.includes(filter) || job.role === filter || job.level === filter)
            );
            renderJobListings(filteredJobs);
        }
    }

    function updateFiltersUI() {
        if (filters.size > 0) {
            clearFiltersContainer.style.display = 'block';
        } else {
            clearFiltersContainer.style.display = 'none';
        }
    }

    function addFilterButtonListeners() {
        const filterButtons = document.querySelectorAll('.job-card .filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.innerText;
                if (filters.has(category)) {
                    filters.delete(category);
                    button.classList.remove('active');
                } else {
                    filters.add(category);
                    button.classList.add('active');
                }
                updateFiltersUI();
                filterJobListings();
            });
        });
    }

    clearFiltersBtn.addEventListener('click', () => {
        filters.clear();
        updateFiltersUI();
        renderFilterButtons(allCategories);
        renderJobListings(jobListings);
    });

    const allCategories = [...new Set(jobListings.flatMap(job => job.languages.concat(job.tools).concat([job.role, job.level])))];
    renderFilterButtons(allCategories);
    renderJobListings(jobListings);
});
