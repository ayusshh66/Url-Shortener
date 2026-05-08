import express from 'express';
import userRouter from './routes/users.routes.js'

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json())

app.get('/', (req,res) => {
    res.status(200).end('server is ready ')
})

app.use('/user', userRouter);

app.listen(PORT, () => {
    console.log(`server is up and running at port number : ${PORT}`)
})