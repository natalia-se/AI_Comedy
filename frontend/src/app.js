// DOM elements
const results = document.getElementById("results");
const themeElement = document.getElementById("theme");
const jokeGpt3Element = document.getElementById("joke_gpt3"); // Renamed for GPT-3.5 joke
const jokeGpt4Element = document.getElementById("joke_gpt4"); // Renamed for GPT-4 joke
const scoresElement = document.getElementById("scores");

// Function to generate theme using GPT-4o
async function generateTheme() {
  const response = await fetch("http://localhost:3000/generate-theme", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const theme = await response.json();
  return theme;
  // return "Animals";
}

// Function to generate a joke using GPT-3.5 via the backend server
async function generateJokeGPT3(theme) {
  const response = await fetch("http://localhost:3000/generate-joke-gpt3", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ theme }),
  });

  const data = await response.json();
  return data.joke;
  // return "GPT3";
}

// Function to generate a joke using GPT-4 via the backend server
async function generateJokeGPT4(theme) {
  const response = await fetch("http://localhost:3000/generate-joke-gpt4", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ theme }),
  });

  const data = await response.json();
  return data.joke;
  // return "GPT4";
}

// Function to evaluate jokes via the backend server
async function evaluateJokes(jokes) {
  const response = await fetch("http://localhost:3000/evaluate-jokes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ jokes }),
  });

  const data = await response.json();
  return data.scores;
  // return "WInnn!";
}

// Main function to handle the competition flow
async function startCompetition() {
  // Generate the theme using GPT-4 (assumed to be handled on the backend)
  const theme = await generateTheme();
  themeElement.innerText = `Theme: ${theme}`;

  // Generate jokes from GPT-3.5 and GPT-4
  const jokeGPT3 = await generateJokeGPT3(theme);
  jokeGpt3Element.innerText = jokeGPT3;

  const jokeGPT4 = await generateJokeGPT4(theme);
  jokeGpt4Element.innerText = jokeGPT4;

  // Collect jokes and evaluate them
  const jokes = [jokeGPT3, jokeGPT4];
  const scores = await evaluateJokes(jokes);
  scoresElement.innerText = scores;

  // Display the results
  results.style.display = "block";
}

// Event listener for the "Start Competition" button
document
  .getElementById("startCompetition")
  .addEventListener("click", startCompetition);
