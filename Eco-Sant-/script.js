// ---- Données des spécialistes ----

const specialistsData = [
  {
    id: 1,
    nom: "Dr. Andre Dzudie",
    specialite: "Cardiologue",
    planning: "Lundi, Mercredi, Vendredi",
    creneaux: ["09:00", "11:00", "14:30"],
    image: "images/dr_Andre.jpg",
  },

  {
    id: 2,
    nom: "Dr. Joel Foko",
    specialite: "Neurologue",
    planning: "Mardi, Jeudi",
    creneaux: ["10:00", "15:00"],
    image: "images/dr_Joel.jpg",
  },

  {
    id: 3,
    nom: "Dr. Marc Santa",
    specialite: "Phytothérapeute",
    planning: "Tous les jours",
    creneaux: ["09:30", "11:30", "16:00"],
    image: "favorite/1750099474543.jpg",
  },

  {
    id: 4,
    nom: "Dr. Marc Santa",
    specialite: "Phytothérapeute",
    planning: "Tous les jours",
    creneaux: ["09:30", "11:30", "16:00"],
    image: "images/dr_Marc.jpg",
  },
];

// ---- Fonction pour afficher les spécialistes ----

function displaySpecialist(specialists) {
  // console.log("La fonction displaySpecialists est appelée.");
  const listContainer = document.getElementById("specialist-list");
  listContainer.innerHTML = ""; // Nettoyer la liste existante

  if (specialists.lengh === 0) {
    listContainer.innerHTML = "<p>Aucun spécialiste trouvé.</p>";
    return;
  }

  specialistsData.forEach((specialist) => {
    const specialistBlock = document.createElement("div");
    specialistBlock.classList.add("specialist-block");
    specialistBlock.innerHTML = `
        <div class="specialist-info">
            <img src="${specialist.image}" alt="Photo de ${specialist.nom}">
            <div class="details">
                <h3>${specialist.nom}</h3>
                <p class="specialty">${specialist.specialite}</p>
            </div>    
        </div>
        <div class="planning-info">
            <p><strong>Planning :</strong>${specialist.planning}</p>
         <p><strong>Crénaux :</strong>${specialist.creneaux.join(", ")}</p>
        </div>
        <div class="rdv-action">
            
            <button class="btn btn-rdv" data-id="${
              specialist.id
            }">Prendre un rendez-vous</button>
        </div>
        `;

    listContainer.appendChild(specialistBlock);
  });

  // ---- Ajout des évènements sur les boutons "Prendre un rendez-vous" ----

  document.querySelectorAll(".btn-rdv").forEach((button) => {
    button.addEventListener("click", (event) => {
      const specialistId = event.target.dataset.id;
      const specialist = specialistsData.find((s) => s.id == specialistId);
      if (specialist) {
        showModal(specialist);
      }
    });
  });
}

// ---- Fonctionnalité de recherche dynamique ----

const searchInput = document.getElementById("specialist-search");
searchInput.addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase();
  const filteredSpecialists = specialistsData.filter(
    (specialist) =>
      specialist.nom.toLowerCase().includes(searchTerm) ||
      specialist.specialite.toLowerCase().includes(searchTerm)
  );
  displaySpecialist(filteredSpecialists);
});

// ---- Gestion du Modal ----

const modal = document.getElementById("rdv-modal");
const closeBtn = document.querySelector(".close-btn");

function showModal(specialist) {
  document.getElementById(
    "modal-specialist-name"
  ).textContent = `Prendre rendez-vous avec ${specialist.nom}`;
  modal.style.display = "block"; // Afficher le modal
}

function hideModal() {
  modal.style.display = "none"; // Cacher le modal
}

// Cacher le modal si l'utilisateur clique sur le bouton de fermeture ou en dehors du modal

closeBtn.addEventListener("click", hideModal);
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    hideModal();
  }
});

// ---- Gestion de la soumission du formulaire du modal ----

const rdvForm = document.getElementById("rdv-form");
rdvForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Empeche le chargement de la page

  const formData = new formData(rdvForm);
  const rdvData = Object.fromEntries(formData.entries());

  // Affichage des données dans la console

  console.log("Rendez-vous confirmé :", rdvData);

  // Fermeture du modal après soumission

  hideModal();

  // Redirection vers la page des rendez-vous

  window.location.href = "Rendezvous.html";
});

// Affichage de tous les specialistes au chargement de la page

document.addEventListener("DOMContentLoaded", () => {
  displaySpecialist(specialistsData);
});
