import express, { Express } from "express";
import { listPolls, addPoll, getPoll, vote, } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.get("/api/list", listPolls);
app.post("/api/add", addPoll);
app.post("/api/getpoll", getPoll);
app.post("/api/vote", vote);
app.listen(port, () => console.log(`Server listening on ${port}`));
