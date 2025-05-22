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

if (recipes.length === 0) {
    recipes = [
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
        {
            id: '3',
            name: 'Caprese Salad',
            category: 'Vegetarian',
            ingredients: ['Tomatoes', 'Fresh Mozzarella', 'Basil', 'Balsamic Glaze', 'Olive Oil', 'Salt', 'Pepper'],
            steps: ['Slice tomatoes and mozzarella', 'Arrange on plate with basil', 'Drizzle with olive oil and balsamic', 'Season with salt and pepper'],
            time: '10 mins',
            servings: '2',
            image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '4',
            name: 'Vegetable Lasagna',
            category: 'Vegetarian',
            ingredients: ['Lasagna Noodles', 'Ricotta Cheese', 'Spinach', 'Zucchini', 'Tomato Sauce', 'Mozzarella Cheese'],
            steps: ['Cook noodles', 'Layer with vegetables and cheese', 'Bake at 375°F for 45 minutes', 'Let rest before serving'],
            time: '1 hour',
            servings: '6',
            image: 'https://images.unsplash.com/photo-1629115916087-7e8c114a24ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '5',
            name: 'Hummus Wrap',
            category: 'Vegetarian',
            ingredients: ['Whole Wheat Tortilla', 'Hummus', 'Cucumber', 'Tomato', 'Red Onion', 'Lettuce'],
            steps: ['Spread hummus on tortilla', 'Add sliced vegetables', 'Roll tightly and slice in half'],
            time: '10 mins',
            servings: '1',
            image: 'https://images.unsplash.com/photo-1546069901-4562a0d1c4ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        // 15 more vegetarian recipes...

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
        {
            id: '23',
            name: 'Grilled Salmon',
            category: 'Non-Vegetarian',
            ingredients: ['Salmon Fillet', 'Lemon', 'Dill', 'Olive Oil', 'Salt', 'Pepper'],
            steps: ['Season salmon', 'Preheat grill', 'Grill for 4-5 minutes per side', 'Serve with lemon'],
            time: '15 mins',
            servings: '2',
            image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '24',
            name: 'Beef Tacos',
            category: 'Non-Vegetarian',
            ingredients: ['Ground Beef', 'Taco Shells', 'Lettuce', 'Tomato', 'Cheese', 'Sour Cream', 'Taco Seasoning'],
            steps: ['Brown beef with seasoning', 'Prepare toppings', 'Warm taco shells', 'Assemble tacos'],
            time: '25 mins',
            servings: '4',
            image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '25',
            name: 'Chicken Curry',
            category: 'Non-Vegetarian',
            ingredients: ['Chicken Thighs', 'Onion', 'Garlic', 'Ginger', 'Curry Powder', 'Coconut Milk', 'Tomato'],
            steps: ['Brown chicken', 'Sauté onions, garlic, ginger', 'Add spices and coconut milk', 'Simmer for 20 minutes'],
            time: '40 mins',
            servings: '4',
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        // 15 more non-vegetarian recipes...

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
        },
        {
            id: '43',
            name: 'Grilled Chicken Salad',
            category: 'Diet',
            ingredients: ['Grilled Chicken', 'Mixed Greens', 'Cherry Tomatoes', 'Cucumber', 'Olive Oil', 'Lemon Juice'],
            steps: ['Chop vegetables', 'Slice chicken', 'Combine in bowl', 'Dress with olive oil and lemon'],
            time: '15 mins',
            servings: '2',
            image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '44',
            name: 'Avocado Toast',
            category: 'Diet',
            ingredients: ['Whole Grain Bread', 'Avocado', 'Egg', 'Red Pepper Flakes', 'Salt', 'Pepper'],
            steps: ['Toast bread', 'Mash avocado', 'Fry or poach egg', 'Assemble toast with avocado and egg', 'Season to taste'],
            time: '10 mins',
            servings: '1',
            image: 'https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '45',
            name: 'Vegetable Soup',
            category: 'Diet',
            ingredients: ['Carrots', 'Celery', 'Onion', 'Garlic', 'Vegetable Broth', 'Tomatoes', 'Green Beans'],
            steps: ['Sauté vegetables', 'Add broth and tomatoes', 'Simmer for 20 minutes', 'Season to taste'],
            time: '30 mins',
            servings: '4',
            image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        }
        // 5 more diet recipes...
    ];
    
    localStorage.setItem('recipes', JSON.stringify(recipes));
}
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
