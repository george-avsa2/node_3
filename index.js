const express = require("express");
const app = express();
const PORT = 3000;
const fs = require("fs").promises;
const fsCallback = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

let movies;

app.use(express.json());

app.get("/movies", (req, res) => {
  res.json(movies);
});

app.get("/movies/:id", (req, res) => {
  const movieId = parseInt(req.params.id);
  const movie = movies.find((movie) => movie.id === movieId);

  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ message: "movie not found" });
  }
});

app.post("/movies", (req, res) => {
  const newMovie = {
    id: uuidv4(),
    title: req?.body?.title,
    year: req?.body?.year,
    rating: req?.body?.rating || null,
    position: req?.body?.position || null,
    gallery: req?.body?.gallery || null,
  };

  const errors = [];

  if (!newMovie.title || typeof newMovie.title !== "string") {
    errors.push("title is missing or not string");
  }

  if (!newMovie.year || typeof newMovie.year !== "number") {
    errors.push("year is missing or not string");
  }

  if (newMovie.rating) {
  }

  movies.push(newMovie);
  res.status(201).json(newMovie);
});

app.put("/movies/:id", (req, res) => {
  const movieId = parseInt(req.params.id);
  const movieIndex = movies.findIndex((u) => u.id === movieId);

  if (movieIndex !== -1) {
    movies[movieIndex] = {
      id: movieId,
      name: req.body.name,
      email: req.body.email,
    };
    res.json(movies[movieIndex]);
  } else {
    res.status(404).json({ message: "movie not found" });
  }
});

app.delete("/movies/:id", (req, res) => {
  const movieId = parseInt(req.params.id);
  const movieIndex = movies.findIndex((u) => u.id === movieId);

  if (movieIndex !== -1) {
    movies.splice(movieIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "movie not found" });
  }
});

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

const loadmoviesFromFile = async () => {
  try {
    const data = await fs.readFile(
      path.join(process.cwd(), "data", "movies-min.json"),
      "utf-8"
    );
    movies = JSON.parse(data);
    console.log("movies data successfully loaded.");
  } catch (err) {
    console.error("Error loading movies data:", err);
    throw err;
  }
};

const startServer = async () => {
  try {
    await loadmoviesFromFile();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Server failed to start:", err);
  }
};

startServer();

process.on("SIGINT", async () => {
  fsCallback.writeFile(
    path.join(__dirname, "data/movies.json"),
    JSON.stringify(movies),
    "utf-8",
    () => {
      process.exit();
    }
  );
});
