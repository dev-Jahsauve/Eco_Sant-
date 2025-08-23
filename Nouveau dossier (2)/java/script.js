
    /* ======== ÉTAT APPLI (demo locale) ======== */
    const state = {
      currentUser: null,
      appointments: JSON.parse(localStorage.getItem('eco_rdv') || '[]'),
      prescriptions: JSON.parse(localStorage.getItem('eco_rx') || '[]'),
    };
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    /* ======== NAVIGATION / ROUTER ======== */
    function showView(id) {
        $$('.view').forEach(v => v.classList.remove('active'));
        const el = $(`#${id}`) || $('#landing');
        el.classList.add('active');

        $$('.nav-link').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
        updateNav();

        if (id === 'dashboard-patient') renderPatientDash();
        if (id === 'dashboard-practitioner') renderPractDash();
        if (id === 'consultation') renderConsultations();
        if (id === 'profile') hydrateProfileForm();
    }

    function router() {
      const hash = window.location.hash.substring(1) || 'landing';
      showView(hash);
    }
    window.addEventListener('hashchange', router);
    document.addEventListener('DOMContentLoaded', router);

    $$('a[href^="#"]').forEach(el => {
      el.addEventListener('click', e => {
        if (!e.target.closest('.card')) {
          e.preventDefault();
          window.location.hash = el.getAttribute('href');
          toggleMenu(false);
        }
      });
    });

    const menu = $('#mainMenu');
    const btnHamb = $('#btnHamburger');
    function toggleMenu(force) {
        if (typeof force === 'boolean') { menu.classList.toggle('open', force); return; }
        menu.classList.toggle('open');
    }
    btnHamb.addEventListener('click', () => toggleMenu());

    /* ======== AUTH / INSCRIPTION ======== */
    const authForm = $('#authForm');
    const roleSelect = $('#role');
    roleSelect.addEventListener('change', () => {
        $('.practitioner-only').style.display = (roleSelect.value === 'medecin' || roleSelect.value === 'naturopathe') ? 'block' : 'none';
    });

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = $('#fullName').value.trim();
        const email = $('#email').value.trim();
        const phone = $('#phone').value.trim();
        const pwd = $('#password').value;
        const role = $('#role').value;
        const specialty = $('#specialty').value.trim();

        state.currentUser = {
            id: crypto.randomUUID(),
            name, email, phone, password: pwd, role,
            specialty: (role === 'patient') ? '' : specialty
        };
        localStorage.setItem('eco_user', JSON.stringify(state.currentUser));
        updateNav();
        window.location.hash = (role === 'patient' ? 'dashboard-patient' : 'dashboard-practitioner');
    });

    function loadSession() {
        const u = localStorage.getItem('eco_user');
        if (u) { state.currentUser = JSON.parse(u); }
        updateNav();
    }

    function logout() {
        state.currentUser = null;
        localStorage.removeItem('eco_user');
        updateNav();
        window.location.hash = 'landing';
    }

    function updateNav() {
        const who = $('#whoami');
        const btnLogin = $('#btnLogin');
        const btnLogout = $('#btnLogout');
        const isAuth = !!state.currentUser;

        who.style.display = isAuth ? 'inline-block' : 'none';
        btnLogin.style.display = isAuth ? 'none' : 'inline-block';
        btnLogout.style.display = isAuth ? 'inline-block' : 'none';
        if (isAuth) {
            who.textContent = `${state.currentUser.name} • ${state.currentUser.role}`;
        }

        $$('.require-auth').forEach(el => el.style.display = isAuth ? '' : 'none');
        $$('.patient-only').forEach(el => el.style.display = (isAuth && state.currentUser.role === 'patient') ? '' : 'none');
        $$('.practitioner-only').forEach(el => el.style.display = (isAuth && (state.currentUser.role === 'medecin' || state.currentUser.role === 'naturopathe')) ? '' : 'none');
    }

    /* ======== PRISE DE RDV ======== */
    const formBooking = $('#formBooking');
    formBooking?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!state.currentUser) { alert('Connecte-toi d’abord.'); return; }
        const type = $('#bkType').value;
        const date = $('#bkDate').value;
        const time = $('#bkTime').value;
        const reason = $('#bkReason').value.trim();

        const rdv = {
            id: crypto.randomUUID(),
            patientName: state.currentUser.name,
            patientEmail: state.currentUser.email,
            type, date, time, reason,
            status: 'En attente', link: null
        };
        state.appointments.push(rdv);
        localStorage.setItem('eco_rdv', JSON.stringify(state.appointments));
        $('#bkMsg').innerHTML = `<span class="alert ok">Demande envoyée. Statut: <b>En attente</b>.</span>`;
        $('#bkSummary').innerHTML = `
            <li><b>Type:</b> ${type}</li>
            <li><b>Date:</b> ${date}</li>
            <li><b>Heure:</b> ${time}</li>
            <li><b>Motif:</b> ${reason}</li>
        `;
        renderPatientDash();
    });

    /* ======== TABLEAUX / RENDUS ======== */
    function renderPatientDash() {
        const tbody = $('#tblPatientUpcoming tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        const me = state.currentUser?.email;
        const mine = state.appointments.filter(a => a.patientEmail === me);
        if (mine.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5">Aucun rendez-vous.</td></tr>`;
        } else {
            mine.forEach(a => {
                const tr = document.createElement('tr');
                const statusClass = a.status === 'Confirmé' ? 'confirmed' : a.status === 'Refusé' ? 'refused' : 'pending';
                const statusText = a.status;
                const typeText = a.type === 'medecin' ? 'Médecin' : 'Naturopathe';
                tr.innerHTML = `
                    <td>${a.date}</td>
                    <td>${a.time}</td>
                    <td>${typeText}</td>
                    <td>${a.reason}</td>
                    <td class="status ${statusClass}">${statusText}</td>
                `;
                tbody.appendChild(tr);
            });
        }
        const wrap = $('#patientPrescriptions');
        const myRx = state.prescriptions.filter(rx => rx.patientEmail === me);
        if (myRx.length === 0) { wrap.textContent = 'Aucune ordonnance pour le moment.'; }
        else {
            wrap.innerHTML = myRx.map(rx => `• ${rx.date} — <a href="${rx.url}" download="${rx.fileName}">${rx.fileName}</a>`).join('<br>');
        }
    }

    function renderPractDash() {
        const reqBody = $('#tblRequests tbody');
        const upBody = $('#tblPractUpcoming tbody');
        if (!reqBody || !upBody) return;
        reqBody.innerHTML = '';
        upBody.innerHTML = '';
        const role = state.currentUser?.role;
        if (!(role === 'medecin' || role === 'naturopathe')) return;
        const mine = state.appointments.filter(a => a.type === role);
        const pending = mine.filter(a => a.status === 'En attente');
        const confirmed = mine.filter(a => a.status === 'Confirmé');

        pending.forEach(a => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${a.patientName}</td>
                <td>${a.date}</td>
                <td>${a.time}</td>
                <td>${a.reason}</td>
                <td>
                    <button class="btn small" data-accept="${a.id}">Accepter</button>
                    <button class="btn ghost small" data-refuse="${a.id}">Refuser</button>
                </td>
            `;
            reqBody.appendChild(tr);
        });
        confirmed.forEach(a => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${a.patientName}</td>
                <td>${a.date}</td>
                <td>${a.time}</td>
                <td>${a.link ? `<a href="${a.link}" target="_blank">Lien</a>` : '—'}</td>
            `;
            upBody.appendChild(tr);
        });
        reqBody.querySelectorAll('[data-accept]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.accept;
                const rdv = state.appointments.find(r => r.id === id);
                if (!rdv) return;
                rdv.status = 'Confirmé';
                rdv.link = `https://visio.eco-sante.demo/${id}`;
                localStorage.setItem('eco_rdv', JSON.stringify(state.appointments));
                renderPractDash(); renderPatientDash();
            });
        });
        reqBody.querySelectorAll('[data-refuse]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.refuse;
                const rdv = state.appointments.find(r => r.id === id);
                if (!rdv) return;
                rdv.status = 'Refusé';
                localStorage.setItem('eco_rdv', JSON.stringify(state.appointments));
                renderPractDash(); renderPatientDash();
            });
        });
    }

    /* ======== CONSULTATION ======== */
    function renderConsultations() {
        const tbody = $('#tblConfirmed tbody');
        const me = state.currentUser;
        if (!tbody || !me) { return; }
        $('#consAlert').style.display = 'block';
        $('#liveConsult').style.display = 'none';
        $('#linkPreview').textContent = '';

        tbody.innerHTML = '';
        let list = [];
        if (me.role === 'patient') {
            list = state.appointments.filter(a => a.patientEmail === me.email && a.status === 'Confirmé');
        } else if (me.role === 'medecin' || me.role === 'naturopathe') {
            list = state.appointments.filter(a => a.type === me.role && a.status === 'Confirmé');
        }
        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4">Aucune consultation confirmée.</td></tr>`;
            return;
        }
        list.forEach(a => {
            const tr = document.createElement('tr');
            const withWho = (me.role === 'patient') ? `${a.type === 'medecin' ? 'Médecin' : 'Naturopathe'}` : a.patientName;
            tr.innerHTML = `
                <td>${withWho}</td>
                <td>${a.date}</td>
                <td>${a.time}</td>
                <td><button class="btn small" data-start="${a.id}">Commencer</button></td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll('[data-start]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.start;
                const rdv = state.appointments.find(r => r.id === id);
                if (!rdv) return;
                $('#consAlert').style.display = 'none';
                $('#liveConsult').style.display = 'grid';
                $('#linkPreview').innerHTML = `Lien vidéo sécurisé (démo): <a href="${rdv.link}" target="_blank">${rdv.link}</a>`;
                live.current = rdv;
                $('#chatLog').innerHTML = '';
                $('#fileList').textContent = '';
                $('#noteMed').value = '';
            });
        });
    }

    const live = { current: null };
    $('#btnSend').addEventListener('click', () => {
        const input = $('#chatInput');
        const txt = input.value.trim();
        if (!txt) return;
        const div = document.createElement('div');
        div.className = 'msg me';
        div.textContent = (state.currentUser?.name || 'Moi') + ': ' + txt;
        $('#chatLog').appendChild(div);
        input.value = '';
        $('#chatLog').scrollTop = $('#chatLog').scrollHeight;
    });
    $('#fileInput').addEventListener('change', (e) => {
        const files = [...e.target.files];
        $('#fileList').innerHTML = files.map(f => `• ${f.name} (${Math.round(f.size / 1024)} Ko)`).join('<br>');
    });
    $('#btnPrescription').addEventListener('click', () => {
        if (!live.current) return;
        const content = [
            'Éco-Santé — Ordonnance (démo)',
            `Date: ${new Date().toLocaleString()}`,
            `Patient: ${live.current.patientName}`,
            `Praticien: ${state.currentUser.role}`,
            '',
            'Recommandations / Traitement:',
            $('#noteMed').value || '(vide)'
        ].join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const fileName = `Ordonnance_${new Date().toISOString().slice(0, 10)}.txt`;
        state.prescriptions.push({ id: crypto.randomUUID(), patientEmail: live.current.patientEmail, fileName, url, date: new Date().toLocaleDateString() });
        localStorage.setItem('eco_rx', JSON.stringify(state.prescriptions));
        $('#rxStatus').innerHTML = `<span class="alert ok">Ordonnance générée et enregistrée.</span>`;
    });

    /* ======== PROFIL UTILISATEUR ======== */
    const pfInputs = $$('#profile input');
    const btnEditProfile = $('#btnEditProfile');
    const btnSaveProfile = $('#btnSaveProfile');
    const btnCancelProfile = $('#btnCancelProfile');
    const pfMsg = $('#pfMsg');

    function hydrateProfileForm() {
        if (!state.currentUser) return;
        $('#pfName').value = state.currentUser.name;
        $('#pfEmail').value = state.currentUser.email;
        $('#pfPhone').value = state.currentUser.phone;
        $('#pfRole').value = state.currentUser.role;
        $('#pfSpec').value = state.currentUser.specialty || '';
        $('#pfPhoto').value = state.currentUser.photo || '';
        $('.pf-spec').style.display = (state.currentUser.role === 'medecin' || state.currentUser.role === 'naturopathe') ? 'block' : 'none';

        setProfileEditable(false);
    }

    function setProfileEditable(editable) {
        pfInputs.forEach(input => {
            if (input.id !== 'pfRole') {
                input.disabled = !editable;
            }
        });
        btnEditProfile.style.display = editable ? 'none' : 'block';
        btnSaveProfile.style.display = editable ? 'block' : 'none';
        btnCancelProfile.style.display = editable ? 'block' : 'none';
        pfMsg.style.display = 'none';
    }

    btnEditProfile.addEventListener('click', () => setProfileEditable(true));
    btnCancelProfile.addEventListener('click', () => {
        hydrateProfileForm();
        setProfileEditable(false);
    });

    btnSaveProfile.addEventListener('click', () => {
        const user = state.currentUser;
        if (!user) return;
        user.name = $('#pfName').value;
        user.email = $('#pfEmail').value;
        user.phone = $('#pfPhone').value;
        user.specialty = $('#pfSpec').value;
        user.photo = $('#pfPhoto').value;

        localStorage.setItem('eco_user', JSON.stringify(user));
        state.currentUser = user;

        pfMsg.textContent = 'Modifications enregistrées ✓';
        pfMsg.className = 'pill alert ok';
        pfMsg.style.display = 'inline-block';

        setProfileEditable(false);
        updateNav();
    });

    $('#btnChangePwd').addEventListener('click', () => {
        const pwd1 = $('#pfPwd1').value;
        const pwd2 = $('#pfPwd2').value;
        const msgBox = $('#pwdMsg');

        if (pwd1.length < 6) {
            msgBox.innerHTML = `<span class="alert err">Le mot de passe doit faire 6 caractères minimum.</span>`;
            return;
        }
        if (pwd1 !== pwd2) {
            msgBox.innerHTML = `<span class="alert err">Les mots de passe ne correspondent pas.</span>`;
            return;
        }
        if (!state.currentUser) return;
        state.currentUser.password = pwd1;
        localStorage.setItem('eco_user', JSON.stringify(state.currentUser));
        msgBox.innerHTML = `<span class="alert ok">Mot de passe mis à jour.</span>`;
        $('#pfPwd1').value = '';
        $('#pfPwd2').value = '';
    });

    loadSession();
    router();
