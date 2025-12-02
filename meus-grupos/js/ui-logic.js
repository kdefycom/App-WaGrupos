function escapeHTML(str) {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
}

function setupSidebar() {
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const closeBtn = document.getElementById('closeSidebar');
    if (!toggle || !sidebar || !overlay || !closeBtn) return;
    const openMenu = () => { sidebar.classList.add('active'); overlay.classList.add('active'); };
    const closeMenu = () => { sidebar.classList.remove('active'); overlay.classList.remove('active'); };
    toggle.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
}

function setupBoostPopup() {
    boostPopupOverlay = document.getElementById('boost-popup-overlay');
    boostPopup = document.getElementById('boost-popup');
    closePopupButton = document.getElementById('close-popup');

    if (boostPopupOverlay && boostPopup && closePopupButton) {
        closePopupButton.addEventListener('click', closeBoostPopup);
        boostPopupOverlay.addEventListener('click', (event) => {
            if (event.target === boostPopupOverlay) {
                closeBoostPopup();
            }
        });
    }
}

function openBoostPopup() {
    if (boostPopupOverlay) {
        boostPopupOverlay.style.display = 'flex';
    }
}

function closeBoostPopup() {
    if (boostPopupOverlay) {
        boostPopupOverlay.style.display = 'none';
    }
}

function setupImagePreviewHidden() {
    const fileInput = document.getElementById("editFotoFile");
    const preview = document.getElementById("editFotoPreview");

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const prefix = base64.substring(0, base64.indexOf(",") + 1);
        const semPrefixo = base64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

        preview.src = base64;
        preview.dataset.prefix = prefix;
        preview.dataset.base64 = semPrefixo;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    });
}
