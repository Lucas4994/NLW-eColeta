import express from 'express';
import routes from './routes/routes'
import path from 'path';

const app = express();

app.use(express.json());

app.use(routes);


app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});