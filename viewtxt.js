// viewtxt.js
document.addEventListener('DOMContentLoaded', () => {
    const resultText = document.querySelector(".result-text");

    function displayText(text) {
        resultText.innerHTML = text;
        resultText.style.display = 'block';
        resultText.style.whiteSpace = 'pre-wrap';
        resultText.style.padding = '10px';
        resultText.style.border = '1px solid #ccc';
        resultText.style.marginTop = '10px';
        resultText.style.backgroundColor = '#f3f3f3';
        resultText.style.width = '80%';
        resultText.style.maxHeight = '400px';
        resultText.style.overflowY = 'auto';
    }

    // Chame a função displayText com o texto do OCR quando estiver pronto para exibir na tela
    // Exemplo:
    // displayText("Texto retornado do OCR");
});
