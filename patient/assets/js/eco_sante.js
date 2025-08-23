// // ===== GESTIONNAIRE DE PAGES =====
// // Fonction pour afficher une page spécifique et masquer les autres
// function showPage(pageId) {
//   // Masquer toutes les pages
//   document.querySelectorAll(".page").forEach((page) => {
//     page.style.display = "none";
//   });

//   // Afficher la page demandée
//   const pageElement = document.getElementById(`${pageId}-page`);
//   if (pageElement) {
//     pageElement.style.display = "block";
//   }

//   // Mettre à jour l'URL avec un hash pour la page actuelle
//   window.location.hash = pageId;

//   // Scroll vers le haut de la page
//   window.scrollTo(0, 0);
// }

// // Écouter les clics sur les liens de navigation
// document
//   .querySelectorAll("a[data-page], button[data-page]")
//   .forEach((element) => {
//     element.addEventListener("click", function (e) {
//       e.preventDefault();
//       const pageId = this.getAttribute("data-page");
//       showPage(pageId);
//     });
//   });

// // Vérifier l'URL au chargement pour afficher la bonne page
// window.addEventListener("load", function () {
//   const hash = window.location.hash.substring(1) || "home";
//   showPage(hash);
// });

// ===== MENU MOBILE =====
const mobileMenu = document.getElementById("mobile-menu");
const navMenu = document.querySelector(".nav-menu");

mobileMenu.addEventListener("click", function () {
  navMenu.classList.toggle("active");
});

// ===== VALIDATION DES FORMULAIRES =====
// Regex pour validation
const patterns = {
  name: /^[a-zA-ZàâäéèêëïîôöùûüçÀÂÄÉÈÊËÏÎÔÖÙÛÜÇ\s-]{2,50}$/,
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  phone: /^[0-9]{10}$/,
  password: /^(?=.[a-z])(?=.[A-Z])(?=.*[0-9]).{8,}$/,
};

// Fonction de validation en temps réel
function validateField(field, pattern) {
  const value = field.value.trim();
  const errorElement = field.nextElementSibling;

  if (value === "") {
    field.classList.remove("valid", "invalid");
    errorElement.style.display = "none";
    return false;
  }

  if (pattern.test(value)) {
    field.classList.remove("invalid");
    field.classList.add("valid");
    errorElement.style.display = "none";
    return true;
  } else {
    field.classList.remove("valid");
    field.classList.add("invalid");
    errorElement.style.display = "block";
    return false;
  }
}

// Validation formulaire d'inscription
document.addEventListener("DOMContentLoaded", function () {
  // Récupération des éléments du formulaire
  const form = document.getElementById("register-form");
  const fullnameInput = document.getElementById("fullname");
  const emailInput = document.getElementById("register-email");
  const passwordInput = document.getElementById("register-password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const phoneInput = document.getElementById("phone");
  const submitButton = document.getElementById("register-btn");

  // Expressions régulières pour la validation
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
  const phoneRegex = /^(?:\+237|237)?[2368]7$/;

  // État de validation des champs
  const validationState = {
    fullname: false,
    email: false,
    password: false,
    confirmPassword: false,
    phone: false,
  };

  // Fonction pour mettre à jour l'état du bouton de soumission
  function updateSubmitButton() {
    const allValid = Object.values(validationState).every((state) => state);
    submitButton.disabled = !allValid;
  }

  // Validation du nom complet
  fullnameInput.addEventListener("input", function () {
    const errorElement = document.getElementById("NameError");

    if (!this.value.trim()) {
      errorElement.textContent = "Le nom complet est requis";
      this.classList.add("invalid");
      this.classList.remove("valid");
      validationState.fullname = false;
    } else if (!nameRegex.test(this.value)) {
      errorElement.textContent =
        "Le nom doit contenir entre 2 et 50 caractères alphabétiques";
      this.classList.add("invalid");
      this.classList.remove("valid");
      validationState.fullname = false;
    } else {
      errorElement.textContent = "";
      this.classList.remove("invalid");
      this.classList.add("valid");
      validationState.fullname = true;
    }

    updateSubmitButton();
  });

  // Validation de l'email
  emailInput.addEventListener("input", function () {
    const errorElement = document.getElementById("loginEmailError");

    if (!this.value.trim()) {
      errorElement.textContent = "L'email est requis";
      this.classList.add("invalid");
      this.classList.remove("valid");
      validationState.email = false;
    } else if (!emailRegex.test(this.value)) {
      errorElement.textContent = "Veuillez entrer une adresse email valide";
      this.classList.add("invalid");
      this.classList.remove("valid");
      validationState.email = false;
    } else {
      errorElement.textContent = "";
      this.classList.remove("invalid");
      this.classList.add("valid");
      validationState.email = true;
    }

    updateSubmitButton();
  });

  // Validation du mot de passe
  passwordInput.addEventListener("input", function () {
    const errorElement = document.getElementById("passwordError");

    if (!this.value) {
      errorElement.textContent = "Le mot de passe est requis";
      this.classList.add("invalid");
      this.classList.remove("valid");
      validationState.password = false;
    } else if (!passwordRegex.test(this.value)) {
      errorElement.textContent =
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial";
      this.classList.add("invalid");
      this.classList.remove("valid");
      validationState.password = false;
    } else {
      errorElement.textContent = "";
      this.classList.remove("invalid");
      this.classList.add("valid");
      validationState.password = true;
    }

    // Re-valider la confirmation si le mot de passe change
    if (confirmPasswordInput.value) {
      confirmPasswordInput.dispatchEvent(new Event("input"));
    }

    updateSubmitButton();
  });

  // Validation de la confirmation du mot de passe
  confirmPasswordInput.addEventListener("input", function () {
    const errorElement = document.getElementById("ConfirmError");

    if (!this.value) {
      errorElement.textContent = "Veuillez confirmer votre mot de passe";
      this.classList.add("invalid");
      this.classList.remove("valid");
      validationState.confirmPassword = false;
    } else if (this.value !== passwordInput.value) {
      errorElement.textContent = "Les mots de passe ne correspondent pas";
      this.classList.add("invalid");
      this.classList.remove("valid");
      validationState.confirmPassword = false;
    } else {
      errorElement.textContent = "";
      this.classList.remove("invalid");
      this.classList.add("valid");
      validationState.confirmPassword = true;
    }

    updateSubmitButton();
  });

  // Validation du numéro de téléphone
  phoneInput.addEventListener("input", function () {
    const errorElement = document.getElementById("TelError");

    if (!this.value.trim()) {
      errorElement.textContent = "Le numéro de téléphone est requis";
      this.classList.add("invalid");
      this.classList.remove("valid");
      validationState.phone = false;
    } else if (!phoneRegex.test(this.value)) {
      errorElement.textContent =
        "Veuillez entrer un numéro de téléphone français valide";
      this.classList.add("invalid");
      this.classList.remove("valid");
      validationState.phone = false;
    } else {
      errorElement.textContent = "";
      this.classList.remove("invalid");
      this.classList.add("valid");
      validationState.phone = true;
    }

    updateSubmitButton();
  });

  // Empêcher la soumission du formulaire si invalide
  form.addEventListener("submit", function (e) {
    if (submitButton.disabled) {
      e.preventDefault();
      // Forcer la validation de tous les champs
      fullnameInput.dispatchEvent(new Event("input"));
      emailInput.dispatchEvent(new Event("input"));
      passwordInput.dispatchEvent(new Event("input"));
      confirmPasswordInput.dispatchEvent(new Event("input"));
      phoneInput.dispatchEvent(new Event("input"));
    } else {
      // Ici, normalement, on enverrait les données au serveur
      
      alert("Formulaire validé avec succès! ");
    }
  });
});

// Validation formulaire de connexion
// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Références aux éléments du formulaire
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginEmailError = document.getElementById('loginEmailError');
    const loginPasswordError = document.getElementById('loginPasswordError');
    
    // Expressions régulières pour la validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
    
    // Fonction pour afficher les erreurs
    function setError(element, errorElement, message) {
        errorElement.textContent = message;
        element.parentElement.classList.add('error');
        element.parentElement.classList.remove('success');
    }
    
    // Fonction pour indiquer le succès
    function setSuccess(element, errorElement) {
        errorElement.textContent = '';
        element.parentElement.classList.remove('error');
        element.parentElement.classList.add('success');
    }
    
    // Validation de l'email en temps réel
    emailInput.addEventListener('input', function() {
        validateEmail();
    });
    
    // Validation du mot de passe en temps réel
    passwordInput.addEventListener('input', function() {
        validatePassword();
    });
    
    // Fonction de validation de l'email
    function validateEmail() {
        const emailValue = emailInput.value.trim();
        
        if (emailValue === '') {
            setError(emailInput, loginEmailError, 'L\'email est requis');
            return false;
        } else if (!emailRegex.test(emailValue)) {
            setError(emailInput, loginEmailError, 'Veuillez entrer un email valide');
            return false;
        } else {
            setSuccess(emailInput, loginEmailError);
            return true;
        }
    }
    
    // Fonction de validation du mot de passe
    function validatePassword() {
        const passwordValue = passwordInput.value.trim();
        
        if (passwordValue === '') {
            setError(passwordInput, loginPasswordError, 'Le mot de passe est requis');
            return false;
        } else if (!passwordRegex.test(passwordValue)) {
            setError(passwordInput, loginPasswordError, 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial');
            return false;
        } else {
            setSuccess(passwordInput, loginPasswordError);
            return true;
        }
    }
    
    // Gestion de la soumission du formulaire
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Valider tous les champs avant soumission
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        if (isEmailValid && isPasswordValid) {
            // Afficher un message de chargement
            const loginText = document.getElementById('login-text');
            const originalText = loginText.textContent;
            loginText.textContent = 'Connexion en cours...';
            
            // Simuler une requête de connexion (à remplacer par une vraie requête API)
            setTimeout(function() {
                alert('Connexion réussie! (ceci est une simulation)');
                loginText.textContent = originalText;
                
                // Réinitialiser le formulaire après connexion réussie
                loginForm.reset();
                emailInput.parentElement.classList.remove('success');
                passwordInput.parentElement.classList.remove('success');
            }, 1500);
        }
    });
    
    // Gestion de l'option "Mot de passe oublié"
    document.getElementById('forgot-password').addEventListener('click', function(e) {
        e.preventDefault();
        const emailValue = emailInput.value.trim();
        
        if (emailValue === '' || !emailRegex.test(emailValue)) {
            alert('Veuillez d\'abord entrer un email valide pour réinitialiser votre mot de passe');
            emailInput.focus();
        } else {
            alert('Un email de réinitialisation a été envoyé à ' + emailValue + ' (ceci est une simulation)');
        }
    });
});

// ===== DONNÉES DE TEST =====
// Données des spécialistes
const specialists = [
  {
    id: 1,
    name: "Dr. Martin Lefebvre",
    specialty: "Cardiologue",
    schedule: "Lun-Ven: 9h-17h",
    price: "50€",
  },
  {
    id: 2,
    name: "Dr. Sophie Laurent",
    specialty: "Dermatologue",
    schedule: "Mar-Sam: 10h-18h",
    price: "60€",
  },
  {
    id: 3,
    name: "Dr. Pierre Moreau",
    specialty: "Pédiatre",
    schedule: "Lun-Jeu: 8h-16h",
    price: "45€",
  },
  {
    id: 4,
    name: "Dr. Élise Bernard",
    specialty: "Gynécologue",
    schedule: "Mer-Ven: 9h-17h",
    price: "55€",
  },
];

// Données des rendez-vous
const appointments = [
  {
    id: 1,
    reason: "Consultation générale",
    date: "15/10/2023 - 10h30",
    status: "En attente",
  },
  {
    id: 2,
    reason: "Suivi cardiologique",
    date: "20/10/2023 - 14h15",
    status: "Accepté",
  },
];

// Données des notifications
const notifications = [
  {
    id: 1,
    title: "Rendez-vous confirmé",
    content:
      "Votre rendez-vous avec le Dr. Martin Lefebvre a été confirmé. Lien de visioconférence: https://eco-sante.fr/visio/abc123",
    date: "12/10/2023 09:30",
    status: "Non lu",
  },
  {
    id: 2,
    title: "Nouvelle ordonnance disponible",
    content: "Votre ordonnance du 10/10/2023 est disponible dans votre espace.",
    date: "10/10/2023 16:45",
    status: "Lu",
  },
];

// Données des ordonnances
const prescriptions = [
  {
    id: 1,
    doctor: "Dr. Martin Lefebvre",
    date: "10/10/2023",
    observations: "Pression artérielle légèrement élevée",
    recommendations:
      "Réduire la consommation de sel, exercice physique régulier",
    nextAppointment: "10/01/2024",
    exams: "Prise de sang à jeun",
  },
  {
    id: 2,
    doctor: "Dr. Sophie Laurent",
    date: "05/09/2023",
    observations: "Peau sèche avec irritation modérée",
    recommendations: "Appliquer une crème hydratante deux fois par jour",
    nextAppointment: "05/12/2023",
    exams: "Aucun",
  },
];

// ===== FONCTIONNALITÉS DU TABLEAU DE BORD =====
// Recherche de spécialistes
const specialistSearch = document.getElementById("specialist-search");
const specialistResults = document.getElementById("specialist-results");

if (specialistSearch && specialistResults) {
  // Afficher tous les spécialistes au chargement
  displaySpecialists(specialists);

  // Recherche en temps réel
  specialistSearch.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const filteredSpecialists = specialists.filter(
      (specialist) =>
        specialist.name.toLowerCase().includes(searchTerm) ||
        specialist.specialty.toLowerCase().includes(searchTerm)
    );

    displaySpecialists(filteredSpecialists);
  });
}

// Fonction pour afficher les spécialistes
function displaySpecialists(specialistsList) {
  specialistResults.innerHTML = "";

  if (specialistsList.length === 0) {
    specialistResults.innerHTML = "<p>Aucun spécialiste trouvé.</p>";
    return;
  }

  specialistsList.forEach((specialist) => {
    const specialistCard = document.createElement("div");
    specialistCard.className = "specialist-card";
    specialistCard.innerHTML = `
                    <div class="specialist-info">
                        <h3>${specialist.name}</h3>
                        <p>${specialist.specialty}</p>
                    </div>
                    <div class="specialist-schedule">
                        <p>${specialist.schedule}</p>
                    </div>
                    <div class="specialist-actions">
                        <p class="specialist-price">${specialist.price}</p>
                        <button class="btn-primary take-appointment" data-id="${specialist.id}">Prendre RDV</button>
                    </div>
                `;

    specialistResults.appendChild(specialistCard);
  });

  // Ajouter les écouteurs d'événements pour les boutons
  document.querySelectorAll(".take-appointment").forEach((button) => {
    button.addEventListener("click", function () {
      const specialistId = this.getAttribute("data-id");
      // Simuler la prise de rendez-vous
      alert(`Rendez-vous pris avec le spécialiste #${specialistId}`);
      showPage("appointments");
    });
  });
}

// Afficher les rendez-vous
const appointmentsList = document.getElementById("appointments-list");
if (appointmentsList) {
  displayAppointments();
}

function displayAppointments() {
  appointmentsList.innerHTML = "";

  appointments.forEach((appointment) => {
    const statusClass =
      appointment.status === "Accepté" ? "status-accepted" : "status-pending";

    const row = document.createElement("tr");
    row.innerHTML = `
                    <td>${appointment.reason}</td>
                    <td>${appointment.date}</td>
                    <td><span class="status-badge ${statusClass}">${appointment.status}</span></td>
                `;

    appointmentsList.appendChild(row);
  });
}

// Afficher les notifications
const notificationsContainer = document.getElementById(
  "notifications-container"
);
if (notificationsContainer) {
  displayNotifications();
}

function displayNotifications() {
  notificationsContainer.innerHTML = "";

  notifications.forEach((notification) => {
    const notificationCard = document.createElement("div");
    notificationCard.className = "notification-card";
    notificationCard.innerHTML = `
                    <div class="notification-header">
                        <h3>${notification.title}</h3>
                        <span class="notification-date">${
                          notification.date
                        }</span>
                    </div>
                    <p>${notification.content}</p>
                    <div class="notification-actions">
                        ${
                          notification.title.includes("visioconférence") ? (
                            <a href="#" class="video-link">
                              Rejoindre la visioconférence
                            </a>
                          ) : (
                            ""
                          )
                        }
                    </div>
                `;

    notificationsContainer.appendChild(notificationCard);
  });
}

// Afficher les ordonnances
const prescriptionsContainer = document.getElementById(
  "prescriptions-container"
);
if (prescriptionsContainer) {
  displayPrescriptions();
}

function displayPrescriptions() {
  prescriptionsContainer.innerHTML = "";

  prescriptions.forEach((prescription) => {
    const prescriptionCard = document.createElement("div");
    prescriptionCard.className = "prescription-card";
    prescriptionCard.innerHTML = `
                    <div class="prescription-header">
                        <h3>Ordonnance du ${prescription.date}</h3>
                        <span>Par ${prescription.doctor}</span>
                    </div>
                    <div class="prescription-details">
                        <div class="prescription-item">
                            <strong>Observations:</strong> ${prescription.observations}
                        </div>
                        <div class="prescription-item">
                            <strong>Recommandations:</strong> ${prescription.recommendations}
                        </div>
                        <div class="prescription-item">
                            <strong>Prochain rendez-vous:</strong> ${prescription.nextAppointment}
                        </div>
                        <div class="prescription-item">
                            <strong>Examens à faire:</strong> ${prescription.exams}
                        </div>
                    </div>
                `;

    prescriptionsContainer.appendChild(prescriptionCard);
  });
}

// ===== GESTION DU PROFIL =====
const editProfileBtn = document.getElementById("edit-profile");
const saveProfileBtn = document.getElementById("save-profile");
const profileForm = document.getElementById("profile-form");

if (editProfileBtn && saveProfileBtn && profileForm) {
  editProfileBtn.addEventListener("click", function () {
    // Activer l'édition des champs
    document.getElementById("profile-name").disabled = false;
    document.getElementById("profile-email").disabled = false;
    document.getElementById("profile-phone").disabled = false;
    document.getElementById("profile-password").disabled = false;

    // Changer le mot de passe en texte vide pour la modification
    document.getElementById("profile-password").value = "";

    // Activer le bouton de sauvegarde
    saveProfileBtn.disabled = false;
  });

  profileForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Désactiver l'édition des champs
    document.getElementById("profile-name").disabled = true;
    document.getElementById("profile-email").disabled = true;
    document.getElementById("profile-phone").disabled = true;
    document.getElementById("profile-password").disabled = true;

    // Remettre le mot de passe en placeholder
    document.getElementById("profile-password").value = "";

    // Désactiver le bouton de sauvegarde
    saveProfileBtn.disabled = true;

    // Afficher un message de confirmation
    alert("Profil mis à jour avec succès !");
  });
}

// ===== SIMULATION DE CHAT =====
const chatMessages = document.getElementById("chat-messages");
if (chatMessages) {
  // Messages initiaux de simulation
  const initialMessages = [
    {
      sender: "Médecin",
      text: "Bonjour, comment puis-je vous aider aujourd'hui ?",
      time: "10:30",
    },
    {
      sender: "Vous",
      text: "Bonjour docteur, j'ai des douleurs à la poitrine depuis ce matin.",
      time: "10:31",
    },
    {
      sender: "Médecin",
      text: "Pouvez-vous décrire la nature de cette douleur ?",
      time: "10:32",
    },
  ];

  // Afficher les messages initiaux
  initialMessages.forEach((message) => {
    addMessageToChat(message.sender, message.text, message.time);
  });

  // Simulation de réponse automatique après un délai
  setTimeout(() => {
    addMessageToChat(
      "Médecin",
      "Je vais vous prescrire un électrocardiogramme pour plus de sécurité.",
      "10:35"
    );
  }, 5000);
}

function addMessageToChat(sender, text, time) {
  const messageElement = document.createElement("div");
  messageElement.className =
    chat - message`${sender === "Vous" ? "own-message" : ""}`;
  messageElement.innerHTML = `
                <strong>${sender}:</strong> ${text} <span class="message-time">${time}</span>
            `;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
