document.addEventListener('DOMContentLoaded', () => {
    alert("DOM completamente carregado");

    const api = "https://script.google.com/macros/s/AKfycbxGgPnMwV7MLIyhTfPIYqXbRA4-e6RJ8JGfF22h6dfkHH_m-slT6wC2GrsBfuxajhUD/exec";
    const msg = document.querySelector(".message");
    const fileInput = document.querySelector(".file");
    const captureBtn = document.querySelector(".capture-btn");
    const snapBtn = document.querySelector(".snap-btn");
    const video = document.querySelector("#video");
    const canvas = document.querySelector("#canvas");
    const capturedImage = document.querySelector(".captured-image");
    const btn = document.querySelector(".btn");
    const progressBarFill = document.querySelector(".progress-bar-fill");
    const progressInfo = document.querySelector(".progress-info");

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    let imageBase64 = '';

    const isMobile = window.matchMedia("only screen and (max-width: 767px)").matches;

    if (isMobile) {
        captureBtn.style.display = 'inline-block';
        alert("Modo mobile detectado, botão de captura exibido");
    } else {
        captureBtn.style.display = 'none';
        alert("Modo desktop detectado, botão de captura oculto");
    }

    captureBtn.addEventListener('click', async () => {
        alert("Botão de captura clicado");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: "environment" } }
            });
            video.style.display = 'block';
            snapBtn.style.display = 'block';
            video.srcObject = stream;
            alert("Câmera traseira ativada");
        } catch (err) {
            console.error("Erro ao acessar a câmera traseira:", err);
            alert("Erro ao acessar a câmera traseira: " + err.message);
        }
    });

    snapBtn.addEventListener('click', () => {
        alert("Botão de tirar foto clicado");
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
        alert("Foto capturada e exibida");
        fileInput.value = ''; // Limpa o arquivo selecionado anteriormente
    });

    btn.addEventListener('click', () => {
        alert("Botão de gerar OCR clicado");
        const file = fileInput.files ? fileInput.files[0] : null;
        if (!file && !imageBase64) {
            alert("Selecione um arquivo PDF ou capture uma imagem primeiro.");
            return;
        }

        if (file && file.size > MAX_FILE_SIZE) {
            alert("O arquivo é muito grande. O tamanho máximo é de 5MB.");
            return;
        }

        msg.innerHTML = `Carregando...`;
        progressBarFill.style.width = '0%';
        progressInfo.innerHTML = '';
        alert("Iniciando processamento OCR");

        let startTime = Date.now();

        if (file) {
            let fr = new FileReader();
            fr.readAsDataURL(file);
            fr.onload = () => {
                let res = fr.result;
                let b64 = res.split("base64,")[1];
                alert("Arquivo lido, iniciando OCR");
                processOCR(b64, file.type, file.name, startTime);
            };
        } else if (imageBase64) {
            alert("Imagem capturada, iniciando OCR");
            processOCR(imageBase64, 'image/jpeg', 'captured_image.jpg', startTime);
        }
    });

    function processOCR(base64Data, fileType, fileName, startTime) {
        alert("Processando OCR");
        let uploadProgress = setInterval(() => {
            let elapsed = Date.now() - startTime;
            let percentComplete = Math.min(100, (elapsed / 2000) * 100); 
            progressBarFill.style.width = `${percentComplete}%`;
            progressInfo.innerHTML = `Carregando: ${Math.round(percentComplete)}% - Tempo restante: ${Math.max(0, ((2000 - elapsed) / 1000).toFixed(1))}s - Tamanho do arquivo: ${(base64Data.length * 0.75 / 1024).toFixed(2)} KB`;
            if (percentComplete >= 100) clearInterval(uploadProgress);
        }, 100);

        fetch(api, {
            method: "POST",
            body: JSON.stringify({
                file: base64Data,
                type: fileType,
                name: fileName
            })
        })
        .then(res => res.text())
        .then(data => {
            clearInterval(uploadProgress);
            progressBarFill.style.width = '100%';
            msg.innerHTML = ``;
            alert("OCR concluído, iniciando download do resultado");
            downloadTextFile(data, "OCR_Resultado.txt");
        })
        .catch(error => {
            clearInterval(uploadProgress);
            msg.innerHTML = `Erro ao processar o arquivo.`;
            alert("Erro ao processar o arquivo: " + error.message);
            console.error('Error:', error);
        });
    }

    function downloadTextFile(text, filename) {
        let blob = new Blob([text], { type: 'text/plain' });
        alert("Iniciando download do arquivo de texto");
        if (isMobile) {
            alert("Modo mobile detectado, usando FileSaver.js");
            saveAs(blob, filename);
        } else {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
            alert("Download do arquivo de texto iniciado");
        }
    }
});
