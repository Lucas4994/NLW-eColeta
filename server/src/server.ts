import express from 'express';

const app = express();

app.get('/users', (req, res) => {
    console.log('Listagem de usuarios');
    res.json([
        'DIego',
        'Lucas',
        'Tiago'
    ]);
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});