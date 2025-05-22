document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const homeSection = document.getElementById('home-section');
    const addRecipeBtn = document.getElementById('add-recipe-btn');
    const viewRecipesBtn = document.getElementById('view-recipes-btn');
    const addRecipeSection = document.getElementById('add-recipe-section');
    const viewRecipesSection = document.getElementById('view-recipes-section');
    const backFromAddBtn = document.getElementById('back-from-add');
    const backFromViewBtn = document.getElementById('back-from-view');
    const recipeForm = document.getElementById('recipe-form');
    const recipesContainer = document.getElementById('recipes-container');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const autocompleteResults = document.getElementById('autocomplete-results');
    const modal = document.getElementById('recipe-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const imageInput = document.getElementById('recipe-image');
    const uploadLabel = document.querySelector('.upload-label');

    // Common ingredients for autocomplete
    const commonIngredients = [
        'Chicken', 'Beef', 'Fish', 'Eggs', 'Milk', 'Cheese', 
        'Tomato', 'Onion', 'Garlic', 'Potato', 'Carrot', 'Broccoli',
        'Rice', 'Pasta', 'Bread', 'Flour', 'Sugar', 'Salt',
        'Butter', 'Oil', 'Lemon', 'Apple', 'Banana', 'Spinach',
        'Chickpeas', 'Lentils', 'Tofu', 'Mushrooms', 'Bell Pepper', 'Avocado'
    ];

    // Initialize recipes array
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    // If no recipes exist, initialize with sample data
    if (recipes.length === 0) {
        recipes = [
            // Your sample recipes here
            // ...
        ];
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }

    // Helper function to read file as data URL
    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }

    // Image upload preview
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.match('image.*')) {
                alert('Please select an image file (JPEG, PNG, etc.)');
                this.value = '';
                return;
            }

            // Validate file size (2MB max)
            if (file.size > 2 * 1024 * 1024) {
                alert('Image size should be less than 2MB');
                this.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                uploadLabel.innerHTML = `
                    <img src="${e.target.result}" class="image-preview">
                    <span>Change image</span>
                `;
            };
            reader.readAsDataURL(file);
        }
    });

    // Form submission
    recipeForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('recipe-name').value.trim();
        const category = document.getElementById('recipe-category').value;
        const ingredients = document.getElementById('recipe-ingredients').value.trim();
        const steps = document.getElementById('recipe-steps').value.trim();
        const time = document.getElementById('recipe-time').value.trim();
        
        // Validate required fields
        if (!name) {
            alert('Please enter a recipe name');
            return;
        }
        if (!category || category === "Select Category") {
            alert('Please select a category');
            return;
        }
        if (!ingredients) {
            alert('Please enter at least one ingredient');
            return;
        }
        if (!steps) {
            alert('Please enter preparation steps');
            return;
        }
        
        // Create recipe object
        const recipe = {
            id: Date.now().toString(),
            name,
            category,
            ingredients: ingredients.split('\n').filter(ing => ing.trim()),
            steps: steps.split('\n').filter(step => step.trim()),
            time: time || 'Not specified',
            image: null
        };
        
        try {
            // Handle image upload if exists
            if (imageInput.files.length > 0) {
                const file = imageInput.files[0];
                recipe.image = await readFileAsDataURL(file);
            }
            
            // Add to recipes array
            recipes.push(recipe);
            
            // Save to localStorage
            localStorage.setItem('recipes', JSON.stringify(recipes));
            
            // Reset form
            recipeForm.reset();
            uploadLabel.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <span>Click to upload image</span>
            `;
            
            // Show success message
            alert(`Recipe "${name}" saved successfully!`);
            
            // Switch to view recipes
            viewRecipesBtn.click();
            
        } catch (error) {
            console.error('Error saving recipe:', error);
            alert('There was an error saving your recipe. Please try again.');
        }
    });

    // Navigation functionality
    addRecipeBtn.addEventListener('click', function() {
        homeSection.style.display = 'none';
        addRecipeSection.style.display = 'block';
        viewRecipesSection.style.display = 'none';
        addRecipeBtn.classList.add('active');
        viewRecipesBtn.classList.remove('active');
    });

    viewRecipesBtn.addEventListener('click', function() {
        homeSection.style.display = 'none';
        addRecipeSection.style.display = 'none';
        viewRecipesSection.style.display = 'block';
        viewRecipesBtn.classList.add('active');
        addRecipeBtn.classList.remove('active');
        displayRecipes();
    });

    // Back button functionality
    backFromAddBtn.addEventListener('click', function() {
        homeSection.style.display = 'flex';
        addRecipeSection.style.display = 'none';
        viewRecipesSection.style.display = 'none';
        addRecipeBtn.classList.remove('active');
        viewRecipesBtn.classList.remove('active');
    });

    backFromViewBtn.addEventListener('click', function() {
        homeSection.style.display = 'flex';
        addRecipeSection.style.display = 'none';
        viewRecipesSection.style.display = 'none';
        addRecipeBtn.classList.remove('active');
        viewRecipesBtn.classList.remove('active');
    });

    // Initialize view
    homeSection.style.display = 'flex';
    addRecipeSection.style.display = 'none';
    viewRecipesSection.style.display = 'none';

    // Category tabs
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            displayRecipes(this.dataset.category);
        });
    });

    // Display recipes
    function displayRecipes(category = 'all') {
        recipesContainer.innerHTML = '';
        
        let filteredRecipes = recipes;
        if (category !== 'all') {
            filteredRecipes = recipes.filter(recipe => recipe.category === category);
        }
        
        if (filteredRecipes.length === 0) {
            recipesContainer.innerHTML = `
                <div class="no-recipes">
                    <i class="fas fa-book-open" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
                    <p>No recipes found in this category</p>
                </div>
            `;
            return;
        }
        
        filteredRecipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.setAttribute('data-id', recipe.id);
            
            let ingredientsPreview = recipe.ingredients.slice(0, 3).join(', ');
            if (recipe.ingredients.length > 3) {
                ingredientsPreview += '...';
            }
            
            // Determine badge class based on category
            let badgeClass = '';
            if (recipe.category === 'Vegetarian') badgeClass = 'veg';
            else if (recipe.category === 'Non-Vegetarian') badgeClass = 'non-veg';
            else if (recipe.category === 'Diet') badgeClass = 'diet';
            
            recipeCard.innerHTML = `
                ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">` : 
                '<div style="background: #f5f5f5; height: 200px; display: flex; align-items: center; justify-content: center;">' +
                '<i class="fas fa-utensils" style="font-size: 3rem; color: #ddd;"></i></div>'}
                <div class="recipe-badge ${badgeClass}">${recipe.category}</div>
                <div class="recipe-info">
                    <h3 class="recipe-title">${recipe.name}</h3>
                    <div class="recipe-meta">
                        ${recipe.time ? `<span><i class="far fa-clock"></i> ${recipe.time}</span>` : ''}
                        ${recipe.servings ? `<span><i class="fas fa-utensils"></i> ${recipe.servings}</span>` : ''}
                    </div>
                    <p class="recipe-description">${ingredientsPreview}</p>
                </div>
            `;
            
            recipeCard.addEventListener('click', () => openRecipeModal(recipe));
            recipesContainer.appendChild(recipeCard);
        });
    }

    // Search functionality with autocomplete
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        autocompleteResults.innerHTML = '';
        
        if (query.length < 2) {
            autocompleteResults.style.display = 'none';
            return;
        }
        
        const matches = commonIngredients.filter(ingredient => 
            ingredient.toLowerCase().includes(query)
        ).slice(0, 5);
        
        if (matches.length > 0) {
            matches.forEach(match => {
                const item = document.createElement('div');
                item.className = 'autocomplete-item';
                item.textContent = match;
                item.addEventListener('click', function() {
                    searchInput.value = match;
                    autocompleteResults.style.display = 'none';
                    searchRecipes();
                });
                autocompleteResults.appendChild(item);
            });
            autocompleteResults.style.display = 'block';
        } else {
            autocompleteResults.style.display = 'none';
        }
    });

    searchBtn.addEventListener('click', searchRecipes);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchRecipes();
        }
    });

    function searchRecipes() {
        const query = searchInput.value.trim().toLowerCase();
        autocompleteResults.style.display = 'none';
        
        if (!query) {
            displayRecipes();
            return;
        }
        
        const filteredRecipes = recipes.filter(recipe => {
            // Search in name
            if (recipe.name.toLowerCase().includes(query)) {
                return true;
            }
            
            // Search in ingredients
            for (const ingredient of recipe.ingredients) {
                if (ingredient.toLowerCase().includes(query)) {
                    return true;
                }
            }
            
            return false;
        });
        
        // Switch to recipes view and display results
        viewRecipesBtn.click();
        displayRecipes();
        recipesContainer.innerHTML = '';
        
        if (filteredRecipes.length === 0) {
            recipesContainer.innerHTML = `
                <div class="no-recipes">
                    <i class="fas fa-search" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
                    <p>No recipes found matching "${query}"</p>
                </div>
            `;
            return;
        }
        
        filteredRecipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.setAttribute('data-id', recipe.id);
            
            let ingredientsPreview = recipe.ingredients.slice(0, 3).join(', ');
            if (recipe.ingredients.length > 3) {
                ingredientsPreview += '...';
            }
            
            // Determine badge class based on category
            let badgeClass = '';
            if (recipe.category === 'Vegetarian') badgeClass = 'veg';
            else if (recipe.category === 'Non-Vegetarian') badgeClass = 'non-veg';
            else if (recipe.category === 'Diet') badgeClass = 'diet';
            
            recipeCard.innerHTML = `
                ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">` : 
                '<div style="background: #f5f5f5; height: 200px; display: flex; align-items: center; justify-content: center;">' +
                '<i class="fas fa-utensils" style="font-size: 3rem; color: #ddd;"></i></div>'}
                <div class="recipe-badge ${badgeClass}">${recipe.category}</div>
                <div class="recipe-info">
                    <h3 class="recipe-title">${recipe.name}</h3>
                    <div class="recipe-meta">
                        ${recipe.time ? `<span><i class="far fa-clock"></i> ${recipe.time}</span>` : ''}
                        ${recipe.servings ? `<span><i class="fas fa-utensils"></i> ${recipe.servings}</span>` : ''}
                    </div>
                    <p class="recipe-description">${ingredientsPreview}</p>
                </div>
            `;
            
            recipeCard.addEventListener('click', () => openRecipeModal(recipe));
            recipesContainer.appendChild(recipeCard);
        });
    }

    // Close autocomplete when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target !== searchInput) {
            autocompleteResults.style.display = 'none';
        }
    });

    // Modal functionality
    function openRecipeModal(recipe) {
        document.getElementById('modal-title').textContent = recipe.name;
        
        // Set meta information
        const modalMeta = document.getElementById('modal-meta');
        modalMeta.innerHTML = '';
        
        if (recipe.time || recipe.servings) {
            if (recipe.time) {
                const timeEl = document.createElement('span');
                timeEl.innerHTML = `<i class="far fa-clock"></i> ${recipe.time}`;
                modalMeta.appendChild(timeEl);
            }
            
            if (recipe.servings) {
                const servingsEl = document.createElement('span');
                servingsEl.innerHTML = `<i class="fas fa-utensils"></i> ${recipe.servings}`;
                modalMeta.appendChild(servingsEl);
            }
        }
        
        // Set image
        const modalImage = document.getElementById('modal-image');
        if (recipe.image) {
            modalImage.src = recipe.image;
            modalImage.style.display = 'block';
        } else {
            modalImage.style.display = 'none';
        }
        
        // Set ingredients
        const ingredientsList = document.getElementById('modal-ingredients');
        ingredientsList.innerHTML = '';
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        });
        
        // Set steps
        const stepsList = document.getElementById('modal-steps');
        stepsList.innerHTML = '';
        recipe.steps.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            stepsList.appendChild(li);
        });
        
        modal.style.display = 'block';
    }

    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});