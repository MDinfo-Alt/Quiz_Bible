let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// Carregar perguntas do arquivo JSON
fetch('perguntas.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        loadQuestion();
    })
    .catch(error => {
        console.error("Erro ao carregar perguntas:", error);
    });

// Carregar a próxima pergunta
function loadQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
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
    
    // Primeiro, vamos verificar se a resposta está correta
    if (selectedIndex === question.correctAnswer) {
        // Se for correta, vamos destacar a opção com verde
        answersList[selectedIndex].style.backgroundColor = 'green';
        score++;  // Incrementa a pontuação
    } else {
        // Se for errada, vamos destacar a opção com vermelho
        answersList[selectedIndex].style.backgroundColor = 'red';
        
        // E vamos também destacar a resposta correta com verde
        answersList[question.correctAnswer].style.backgroundColor = 'green';
    }

    // Atualiza a pontuação na tela
    document.getElementById('score-count').innerText = score;

    // Desabilitar todas as respostas após a escolha
    for (let li of answersList) {
        li.style.pointerEvents = 'none'; // Desabilita interações
    }

    // Habilitar o botão "Próxima" para que o jogador possa continuar
    document.getElementById('next-button').disabled = false;
}


// Ir para a próxima pergunta
document.getElementById('next-button').addEventListener('click', () => {
    currentQuestionIndex++;
    loadQuestion();
});

// Finalizar o quiz
function endQuiz() {
    document.getElementById('question-text').innerText = `Quiz Finalizado! Sua pontuação: ${score}`;
    document.getElementById('answers-list').innerHTML = '';
    document.getElementById('next-button').style.display = 'none';
}