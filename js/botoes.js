document.addEventListener("DOMContentLoaded", function() {
    const welcomeModal = document.getElementById("welcomeModal");
    const welcomeContinueBtn = document.getElementById("welcomeContinueBtn");
    const helpModal = document.getElementById("helpModal");
    const helpCloseBtn = document.getElementById("helpCloseBtn");
    const ajudeButtonRodape = document.querySelector(".ajude-button-rodape");
    const ajudeButtonCenter = document.querySelector(".ajude-button-center");

    if (welcomeModal) {
        welcomeModal.classList.add("active");
    }

    if (welcomeContinueBtn) {
        welcomeContinueBtn.addEventListener("click", function() {
            welcomeModal.classList.remove("active");
        });
    }

    function openHelpModal(event, buttonElement) {
        event.preventDefault(); 
        if (helpModal) {
            helpModal.classList.add("active");
            helpModal.setAttribute("data-clicked-button", buttonElement.className);
        }
    }

    function redirectFromModal() {
        const clickedButtonClass = helpModal.getAttribute("data-clicked-button");
        let buttonElement;
        
        if (clickedButtonClass && clickedButtonClass.includes("ajude-button-center")) {
            buttonElement = ajudeButtonCenter;
        } else {
            buttonElement = ajudeButtonRodape;
        }

        if (buttonElement) {
            const originalLink = buttonElement.getAttribute("href");
            const originalTarget = buttonElement.getAttribute("target");
            if (originalLink) {
                if (originalTarget === "_blank") {
                    window.open(originalLink, "_blank");
                } else {
                    window.location.href = originalLink;
                }
            }
        }
    }

    if (ajudeButtonRodape) {
        ajudeButtonRodape.addEventListener("click", function(event) {
            event.preventDefault();
            
            if (helpModal) {
                helpModal.classList.add("active");
                helpModal.setAttribute("data-clicked-button", this.className);
            }
            
            setTimeout(() => {
                console.log("Modal exibido com sucesso");
            }, 100);
        });
    }

    if (ajudeButtonCenter) {
        ajudeButtonCenter.addEventListener("click", function(event) {
            event.preventDefault();
            
            if (helpModal) {
                helpModal.classList.add("active");
                helpModal.setAttribute("data-clicked-button", this.className);
            }
            
            setTimeout(() => {
                console.log("Modal exibido com sucesso");
            }, 100);
        });
    }

    if (helpCloseBtn) {
        helpCloseBtn.addEventListener("click", function() {
            helpModal.classList.remove("active");
            redirectFromModal();
        });
    }

    window.addEventListener("click", function(event) {
        if (event.target === welcomeModal) {
            welcomeModal.classList.remove("active");
        }
        if (event.target === helpModal) {
            helpModal.classList.remove("active");
            redirectFromModal();
        }
    });
});