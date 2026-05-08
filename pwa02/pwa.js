const mySecretSalt = "pwa_salt_2026";
let myDeferredPrompt;

function myEncrypt(myDate) {
    return btoa(myDate + "_" + mySecretSalt);
}

function myIsValid(myVal) {
    try { 
        return atob(myVal).endsWith(mySecretSalt); 
    } catch(e) { return false; }
}

async function myLoadCheck() {
    // Hide button if already installed/running as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
        document.getElementById('myInstallBtn').style.display = 'none';
    }

    // 1. Check for premium status
    if (myIsValid(localStorage.getItem('_sys_id'))) {
        return;
    }

    // 2. Check for Stripe redirect success
    const myUrlParams = new URLSearchParams(window.location.search);
    if (myUrlParams.get('session_id')) {
        const myToday = new Date().toISOString().split('T')[0];
        localStorage.setItem('_sys_id', myEncrypt(myToday));
        alert("Payment Verified! Prompts disabled.");
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
    }

    // 3. Increment load count
    let myCount = parseInt(localStorage.getItem('myLoadCount') || 0) + 1;
    localStorage.setItem('myLoadCount', myCount);

    if (myCount % 10 === 0) {
        if (confirm("You've used this " + myCount + " times. Pay $10 once to stop this prompt?")) {
            window.location.href = "https://buy.stripe.com/your_link";
        }
    }
}

// Installation Logic
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    myDeferredPrompt = e;
    // Show the button because the browser says we CAN install
    document.getElementById('myInstallBtn').style.display = 'block';
});

async function myInstallPWA() {
    if (myDeferredPrompt) {
        myDeferredPrompt.prompt();
        const { outcome } = await myDeferredPrompt.userChoice;
        if (outcome === 'accepted') {
            document.getElementById('myInstallBtn').style.display = 'none';
        }
        myDeferredPrompt = null;
    }
}

// Hide button immediately after successful installation
window.addEventListener('appinstalled', () => {
    document.getElementById('myInstallBtn').style.display = 'none';
    console.log('PWA installed');
});

// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}