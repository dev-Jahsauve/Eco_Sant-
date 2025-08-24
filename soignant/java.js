// Gestion des utilisateurs et stockage des données
const userAccounts = JSON.parse(localStorage.getItem('mediconnect_users')) || [];
let currentUser = null;

// Fonction pour enregistrer un nouvel utilisateur
function registerUser(userData) {
    userAccounts.push(userData);
    localStorage.setItem('mediconnect_users', JSON.stringify(userAccounts));
    return true;
}

// Fonction pour vérifier les informations de connexion
function loginUser(email, password) {
    return userAccounts.find(user => user.email === email && user.password === password);
}

// Fonction pour afficher les notifications toast
function showToast(type, title, message) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas fa-${icon}"></i></div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Fermer le toast après 5 secondes
    setTimeout(() => {
        toast.remove();
    }, 5000);
    
    // Fermer le toast manuellement
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
}

// Fonction pour mettre à jour l'affichage du profil
function updateProfileDisplay(userData) {
    if (userData) {
        document.getElementById('profile-name').value = userData.fullname;
        document.getElementById('profile-email').value = userData.email;
        document.getElementById('profile-specialite').value = userData.specialite;
        document.getElementById('profile-phone').value = userData.phone;
        document.getElementById('profile-type').value = userData.type === 'medecin' ? 'Médecin' : 'Naturopathe';
        
        // Mettre à jour le header
        document.getElementById('user-name').textContent = userData.fullname;
        document.getElementById('user-avatar').textContent = userData.fullname.split(' ').map(n => n[0]).join('');
    }
}

// Fonction pour initialiser la navigation du dashboard
function initDashboardNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetSection = this.getAttribute('data-section');
                
                // Mettre à jour la classe active
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Afficher la section correspondante
                document.querySelectorAll('.dashboard-section').forEach(section => {
                    section.classList.remove('active');
                });
                document.getElementById(targetSection).classList.add('active');
            });
        });
    }
}

// Fonction pour vérifier si l'utilisateur est connecté
function checkAuth() {
    const savedUser = localStorage.getItem('mediconnect_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        return true;
    }
    return false;
}

// Fonction pour rediriger vers le dashboard si connecté
function redirectIfLoggedIn() {
    if (checkAuth() && window.location.pathname !== '/dashboard.html') {
        window.location.href = 'dashboard.html';
    }
}

// Fonction pour rediriger vers la page de connexion si non connecté
function redirectIfNotLoggedIn() {
    if (!checkAuth() && window.location.pathname === '/dashboard.html') {
        window.location.href = 'index.html';
    }
}