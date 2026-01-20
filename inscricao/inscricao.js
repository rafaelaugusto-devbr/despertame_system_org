// ============================= 
// SCRIPT DE VALIDAÇÃO E EFEITOS
// ============================= 

document.addEventListener("DOMContentLoaded", () => {
    
    // Elementos do DOM
    const loading = document.getElementById("loading");
    const formContainer = document.getElementById("formContainer");
    const blocked = document.getElementById("blocked");
    const formIframe = document.getElementById("formIframe");

    // ============================= 
    // VALIDAÇÃO DO reCAPTCHA
    // ============================= 

    // Timeout de segurança para evitar loading infinito
    const loadingTimeout = setTimeout(() => {
        if (!loading.classList.contains("hidden")) {
            console.warn("reCAPTCHA demorou muito para responder");
            showBlocked();
        }
    }, 10000); // 10 segundos

    // Verificação do reCAPTCHA
    if (typeof grecaptcha !== 'undefined') {
        grecaptcha.ready(() => {
            grecaptcha.execute("6LchJ1AsAAAAAKY32R-WgwjaCIvmjrXRRYw5QKP2", { 
                action: "access_form" 
            })
            .then(token => {
                clearTimeout(loadingTimeout);
                
                // Validação do token
                if (!token || token.length < 20) {
                    console.error("Token reCAPTCHA inválido");
                    showBlocked();
                    return;
                }

                // Token válido - libera formulário
                console.log("reCAPTCHA validado com sucesso");
                showForm();
            })
            .catch(error => {
                clearTimeout(loadingTimeout);
                console.error("Erro no reCAPTCHA:", error);
                showBlocked();
            });
        });
    } else {
        clearTimeout(loadingTimeout);
        console.error("reCAPTCHA não carregou");
        showBlocked();
    }

    // ============================= 
    // FUNÇÕES DE CONTROLE DE ESTADOS
    // ============================= 

    function showForm() {
        loading.classList.add("hidden");
        formContainer.classList.remove("hidden");
        
        // Adiciona animações escalonadas
        setTimeout(() => {
            const elementsToAnimate = formContainer.querySelectorAll('.slide-up');
            elementsToAnimate.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        el.style.transition = 'all 0.5s ease';
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 100);
            });
        }, 100);

        // Foco no iframe para acessibilidade
        setTimeout(() => {
            formIframe.focus();
        }, 1000);
    }

    function showBlocked() {
        loading.classList.add("hidden");
        blocked.classList.remove("hidden");
    }

    // ============================= 
    // IFRAME COM SCROLL NATURAL (sem altura fixa)
    // ============================= 
    // O iframe agora ocupa todo o espaço disponível usando flexbox
    // e tem scroll natural, como um formulário nativo do site

    // ============================= 
    // TRATAMENTO DE ERROS DO IFRAME
    // ============================= 

    formIframe.addEventListener('error', () => {
        console.error("Erro ao carregar o formulário");
    });

    // Detecta quando o iframe terminou de carregar
    formIframe.addEventListener('load', () => {
        console.log("Formulário carregado com sucesso");
    });

    // ============================= 
    // EFEITO DE SCROLL SUAVE
    // ============================= 

    // Detecta scroll dentro do iframe (quando possível)
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        
        // Adiciona classe de animação baseada no scroll
        if (st > lastScrollTop) {
            // Scrolling down
            document.body.classList.add('scrolling-down');
            document.body.classList.remove('scrolling-up');
        } else {
            // Scrolling up
            document.body.classList.add('scrolling-up');
            document.body.classList.remove('scrolling-down');
        }
        lastScrollTop = st <= 0 ? 0 : st;
    }, false);

    // ============================= 
    // PREVINE CACHE DO IFRAME
    // ============================= 

    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            location.reload();
        }
    });
    
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode.splice(-konamiSequence.length - 1, konamiCode.length - konamiSequence.length);
        
        if (konamiCode.join('').includes(konamiSequence.join(''))) {
            document.body.style.filter = document.body.style.filter === 'invert(1)' ? '' : 'invert(1)';
        }
    });
});