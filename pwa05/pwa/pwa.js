const mySecretSalt = "webmcu_vision_2026"; // Update per sensor repo
let myDeferredPrompt;

function myEncrypt(myDate) {
    return btoa(myDate + "_" + mySecretSalt);
}

function myIsValid(myVal) {
    try { 
        return atob(myVal).endsWith(mySecretSalt); 
    } catch(e) { return false; }
}

async function myHandleAppAction() {
    const myIsPaid = myIsValid(localStorage.getItem('_sys_app_id'));
    if (!myIsPaid) {
        window.location.href = "https://buy.stripe.com/your_unique_link";
    } else if (myDeferredPrompt) {
        myDeferredPrompt.prompt();
    }
}

function myLoadCheck() {
    const myBtn = document.getElementById('myAppBtn');
    const myIsPaid = myIsValid(localStorage.getItem('_sys_app_id'));
    const myIsStandalone = window.matchMedia('(display-mode: standalone)').matches;

    // Detect if we just returned from Stripe
    const myUrlParams = new URLSearchParams(window.location.search);
    if (myUrlParams.get('session_id')) {
        localStorage.setItem('_sys_app_id', myEncrypt(new Date().toISOString().split('T')[0]));
        window.history.replaceState({}, document.title, window.location.pathname);
        location.reload(); 
        return;
    }

    if (myIsStandalone) {
        myBtn.style.display = 'none'; 
    } else {
        myBtn.style.display = 'block';
        myBtn.innerText = myIsPaid ? "Install App" : "Get Offline App ($6)";
    }
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    myDeferredPrompt = e;
    myLoadCheck();
});

// Run check on load
window.onload = myLoadCheck;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}