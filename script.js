let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 0;
let questions = [];
let usedQuestions = [];
let consecutiveErrors = 0;

const correctSound = new Audio('respostacerta.mp3');
const wrongSound = new Audio('respostaerrada.mp3');

// Função para embaralhar as perguntas
const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

// Carregar perguntas do arquivo JSON
fetch('perguntas.json')
    .then((response) => response.json())
    .then((data) => {
        questions = data;
        totalQuestions = questions.length;
        shuffle(questions);
        loadQuestion();
    })
    .catch((error) => console.error("Erro ao carregar perguntas:", error));

// Carregar a próxima pergunta
const loadQuestion = () => {
    if (currentQuestionIndex < questions.length) {
        let question = questions[currentQuestionIndex];

        // Evita perguntas repetidas
        while (usedQuestions.includes(question.id)) {
            currentQuestionIndex++;
            if (currentQuestionIndex >= questions.length) {
                endQuiz();
                return;
            }
            question = questions[currentQuestionIndex];
        }

        usedQuestions.push(question.id);

        document.getElementById('question-text').innerText = question.question;

        const answersList = document.getElementById('answers-list');
        answersList.innerHTML = '';

        question.answers.forEach((answer, index) => {
            const li = document.createElement('li');
            li.innerText = answer.text;
            li.onclick = () => checkAnswer(index);
            answersList.appendChild(li);
        });

        document.getElementById('next-button').disabled = true;
    } else {
        endQuiz();
    }
};

// Verificar resposta
const checkAnswer = (selectedIndex) => {
    const question = questions[currentQuestionIndex];
    const answersList = document.getElementById('answers-list').children;

    if (selectedIndex === question.correctAnswer) {
        answersList[selectedIndex].style.backgroundColor = 'green';
        score++;
        consecutiveErrors = 0;
        correctSound.play();
    } else {
        answersList[selectedIndex].style.backgroundColor = 'red';
        answersList[question.correctAnswer].style.backgroundColor = 'green';
        consecutiveErrors++;
        wrongSound.play();

        if (consecutiveErrors > 3) {
            alert("Você errou 3 perguntas consecutivas! O quiz será reiniciado.");
            resetQuiz();
            return;
        }
    }

    document.getElementById('score-count').innerText = score;

    Array.from(answersList).forEach((li) => {
        li.style.pointerEvents = 'none';
    });

    document.getElementById('next-button').disabled = false;
};

// Ir para a próxima pergunta
document.getElementById('next-button').addEventListener('click', () => {
    currentQuestionIndex++;
    loadQuestion();
});

// Finalizar o quiz
const endQuiz = () => {
    document.getElementById('question-text').innerText = `Você acertou ${score} de ${totalQuestions}!`;
    document.getElementById('answers-list').innerHTML = '';
    document.getElementById('next-button').style.display = 'none';
};

// Reiniciar o quiz
const resetQuiz = () => {
    score = 0;
    consecutiveErrors = 0;
    currentQuestionIndex = 0;
    usedQuestions = [];
    document.getElementById('score-count').innerText = score;
    loadQuestion();
};
