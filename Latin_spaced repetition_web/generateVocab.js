const fs = require('fs');

console.log('Starting script...');

// Read the JSON file
try {
    const rawData = fs.readFileSync('dcc_core_vocabulary.json');
    console.log('JSON file read successfully.');
    const vocabularyList = JSON.parse(rawData);
    console.log('JSON file parsed successfully.');

    // Generate the JavaScript code
    let vocabJsContent = `// Full Latin vocabulary embedded directly into the JavaScript code
const vocabulary = [
`;

    vocabularyList.forEach(entry => {
        vocabJsContent += `    { "Headword": "${entry.Headword}", "Definition": "${entry.Definition}" },\n`;
    });

    vocabJsContent += `];

// Shuffle function to randomize the vocabulary order
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// App state variables
let currentWordIndex = 0;
let score = 0;

// Initialize the app with shuffled vocabulary
const shuffledVocabulary = shuffle([...vocabulary]);

// DOM elements
const questionElement = document.getElementById("question");
const inputElement = document.getElementById("answer");
const submitButton = document.getElementById("submit");
const feedbackElement = document.getElementById("feedback");
const scoreElement = document.getElementById("score");

// Function to display the current question
function displayQuestion() {
    const word = shuffledVocabulary[currentWordIndex];
    questionElement.textContent = \`Translate: \${word.Headword}\`;
    inputElement.value = "";
    feedbackElement.textContent = "";
}

// Function to handle answer submission
function checkAnswer() {
    const userAnswer = inputElement.value.trim().toLowerCase();
    const correctAnswer = shuffledVocabulary[currentWordIndex].Definition.toLowerCase();

    if (userAnswer === correctAnswer) {
        feedbackElement.textContent = "Correct!";
        feedbackElement.style.color = "green";
        score++;
    } else {
        feedbackElement.textContent = \`Incorrect. The correct answer is: \${correctAnswer}\`;
        feedbackElement.style.color = "red";
    }

    scoreElement.textContent = \`Score: \${score}\`;
    currentWordIndex++;

    if (currentWordIndex < shuffledVocabulary.length) {
        displayQuestion();
    } else {
        questionElement.textContent = "You've completed all the words!";
        inputElement.style.display = "none";
        submitButton.style.display = "none";
    }
}

// Event listener for the submit button
submitButton.addEventListener("click", checkAnswer);

// Start the app
displayQuestion();
`;

    // Write the generated code to vocab.js
    fs.writeFileSync('vocab.js', vocabJsContent);
    console.log('vocab.js has been generated successfully.');
} catch (error) {
    console.error('Error:', error);
}