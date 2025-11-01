let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 0;
let questions = [];
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

// Carregar a pergunta atual
const loadQuestion = () => {
    if (currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }

    const question = questions[currentQuestionIndex];

    // Exibir o texto da pergunta
    document.getElementById('question-text').innerText = question.question;

    // Limpar respostas anteriores
    const answersList = document.getElementById('answers-list');
    answersList.innerHTML = '';

    // Criar opções de resposta
    question.answers.forEach((answer, index) => {
        const li = document.createElement('li');
        li.innerText = answer.text;
        li.style.backgroundColor = '';  // Resetar cor
        li.style.pointerEvents = 'auto'; // Permitir clique
        li.onclick = () => checkAnswer(index);
        answersList.appendChild(li);
    });

    // Desabilitar botão "Próxima" até escolher uma resposta
    document.getElementById('next-button').disabled = true;
};

// Verificar resposta selecionada
const checkAnswer = (selectedIndex) => {
    const question = questions[currentQuestionIndex];
    const answersList = document.getElementById('answers-list').children;

    // Bloquear clique nas respostas após selecionar
    Array.from(answersList).forEach((li) => li.style.pointerEvents = 'none');

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

        if (consecutiveErrors >= 3) {
            setTimeout(() => {
                alert("Você errou 3 perguntas consecutivas! O quiz será reiniciado.");
                resetQuiz();
            }, 500);
            return;
        }
    }

    // Atualizar placar
    document.getElementById('score-count').innerText = score;

    // Habilitar botão "Próxima"
    document.getElementById('next-button').disabled = false;
};

// Evento clique botão Próxima pergunta
document.getElementById('next-button').addEventListener('click', () => {
    currentQuestionIndex++;
    loadQuestion();
});

// Finalizar quiz exibindo resultado
const endQuiz = () => {
    document.getElementById('question-text').innerText = `Você acertou ${score} de ${totalQuestions}!`;
    document.getElementById('answers-list').innerHTML = '';
    document.getElementById('next-button').style.display = 'none';
};

// Reiniciar quiz para jogar novamente
const resetQuiz = () => {
    score = 0;
    consecutiveErrors = 0;
    currentQuestionIndex = 0;
    document.getElementById('score-count').innerText = score;
    document.getElementById('next-button').style.display = 'block';
    document.getElementById('next-button').disabled = true;
    loadQuestion();
};
