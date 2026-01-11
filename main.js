document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const numbersDisplay = document.querySelector('.numbers-display');

    generateBtn.addEventListener('click', () => {
        const lottoNumbers = generateLottoNumbers();
        displayLottoNumbers(lottoNumbers);
    });

    function generateLottoNumbers() {
        const numbers = [];
        while (numbers.length < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1; // Numbers from 1 to 45
            if (!numbers.includes(randomNumber)) {
                numbers.push(randomNumber);
            }
        }
        return numbers.sort((a, b) => a - b);
    }

    function displayLottoNumbers(lottoNumbers) {
        numbersDisplay.innerHTML = ''; // Clear previous numbers
        lottoNumbers.forEach(number => {
            const numberCircle = document.createElement('div');
            numberCircle.classList.add('number-circle');
            numberCircle.textContent = number;
            numbersDisplay.appendChild(numberCircle);
        });
    }
});