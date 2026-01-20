import { doc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

let db;

async function loadFirebaseConfig() {
    try {
        const module = await import('../admin/firebase-config.js');
        db = module.db;
        console.log('Firebase config carregado com sucesso!');
        return true;
    } catch (error) {
        console.error('Erro ao carregar firebase config:', error);
        return false;
    }
}

export async function initializeFirebaseLinkListeners() {
    const configLoaded = await loadFirebaseConfig();
    
    if (!configLoaded) {
        console.error('Não foi possível carregar a configuração do Firebase');
        return;
    }

    try {
        onSnapshot(doc(db, 'ajude', 'config'), (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                atualizarLinksNaPagina('ajude', data.url || '');
            } else {
                atualizarLinksNaPagina('ajude', ''); 
            }
        }, (error) => {
            console.error('Erro no listener ajude:', error);
        });

        onSnapshot(doc(db, 'retiro', 'config'), (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                atualizarLinksNaPagina('retiro', data.url || '');
            } else {
                atualizarLinksNaPagina('retiro', '');
            }
        }, (error) => {
            console.error('Erro no listener retiro:', error);
        });
    } catch (error) {
        console.error('Erro ao inicializar listeners:', error);
    }
}

function atualizarLinksNaPagina(tipo, url) {
}

document.addEventListener('DOMContentLoaded', async () => {
    await initializeFirebaseLinkListeners();
});