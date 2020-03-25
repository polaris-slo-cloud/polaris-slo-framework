import express from 'express';

const port = 8080;

const app = express();

app.get('/', (req, res) => {
    res.send('hallo!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});
