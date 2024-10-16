import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors"; // Import cors

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/generate-theme", async (req, res) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Generate a fun theme for a comedy night competition.",
        },
      ],
      max_tokens: 300,
    }),
  });

  const data = await response.json();
  res.json(data.choices[0].message.content);
});

// Function to make a request to OpenAI API for generating jokes
async function generateJoke(model, theme) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "user",
          content: `Create a funny joke based on this theme: ${theme}`,
        },
      ],
      max_tokens: 300,
      temperature: 0.9,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// Function to make a request to OpenAI API for evaluating jokes
async function evaluateJokes(jokes) {
  const jokeList = jokes.map((joke, i) => `Joke ${i + 1}: ${joke}`).join("\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Evaluate these jokes based on humor, relevance, and creativity:\n${jokeList}\nChoose the winnare.`,
        },
      ],
      max_tokens: 300,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// API route for generating jokes using GPT-3.5
app.post("/generate-joke-gpt3", async (req, res) => {
  const { theme } = req.body;
  try {
    const joke = await generateJoke("gpt-3.5-turbo", theme);
    res.json({ joke });
  } catch (error) {
    console.error("Error generating joke with GPT-3.5:", error);
    res.status(500).json({ error: "Failed to generate joke with GPT-3.5" });
  }
});

// API route for generating jokes using GPT-4
app.post("/generate-joke-gpt4", async (req, res) => {
  const { theme } = req.body;
  try {
    const joke = await generateJoke("gpt-4", theme);
    res.json({ joke });
  } catch (error) {
    console.error("Error generating joke with GPT-4:", error);
    res.status(500).json({ error: "Failed to generate joke with GPT-4" });
  }
});

// API route for evaluating jokes
app.post("/evaluate-jokes", async (req, res) => {
  const { jokes } = req.body;
  try {
    const scores = await evaluateJokes(jokes);
    res.json({ scores });
  } catch (error) {
    console.error("Error evaluating jokes:", error);
    res.status(500).json({ error: "Failed to evaluate jokes" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
