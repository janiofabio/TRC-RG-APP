// retfotfv.js
document.addEventListener('DOMContentLoaded', () => {
    const capturedImage = document.querySelector(".captured-image");
    const frontPhotoBtn = document.querySelector(".front-photo-btn");
    const backPhotoBtn = document.querySelector(".back-photo-btn");
    const frontImage = document.querySelector(".front-image");
    const backImage = document.querySelector(".back-image");

    frontPhotoBtn.addEventListener('click', () => {
        frontImage.src = capturedImage.src;
        frontImage.style.display = 'block';
    });

    backPhotoBtn.addEventListener('click', () => {
        backImage.src = capturedImage.src;
        backImage.style.display = 'block';
    });
});
