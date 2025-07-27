import { auth, db, signInWithEmailAndPassword, signOut, onAuthStateChanged, collection, addDoc, getDocs, query, orderBy } from './firebase.js';

const blogSection = document.getElementById('blog-section');
const loginSection = document.getElementById('login-section');
const newPostSection = document.getElementById('new-post-section');
const postForm = document.getElementById('post-form');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');

// Show/hide UI based on auth state
onAuthStateChanged(auth, user => {
  if (user) {
    loginSection.style.display = 'none';
    newPostSection.style.display = 'block';
    logoutBtn.style.display = 'inline-block';
  } else {
    loginSection.style.display = 'block';
    newPostSection.style.display = 'none';
    logoutBtn.style.display = 'none';
  }
});

// Login
if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      loginForm.reset();
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  });
}

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
  });
}

// Add new post
if (postForm) {
  postForm.addEventListener('submit', async e => {
    e.preventDefault();
    const title = postForm.title.value;
    const content = postForm.content.value;
    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        created: new Date().toISOString()
      });
      postForm.reset();
      loadPosts();
    } catch (err) {
      alert('Failed to add post: ' + err.message);
    }
  });
}

// Load posts
async function loadPosts() {
  blogSection.innerHTML = '';
  const q = query(collection(db, 'posts'), orderBy('created', 'desc'));
  const snapshot = await getDocs(q);
  snapshot.forEach(doc => {
    const post = doc.data();
    const div = document.createElement('div');
    div.className = 'blog-post';
    div.innerHTML = `<h2>${post.title}</h2><p>${post.content}</p><small>${new Date(post.created).toLocaleString()}</small>`;
    blogSection.appendChild(div);
  });
}

window.loadPosts = loadPosts;
document.addEventListener('DOMContentLoaded', loadPosts);
