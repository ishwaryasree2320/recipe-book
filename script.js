document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    initApp();
});

// App State
let currentUser = null;
let allRecipes = [];
let autocompleteData = [];

function initApp() {
    // Load default recipes and users
    initializeDefaultData();
    
    // Load recipes from localStorage
    loadRecipes();
    
    // Set up event listeners
    setupEventListeners();
    
    // Check if user is logged in
    checkAuthState();
    
    // Display featured recipes
    displayFeaturedRecipes();
}

function initializeDefaultData() {
    // Default admin user
    const defaultUsers = [
        {
            id: 'admin-user',
            name: 'Admin',
            email: 'admin@example.com',
            password: 'admin123',
            isAdmin: true
        },
        {
            id: 'default-user-1',
            name: 'Chef Marie',
            email: 'marie@example.com',
            password: 'password123',
            isAdmin: false
        },
        {
            id: 'default-user-2',
            name: 'Chef Giovanni',
            email: 'giovanni@example.com',
            password: 'password123',
            isAdmin: false
        }
    ];

    // Default recipes
    const defaultRecipes = [
        {
            id: '1',
            name: 'Classic Pancakes',
            category: 'breakfast',
            ingredients: [
                '1 cup all-purpose flour',
                '2 tablespoons sugar',
                '2 teaspoons baking powder',
                '1/2 teaspoon salt',
                '1 cup milk',
                '1 large egg',
                '2 tablespoons melted butter'
            ],
            steps: [
                'In a large bowl, whisk together flour, sugar, baking powder and salt.',
                'In another bowl, beat the egg, then add milk and melted butter.',
                'Pour the wet ingredients into the dry ingredients and stir until just combined.',
                'Heat a griddle or frying pan over medium heat and grease lightly.',
                'Pour about 1/4 cup batter onto the griddle for each pancake.',
                'Cook until bubbles form on the surface, then flip and cook until golden brown.'
            ],
            isPublic: true,
            userId: 'default-user-1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '2',
            name: 'Spaghetti Bolognese',
            category: 'dinner',
            ingredients: [
                '1 lb ground beef',
                '1 onion, chopped',
                '2 cloves garlic, minced',
                '1 can (28 oz) crushed tomatoes',
                '2 tablespoons tomato paste',
                '1 teaspoon dried oregano',
                '1 teaspoon dried basil',
                'Salt and pepper to taste',
                '1 lb spaghetti',
                'Grated Parmesan cheese for serving'
            ],
            steps: [
                'In a large skillet, brown the ground beef over medium heat.',
                'Add onion and garlic, cook until softened.',
                'Stir in crushed tomatoes, tomato paste, oregano, and basil. Season with salt and pepper.',
                'Simmer for 20-30 minutes, stirring occasionally.',
                'Meanwhile, cook spaghetti according to package directions.',
                'Serve sauce over cooked spaghetti, topped with Parmesan cheese.'
            ],
            isPublic: true,
            userId: 'default-user-2',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '3',
            name: 'Chocolate Chip Cookies',
            category: 'dessert',
            ingredients: [
                '2 1/4 cups all-purpose flour',
                '1 teaspoon baking soda',
                '1 teaspoon salt',
                '1 cup (2 sticks) butter, softened',
                '3/4 cup granulated sugar',
                '3/4 cup packed brown sugar',
                '1 teaspoon vanilla extract',
                '2 large eggs',
                '2 cups (12-oz. pkg.) semi-sweet chocolate chips'
            ],
            steps: [
                'Preheat oven to 375°F.',
                'Combine flour, baking soda and salt in small bowl.',
                'Beat butter, granulated sugar, brown sugar and vanilla extract in large mixer bowl until creamy.',
                'Add eggs one at a time, beating well after each addition.',
                'Gradually beat in flour mixture.',
                'Stir in chocolate chips.',
                'Drop by rounded tablespoon onto ungreased baking sheets.',
                'Bake for 9 to 11 minutes or until golden brown.',
                'Cool on baking sheets for 2 minutes; remove to wire racks to cool completely.'
            ],
            isPublic: true,
            userId: 'default-user-1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        }
    ];

    // Initialize users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    defaultUsers.forEach(user => {
        if (!users.some(u => u.id === user.id)) {
            users.push(user);
        }
    });
    localStorage.setItem('users', JSON.stringify(users));

    // Initialize recipes
    const existingRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    if (existingRecipes.length === 0) {
        localStorage.setItem('recipes', JSON.stringify(defaultRecipes));
    }
}

function setupEventListeners() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection(link.id.replace('-link', '-section'));
            setActiveNavLink(link);
        });
    });

    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileNav);
    }
    
    function toggleMobileNav() {
    const mobileNav = document.querySelector('.nav-links');
    const hamburger = document.getElementById('hamburger');

    if (mobileNav) {
        mobileNav.classList.toggle('show'); // This relies on the CSS `.show` toggle
        // Update hamburger icon
        if (mobileNav.classList.contains('show')) {
            hamburger.innerHTML = '<i class="fas fa-times"></i>';
            document.body.style.overflow = 'hidden';
        } else {
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    }
}
    // Auth
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => showModal('login-modal'));
    }

    const signupBtn = document.getElementById('signup-btn');
    if (signupBtn) {
        signupBtn.addEventListener('click', () => showModal('signup-modal'));
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser);
    }

    const showSignup = document.getElementById('show-signup');
    if (showSignup) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal('login-modal');
            showModal('signup-modal');
        });
    }

    const showLogin = document.getElementById('show-login');
    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal('signup-modal');
            showModal('login-modal');
        });
    }

    const closeModals = document.querySelectorAll('.close-modal');
    closeModals.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            hideModal(modal.id);
        });
    });

    // Forms
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    const recipeForm = document.getElementById('recipe-form');
    if (recipeForm) {
        recipeForm.addEventListener('submit', handleRecipeSubmit);
    }

    // Search
    const mainSearch = document.getElementById('main-search');
    if (mainSearch) {
        mainSearch.addEventListener('input', handleSearchInput);
        mainSearch.addEventListener('focus', showAutocomplete);
        mainSearch.addEventListener('blur', () => {
            setTimeout(() => {
                const autocompleteResults = document.getElementById('autocomplete-results');
                if (autocompleteResults) {
                    autocompleteResults.style.display = 'none';
                }
            }, 200);
        });
    }

    const mainSearchBtn = document.getElementById('main-search-btn');
    if (mainSearchBtn) {
        mainSearchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleSearchSubmit();
        });
    }

    // Recipe management
    const addIngredientBtn = document.getElementById('add-ingredient');
    if (addIngredientBtn) {
        addIngredientBtn.addEventListener('click', addIngredientField);
    }

    const addStepBtn = document.getElementById('add-step');
    if (addStepBtn) {
        addStepBtn.addEventListener('click', addStepField);
    }

    const recipeImage = document.getElementById('recipe-image');
    if (recipeImage) {
        recipeImage.addEventListener('change', handleImageUpload);
    }

    const recipeFilter = document.getElementById('recipe-filter');
    if (recipeFilter) {
        recipeFilter.addEventListener('change', filterUserRecipes);
    }

    const backToHome = document.getElementById('back-to-home');
    if (backToHome) {
        backToHome.addEventListener('click', () => switchSection('home-section'));
    }

    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target.id);
        }
    });
}

// Navigation functions
function switchSection(sectionId) {
    const sections = document.querySelectorAll('main > section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.remove('hidden');
            section.classList.add('active-section');
        } else {
            section.classList.add('hidden');
            section.classList.remove('active-section');
        }
    });
}

function setActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link === activeLink) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function toggleMobileNav() {
    const mobileNav = document.querySelector('.nav-links');
    if (mobileNav) {
        mobileNav.classList.toggle('show');
    }
}

// Auth functions
function checkAuthState() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        loginUser(user);
    }
}

function loginUser(user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Update UI
    document.getElementById('login-btn')?.classList.add('hidden');
    document.getElementById('signup-btn')?.classList.add('hidden');
    document.getElementById('user-profile')?.classList.remove('hidden');
    
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        usernameDisplay.textContent = user.name + (user.isAdmin ? ' (Admin)' : '');
    }
    
    const userAvatar = document.getElementById('user-avatar');
    if (userAvatar) {
        userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=${user.isAdmin ? 'ff0000' : 'ff6b6b'}&color=fff`;
    }
    
    // Enable appropriate links
    document.getElementById('add-recipe-link')?.classList.remove('disabled');
    document.getElementById('view-recipes-link')?.classList.remove('disabled');
    
    // Refresh displays
    displayFeaturedRecipes();
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Update UI
    document.getElementById('login-btn')?.classList.remove('hidden');
    document.getElementById('signup-btn')?.classList.remove('hidden');
    document.getElementById('user-profile')?.classList.add('hidden');
    
    // Disable recipe management links
    document.getElementById('add-recipe-link')?.classList.add('disabled');
    document.getElementById('view-recipes-link')?.classList.add('disabled');
    
    // Return to home section
    switchSection('home-section');
    setActiveNavLink(document.getElementById('home-link'));
    
    // Refresh displays
    displayFeaturedRecipes();
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-password')?.value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        loginUser(user);
        hideModal('login-modal');
    } else {
        alert('Invalid email or password');
    }
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name')?.value;
    const email = document.getElementById('signup-email')?.value;
    const password = document.getElementById('signup-password')?.value;
    const confirmPassword = document.getElementById('signup-confirm-password')?.value;
    
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.email === email)) {
        alert('User with this email already exists');
        return;
    }
    
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        isAdmin: false
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    loginUser(newUser);
    hideModal('signup-modal');
    alert('Account created successfully!');
}

// Recipe functions
function loadRecipes() {
    allRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    updateAutocompleteData();
}

function saveRecipes() {
    localStorage.setItem('recipes', JSON.stringify(allRecipes));
    updateAutocompleteData();
}

function updateAutocompleteData() {
    autocompleteData = allRecipes.map(recipe => ({
        id: recipe.id,
        name: recipe.name,
        ingredients: recipe.ingredients.join(', ')
    }));
}

function displayFeaturedRecipes() {
    const featuredGrid = document.getElementById('featured-recipes-grid');
    if (!featuredGrid) return;
    
    // Show all public recipes plus admin's private recipes
    const visibleRecipes = allRecipes.filter(recipe => 
        recipe.isPublic || 
        (currentUser && (recipe.userId === currentUser.id || currentUser.isAdmin))
    );
    
    if (visibleRecipes.length === 0) {
        featuredGrid.innerHTML = '<p class="no-recipes">No recipes found. Add your first recipe!</p>';
        return;
    }
    
    featuredGrid.innerHTML = visibleRecipes.map(recipe => createRecipeCard(recipe)).join('');
    setupRecipeCardEvents();
}

function filterUserRecipes() {
    const filter = document.getElementById('recipe-filter')?.value;
    const userRecipesGrid = document.getElementById('user-recipes-grid');
    if (!userRecipesGrid || !currentUser) return;
    
    let filteredRecipes = allRecipes.filter(recipe => 
        recipe.userId === currentUser.id || 
        (currentUser.isAdmin && recipe.userId.includes('default-user'))
    );
    
    if (filter === 'public') {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.isPublic);
    } else if (filter === 'private') {
        filteredRecipes = filteredRecipes.filter(recipe => !recipe.isPublic);
    }
    
    if (filteredRecipes.length === 0) {
        userRecipesGrid.innerHTML = '<p class="no-recipes">No recipes match your filter.</p>';
        return;
    }
    
    userRecipesGrid.innerHTML = filteredRecipes.map(recipe => createRecipeCard(recipe)).join('');
    setupRecipeCardEvents();
}

function createRecipeCard(recipe) {
    const user = getUserById(recipe.userId);
    const isOwner = currentUser && recipe.userId === currentUser.id;
    const isAdmin = currentUser?.isAdmin;
    const canEdit = isOwner || isAdmin;
    
    return `
        <div class="recipe-card" data-id="${recipe.id}">
            ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">` : 
              '<div class="recipe-image placeholder">No Image</div>'}
            <div class="recipe-info">
                <h3 class="recipe-title">${recipe.name}</h3>
                <div class="recipe-meta">
                    <span class="recipe-category">${recipe.category}</span>
                    <span class="recipe-author">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=${user.isAdmin ? 'ff0000' : '6c757d'}&color=fff" 
                             alt="${user.name}" class="author-avatar">
                        ${user.name}${user.isAdmin ? ' (Admin)' : ''}
                    </span>
                </div>
                <div class="recipe-actions">
                    <button class="btn-view" data-id="${recipe.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${canEdit ? `
                    <button class="btn-view btn-edit" data-id="${recipe.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-view btn-delete" data-id="${recipe.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function setupRecipeCardEvents() {
    document.querySelectorAll('.btn-view:not(.btn-edit):not(.btn-delete)').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const recipeId = btn.getAttribute('data-id');
            showRecipeDetails(recipeId);
        });
    });
    
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const recipeId = btn.getAttribute('data-id');
            editRecipe(recipeId);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const recipeId = btn.getAttribute('data-id');
            deleteRecipe(recipeId);
        });
    });
}

function showRecipeDetails(recipeId) {
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    const user = getUserById(recipe.userId);
    const isOwner = currentUser && recipe.userId === currentUser.id;
    const isAdmin = currentUser?.isAdmin;
    const canEdit = isOwner || isAdmin;
    
    const modalContent = document.getElementById('recipe-modal-content');
    if (!modalContent) return;
    
    modalContent.innerHTML = `
        <div class="recipe-details">
            <div class="recipe-details-header">
                <h1 class="recipe-details-title">${recipe.name}</h1>
                <div class="recipe-details-meta">
                    <span><i class="fas fa-user"></i> ${user.name}${user.isAdmin ? ' (Admin)' : ''}</span>
                    <span><i class="fas fa-calendar-alt"></i> ${new Date(recipe.createdAt).toLocaleDateString()}</span>
                    <span><i class="fas fa-tag"></i> ${recipe.category}</span>
                </div>
            </div>
            
            ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.name}" class="recipe-details-image">` : ''}
            
            <div class="recipe-details-content">
                <div class="recipe-ingredients-list">
                    <h3><i class="fas fa-list-ul"></i> Ingredients</h3>
                    <ul>
                        ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="recipe-steps-list">
                    <h3><i class="fas fa-list-ol"></i> Preparation Steps</h3>
                    <ol>
                        ${recipe.steps.map((step, i) => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
            </div>
            
            ${canEdit ? `
            <div class="recipe-actions-container">
                <button class="btn-primary" id="edit-recipe-btn" data-id="${recipe.id}">
                    <i class="fas fa-edit"></i> Edit Recipe
                </button>
                <button class="btn-primary btn-delete" id="delete-recipe-btn" data-id="${recipe.id}">
                    <i class="fas fa-trash"></i> Delete Recipe
                </button>
            </div>
            ` : ''}
        </div>
    `;
    
    if (canEdit) {
        document.getElementById('edit-recipe-btn')?.addEventListener('click', () => {
            hideModal('recipe-details-modal');
            editRecipe(recipeId);
        });
        
        document.getElementById('delete-recipe-btn')?.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this recipe?')) {
                deleteRecipe(recipeId);
                hideModal('recipe-details-modal');
                if (document.getElementById('user-recipes-grid')) {
                    filterUserRecipes();
                }
                displayFeaturedRecipes();
            }
        });
    }
    
    showModal('recipe-details-modal');
}

function editRecipe(recipeId) {
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    // Switch to add recipe section
    switchSection('add-recipe-section');
    setActiveNavLink(document.getElementById('add-recipe-link'));
    
    // Fill the form with recipe data
    document.getElementById('recipe-name').value = recipe.name;
    document.getElementById('recipe-category').value = recipe.category;
    
    // Clear existing ingredients and steps
    const ingredientsContainer = document.querySelector('.ingredients-container');
    const stepsContainer = document.querySelector('.steps-container');
    if (ingredientsContainer) ingredientsContainer.innerHTML = '';
    if (stepsContainer) stepsContainer.innerHTML = '';
    
    // Add ingredients
    recipe.ingredients.forEach(ing => {
        addIngredientField(ing);
    });
    
    // Add steps
    recipe.steps.forEach(step => {
        addStepField(step);
    });
    
    // Set image preview if exists
    const imagePreview = document.getElementById('image-preview');
    if (recipe.image && imagePreview) {
        imagePreview.innerHTML = `<img src="${recipe.image}" alt="Preview">`;
        imagePreview.classList.remove('hidden');
    }
    
    // Set public/private
    const recipePublic = document.getElementById('recipe-public');
    if (recipePublic) {
        recipePublic.checked = recipe.isPublic;
    }
    
    // Change form to update mode
    const recipeForm = document.getElementById('recipe-form');
    if (recipeForm) {
        recipeForm.setAttribute('data-edit-mode', recipeId);
        const submitBtn = recipeForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Recipe';
        }
    }
}

function deleteRecipe(recipeId) {
    allRecipes = allRecipes.filter(r => r.id !== recipeId);
    saveRecipes();
    
    // Refresh displays
    displayFeaturedRecipes();
    if (document.getElementById('user-recipes-grid')) {
        filterUserRecipes();
    }
}

function handleRecipeSubmit(e) {
    e.preventDefault();
    
    if (!currentUser) {
        alert('Please login to add recipes');
        return;
    }
    
    const name = document.getElementById('recipe-name')?.value.trim();
    const category = document.getElementById('recipe-category')?.value;
    const isPublic = document.getElementById('recipe-public')?.checked;
    
    // Get ingredients
    const ingredients = [];
    document.querySelectorAll('.ingredient-input input').forEach(input => {
        if (input.value.trim()) {
            ingredients.push(input.value.trim());
        }
    });
    
    // Get steps
    const steps = [];
    document.querySelectorAll('.step-input textarea').forEach(textarea => {
        if (textarea.value.trim()) {
            steps.push(textarea.value.trim());
        }
    });
    
    // Validation
    if (!name || ingredients.length === 0 || steps.length === 0) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Check if we're editing an existing recipe
    const recipeForm = document.getElementById('recipe-form');
    const isEdit = recipeForm?.hasAttribute('data-edit-mode');
    const recipeId = isEdit ? recipeForm.getAttribute('data-edit-mode') : Date.now().toString();
    
    const recipe = {
        id: recipeId,
        name,
        category,
        ingredients,
        steps,
        isPublic,
        userId: currentUser.id,
        createdAt: isEdit ? allRecipes.find(r => r.id === recipeId)?.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Handle image
    const imagePreview = document.getElementById('image-preview');
    if (imagePreview?.querySelector('img')) {
        recipe.image = imagePreview.querySelector('img').src;
    }
    
    // Update or add the recipe
    if (isEdit) {
        const index = allRecipes.findIndex(r => r.id === recipeId);
        if (index !== -1) {
            allRecipes[index] = recipe;
        }
    } else {
        allRecipes.push(recipe);
    }
    
    saveRecipes();
    
    // Reset form
    if (recipeForm) {
        recipeForm.reset();
        const ingredientsContainer = document.querySelector('.ingredients-container');
        const stepsContainer = document.querySelector('.steps-container');
        if (ingredientsContainer) ingredientsContainer.innerHTML = '';
        if (stepsContainer) stepsContainer.innerHTML = '';
        
        const imagePreview = document.getElementById('image-preview');
        if (imagePreview) {
            imagePreview.innerHTML = '';
            imagePreview.classList.add('hidden');
        }
        
        recipeForm.removeAttribute('data-edit-mode');
        const submitBtn = recipeForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Recipe';
        }
    }
    
    // Show success message
    alert(`Recipe ${isEdit ? 'updated' : 'added'} successfully!`);
    
    // Switch to view recipes
    switchSection('view-recipes-section');
    setActiveNavLink(document.getElementById('view-recipes-link'));
    filterUserRecipes();
}

function addIngredientField(value = '') {
    const ingredientsContainer = document.querySelector('.ingredients-container');
    if (!ingredientsContainer) return;
    
    const div = document.createElement('div');
    div.className = 'ingredient-input';
    div.innerHTML = `
        <input type="text" class="ingredient" placeholder="Ingredient" value="${value}">
        <button type="button" class="remove-ingredient"><i class="fas fa-times"></i></button>
    `;
    ingredientsContainer.appendChild(div);
    
    div.querySelector('.remove-ingredient')?.addEventListener('click', () => {
        div.remove();
    });
}

function addStepField(value = '') {
    const stepsContainer = document.querySelector('.steps-container');
    if (!stepsContainer) return;
    
    const div = document.createElement('div');
    div.className = 'step-input';
    div.innerHTML = `
        <textarea class="step" placeholder="Step">${value}</textarea>
        <button type="button" class="remove-step"><i class="fas fa-times"></i></button>
    `;
    stepsContainer.appendChild(div);
    
    div.querySelector('.remove-step')?.addEventListener('click', () => {
        div.remove();
    });
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const imagePreview = document.getElementById('image-preview');
        if (imagePreview) {
            imagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            imagePreview.classList.remove('hidden');
        }
    };
    reader.readAsDataURL(file);
}

// Search functions
function handleSearchInput() {
    const query = document.getElementById('main-search')?.value.trim().toLowerCase();
    if (!query || query.length < 2) {
        const autocompleteResults = document.getElementById('autocomplete-results');
        if (autocompleteResults) {
            autocompleteResults.style.display = 'none';
        }
        return;
    }
    
    const results = autocompleteData.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.ingredients.toLowerCase().includes(query)
    ).slice(0, 5); // Show max 5 results
    
    const autocompleteResults = document.getElementById('autocomplete-results');
    if (!autocompleteResults) return;
    
    if (results.length > 0) {
        autocompleteResults.innerHTML = results.map(item => `
            <div class="autocomplete-item" data-id="${item.id}">
                <strong>${item.name}</strong>
                <small>${item.ingredients.substring(0, 50)}...</small>
            </div>
        `).join('');
        
        autocompleteResults.style.display = 'block';
        
        // Add click event to autocomplete items
        document.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                const recipeId = item.getAttribute('data-id');
                const mainSearch = document.getElementById('main-search');
                if (mainSearch) {
                    mainSearch.value = '';
                }
                autocompleteResults.style.display = 'none';
                showRecipeDetails(recipeId);
            });
        });
    } else {
        autocompleteResults.style.display = 'none';
    }
}

function handleSearchSubmit() {
    const query = document.getElementById('main-search')?.value.trim();
    if (!query) return;
    
    const results = allRecipes.filter(recipe => 
        recipe.name.toLowerCase().includes(query.toLowerCase()) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(query.toLowerCase()))
    );
    
    const searchResultsGrid = document.getElementById('search-results-grid');
    if (!searchResultsGrid) return;
    
    if (results.length === 0) {
        searchResultsGrid.innerHTML = '<p class="no-recipes">No recipes found matching your search.</p>';
    } else {
        searchResultsGrid.innerHTML = results.map(recipe => createRecipeCard(recipe)).join('');
        setupRecipeCardEvents();
    }
    
    switchSection('search-results-section');
}

function showAutocomplete() {
    const autocompleteResults = document.getElementById('autocomplete-results');
    const mainSearch = document.getElementById('main-search');
    
    if (autocompleteResults && mainSearch && mainSearch.value.trim().length >= 2) {
        autocompleteResults.style.display = 'block';
    }
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('show');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        modal.classList.add('hidden');
    }
}

// Utility functions
function getUserById(userId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(u => u.id === userId) || { 
        name: 'Unknown User', 
        email: '',
        isAdmin: false
    };
}

// Debugging function - uncomment to reset all data
function resetData() {
    if (confirm('This will delete all recipes and users. Are you sure?')) {
        localStorage.clear();
        location.reload();
    }
}

// Uncomment next line and refresh page to reset all data
// resetData();
