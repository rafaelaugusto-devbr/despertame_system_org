// public/js/blog.js (Versão Completa e Corrigida)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA8nykV5bBkk2SflhOjnt3IbqVHKO-qTcE",
    authDomain: "despertame-8b932.firebaseapp.com",
    projectId: "despertame-8b932",
    storageBucket: "despertame-8b932.firebasestorage.app",
    messagingSenderId: "436618938431",
    appId: "1:436618938431:web:7635e3bd59182c82dc108a",
    measurementId: "G-TH8XGQ1JMP"
};

const app = initializeApp(firebaseConfig );
const db = getFirestore(app);

function formatarData(timestamp) {
    if (!timestamp || typeof timestamp.toDate !== 'function') {
        return "Data indefinida";
    }
    return timestamp.toDate().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

async function carregarPosts() {
    // CORREÇÃO: Garante que estamos pegando o container correto pelo ID
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) {
        console.error("ERRO CRÍTICO: O elemento com ID 'posts-container' não foi encontrado no blog.html.");
        return;
    }

    postsContainer.innerHTML = '<p style="text-align: center; color: #64748b; grid-column: 1 / -1;">Carregando posts...</p>';

    try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, orderBy('data', 'desc'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            postsContainer.innerHTML = '<p style="text-align: center; color: #64748b; grid-column: 1 / -1;">Ainda não há posts no blog. Volte em breve!</p>';
            return;
        }

        let html = '';
        querySnapshot.forEach(doc => {
            const post = doc.data();
            const postId = doc.id;
            
            // CORREÇÃO: Garante que a URL gerada está no formato correto para o firebase.json
            const postUrl = `/post/${postId}`;

            html += `
                <a href="${postUrl}" class="post-card">
                    ${post.imagemUrl ? `<img src="${post.imagemUrl}" alt="${post.titulo}" class="post-card-image">` : '<div class="post-card-image" style="background-color: #e2e8f0;"></div>'}
                    <div class="post-card-content">
                        <h3 class="post-card-title">${post.titulo || 'Sem Título'}</h3>
                        <span class="post-card-date">${formatarData(post.data)}</span>
                        <p class="post-card-excerpt">${post.resumo || 'Clique para ler mais...'}</p>
                        <span class="post-card-read-more">Ler Mais →</span>
                    </div>
                </a>
            `;
        });

        postsContainer.innerHTML = html;

    } catch (error) {
        console.error("Erro ao buscar posts: ", error);
        postsContainer.innerHTML = '<p style="text-align: center; color: #DC143C; grid-column: 1 / -1;">Ocorreu um erro ao carregar os posts. Verifique o console para mais detalhes.</p>';
    }
}

document.addEventListener('DOMContentLoaded', carregarPosts);
