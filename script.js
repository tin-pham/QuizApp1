// Start
const startButton = document.getElementById('start');

startButton.addEventListener('click', () => {
  // Hide the start screen
  document.querySelector('.container__start').style.display = 'none';
  setTimeout(() => {
    alert('Loading');
    handleUI();
  }, 2000);
  //   Show the quiz screen
});

const url = 'https://opentdb.com/api.php?amount=2&category=23&difficulty=easy&type=multiple';
const url2 = 'https://opentdb.com/api.php?amount=2&category=23&difficulty=medium&type=multiple';
const url3 = 'https://opentdb.com/api.php?amount=1&category=23&difficulty=hard&type=multiple';

const easyQuestions = fetch(url);
const mediumQuestions = fetch(url2);
const hardQuestions = fetch(url3);
// Add Data

Promise.all([easyQuestions, mediumQuestions, hardQuestions]).then((questions) => {
  questions.forEach((question) => {
    handleQuestion(question.json());
  });
});

// Handle the Quiz

function createQuiz(item) {
  const { question, difficulty, correct_answer, incorrect_answers } = item;

  // Randomize answer position
  const answer = [].concat(incorrect_answers, correct_answer).sort((a, b) => 0.5 - Math.random());
  const quizEle = document.createElement('div');
  quizEle.classList.add('quiz');
  quizEle.innerHTML = `
   
    <h3>Q:${question}</h3>
    <div class="grid">
      <button class="btn">A. ${answer[0]}</button>
      <button class="btn">B. ${answer[1]}</button>
      <button class="btn">C. ${answer[2]}</button>
      <button class="btn">D. ${answer[3]}</button>
    </div>
    <div class="difficulty ${colorDecide(difficulty)}">${difficulty}</div>
  `;

  handleAnswer(quizEle.querySelectorAll('button'), correct_answer, difficulty);
  return quizEle;
}

let quizs = [];
function handleQuestion(prom) {
  prom.then((quiz) => {
    const ques = quiz.results;
    ques.forEach((q) => {
      const containerQuiz = document.querySelector('.container__quiz');

      // Create Quiz
      let quizEle = document.createElement('div');
      quizEle = createQuiz(q);

      // Append the quiz into container
      containerQuiz.appendChild(quizEle);
    });
  });
}

// Current Quiz
let current = 0;
function handleUI() {
  const quizs = document.querySelectorAll('.quiz');
  // Clear First
  quizs.forEach((quiz) => {
    quiz.classList.remove('active');
  });

  quizs[current].classList.add('active');
}

var score = +document.querySelector('.score').innerHTML;
function handleAnswer(answerButton, correct_answer, difficulty) {
  answerButton.forEach((button) => {
    button.addEventListener('click', (e) => {
      const target = e.currentTarget;

      // If the answer match the correct_answer

      if (target.textContent.indexOf(correct_answer) > -1) {
        // Turn green
        handleTrue(target, answerButton, difficulty);
      } else {
        // Turn red
        handleFalse(target, answerButton, correct_answer);
      }

      // Next question
      if (current === 5) {
        setTimeout(() => {
          finalScore();
        }, 2000);
      }

      setTimeout(() => {
        current++;
        handleUI();
      }, 2000);
    });
  });
}

function handleTrue(target, answerButton, difficulty) {
  target.classList.add('true');

  answerButton.forEach((button) => {
    button.style.pointerEvents = 'none';
  });

  score += handleScore(difficulty);
  document.querySelector('.score').innerHTML = score;
}

function handleFalse(target, answerButton, correct_answer) {
  target.classList.add('false');

  answerButton.forEach((button) => {
    if (button.textContent.indexOf(correct_answer) > -1) {
      button.classList.add('true');
      button.style.pointerEvents = 'none';
    } else {
      button.style.pointerEvents = 'none';
    }
  });
}

function handleScore(difficulty) {
  if (difficulty === 'easy') return 10;
  if (difficulty === 'medium') return 20;
  if (difficulty === 'hard') return 30;
}

function colorDecide(difficulty) {
  if (difficulty === 'easy') return 'easy';
  if (difficulty === 'medium') return 'medium';
  if (difficulty === 'hard') return 'hard';
}

function finalScore() {
  const containerQuiz = document.querySelector('.container__quiz');
  containerQuiz.innerHTML = `
      <h3>Your Final Score Is</h3>
      <h1>${score}</h1>
    `;
}
