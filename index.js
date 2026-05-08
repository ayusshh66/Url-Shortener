import express from 'express';

const app = express();
const PORT = process.env.PORT ?? 8000;

app.get('/', (req,res) => {
    res.status(200).end('server is ready ')
})

app.listen(PORT, () => {
    console.log(`server is up and running at port number : ${PORT}`)
})