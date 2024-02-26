document.addEventListener('DOMContentLoaded', function() {
    //alamcenamos en variables todos los elementos que vamos a usar y creo desde aqui el boton de score, creandomelo en html no me iba bien
    const quoteText = document.getElementById('quote');
    const optionsContainer = document.getElementById('options-container');
    const nextButton = document.getElementById('next');
    const scoreDisplay = document.createElement('div'); 
    scoreDisplay.setAttribute('id', 'score');
    document.body.insertBefore(scoreDisplay, document.body.firstChild); 

    let correctAuthor = '';
    let authors = [];
    let score = 0; 

    // Función que actualiza la puntuación en pantalla 
    function updateScoreDisplay() {
        scoreDisplay.textContent = `Score: ${score}`;
    }

    // Funcion que reinicia el juego 
    function resetGame() {
        score = 0; // puntuacion a cero 
        updateScoreDisplay();
        fetchQuote(); // tengo que volver a llamar a las funciones que me generan las quotes y la puntuación
    }

    async function fetchQuote() { // funcion que obtiene una cita aleatoria de la api
        const response = await fetch('https://api.quotable.io/random');
        const data = await response.json();
        quoteText.textContent = data.content;
        correctAuthor = data.author;
        fetchAuthors();
    }

    async function fetchAuthors() { //obtenemos lista de autores 
        const response = await fetch('https://api.quotable.io/authors');
        const data = await response.json();
        authors = data.results.map(author => author.name);
        displayOptions();
    }

    function displayOptions() { // función que genera las 4 opciones, cogemos la respuesta correcta y 3 random
        const options = shuffleOptions([correctAuthor, ...getRandom(authors, 3)]);
        optionsContainer.innerHTML = options.map(option => 
            `<button class="option">${option}</button>`
        ).join('');
        optionsContainer.addEventListener('click', checkAnswer);
    }
//Eventos que gestionana las respuestas correcta, incorrectas y el reinicio del juego 
    function checkAnswer(event) { 
        if (event.target.classList.contains('option')) {
            const selectedAuthor = event.target.textContent;
            const options = document.querySelectorAll('.option');
            options.forEach((option) => {
                option.classList.add('disabled');
                option.disabled = true;
                if (option.textContent === correctAuthor) {
                    option.classList.add('correct-answer');
                }
            });
            
            if (selectedAuthor === correctAuthor) {
                score += 100; // Sumo 100 por respuesta corrcta
                event.target.classList.add('correct-answer');
                alert('Correct!');
            } else {
                score -= 200; // Resta 200 por incorrecta 
                event.target.classList.add('incorrect-answer');
                alert(`Wrong! The correct author is ${correctAuthor}.`);
            }

            if (score < 0) {
                alert('Game Over! Starting over...');
                resetGame();
            } else {
                updateScoreDisplay();
            }
            nextButton.disabled = false;
        }
    }
// como se colocan en la pantalla barajo las opciones, que no salga siempre el que esta bien en la misma posicion
    function shuffleOptions(options) {
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        return options;
    }

    function getRandom(arr, n) {
        const result = new Set();
        while(result.size < n) {
            const random = arr[Math.floor(Math.random() * arr.length)];
            result.add(random);
        }
        return [...result];
    }
// para pasar a la siguiente 
    nextButton.addEventListener('click', () => {
        fetchQuote();
        nextButton.disabled = true;
    });

    updateScoreDisplay(); // incio 
    fetchQuote(); 
});
