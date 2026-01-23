// public/js/blog.js (Versão Otimizada e Testada)

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

const app = initializeApp(firebaseConfig);
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
    const postsContainer = document.getElementById('posts-container');
    
    if (!postsContainer) {
        console.error("ERRO: O elemento com ID 'posts-container' não foi encontrado.");
        return;
    }

    // Remove skeleton se existir
    const skeleton = document.getElementById('loading-skeleton');
    if (skeleton) {
        skeleton.remove();
    }

    // Mostra loading
    postsContainer.innerHTML = '<p style="text-align: center; color: #64748b; grid-column: 1 / -1; padding: 40px;">Carregando posts...</p>';

    try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, orderBy('data', 'desc'));
        const querySnapshot = await getDocs(q);

        // Limpa o container
        postsContainer.innerHTML = '';

        if (querySnapshot.empty) {
            postsContainer.innerHTML = '<p style="text-align: center; color: #64748b; grid-column: 1 / -1; padding: 60px 20px;">Ainda não há posts no blog. Volte em breve!</p>';
            return;
        }

        // Cria cada post como um card completo
        querySnapshot.forEach(doc => {
            const post = doc.data();
            const postId = doc.id;
            const postUrl = `/post/${postId}`;

            // Cria o elemento do card
            const card = document.createElement('a');
            card.href = postUrl;
            card.className = 'post-card';

            // Cria a estrutura HTML do card
            const imageHtml = post.imagemUrl 
                ? `<img src="${post.imagemUrl}" alt="${post.titulo}" class="post-card-image">` 
                : `<div class="post-card-image post-card-placeholder"></div>`;

            card.innerHTML = `
                ${imageHtml}
                <div class="post-card-content">
                    <h3 class="post-card-title">${post.titulo || 'Sem Título'}</h3>
                    <div class="post-card-date">
                        <i class="far fa-calendar"></i>
                        <span>${formatarData(post.data)}</span>
                    </div>
                    <p class="post-card-excerpt">${post.resumo || post.conteudo?.substring(0, 150) + '...' || 'Clique para ler mais...'}</p>
                    <div class="post-card-footer">
                        <span class="post-card-read-more">
                            Ler Mais <i class="fas fa-arrow-right"></i>
                        </span>
                    </div>
                </div>
            `;

            postsContainer.appendChild(card);
        });

        console.log(`✅ ${querySnapshot.size} post(s) carregado(s) com sucesso!`);

    } catch (error) {
        console.error("❌ Erro ao buscar posts:", error);
        postsContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <p style="color: #DC143C; font-size: 1.2rem; margin-bottom: 10px;">
                    <i class="fas fa-exclamation-triangle"></i> Erro ao carregar posts
                </p>
                <p style="color: #64748b;">Tente recarregar a página. Se o erro persistir, contate o suporte.</p>
            </div>
        `;
    }
}

// Aguarda o DOM carregar completamente
document.addEventListener('DOMContentLoaded', carregarPosts);