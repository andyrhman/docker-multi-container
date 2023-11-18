const keys = require('./keys');

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort,
});

pgClient.connect()
    .then(() => {
        console.log('Connected to database');
        pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
            .then(res => console.log('Table creation successful'))
            .catch(err => console.error('Error creating table:', err));
    })
    .catch(err => console.error('Error connecting to database:', err));


// Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get('/', (req, res) => {
    res.send('Hi');
});

app.get('/values/all', async (req, res) => {
    try {
        const values = await pgClient.query('SELECT * from values');
        res.send(values.rows);
    } catch (err) {
        console.error('Error fetching values:', err);
        res.status(500).send('Internal Server Error');
    }
});

const { promisify } = require('util');
const hgetallAsync = promisify(redisClient.hgetall).bind(redisClient);

app.get('/values/current', async (req, res) => {
    try {
        const values = await hgetallAsync('values');
        res.send(values);
    } catch (err) {
        console.error('Error fetching values from Redis:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/values', async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    }

    try {
        redisClient.hset('values', index, 'Nothing yet!');
        redisPublisher.publish('insert', index);
        await pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

        res.send({ working: true });
    } catch (err) {
        console.error('Error inserting value:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(5000, (err) => {
    console.log('Listening');
});
