let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 0; // Nova variável para o total de perguntas
let questions = [];
let usedQuestions = []; // Armazena os índices das perguntas já usadas
let consecutiveErrors = 0;  // Para contar os erros consecutivos

// Sons para respostas corretas e erradas
const correctSound = new Audio('respostacerta.mp3'); // Som de resposta certa
const wrongSound = new Audio('respostaerrada.mp3'); // Som de resposta errada

// Função para embaralhar as perguntas
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Carregar perguntas do arquivo JSON
fetch('perguntas.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        totalQuestions = questions.length; // Armazena o total de perguntas
        shuffle(questions); // Embaralha as perguntas
        loadQuestion();
    })
    .catch(error => {
        console.error("Erro ao carregar perguntas:", error);
    });

// Carregar a próxima pergunta
function loadQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        
        // Evita perguntas repetidas usando a lista de usadas
        while (usedQuestions.includes(question.id)) {
            currentQuestionIndex++;
            if (currentQuestionIndex >= questions.length) {
                endQuiz();
                return;
            }
        }
        
        // Marca a pergunta atual como usada
        usedQuestions.push(question.id);
        
        // Exibe a pergunta
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
}

function checkAnswer(selectedIndex) {
    const question = questions[currentQuestionIndex];
    const answersList = document.getElementById('answers-list').children;
    
    if (selectedIndex === question.correctAnswer) {
        answersList[selectedIndex].style.backgroundColor = 'green';
        score++;  // Incrementa a pontuação
        consecutiveErrors = 0;  // Reseta o contador de erros consecutivos
        correctSound.play();  // Toca o som de resposta certa
    } else {
        answersList[selectedIndex].style.backgroundColor = 'red';
        answersList[question.correctAnswer].style.backgroundColor = 'green';
        
        consecutiveErrors++;  // Incrementa o contador de erros consecutivos
        wrongSound.play();  // Toca o som de resposta errada
        
        if (consecutiveErrors > 3) {
            alert("Você errou 3 perguntas consecutivas! O quiz será reiniciado.");
            score = 0;  // Zera a pontuação
            consecutiveErrors = 0;  // Reseta o contador de erros consecutivos
            currentQuestionIndex = 0;  // Reinicia as perguntas
            usedQuestions = [];  // Limpa as perguntas já usadas
            document.getElementById('score-count').innerText = score;  // Atualiza a pontuação na tela
            loadQuestion();  // Carrega a primeira pergunta novamente
            return;  // Interrompe a execução da função
        }
    }

    // Atualiza a pontuação
    document.getElementById('score-count').innerText = score;

    // Desabilita interações com as respostas
    for (let li of answersList) {
        li.style.pointerEvents = 'none';
    }

    // Habilita o botão "Próxima"
    document.getElementById('next-button').disabled = false;
}

// Ir para a próxima pergunta
document.getElementById('next-button').addEventListener('click', () => {
    currentQuestionIndex++;
    loadQuestion();
});

// Finalizar o quiz
function endQuiz() {
    document.getElementById('question-text').innerText = `Você acertou ${score} de ${totalQuestions}!`;
    document.getElementById('answers-list').innerHTML = '';
    document.getElementById('next-button').style.display = 'none';
}
