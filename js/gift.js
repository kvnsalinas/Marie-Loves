const backFromCouponBtn = document.getElementById('back-from-coupon');
const couponDiv = document.getElementById('love-coupon');
const letter = document.querySelector('.letter');

backFromCouponBtn?.addEventListener('click', () => {
    couponDiv.style.display = 'none';
    letter.style.display = 'block';
});

// Email sending (if present)
const sendEmailBtn = document.getElementById('send-email-btn');
const recipientEmail = document.getElementById('recipient-email');
const emailStatus = document.getElementById('email-status');

sendEmailBtn?.addEventListener('click', () => {
    const email = recipientEmail?.value.trim();
    if (!email) {
        emailStatus.textContent = 'Please enter your email address';
        emailStatus.className = 'email-status error';
        return;
    }
    sendEmailBtn.disabled = true;
    sendEmailBtn.textContent = 'Sending...';
    emailStatus.textContent = '';
    const formData = new FormData();
    formData.append('email', email);
    fetch('send-coupon.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        emailStatus.textContent = data.message;
        emailStatus.className = data.success ? 'email-status success' : 'email-status error';
        if (data.success) recipientEmail.value = '';
    })
    .catch(() => {
        emailStatus.textContent = 'An error occurred. Please try again.';
        emailStatus.className = 'email-status error';
    })
    .finally(() => {
        sendEmailBtn.disabled = false;
        sendEmailBtn.textContent = 'Email this Coupon';
    });
});