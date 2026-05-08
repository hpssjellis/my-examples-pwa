async function myHandleAppAction() {
    const myIsPaid = myIsValid(localStorage.getItem('_sys_app_id'));
    
    if (!myIsPaid) {
        // Redirect to Stripe
        window.location.href = "https://buy.stripe.com/your_unique_sensor_link";
    } else if (myDeferredPrompt) {
        // Trigger PWA Install
        myDeferredPrompt.prompt();
    }
}

function myLoadCheck() {
    const myBtn = document.getElementById('myAppBtn');
    const myIsPaid = myIsValid(localStorage.getItem('_sys_app_id'));
    const myIsStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (myIsStandalone) {
        myBtn.style.display = 'none'; // Hide if already running as an app
    } else if (myIsPaid) {
        myBtn.innerText = "Install App"; // Change text if they paid but haven't installed
    }
    
    // Check for Stripe redirect success (same as before)
    const myUrlParams = new URLSearchParams(window.location.search);
    if (myUrlParams.get('session_id')) {
        localStorage.setItem('_sys_app_id', myEncrypt(new Date().toISOString().split('T')[0]));
        window.history.replaceState({}, document.title, window.location.pathname);
        location.reload(); 
    }
}