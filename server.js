import express from "express";
import mangoose from "mongoose";
import bodyParser from "body-parser";

import Movie from "./models/movie.js"

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/moviedb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// Create or add a new movie
app.post('/movies', async (req, res) => {
    const { name, img, summary } = req.body;
    try {
        const newMovie = new Movie({ name, img, summary });
        await newMovie.save();
        res.status(201).json(newMovie);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all movies
app.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a movie by ID
app.get('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a movie by ID
app.put('/movies/:id', async (req, res) => {
    try {
        const updatedMovie = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedMovie) return res.status(404).json({ error: 'Movie not found' });
        res.status(200).json(updatedMovie);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a movie by ID
app.delete('/movies/:id', async (req, res) => {
    try {
        const deletedMovie = await Book.findByIdAndDelete(req.params.id);
        if (!deletedMovie) return res.status(404).json({ error: 'Movie not found' });
        res.status(200).json({ message: 'Movie deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

