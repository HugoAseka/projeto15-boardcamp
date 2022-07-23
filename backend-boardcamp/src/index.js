import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import categoriesRouter from "./routes/categoriesRouter.js"
import gamesRouter from "./routes/gamesRouter.js"


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


app.use(categoriesRouter);
app.use(gamesRouter);






const PORT = process.env.PORT || 5008;
app.listen(4002, () => console.log("Servidor Online") )