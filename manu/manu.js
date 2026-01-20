document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('leadForm');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    
    const submitButton = document.getElementById('submitButton');
    const errorMessage = document.getElementById('errorMessage');
    const successPopupOverlay = document.getElementById('successPopupOverlay');
    const closePopupButton = document.getElementById('closePopupButton');

    // --- Inicializa a biblioteca de telefone ---
    const iti = window.intlTelInput(telefoneInput, {
        initialCountry: "br",
        separateDialCode: true,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
    } );

    // --- IDs CORRETOS ---
    const LIST_ID = '901320268027'; 
    const TELEFONE_FIELD_ID = '1171fc0c-eb66-4b2c-83e0-42b9a1cec819';
    const EMAIL_FIELD_ID = 'ebe00a8c-e189-4893-a403-38a45491ed93';
    
    const CLICKUP_API_URL = `https://despertame.ra7700521.workers.dev/?list_id=${LIST_ID}`;

    form.addEventListener('submit', async function(e ) {
        e.preventDefault();
        
        if (!nomeInput.value.trim() || !emailInput.value.trim() || !telefoneInput.value.trim()) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        toggleLoading(true);
        errorMessage.classList.remove('show');

        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();
        const telefoneFormatado = iti.getNumber(); // Pega o número completo com DDI

        // --- DADOS ENVIADOS PARA OS CAMPOS PERSONALIZADOS ---
        const clickupData = {
            name: nome,
            custom_fields: [
                { id: EMAIL_FIELD_ID, value: email },
                { id: TELEFONE_FIELD_ID, value: telefoneFormatado }
            ]
        };

        try {
            const clickupResponse = await fetch(CLICKUP_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clickupData)
            });

            // Esta verificação falhará hoje por causa do erro 400 (limite do plano)
            if (!clickupResponse.ok) {
                const errorText = await clickupResponse.text();
                throw new Error(`ClickUp falhou: ${errorText}`);
            }

            // Esta parte só será alcançada quando o limite do ClickUp for resolvido
            successPopupOverlay.classList.add('show');
            form.reset();

        } catch (error) {
            console.error("Erro ao enviar para o ClickUp:", error);
            displayMessage(errorMessage);
        } finally {
            toggleLoading(false);
        }
    });

    // --- Eventos do Popup e Funções Auxiliares (sem alterações) ---
    closePopupButton.addEventListener('click', () => {
        successPopupOverlay.classList.remove('show');
    });
    successPopupOverlay.addEventListener('click', (e) => {
        if (e.target === successPopupOverlay) {
            successPopupOverlay.classList.remove('show');
        }
    });

    function toggleLoading(isLoading) {
        const buttonText = submitButton.querySelector('span');
        const icon = submitButton.querySelector('i');
        submitButton.disabled = isLoading;
        if (isLoading) {
            buttonText.style.display = 'none';
            if (!submitButton.querySelector('.spinner')) icon.insertAdjacentHTML('afterend', '<div class="spinner"></div>');
            icon.style.display = 'none';
        } else {
            buttonText.style.display = 'inline';
            const spinner = submitButton.querySelector('.spinner');
            if (spinner) spinner.remove();
            icon.style.display = 'inline-block';
        }
    }

    function displayMessage(messageElement) {
        messageElement.classList.add('show');
        setTimeout(() => { messageElement.classList.remove('show'); }, 6000);
    }
});
