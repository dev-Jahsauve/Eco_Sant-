document.addEventListener("DOMContentLoaded", function () {
  // Éléments de la page
  const mainContent = document.getElementById("main-content");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const dashboard = document.getElementById("dashboard");
  const btnLogin = document.getElementById("btn-login");
  const btnRegister = document.getElementById("btn-register");
  const showLogin = document.getElementById("show-login");
  const showRegister = document.getElementById("show-register");
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const navLinks = document.querySelectorAll(".nav-link");
  const dashboardSections = document.querySelectorAll(".dashboard-section");
  const userName = document.getElementById("user-name");
  const footerAccueil = document.getElementById("footer-accueil");
  const footerAbout = document.getElementById("footer-about");
  const navAccueil = document.getElementById("nav-accueil");
  const navAbout = document.getElementById("nav-about");

  // Afficher le formulaire de connexion
  function showLoginForm() {
    mainContent.style.display = "none";
    loginForm.style.display = "flex";
    registerForm.style.display = "none";
    dashboard.style.display = "none";
  }

  // Afficher le formulaire d'inscription
  function showRegisterForm() {
    mainContent.style.display = "none";
    loginForm.style.display = "none";
    registerForm.style.display = "flex";
    dashboard.style.display = "none";
  }

  // Afficher le dashboard
  function showDashboard() {
    mainContent.style.display = "none";
    loginForm.style.display = "none";
    registerForm.style.display = "none";
    dashboard.style.display = "block";
  }

  // Afficher la page d'accueil
  function showHomePage() {
    mainContent.style.display = "block";
    loginForm.style.display = "none";
    registerForm.style.display = "none";
    dashboard.style.display = "none";
  }

  // Navigation dans le dashboard
  function changeDashboardSection(sectionId) {
    dashboardSections.forEach((section) => {
      section.classList.remove("active");
    });
    document.getElementById(sectionId).classList.add("active");

    navLinks.forEach((link) => {
      link.classList.remove("active");
    });
    document
      .querySelector(`[data-section="${sectionId}"]`)
      .classList.add("active");
  }

  // Événements
  btnLogin.addEventListener("click", function (e) {
    e.preventDefault();
    showLoginForm();
  });

  btnRegister.addEventListener("click", function (e) {
    e.preventDefault();
    showRegisterForm();
  });

  showLogin.addEventListener("click", function (e) {
    e.preventDefault();
    showLoginForm();
  });

  showRegister.addEventListener("click", function (e) {
    e.preventDefault();
    showRegisterForm();
  });

  loginBtn.addEventListener("click", function (e) {
    e.preventDefault();
    alert("Connexion réussie ! Bienvenue sur eco_santé.");
    const fullName = "Dr. Julien Dupont";
    userName.textContent = fullName;
    showDashboard();
  });

  registerBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const fullName =
      document.getElementById("fullname").value || "Dr. Julien Dupont";
    const userType = document.querySelector(
      'input[name="user-type"]:checked'
    ).value;

    userName.textContent = fullName;
    alert(
      `Inscription réussie ! Bienvenue ${fullName} (${userType}) sur eco_santé.`
    );
    showDashboard();
  });

  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    showHomePage();
    alert("Vous avez été déconnecté avec succès.");
  });

  // Navigation dans le dashboard
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const sectionId = this.getAttribute("data-section");
      changeDashboardSection(sectionId);
    });
  });

  // Navigation depuis le footer
  footerAccueil.addEventListener("click", function (e) {
    e.preventDefault();
    showHomePage();
  });

  footerAbout.addEventListener("click", function (e) {
    e.preventDefault();
    showHomePage();
    setTimeout(() => {
      document.getElementById("about").scrollIntoView({ behavior: "smooth" });
    }, 100);
  });

  // Navigation depuis la navbar
  navAccueil.addEventListener("click", function (e) {
    e.preventDefault();
    showHomePage();
  });

  navAbout.addEventListener("click", function (e) {
    e.preventDefault();
    showHomePage();
    setTimeout(() => {
      document.getElementById("about").scrollIntoView({ behavior: "smooth" });
    }, 100);
  });
});
