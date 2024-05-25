// capimg.js
document.addEventListener('DOMContentLoaded', () => {
    const captureBtn = document.querySelector(".capture-btn");
    const snapBtn = document.querySelector(".snap-btn");
    let video, canvas, capturedImage;

    captureBtn.addEventListener('click', async () => {
        video = document.querySelector("#video");
        canvas = document.querySelector("#canvas");
        capturedImage = document.querySelector(".captured-image");

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: "environment" },
                    focusMode: "continuous"
                }
            });
            if (video && snapBtn) {
                video.style.display = 'block';
                snapBtn.style.display = 'block';
                video.srcObject = stream;
            }
        } catch (err) {
            console.error("Erro ao acessar a câmera traseira:", err);
            alert("Erro ao acessar a câmera traseira: " + err.message);
        }
    });

    snapBtn.addEventListener('click', () => {
        video = document.querySelector("#video");
        canvas = document.querySelector("#canvas");
        capturedImage = document.querySelector(".captured-image");

        if (canvas && video && capturedImage) {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            video.style.display = 'none';
            snapBtn.style.display = 'none';
            capturedImage.style.display = 'block';
            capturedImage.src = canvas.toDataURL('image/jpeg');
            imageBase64 = capturedImage.src.split(',')[1];
            canvas.style.display = 'none';
        }
    });
});
