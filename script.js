document.addEventListener('DOMContentLoaded', () => {
    // --- GENERAL ---
    const checkLoginStatus = () => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        const nav = document.getElementById('nav-main');

        if (nav) {
            if (loggedInUser) {
                const user = JSON.parse(localStorage.getItem(loggedInUser));
                nav.innerHTML = `
                    <span>Halo, ${user.fullName}!</span>
                    <a href="/home.html">Home</a>
                    <a href="/purchase-history.html">Histori Pembelian</a>
                    <button id="logoutBtn">Logout</button>
                `;
                document.getElementById('logoutBtn').addEventListener('click', () => {
                    localStorage.removeItem('loggedInUser');
                    window.location.href = '/index.html';
                });
            } else {
                 nav.innerHTML = `
                    <a href="/index.html" class="btn">Login</a>
                    <a href="/sign-up.html" class="btn">Sign Up</a>
                `;
            }
        }

        const protectedPages = [
            'car-insurance-form.html', 'health-insurance-form.html', 'life-insurance-form.html',
            'checkout.html', 'purchase-history.html'
        ];
        const currentPage = window.location.pathname.split('/').pop();
        if (protectedPages.includes(currentPage) && !loggedInUser) {
            window.location.href = 'index.html';
        }
    };

    // --- UTILITY FUNCTIONS ---
    const showMessage = (element, message, type) => {
        element.textContent = message;
        element.className = `message ${type}`;
    };

    const getAge = (dateString) => {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    checkLoginStatus();

    // 1. SIGN UP PAGE (signup.html)
    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
        signUpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const messageDiv = document.getElementById('message');
            const fullName = document.getElementById('fullName').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validation checks
            if (!fullName || !phone || !email || !password || !confirmPassword) {
                return showMessage(messageDiv, 'Semua kolom harus diisi.', 'error');
            }
            if (fullName.length < 3 || fullName.length > 32) {
                return showMessage(messageDiv, 'Nama lengkap harus antara 3 dan 32 karakter.', 'error');
            }
            if (/\d/.test(fullName)) {
                 return showMessage(messageDiv, 'Nama lengkap tidak boleh mengandung angka.', 'error');
            }
            if (!/^08\d{8,14}$/.test(phone)) {
                 return showMessage(messageDiv, 'Format nomor HP tidak valid (contoh: 081234567890).', 'error');
            }
             if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return showMessage(messageDiv, 'Format email tidak valid.', 'error');
            }
            if (password.length < 8) {
                return showMessage(messageDiv, 'Kata sandi minimal 8 karakter.', 'error');
            }
            if (password !== confirmPassword) {
                return showMessage(messageDiv, 'Kata sandi dan konfirmasi tidak sesuai.', 'error');
            }
            if (localStorage.getItem(email)) {
                return showMessage(messageDiv, 'Email sudah terdaftar.', 'error');
            }

            const userData = { fullName, phone, email, password };
            localStorage.setItem(email, JSON.stringify(userData));
            
            showMessage(messageDiv, 'Pendaftaran berhasil! Anda akan dialihkan ke halaman login.', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }

    // 2. LOGIN PAGE (index.html)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const messageDiv = document.getElementById('message');
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!email || !password) {
                return showMessage(messageDiv, 'Email dan kata sandi harus diisi.', 'error');
            }
             if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return showMessage(messageDiv, 'Format email tidak valid.', 'error');
            }

            const userDataString = localStorage.getItem(email);
            if (!userDataString) {
                return showMessage(messageDiv, 'Email tidak terdaftar.', 'error');
            }
            const userData = JSON.parse(userDataString);

            if (userData.password !== password) {
                return showMessage(messageDiv, 'Kata sandi salah.', 'error');
            }

            localStorage.setItem('loggedInUser', email);
            showMessage(messageDiv, 'Login berhasil! Mengalihkan ke halaman utama...', 'success');
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1500);
        });
    }
    
    // 3. CAR INSURANCE PAGE (car-insurance-form.html)
    const purchaseCarForm = document.getElementById('purchaseCarForm');
    if (purchaseCarForm) {
        purchaseCarForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const year = parseInt(document.getElementById('carYear').value);
            const price = parseFloat(document.getElementById('carPrice').value);
            const currentYear = new Date().getFullYear();
            const carAge = currentYear - year;

            let premiumRate;
            if (carAge >= 0 && carAge <= 3) {
                premiumRate = 0.025;
            } else if (carAge > 3 && carAge <= 5) {
                premiumRate = (price < 200000000) ? 0.04 : 0.03;
            } else {
                premiumRate = 0.05;
            }
            
            const premium = price * premiumRate;
            
            const premiumResultDiv = document.getElementById('premiumResult');
            premiumResultDiv.innerHTML = `Harga Premi Anda per Tahun: <strong>Rp ${premium.toLocaleString('id-ID')}</strong>`;
            
            document.getElementById('checkoutBtn').style.display = 'block';

            localStorage.setItem('checkoutItem', JSON.stringify({
                productName: 'Asuransi Mobil All-Risk',
                type: 'Mobil',
                premium: premium,
                period: 'Tahun'
            }));
        });
        document.getElementById('checkoutBtn').addEventListener('click', () => {
            window.location.href = '/checkout.html';
        });
    }
    
    // 4. HEALTH INSURANCE PAGE (health-insurance-form.html)
    const purchaseHealthForm = document.getElementById('purchaseHealthForm');
    if (purchaseHealthForm) {
        purchaseHealthForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const dob = document.getElementById('dob').value;
            const age = getAge(dob);
            
            const k1 = parseInt(document.querySelector('input[name="smoker"]:checked').value);
            const k2 = parseInt(document.querySelector('input[name="hypertension"]:checked').value);
            const k3 = parseInt(document.querySelector('input[name="diabetes"]:checked').value);

            const P = 2000000;
            let m;
            if (age <= 20) m = 0.1;
            else if (age > 20 && age <= 35) m = 0.2;
            else if (age > 35 && age <= 50) m = 0.25;
            else m = 0.4;
            
            const premium = P + (m * P) + (k1 * 0.5 * P) + (k2 * 0.4 * P) + (k3 * 0.5 * P);
            
            const premiumResultDiv = document.getElementById('premiumResult');
            premiumResultDiv.innerHTML = `Harga Premi Anda per Tahun: <strong>Rp ${premium.toLocaleString('id-ID')}</strong>`;

            document.getElementById('checkoutBtn').style.display = 'block';

            localStorage.setItem('checkoutItem', JSON.stringify({
                productName: 'Asuransi Kesehatan Platinum',
                type: 'Kesehatan',
                premium: premium,
                period: 'Tahun'
            }));
        });
        document.getElementById('checkoutBtn').addEventListener('click', () => {
            window.location.href = '/checkout.html';
        });
    }

    // 5. LIFE INSURANCE PURCHASE (life-insurance-form.html)
    const purchaseLifeForm = document.getElementById('purchaseLifeForm');
    if(purchaseLifeForm) {
        purchaseLifeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const dob = document.getElementById('dob').value;
            const age = getAge(dob);
            const sumInsured = parseFloat(document.getElementById('sumInsured').value);

            let m;
            if (age <= 30) m = 0.002; // 0.2%
            else if (age > 30 && age <= 50) m = 0.004; // 0.4%
            else m = 0.01; // 1%

            const premium = m * sumInsured;

            const premiumResultDiv = document.getElementById('premiumResult');
            premiumResultDiv.innerHTML = `Harga Premi Anda per Bulan: <strong>Rp ${premium.toLocaleString('id-ID')}</strong>`;

            document.getElementById('checkoutBtn').style.display = 'block';

            localStorage.setItem('checkoutItem', JSON.stringify({
                productName: 'Asuransi Jiwa Warisan Sejahtera',
                type: 'Jiwa',
                premium: premium,
                period: 'Bulan'
            }));
        });
        document.getElementById('checkoutBtn').addEventListener('click', () => {
            window.location.href = '/checkout.html';
        });
    }
    
    // 6. CHECKOUT PAGE (checkout.html)
    const checkoutSummary = document.getElementById('checkoutSummary');
    if (checkoutSummary) {
        const item = JSON.parse(localStorage.getItem('checkoutItem'));
        if (item) {
            checkoutSummary.innerHTML = `
                <p><strong>Produk:</strong> ${item.productName}</p>
                <p><strong>Jenis:</strong> ${item.type}</p>
                <p><strong>Total Pembayaran:</strong> Rp ${item.premium.toLocaleString('id-ID')} / ${item.period}</p>
            `;
        }

        document.getElementById('payBtn').addEventListener('click', () => {
            const userEmail = localStorage.getItem('loggedInUser');
            let history = JSON.parse(localStorage.getItem(`history_${userEmail}`)) || [];
            
            const purchaseRecord = {
                ...item,
                purchaseDate: new Date().toLocaleDateString('id-ID'),
                status: 'Lunas'
            };

            history.push(purchaseRecord);
            localStorage.setItem(`history_${userEmail}`, JSON.stringify(history));

            localStorage.removeItem('checkoutItem');

            alert('Pembayaran berhasil! Anda akan dialihkan ke halaman histori.');
            window.location.href = '/purchase-history.html';
        });
    }
    
    // 7. HISTORY PAGE (purchase-history.html)
    const historyTableBody = document.querySelector('#historyTable tbody');
    if (historyTableBody) {
        const userEmail = localStorage.getItem('loggedInUser');
        const history = JSON.parse(localStorage.getItem(`history_${userEmail}`)) || [];

        if (history.length === 0) {
            document.getElementById('noHistory').style.display = 'block';
        } else {
            history.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.productName}</td>
                    <td>${item.type}</td>
                    <td>${item.purchaseDate}</td>
                    <td>Rp ${(item.premium || 0).toLocaleString('id-ID')} / ${item.period || 'N/A'}</td>
                    <td class="status-paid">${item.status}</td>
                `;
                historyTableBody.appendChild(row);
            });
        }
    }

    // 8. HOME PAGE (home.html)
    const productLinks = document.querySelectorAll('.product-link');
    if (productLinks.length > 0) {
        productLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault(); 

                const isLoggedIn = localStorage.getItem('loggedInUser');

                if (isLoggedIn) {
                    window.location.href = link.getAttribute('href');
                } else {
                    alert('Anda harus login terlebih dahulu untuk melihat detail produk.');
                    window.location.href = '/index.html';
                }
            });
        });
    }
});