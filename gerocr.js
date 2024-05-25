// gerocr.js
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector(".btn");
    const fileInput = document.querySelector(".file");
    const msg = document.querySelector(".message");
    const progressBarFill = document.querySelector(".progress-bar-fill");
    const progressInfo = document.querySelector(".progress-info");

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    let imageBase64 = '';

    btn.addEventListener('click', () => {
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

        let startTime = Date.now();

        if (file) {
            let fr = new FileReader();
            fr.readAsDataURL(file);
            fr.onload = () => {
                let res = fr.result;
                let b64 = res.split("base64,")[1];
                processOCR(b64, file.type, file.name, startTime);
            };
        } else if (imageBase64) {
            processOCR(imageBase64, 'image/jpeg', 'captured_image.jpg', startTime);
        }
    });

    function processOCR(base64Data, fileType, fileName, startTime) {
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
            displayText(data);
        })
        .catch(error => {
            clearInterval(uploadProgress);
            msg.innerHTML = `Erro ao processar o arquivo.`;
            console.error('Error:', error);
        });
    }

    function displayText(text) {
        resultText.innerHTML = text;
        resultText.style.whiteSpace = 'pre-wrap';
        resultText.style.padding = '10px';
        resultText.style.border = '1px solid #ccc';
        resultText.style.marginTop = '10px';
        resultText.style.backgroundColor = '#f3f3f3';
        resultText.style.width = '80%';
        resultText.style.maxHeight = '400px';
        resultText.style.overflowY = 'auto';
    }
});
