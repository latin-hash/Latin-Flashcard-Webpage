console.log("appfunction.js loaded");

// Ensure vocabulary is loaded
console.log("Vocabulary:", vocabulary);

// Array of sentences with blanks and their correct answers
const sentences = vocabulary.map(word => ({
    sentence: word.sentence,
    answer: word.Definition,
    translation: word.translation,
    interval: word.interval || 1,
    dueDate: word.dueDate || new Date()
}));

console.log("Sentences:", sentences);

let currentIndex = 0; // Track the current sentence

// DOM Elements
const sentenceElement = document.getElementById("sentence");
const translationElement = document.getElementById("translation");
const userInput = document.getElementById("user-input");
const checkButton = document.getElementById("check-btn");
const feedbackElement = document.getElementById("feedback");
const scoreElement = document.getElementById("score");
const progressElement = document.getElementById("progress");

// Function to shuffle the sentences
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Shuffle the sentences initially
const shuffledSentences = shuffle([...sentences]);
console.log("Shuffled Sentences:", shuffledSentences);

// Function to load the current sentence
function loadSentence() {
    console.log("Loading sentence:", currentIndex);
    const sentence = shuffledSentences[currentIndex];
    console.log("Current sentence:", sentence);
    sentenceElement.textContent = sentence.sentence;
    translationElement.textContent = sentence.translation;
    userInput.value = "";
    feedbackElement.textContent = "";
    animateApp();
}

// Function to check the user's answer
function checkAnswer() {
    console.log("Checking answer for sentence:", currentIndex);
    const userAnswer = userInput.value.trim().toLowerCase();
    const sentence = shuffledSentences[currentIndex];
    const correctAnswer = sentence.answer.toLowerCase();

    if (userAnswer === correctAnswer) {
        feedbackElement.textContent = "Correct!";
        feedbackElement.style.color = "green";
        score++;
        sentence.interval *= 2; // Double the interval
    } else {
        feedbackElement.textContent = `Incorrect. The correct answer is: ${correctAnswer}`;
        feedbackElement.style.color = "red";
        sentence.interval = 1; // Reset the interval
    }

    sentence.dueDate = new Date(Date.now() + sentence.interval * 24 * 60 * 60 * 1000); // Set the next due date
    scoreElement.textContent = `Score: ${score}`;
    currentIndex++;

    if (currentIndex < shuffledSentences.length) {
        loadSentence();
    } else {
        sentenceElement.textContent = "You've completed all the sentences!";
        translationElement.textContent = "";
        userInput.style.display = "none";
        checkButton.style.display = "none";
    }

    updateProgress();
}

// Function to update the progress
function updateProgress() {
    const progress = (currentIndex / shuffledSentences.length) * 100;
    progressElement.textContent = `Progress: ${progress.toFixed(2)}%`;
}

// Function to animate the app container
function animateApp() {
    const app = document.getElementById("app");
    app.style.transform = "scale(1.05)";
    setTimeout(() => {
        app.style.transform = "scale(1)";
    }, 300);
}

// Event listener for the check button
checkButton.addEventListener("click", checkAnswer);

// Start the app
loadSentence();