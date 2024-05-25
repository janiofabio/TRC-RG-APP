// capimg.js
document.addEventListener('DOMContentLoaded', () => {
    const captureBtn = document.querySelector(".capture-btn");
    const snapBtn = document.querySelector(".snap-btn");
    const video = document.querySelector("#video");
    const canvas = document.createElement("canvas");
    const capturedImage = document.querySelector(".captured-image");

    let imageBase64 = '';

    captureBtn.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: "environment" },
                    focusMode: "continuous"
                }
            });
            video.style.display = 'block';
            snapBtn.style.display = 'block';
            video.srcObject = stream;
        } catch (err) {
            console.error("Erro ao acessar a câmera traseira:", err);
            alert("Erro ao acessar a câmera traseira: " + err.message);
        }
    });

    snapBtn.addEventListener('click', () => {
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
    });
});
