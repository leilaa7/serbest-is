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
function showSection(sectionName) {
    const sections = ['home', 'unpaid', 'paid', 'reading', 'about', 'contact'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.style.display = 'none';
        }
    });
    dS
    const selecteection = document.getElementById(sectionName);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    
    currentSection = sectionName;
    
    if (sectionName === 'unpaid' || sectionName === 'paid') {
        loadBooks();
    }
}

function loadBooks() {
    const freeBooksContainer = document.getElementById('freeBooks');
    const paidBooksContainer = document.getElementById('paidBooks');
    
    if (freeBooksContainer) {
        freeBooksContainer.innerHTML = '';
        freeBooks.forEach(book => {
            freeBooksContainer.appendChild(createBookCard(book));
        });
    }
    
    if (paidBooksContainer) {
        paidBooksContainer.innerHTML = '';
        paidBooks.forEach(book => {
            paidBooksContainer.appendChild(createBookCard(book));
        });
    }
}

function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    
    card.innerHTML = `
        <div class="book-cover">
            📖 ${book.title}
        </div>
        <div class="book-info">
            <h3>${book.title}</h3>
            <div class="author">Müəllif: ${book.author}</div>
            <div class="genre">${book.genre}</div>
            <div class="price ${book.isFree ? 'free' : ''}">${book.price}</div>
            <div class="book-actions">
                <button class="btn btn-primary" onclick="readBook(${book.id})">
                    Oxu
                </button>
                ${!book.isFree ? `<button class="btn btn-secondary" onclick="addToCart(${book.id})">Səbətə əlavə et</button>` : ''}
            </div>
        </div>
    `;
    
    return card;
}

function searchBooks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (!searchTerm) return;
    
    const allBooks = [...freeBooks, ...paidBooks];
    const filteredBooks = allBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.genre.toLowerCase().includes(searchTerm)
    );
    
    showSearchResults(filteredBooks);
}

function showSearchResults(books) {
    let searchSection = document.getElementById('searchResults');
    if (!searchSection) {
        searchSection = document.createElement('section');
        searchSection.id = 'searchResults';
        searchSection.className = 'books-section';
        document.body.appendChild(searchSection);
    }
    
    searchSection.innerHTML = `
        <div class="container">
            <h2>Axtarış Nəticələri</h2>
            <div class="books-grid" id="searchBooksGrid">
            </div>
        </div>
    `;
    
    const searchGrid = document.getElementById('searchBooksGrid');
    books.forEach(book => {
        searchGrid.appendChild(createBookCard(book));
    });
    
    showSection('searchResults');
}

function readBook(bookId) {
    const allBooks = [...freeBooks, ...paidBooks];
    const book = allBooks.find(b => b.id === bookId);
    
    if (!book) return;
    
    if (!book.isFree && !isPurchased(bookId)) {
        alert('Bu kitabı oxumaq üçün əvvəlcə satın almalısınız!');
        return;
    }
    
    currentBook = book;
    currentPage = 1;
    totalPages = Math.ceil(book.content.length / 500);
    
    document.getElementById('currentBookTitle').textContent = book.title;
    document.getElementById('readerContent').textContent = getPageContent(book.content, currentPage);
    updatePageInfo();
    
    showSection('reading');
}

function getPageContent(fullContent, pageNumber) {
    const wordsPerPage = 100;
    const words = fullContent.split(' ');
    const startIndex = (pageNumber - 1) * wordsPerPage;
    const endIndex = startIndex + wordsPerPage;
    return words.slice(startIndex, endIndex).join(' ');
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        document.getElementById('readerContent').textContent = getPageContent(currentBook.content, currentPage);
        updatePageInfo();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        document.getElementById('readerContent').textContent = getPageContent(currentBook.content, currentPage);
        updatePageInfo();
    }
}

function updatePageInfo() {
    document.getElementById('pageInfo').textContent = `Səhifə ${currentPage} / ${totalPages}`;
}

function increaseFontSize() {
    fontSize += 2;
    document.getElementById('readerContent').style.fontSize = fontSize + 'px';
}

function decreaseFontSize() {
    if (fontSize > 12) {
        fontSize -= 2;
        document.getElementById('readerContent').style.fontSize = fontSize + 'px';
    }
}

function toggleTheme() {
    const readerContent = document.getElementById('readerContent');
    isDarkTheme = !isDarkTheme;
    
    if (isDarkTheme) {
        readerContent.style.background = '#2d3748';
        readerContent.style.color = '#e2e8f0';
    } else {
        readerContent.style.background = 'white';
        readerContent.style.color = '#333';
    }
}

function goBack() {
    if (currentSection === 'reading') {
        showSection('unpaid');
    }
}
function showSection(sectionName) {
    const sections = ['home', 'unpaid', 'paid', 'reading', 'about', 'contact'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.style.display = 'none';
        }
    });
    
    const selectedSection = document.getElementById(sectionName);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    
    currentSection = sectionName;
    
    if (sectionName === 'unpaid' || sectionName === 'paid') {
        loadBooks();
    }
}

function loadBooks() {
    const freeBooksContainer = document.getElementById('freeBooks');
    const paidBooksContainer = document.getElementById('paidBooks');
    
    if (freeBooksContainer) {
        freeBooksContainer.innerHTML = '';
        freeBooks.forEach(book => {
            freeBooksContainer.appendChild(createBookCard(book));
        });
    }
    
    if (paidBooksContainer) {
        paidBooksContainer.innerHTML = '';
        paidBooks.forEach(book => {
            paidBooksContainer.appendChild(createBookCard(book));
        });
    }
}

function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    
    card.innerHTML = `
        <div class="book-cover">
            📖 ${book.title}
        </div>
        <div class="book-info">
            <h3>${book.title}</h3>
            <div class="author">Müəllif: ${book.author}</div>
            <div class="genre">${book.genre}</div>
            <div class="price ${book.isFree ? 'free' : ''}">${book.price}</div>
            <div class="book-actions">
                <button class="btn btn-primary" onclick="readBook(${book.id})">
                    Oxu
                </button>
                ${!book.isFree ? `<button class="btn btn-secondary" onclick="addToCart(${book.id})">Səbətə əlavə et</button>` : ''}
            </div>
        </div>
    `;
    
    return card;
}

function searchBooks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (!searchTerm) return;
    
    const allBooks = [...freeBooks, ...paidBooks];
    const filteredBooks = allBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.genre.toLowerCase().includes(searchTerm)
    );
    
    showSearchResults(filteredBooks);
}

function showSearchResults(books) {
    let searchSection = document.getElementById('searchResults');
    if (!searchSection) {
        searchSection = document.createElement('section');
        searchSection.id = 'searchResults';
        searchSection.className = 'books-section';
        document.body.appendChild(searchSection);
    }
    
    searchSection.innerHTML = `
        <div class="container">
            <h2>Axtarış Nəticələri</h2>
            <div class="books-grid" id="searchBooksGrid">
            </div>
        </div>
    `;
    
    const searchGrid = document.getElementById('searchBooksGrid');
    books.forEach(book => {
        searchGrid.appendChild(createBookCard(book));
    });
    
    showSection('searchResults');
}

function readBook(bookId) {
    const allBooks = [...freeBooks, ...paidBooks];
    const book = allBooks.find(b => b.id === bookId);
    
    if (!book) return;
    
    if (!book.isFree && !isPurchased(bookId)) {
        alert('Bu kitabı oxumaq üçün əvvəlcə satın almalısınız!');
        return;
    }
    
    currentBook = book;
    currentPage = 1;
    totalPages = Math.ceil(book.content.length / 500);
    
    document.getElementById('currentBookTitle').textContent = book.title;
    document.getElementById('readerContent').textContent = getPageContent(book.content, currentPage);
    updatePageInfo();
    
    showSection('reading');
}

function getPageContent(fullContent, pageNumber) {
    const wordsPerPage = 100;
    const words = fullContent.split(' ');
    const startIndex = (pageNumber - 1) * wordsPerPage;
    const endIndex = startIndex + wordsPerPage;
    return words.slice(startIndex, endIndex).join(' ');
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        document.getElementById('readerContent').textContent = getPageContent(currentBook.content, currentPage);
        updatePageInfo();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        document.getElementById('readerContent').textContent = getPageContent(currentBook.content, currentPage);
        updatePageInfo();
    }
}

function updatePageInfo() {
    document.getElementById('pageInfo').textContent = `Səhifə ${currentPage} / ${totalPages}`;
}

function increaseFontSize() {
    fontSize += 2;
    document.getElementById('readerContent').style.fontSize = fontSize + 'px';
}

function decreaseFontSize() {
    if (fontSize > 12) {
        fontSize -= 2;
        document.getElementById('readerContent').style.fontSize = fontSize + 'px';
    }
}

function toggleTheme() {
    const readerContent = document.getElementById('readerContent');
    isDarkTheme = !isDarkTheme;
    
    if (isDarkTheme) {
        readerContent.style.background = '#2d3748';
        readerContent.style.color = '#e2e8f0';
    } else {
        readerContent.style.background = 'white';
        readerContent.style.color = '#333';
    }
}

function goBack() {
    if (currentSection === 'reading') {
        showSection('unpaid');
    }
}

// Cart functionality
function addToCart(bookId) {
    const allBooks = [...freeBooks, ...paidBooks];
    const book = allBooks.find(b => b.id === bookId);
    
    if (!book || book.isFree) return;
    
    // Check if already in cart
    if (cart.some(item => item.id === bookId)) {
        alert('Bu kitab artıq səbətdədir!');
        return;
    }
    
    cart.push(book);
    updateCartDisplay();
    alert('Kitab səbətə əlavə edildi!');
}

function updateCartDisplay() {
    document.getElementById('cartCount').textContent = cart.length;
}

function showCart() {
    const cartModal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Səbət boşdur</p>';
    } else {
        let cartHTML = '';
        let total = 0;
        
        cart.forEach(book => {
            const price = parseFloat(book.price.replace(' AZN', ''));
            total += price;
            cartHTML += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                    <div>
                        <strong>${book.title}</strong><br>
                        <small>${book.author}</small>
                    </div>
                    <div>
                        <span>${book.price}</span>
                        <button onclick="removeFromCart(${book.id})" style="margin-left: 10px; background: #ff6b6b; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Sil</button>
                    </div>
                </div>
            `;
        });
        
        cartHTML += `<div style="margin-top: 15px; text-align: right;"><strong>Cəmi: ${total.toFixed(2)} AZN</strong></div>`;
        cartItems.innerHTML = cartHTML;
    }
    
    cartModal.style.display = 'flex';
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function removeFromCart(bookId) {
    cart = cart.filter(book => book.id !== bookId);
    updateCartDisplay();
    showCart(); // Refresh cart display
}

function checkout() {
    if (cart.length === 0) {
        alert('Səbət boşdur!');
        return;
    }
    
    // Simulate payment process
    alert('Ödəniş prosesi simulyasiya edilir...');
    
    setTimeout(() => {
        // Add purchased books to user's library
        cart.forEach(book => {
            addToPurchasedBooks(book.id);
        });
        
        cart = [];
        updateCartDisplay();
        closeCart();
        alert('Ödəniş uğurla tamamlandı! Kitablarınızı indi oxuya bilərsiniz.');
    }, 2000);
}

// Purchased books management (using memory storage)
let purchasedBooks = [];

function addToPurchasedBooks(bookId) {
    if (!purchasedBooks.includes(bookId)) {
        purchasedBooks.push(bookId);
    }
}

function isPurchased(bookId) {
    return purchasedBooks.includes(bookId);
}

// Event listeners
document.addEventListener('keydown', function(e) {
    if (currentSection === 'reading') {
        if (e.key === 'ArrowLeft') {
            previousPage();
        } else if (e.key === 'ArrowRight') {
            nextPage();
        }
    }
});

// Search on Enter key
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchBooks();
    }
});

// Cart icon click
document.querySelector('.user-actions').addEventListener('click', function(e) {
    if (e.target.textContent.includes('Səbət') || e.target.closest('span').textContent.includes('Səbət')) {
        showCart();
    }
});

// Contact form submission
document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('contact-form')) {
        e.preventDefault();
        alert('Mesajınız göndərildi! Tezliklə sizinlə əlaqə saxlayacağıq.');
        e.target.reset();
    }
});

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Auto-hide search results after some time
let searchTimeout;
function showSearchResults(books) {
    clearTimeout(searchTimeout);
    
    let searchSection = document.getElementById('searchResults');
    if (!searchSection) {
        searchSection = document.createElement('section');
        searchSection.id = 'searchResults';
        searchSection.className = 'books-section';
        document.body.appendChild(searchSection);
    }
    
    searchSection.innerHTML = `
        <div class="container">
            <h2>Axtarış Nəticələri (${books.length} kitab tapıldı)</h2>
            <div class="books-grid" id="searchBooksGrid">
            </div>
        </div>
    `;
    
    const searchGrid = document.getElementById('searchBooksGrid');
    if (books.length === 0) {
        searchGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; font-size: 18px; color: #666;">Heç bir kitab tapılmadı. Başqa açar sözlər cəhd edin.</p>';
    } else {
        books.forEach(book => {
            searchGrid.appendChild(createBookCard(book));
        });
    }
    
    showSection('searchResults');
}
