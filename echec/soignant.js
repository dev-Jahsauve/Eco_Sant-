// Gestion des utilisateurs et stockage des données
const userAccounts =
  JSON.parse(localStorage.getItem("mediconnect_users")) || [];
let currentUser = null;

// Fonction pour enregistrer un nouvel utilisateur
function registerUser(userData) {
  userAccounts.push(userData);
  localStorage.setItem("mediconnect_users", JSON.stringify(userAccounts));
  return true;
}

// Fonction pour vérifier les informations de connexion
function loginUser(email, password) {
  return userAccounts.find(
    (user) => user.email === email && user.password === password
  );
}

// Fonction pour afficher les notifications toast
function showToast(type, title, message) {
  const toastContainer = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  let icon = "info-circle";
  if (type === "success") icon = "check-circle";
  if (type === "error") icon = "exclamation-circle";

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
  toast.querySelector(".toast-close").addEventListener("click", () => {
    toast.remove();
  });
}

// Fonction pour mettre à jour l'affichage du profil
function updateProfileDisplay(userData) {
  if (userData) {
    document.getElementById("profile-name").value = userData.fullname;
    document.getElementById("profile-email").value = userData.email;
    document.getElementById("profile-specialite").value = userData.specialite;
    document.getElementById("profile-phone").value = userData.phone;
    document.getElementById("profile-type").value =
      userData.type === "medecin" ? "Médecin" : "Naturopathe";

    // Mettre à jour le header
    document.getElementById("user-name").textContent = userData.fullname;
    document.getElementById("user-avatar").textContent = userData.fullname
      .split(" ")
      .map((n) => n[0])
      .join("");
  }
}

// Navigation
document.addEventListener("DOMContentLoaded", function () {
  // Vérifier si l'utilisateur est déjà connecté (persistance de session)
  const savedUser = localStorage.getItem("mediconnect_current_user");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    document.getElementById("main-content").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    updateProfileDisplay(currentUser);
    showToast("info", "Bienvenue", "Vous êtes connecté à votre compte");
  }

  // Navigation entre les pages
  document.getElementById("btn-login").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("main-content").style.display = "none";
    document.getElementById("login-form").style.display = "flex";
    document.getElementById("register-form").style.display = "none";
    document.getElementById("dashboard").style.display = "none";
  });

  document
    .getElementById("btn-register")
    .addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("main-content").style.display = "none";
      document.getElementById("login-form").style.display = "none";
      document.getElementById("register-form").style.display = "flex";
      document.getElementById("dashboard").style.display = "none";
    });

  document
    .getElementById("show-register")
    .addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("login-form").style.display = "none";
      document.getElementById("register-form").style.display = "flex";
      document.getElementById("dashboard").style.display = "none";
    });

  document.getElementById("show-login").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("login-form").style.display = "flex";
    document.getElementById("register-form").style.display = "none";
    document.getElementById("dashboard").style.display = "none";
  });

  document
    .getElementById("nav-accueil")
    .addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("main-content").style.display = "block";
      document.getElementById("login-form").style.display = "none";
      document.getElementById("register-form").style.display = "none";
      document.getElementById("dashboard").style.display = "none";
    });

  // Navigation du dashboard
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetSection = this.getAttribute("data-section");

      // Mettre à jour la classe active
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");

      // Afficher la section correspondante
      document.querySelectorAll(".dashboard-section").forEach((section) => {
        section.classList.remove("active");
      });
      document.getElementById(targetSection).classList.add("active");
    });
  });

  // Connexion
  document.getElementById("login-btn").addEventListener("click", function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("remember-me").checked;

    if (!email || !password) {
      showToast("error", "Erreur", "Veuillez remplir tous les champs");
      return;
    }

    // Simuler un chargement
    const loginText = document.getElementById("login-text");
    loginText.innerHTML = '<div class="spinner"></div> Connexion...';

    setTimeout(function () {
      // Vérifier les informations de connexion
      const user = loginUser(email, password);

      if (user) {
        // Connexion réussie
        currentUser = user;

        // Sauvegarder la session si "Se souvenir de moi" est coché
        if (rememberMe) {
          localStorage.setItem(
            "mediconnect_current_user",
            JSON.stringify(user)
          );
        }

        document.getElementById("main-content").style.display = "none";
        document.getElementById("login-form").style.display = "none";
        document.getElementById("register-form").style.display = "none";
        document.getElementById("dashboard").style.display = "block";

        updateProfileDisplay(user);
        showToast("success", "Connexion réussie", "Bienvenue sur MediConnect");
      } else {
        showToast("error", "Erreur", "Email ou mot de passe incorrect");
      }

      // Réinitialiser le texte du bouton
      loginText.textContent = "Se connecter";
    }, 1500);
  });

  // Inscription
  document
    .getElementById("register-btn")
    .addEventListener("click", function () {
      const fullname = document.getElementById("fullname").value;
      const email = document.getElementById("register-email").value;
      const password = document.getElementById("register-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;
      const specialite = document.getElementById("specialite").value;
      const phone = document.getElementById("phone").value;
      const userType = document.querySelector(
        'input[name="user-type"]:checked'
      ).value;

      if (
        !fullname ||
        !email ||
        !password ||
        !confirmPassword ||
        !specialite ||
        !phone
      ) {
        showToast("error", "Erreur", "Veuillez remplir tous les champs");
        return;
      }

      if (password !== confirmPassword) {
        showToast("error", "Erreur", "Les mots de passe ne correspondent pas");
        return;
      }

      // Vérifier si l'email est déjà utilisé
      if (userAccounts.find((user) => user.email === email)) {
        showToast("error", "Erreur", "Cet email est déjà utilisé");
        return;
      }

      // Simuler un chargement
      const registerText = document.getElementById("register-text");
      registerText.innerHTML = '<div class="spinner"></div> Inscription...';

      setTimeout(function () {
        // Créer l'objet utilisateur
        const userData = {
          fullname,
          email,
          password,
          specialite,
          phone,
          type: userType,
        };

        // Enregistrer l'utilisateur
        if (registerUser(userData)) {
          currentUser = userData;
          localStorage.setItem(
            "mediconnect_current_user",
            JSON.stringify(userData)
          );

          showToast(
            "success",
            "Inscription réussie",
            "Votre compte a été créé avec succès"
          );

          // Basculer vers le dashboard
          document.getElementById("main-content").style.display = "none";
          document.getElementById("login-form").style.display = "none";
          document.getElementById("register-form").style.display = "none";
          document.getElementById("dashboard").style.display = "block";

          updateProfileDisplay(userData);
        } else {
          showToast(
            "error",
            "Erreur",
            "Une erreur est survenue lors de l'inscription"
          );
        }

        // Réinitialiser le texte du bouton
        registerText.textContent = "S'inscrire";
      }, 1500);
    });

  // Déconnexion
  document.getElementById("logout-btn").addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("mediconnect_current_user");
    currentUser = null;

    document.getElementById("dashboard").style.display = "none";
    document.getElementById("main-content").style.display = "block";

    // Réinitialiser les formulaires
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

    showToast("info", "Déconnexion", "Vous avez été déconnecté avec succès");
  });

  // Enregistrement des modifications du profil
  document
    .getElementById("save-profile-btn")
    .addEventListener("click", function () {
      if (currentUser) {
        // Mettre à jour les informations de l'utilisateur
        currentUser.fullname = document.getElementById("profile-name").value;
        currentUser.email = document.getElementById("profile-email").value;
        currentUser.specialite =
          document.getElementById("profile-specialite").value;
        currentUser.phone = document.getElementById("profile-phone").value;

        // Mettre à jour le stockage local
        const userIndex = userAccounts.findIndex(
          (user) => user.email === currentUser.email
        );
        if (userIndex !== -1) {
          userAccounts[userIndex] = currentUser;
          localStorage.setItem(
            "mediconnect_users",
            JSON.stringify(userAccounts)
          );
          localStorage.setItem(
            "mediconnect_current_user",
            JSON.stringify(currentUser)
          );
        }

        // Mettre à jour l'affichage
        updateProfileDisplay(currentUser);
        showToast(
          "success",
          "Profil mis à jour",
          "Vos modifications ont été enregistrées"
        );
      }
    });

  // Navigation depuis le footer
  document
    .getElementById("footer-accueil")
    .addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("main-content").style.display = "block";
      document.getElementById("login-form").style.display = "none";
      document.getElementById("register-form").style.display = "none";
      document.getElementById("dashboard").style.display = "none";
    });

  document
    .getElementById("footer-about")
    .addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("main-content").style.display = "block";
      document.getElementById("login-form").style.display = "none";
      document.getElementById("register-form").style.display = "none";
      document.getElementById("dashboard").style.display = "none";

      setTimeout(() => {
        document.getElementById("about").scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

  // Navigation depuis la navbar
  document.getElementById("nav-about").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("main-content").style.display = "block";
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "none";
    document.getElementById("dashboard").style.display = "none";

    setTimeout(() => {
      document.getElementById("about").scrollIntoView({ behavior: "smooth" });
    }, 100);
  });
});
