// Import das funções do Firestore
import { doc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyA8nykV5bBkk2SflhOjnt3IbqVHKO-qTcE",
  authDomain: "despertame-8b932.firebaseapp.com",
  projectId: "despertame-8b932",
  storageBucket: "despertame-8b932.firebasestorage.app",
  messagingSenderId: "436618938431",
  appId: "1:436618938431:web:7635e3bd59182c82dc108a",
  measurementId: "G-TH8XGQ1JMP"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * @param {string} tipo 
 * @param {string} url
 */
function atualizarLinksNaPagina(tipo, url) {
    let idsParaAtualizar = [];

    if (tipo === 'ajude') {
        idsParaAtualizar = ['link-ajude-nav', 'link-ajude-hero'];
    } else if (tipo === 'retiro') {
        idsParaAtualizar = ['link-retiro-nav', 'link-retiro-hero', 'link-retiro'];
    } else {
        return;
    }

    idsParaAtualizar.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            if (url && url.trim() !== '') {
                elemento.href = url;
                elemento.style.display = ''; 
                elemento.onclick = null; 
            } else {
                elemento.href = '#';
                elemento.style.display = 'none'; 
                elemento.onclick = (e) => e.preventDefault(); 
            }
        }
    });
}

export function initializeFirebaseLinkListeners() {
    console.log('Inicializando Firebase listeners...');
    console.log('DB inicializado:', !!db);
    
    try {
        // Listener para documentos "ajude"
        const ajudeDocRef = doc(db, 'ajude', 'config');
        onSnapshot(ajudeDocRef, (docSnapshot) => {
            console.log('Snapshot ajude recebido, existe:', docSnapshot.exists());
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                console.log('Dados ajude:', data);
                atualizarLinksNaPagina('ajude', data.url || '');
            } else {
                console.log('Documento ajude não existe');
                atualizarLinksNaPagina('ajude', '');
            }
        }, (error) => {
            console.error('Erro no listener ajude:', error);
        });

        // Listener para documentos "retiro"
        const retiroDocRef = doc(db, 'retiro', 'config');
        onSnapshot(retiroDocRef, (docSnapshot) => {
            console.log('Snapshot retiro recebido, existe:', docSnapshot.exists());
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                console.log('Dados retiro:', data);
                atualizarLinksNaPagina('retiro', data.url || '');
            } else {
                console.log('Documento retiro não existe');
                atualizarLinksNaPagina('retiro', '');
            }
        }, (error) => {
            console.error('Erro no listener retiro:', error);
        });

        console.log('Listeners configurados com sucesso!');

    } catch (error) {
        console.error('Erro ao inicializar listeners:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, inicializando Firebase listeners...');
    initializeFirebaseLinkListeners();
});