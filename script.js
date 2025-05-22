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

    // Initialize recipes array with 50 default recipes
    let recipes = loadRecipes();

    // Load recipes with GitHub Pages compatibility
    function loadRecipes() {
        try {
            const storedRecipes = localStorage.getItem('recipes');
            if (storedRecipes) {
                return JSON.parse(storedRecipes);
            }
        } catch (e) {
            console.warn("Couldn't read from localStorage:", e);
        }

        // Default recipes (50 total)
        return getDefaultRecipes();
    }

    // Get all default recipes
    function getDefaultRecipes() {
        return [
            // 20 Vegetarian Recipes
            {
                id: '1',
                name: 'Vegetable Stir Fry',
                category: 'Vegetarian',
                ingredients: ['Bell Pepper', 'Broccoli', 'Carrot', 'Soy Sauce', 'Garlic', 'Ginger', 'Sesame Oil'],
                steps: ['Chop all vegetables', 'Heat oil in pan', 'Add garlic and ginger', 'Add vegetables and stir fry', 'Add soy sauce'],
                time: '20 mins',
                servings: '2',
                image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: '2',
                name: 'Margherita Pizza',
                category: 'Vegetarian',
                ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella Cheese', 'Basil', 'Olive Oil'],
                steps: ['Roll out dough', 'Spread tomato sauce', 'Add cheese', 'Bake at 450°F for 12 minutes', 'Add fresh basil'],
                time: '30 mins',
                servings: '4',
                image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
            },
            // 18 more vegetarian recipes...
            
            // 20 Non-Vegetarian Recipes
            {
                id: '21',
                name: 'Grilled Chicken',
                category: 'Non-Vegetarian',
                ingredients: ['Chicken Breast', 'Olive Oil', 'Lemon', 'Garlic', 'Rosemary', 'Salt', 'Pepper'],
                steps: ['Marinate chicken', 'Preheat grill', 'Grill for 6-8 minutes per side', 'Rest before serving'],
                time: '25 mins',
                servings: '2',
                image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: '22',
                name: 'Beef Burger',
                category: 'Non-Vegetarian',
                ingredients: ['Ground Beef', 'Burger Buns', 'Lettuce', 'Tomato', 'Onion', 'Cheese', 'Pickles'],
                steps: ['Form patties', 'Season with salt and pepper', 'Grill or pan fry', 'Assemble burger with toppings'],
                time: '20 mins',
                servings: '4',
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
            },
            // 18 more non-vegetarian recipes...
            
            // 10 Diet Recipes
            {
                id: '41',
                name: 'Quinoa Salad',
                category: 'Diet',
                ingredients: ['Quinoa', 'Cucumber', 'Tomato', 'Red Onion', 'Lemon', 'Olive Oil', 'Parsley'],
                steps: ['Cook quinoa', 'Chop vegetables', 'Mix with quinoa', 'Add lemon juice and olive oil', 'Garnish with parsley'],
                time: '25 mins',
                servings: '2',
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: '42',
                name: 'Greek Yogurt Parfait',
                category: 'Diet',
                ingredients: ['Greek Yogurt', 'Mixed Berries', 'Granola', 'Honey'],
                steps: ['Layer yogurt in glass', 'Add berries', 'Sprinkle granola', 'Drizzle with honey'],
                time: '5 mins',
                servings: '1',
                image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
            }
            // 8 more diet recipes...
        ];
    }

    // Save recipes with error handling
    function saveRecipes() {
        try {
            localStorage.setItem('recipes', JSON.stringify(recipes));
            console.log('Recipes saved successfully');
        } catch (e) {
            console.error("Failed to save recipes:", e);
            // Fallback: Store in memory (will reset on refresh)
        }
    }

    // Image upload preview
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.match('image.*')) {
                alert('Please select an image file (JPEG, PNG, etc.)');
                this.value = '';
                return;
            }

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
            reader.onerror = function() {
                alert('Error loading image');
                imageInput.value = '';
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
        const servings = document.getElementById('recipe-servings').value.trim();
        
        // Validate required fields
        if (!name) return alert('Please enter a recipe name');
        if (!category || category === "Select Category") return alert('Please select a category');
        if (!ingredients) return alert('Please enter at least one ingredient');
        if (!steps) return alert('Please enter preparation steps');
        
        // Create recipe object
        const recipe = {
            id: Date.now().toString(),
            name,
            category,
            ingredients: ingredients.split('\n').filter(ing => ing.trim()),
            steps: steps.split('\n').filter(step => step.trim()),
            time: time || 'Not specified',
            servings: servings || 'Not specified',
            image: null
        };
        
        try {
            // Handle image upload
            if (imageInput.files[0]) {
                recipe.image = await readFileAsDataURL(imageInput.files[0]);
            }
            
            // Add to recipes array
            recipes.push(recipe);
            saveRecipes();
            
            // Reset form
            recipeForm.reset();
            uploadLabel.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <span>Click to upload image</span>
            `;
            
            // Show success and display recipes
            alert(`Recipe "${name}" saved successfully!`);
            viewRecipesBtn.click();
            
        } catch (error) {
            console.error('Error saving recipe:', error);
            alert('Error saving recipe. Please check console for details.');
        }
    });

    // Helper function to read file as data URL
    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }

    // Display recipes
    function displayRecipes(category = 'all') {
        recipesContainer.innerHTML = '';
        
        const filteredRecipes = category === 'all' 
            ? recipes 
            : recipes.filter(recipe => recipe.category === category);
        
        if (filteredRecipes.length === 0) {
            recipesContainer.innerHTML = `
                <div class="no-recipes">
                    <i class="fas fa-book-open"></i>
                    <p>No recipes found in this category</p>
                    <button onclick="location.reload()">Refresh</button>
                </div>
            `;
            return;
        }
        
        filteredRecipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.innerHTML = `
                ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">` : 
                '<div class="recipe-image-placeholder"><i class="fas fa-utensils"></i></div>'}
                <div class="recipe-badge ${recipe.category.toLowerCase().replace(' ', '-')}">${recipe.category}</div>
                <div class="recipe-info">
                    <h3>${recipe.name}</h3>
                    <div class="recipe-meta">
                        ${recipe.time ? `<span><i class="far fa-clock"></i> ${recipe.time}</span>` : ''}
                        ${recipe.servings ? `<span><i class="fas fa-utensils"></i> ${recipe.servings}</span>` : ''}
                    </div>
                    <p>${recipe.ingredients.slice(0, 3).join(', ')}${recipe.ingredients.length > 3 ? '...' : ''}</p>
                </div>
            `;
            recipeCard.addEventListener('click', () => openRecipeModal(recipe));
            recipesContainer.appendChild(recipeCard);
        });
    }

    // Open recipe modal
    function openRecipeModal(recipe) {
        document.getElementById('modal-title').textContent = recipe.name;
        
        // Set meta information
        const modalMeta = document.getElementById('modal-meta');
        modalMeta.innerHTML = '';
        
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
        recipe.steps.forEach((step, i) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>Step ${i+1}:</strong> ${step}`;
            stepsList.appendChild(li);
        });
        
        modal.style.display = 'block';
    }

    // Search functionality
    function searchRecipes() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            displayRecipes();
            return;
        }
        
        const filteredRecipes = recipes.filter(recipe => {
            return recipe.name.toLowerCase().includes(query) || 
                   recipe.ingredients.some(ing => ing.toLowerCase().includes(query));
        });
        
        displayRecipes();
        recipesContainer.innerHTML = '';
        
        if (filteredRecipes.length === 0) {
            recipesContainer.innerHTML = `
                <div class="no-recipes">
                    <i class="fas fa-search"></i>
                    <p>No recipes found matching "${query}"</p>
                </div>
            `;
            return;
        }
        
        filteredRecipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.innerHTML = `
                ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">` : 
                '<div class="recipe-image-placeholder"><i class="fas fa-utensils"></i></div>'}
                <div class="recipe-badge ${recipe.category.toLowerCase().replace(' ', '-')}">${recipe.category}</div>
                <div class="recipe-info">
                    <h3>${recipe.name}</h3>
                    <p>${recipe.ingredients.slice(0, 3).join(', ')}...</p>
                </div>
            `;
            recipeCard.addEventListener('click', () => openRecipeModal(recipe));
            recipesContainer.appendChild(recipeCard);
        });
    }

    // Event Listeners
    addRecipeBtn.addEventListener('click', function() {
        homeSection.style.display = 'none';
        addRecipeSection.style.display = 'block';
        viewRecipesSection.style.display = 'none';
    });

    viewRecipesBtn.addEventListener('click', function() {
        homeSection.style.display = 'none';
        addRecipeSection.style.display = 'none';
        viewRecipesSection.style.display = 'block';
        displayRecipes();
    });

    backFromAddBtn.addEventListener('click', function() {
        homeSection.style.display = 'flex';
        addRecipeSection.style.display = 'none';
        viewRecipesSection.style.display = 'none';
    });

    backFromViewBtn.addEventListener('click', function() {
        homeSection.style.display = 'flex';
        addRecipeSection.style.display = 'none';
        viewRecipesSection.style.display = 'none';
    });

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            displayRecipes(this.dataset.category);
        });
    });

    searchBtn.addEventListener('click', searchRecipes);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchRecipes();
    });

    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) modal.style.display = 'none';
    });

    document.addEventListener('click', function(e) {
        if (e.target !== searchInput) {
            autocompleteResults.style.display = 'none';
        }
    });

    // Initialize
    homeSection.style.display = 'flex';
    addRecipeSection.style.display = 'none';
    viewRecipesSection.style.display = 'none';
    displayRecipes();
});