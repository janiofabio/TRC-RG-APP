// capimg.js
document.addEventListener('DOMContentLoaded', () => {
    const captureBtn = document.querySelector(".capture-btn");
    const snapBtn = document.querySelector(".snap-btn");

    captureBtn.addEventListener('click', async () => {
        alert("Botão de captura clicado");

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: "environment" },
                    width: { min: 640, ideal: 1920, max: 1920 },
                    height: { min: 360, ideal: 1080, max: 1080 }
                }
            });

            const video = document.querySelector("#video");
            const snapBtn = document.querySelector(".snap-btn");

            video.srcObject = stream;
            video.onloadedmetadata = () => {
                video.play();
            };

            snapBtn.style.display = 'block';
            alert("Câmera traseira ativada");
        } catch (err) {
            console.error("Erro ao acessar a câmera traseira:", err);
            alert("Erro ao acessar a câmera traseira: " + err.message);
        }
    });

    snapBtn.addEventListener('click', () => {
        alert("Botão de tirar foto clicado");

        const video = document.querySelector("#video");
        const canvas = document.querySelector("#canvas");
        const capturedImage = document.querySelector(".captured-image");

        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        capturedImage.src = canvas.toDataURL('image/jpeg');
        capturedImage.style.display = 'block';
        canvas.style.display = 'none';

        alert("Foto capturada e exibida");
    });
});
