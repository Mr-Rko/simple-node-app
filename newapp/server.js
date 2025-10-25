const express = require('express');
const fs = require('fs');
const axios = require('axios');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const DATA_FILE = 'data.json';
const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // replace with your API key

function loadData() {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/', async (req, res) => {
    const data = loadData();
    let quote = "Stay productive!";
    let weather = { temp: null, city: null, description: null };

    try {
        const quoteRes = await axios.get('https://api.quotable.io/random');
        quote = quoteRes.data.content;
    } catch (err) { console.log("Quote API error", err); }

    try {
        const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Dhaka&appid=${OPENWEATHER_API_KEY}&units=metric`);
        weather = {
            temp: weatherRes.data.main.temp,
            city: weatherRes.data.name,
            description: weatherRes.data.weather[0].description
        };
    } catch (err) { console.log("Weather API error", err); }

    res.render('index', { tasks: data.tasks, notes: data.notes, quote, weather });
});

// Add task
app.post('/add-task', (req, res) => {
    const data = loadData();
    data.tasks.push({ text: req.body.task, done: false });
    saveData(data);
    res.redirect('/');
});

// Toggle task done
app.post('/toggle-task', (req, res) => {
    const data = loadData();
    const index = parseInt(req.body.index);
    data.tasks[index].done = !data.tasks[index].done;
    saveData(data);
    res.redirect('/');
});

// Delete task
app.post('/delete-task', (req, res) => {
    const data = loadData();
    const index = parseInt(req.body.index);
    data.tasks.splice(index, 1);
    saveData(data);
    res.redirect('/');
});

// Add note
app.post('/add-note', (req, res) => {
    const data = loadData();
    data.notes.push(req.body.note);
    saveData(data);
    res.redirect('/');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
