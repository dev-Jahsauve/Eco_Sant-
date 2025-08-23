   // Navigation et affichage des pages
        function showPage(pageId) {
            // Masquer toutes les pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active-page');
            });

            // Afficher la page demandée
            document.getElementById(pageId).classList.add('active-page');

            // Scroll vers le haut
            window.scrollTo(0, 0);
        }

        // Menu hamburger responsive
        document.getElementById('hamburger').addEventListener('click', function() {
            document.getElementById('nav-menu').classList.toggle('active');
        });

        // Gestion des formulaires
        document.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Connexion simulée avec succès! Redirection vers le dashboard...');
            showPage('dashboard-patient');
        });

        document.getElementById('register-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('register-password').value;
            const confirm = document.getElementById('register-confirm').value;
            
            if (password !== confirm) {
                alert('Les mots de passe ne correspondent pas!');
                return;
            }
            
            alert('Inscription simulée avec succès! Redirection vers le dashboard...');
            showPage('dashboard-patient');
        });

        document.getElementById('profile-form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Profil mis à jour avec succès!');
        });

        // Sélection des créneaux horaires
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.addEventListener('click', function() {
                document.querySelectorAll('.time-slot').forEach(s => {
                    s.classList.remove('selected');
                });
                this.classList.add('selected');
            });
        });

        // Simulation de la sélection d'un jour dans le calendrier
        document.querySelectorAll('.calendar-day').forEach(day => {
            if (parseInt(day.textContent)) {
                day.addEventListener('click', function() {
                    document.querySelectorAll('.calendar-day').forEach(d => {
                        d.classList.remove('current-day');
                    });
                    this.classList.add('current-day');
                });
            }
        });
