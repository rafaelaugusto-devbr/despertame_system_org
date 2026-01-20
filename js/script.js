// js/script.js

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // Efeito da barra de navegação ao rolar (scrolled) - Funciona em todas as páginas
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- CORREÇÃO PRINCIPAL APLICADA AQUI ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // VERIFICA se o link é para uma âncora na MESMA PÁGINA
            if (targetId.startsWith('#')) {
                e.preventDefault(); // Só previne o padrão para rolagem suave

                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Desconto para a altura da navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            // Se o link NÃO começar com '#', o JavaScript não faz nada
            // e o navegador segue o link normalmente (ex: para "blog/blog.html" ou "../index.html#home").
        });
    });

    // Efeito de Fade-in para elementos - Funciona em todas as páginas
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.about-card, .mission-card, .contact-form, .location-info')
        .forEach(el => observer.observe(el));

    // Efeito de "hover" nos cards - Funciona em todas as páginas
    document.querySelectorAll('.about-card, .mission-card').forEach(card => {
        card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-10px) scale(1.02)');
        card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0) scale(1)');
    });

    // Marcar link ativo na navbar ao rolar - Funciona em todas as páginas
    // Adicionamos uma verificação para evitar erros em páginas sem as seções
    if (document.querySelector('section[id]')) {
        window.addEventListener('scroll', function() {
            const scrollPos = window.scrollY + 100;
            document.querySelectorAll('section[id]').forEach(section => {
                const navLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
                if (navLink && scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            });
        });
    }

    // Easter egg da logo - Funciona em todas as páginas
    let clickCount = 0;
    const navLogo = document.querySelector('.nav-logo');
    if (navLogo) {
        navLogo.addEventListener('click', function() {
            clickCount++;
            if (clickCount === 5) {
                showNotification('🙏 Que Deus abençoe sua jornada!', 'success');
                clickCount = 0;
                this.style.animation = 'pulse 0.5s ease';
                setTimeout(() => this.style.animation = '', 500);
            }
        });
    }

    // Função de notificação - Funciona em todas as páginas
    function showNotification(message, type='info') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        const n = document.createElement('div');
        n.className = `notification ${type}`;
        n.textContent = message;
        n.style.cssText = `
            position: fixed; top: 100px; right: 20px; background: ${type==='success' ? '#4CAF50' : '#2196F3'};
            color: white; padding: 1rem 1.5rem; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000; transform: translateX(100%); transition: transform 0.3s ease; max-width: 300px;
        `;
        document.body.appendChild(n);
        setTimeout(() => n.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            n.style.transform = 'translateX(100%)';
            setTimeout(() => n.remove(), 300);
        }, 5000);
    }
});
