const firebaseConfig = {
  apiKey: "AIzaSyA8nykV5bBkk2SflhOjnt3IbqVHKO-qTcE",
  authDomain: "despertame-8b932.firebaseapp.com",
  projectId: "despertame-8b932",
  storageBucket: "despertame-8b932.firebasestorage.app",
  messagingSenderId: "436618938431",
  appId: "1:436618938431:web:7635e3bd59182c82dc108a",
  measurementId: "G-TH8XGQ1JMP"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.getElementById('emailForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const emailInput = this.querySelector('.email-input');
  const successMessage = document.getElementById('successMessage');
  const email = emailInput.value.trim();

  if (email) {
    db.collection("email")
      .doc("inscricao")
      .collection("emails")
      .add({
        email: email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        successMessage.classList.add('show');
        emailInput.value = '';
        setTimeout(() => successMessage.classList.remove('show'), 5000);
      })
      .catch(error => {
        alert("Erro ao enviar e-mail: " + error.message);
      });
  }
});
