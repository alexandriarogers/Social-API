const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes')

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(routes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://alexandriarogers:Eatacan90210@cluster0.bhiy4d6.mongodb.net/test', {
    useUnifiedTopology: true
});

mongoose.set('debug', true);

app.listen(PORT, () => console.log(`Connected to localhost:${PORT}`));