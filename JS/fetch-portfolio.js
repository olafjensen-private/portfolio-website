document.addEventListener("DOMContentLoaded", () => {
    const portfolioItemsContainer = document.getElementById("portfolio-items");
    const filtersContainer = document.getElementById("portfolio-filters");

    fetch("../JSON/portfolio.json")
        .then(response => response.json())
        .then(data => {
            const categories = data.categories;
            const urlParams = new URLSearchParams(window.location.search);
            let selectedCategory = urlParams.get("category") || "all";

            function displayProjects(categorySlug) {
                portfolioItemsContainer.innerHTML = "";
                const selectedCategoryData = categorySlug === "all" ? categories : categories.filter(category => category.slug === categorySlug);
                selectedCategoryData.forEach(category => {
                    category.projects.forEach(project => {
                        const projectElement = document.createElement("div");
                        projectElement.classList.add("portfolio-item");
                        projectElement.innerHTML = `
                            <img src="${project.image}" alt="${project.title}">
                            <div class="portfolio-item-content">
                                <h3>${project.title}</h3>
                                <p>${project.description}</p>
                                <a href="${project.link}" target="_blank">View Project</a>
                            </div>
                        `;
                        portfolioItemsContainer.appendChild(projectElement);
                    });
                });
            }

            function createFilterButtons() {
                filtersContainer.innerHTML = "";
                const allButton = document.createElement("button");
                allButton.textContent = "All Projects";
                allButton.setAttribute("data-category", "all");
                filtersContainer.appendChild(allButton);

                categories.forEach(category => {
                    const button = document.createElement("button");
                    button.textContent = category.name;
                    button.setAttribute("data-category", category.slug);
                    filtersContainer.appendChild(button);
                });
            }

            filtersContainer.addEventListener("click", (e) => {
                if (e.target.tagName === "BUTTON") {
                    const categorySlug = e.target.getAttribute("data-category");
                    window.location.search = `?category=${categorySlug}`;
                    displayProjects(categorySlug);
                }
            });

            displayProjects(selectedCategory);
            createFilterButtons();
        })
        .catch(error => console.error("Error loading portfolio data:", error));
});