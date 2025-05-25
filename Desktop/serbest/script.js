let currentSection = 'home';
let cart = [];
let currentBook = null;
let currentPage = 1;
let totalPages = 10;
let fontSize = 18;
let isDarkTheme = false;
let currentUser = null;

let users = [
    {
        id: 1,
        name: "Test İstifadəçisi",
        email: "test@kitab.az",
        password: "123456"
    }
];

const freeBooks = [
    {
        id: 1,
        title: "Azərbaycan Tarixi",
        author: "Müəllif Adı",
        genre: "Tarix",
        price: "Pulsuz",
        isFree: true,
        content: "Bu kitab Azərbaycanın qədim tarixindən başlayaraq müasir dövrə qədərki hadisələri əhatə edir. Ölkəmizin zəngin mədəni irsini və milli dəyərlərini öyrənmək üçün əvəzsiz mənbədir..."
    },
    {
        id: 2,
        title: "Koroğlu Dastanı",
        author: "Xalq Yaradıcılığı",
        genre: "Dastan",
        price: "Pulsuz",
        isFree: true,
        content: "Koroğlu - Azərbaycan xalqının ən məşhur qəhrəman dastanlarından biridir. Bu dastan xalqımızın ədalət və azadlıq uğrunda mübarizə ruhunu əks etdirir..."
    },
    {
        id: 3,
        title: "Nizami Gəncəvi",
        author: "Klassik Ədəbiyyat",
        genre: "Poeziya",
        price: "Pulsuz",
        isFree: true,
        content: "Nizami Gəncəvi dünya ədəbiyyatının ən böyük şairlərindən biridir. Onun əsərləri həm milli, həm də universal dəyərlər daşıyır..."
    },
    {
        id: 4,
        title: "Azərbaycan Dili",
        author: "Dil Mütəxəssisi",
        genre: "Dil öyrənmə",
        price: "Pulsuz",
        isFree: true,
        content: "Azərbaycan dilinin qrammatikası, leksikası və üslubiyyat xüsusiyyətləri haqqında ətraflı məlumat. Ana dilimizi daha yaxşı öyrənmək istəyənlər üçün ideal kitabdır..."
    }
];

const paidBooks = [
    {
        id: 5,
        title: "Müasir Azərbaycan Ədəbiyyatı",
        author: "Tanınmış Yazıçı",
        genre: "Ədəbiyyat",
        price: "15.00 AZN",
        isFree: false,
        content: "XX və XXI əsr Azərbaycan ədəbiyyatının inkişaf yolları, əsas nümayəndələri və onların yaradıcılığı haqqında fundamental tədqiqat..."
    },
    {
        id: 6,
        title: "İqtisadiyyat Əsasları",
        author: "Prof. Dr. Müəllif",
        genre: "İqtisadiyyat",
        price: "25.00 AZN",
        isFree: false,
        content: "İqtisadiyyatın əsas prinsipləri, bazar mexanizmləri və müasir iqtisadi nəzəriyyələr haqqında ətraflı izahat..."
    },
    {
        id: 7,
        title: "Kompüter Elmləri",
        author: "Texnologiya Mütəxəssisi",
        genre: "Texnologiya",
        price: "30.00 AZN",
        isFree: false,
        content: "Proqramlaşdırma, alqoritmlər və məlumat strukturları haqqında müasir yanaşmalar və praktiki nümunələr..."
    },
    {
        id: 8,
        title: "Psixologiya",
        author: "Psixoloq",
        genre: "Psixologiya",
        price: "20.00 AZN",
        isFree: false,
        content: "İnsan psixologiyasının əsasları, şəxsiyyət inkişafı və davranış modellərinin təhlili..."
    }
];

document.addEventListener('DOMContentLoaded', function() {
    showSection('home');
    loadBooks();
    updateCartDisplay();
    setupFormListeners();
    checkLoginStatus();
});

function setupFormListeners() {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleRegister();
    });
}

function showLoginModal() {
    if (currentUser) {
        if (confirm('Çıxış etmək istəyirsiniz?')) {
            logout();
        }
        return;
    }
    
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('registerModal').style.display = 'none';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('registerModal').style.display = 'flex';
}

function closeRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        updateLoginButton();
        closeLoginModal();
        alert(`Xoş gəlmisiniz, ${user.name}!`);
        
        document.getElementById('loginForm').reset();
    } else {
        alert('E-mail və ya şifrə səhvdir!');
    }
}

function handleRegister() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Şifrələr uyğun gəlmir!');
        return;
    }
    
    if (password.length < 6) {
        alert('Şifrə ən azı 6 simvol olmalıdır!');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        alert('Bu e-mail artıq qeydiyyatdan keçib!');
        return;
    }
    
    const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        password: password
    };
    
    users.push(newUser);
    currentUser = newUser;
    
    updateLoginButton();
    closeRegisterModal();
    alert(`Qeydiyyat uğurlu! Xoş gəlmisiniz, ${name}!`);
    
    document.getElementById('registerForm').reset();
}

function updateLoginButton() {
    const loginButton = document.getElementById('loginButton');
    
    if (currentUser) {
        loginButton.innerHTML = `
            <div class="user-profile">
                👤 ${currentUser.name}
                <button class="logout-btn" onclick="logout()">Çıxış</button>
            </div>
        `;
    } else {
        loginButton.innerHTML = '👤 Daxil ol';
    }
}

function logout() {
    currentUser = null;
    updateLoginButton();
    alert('Uğurla çıxış etdiniz!');
}

function checkLoginStatus() {
    updateLoginButton();
}
