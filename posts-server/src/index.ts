import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";

const app: Express = express();
app.use(bodyParser.json());
app.use(cors());
const PORT: number = 4000;
import { randomBytes } from 'crypto';
type Post = {
  id: string;
  content: string;
};
const EVENT_BUS_URL = 'http://localhost:4005/events';

const posts: { [id: string]: Post } = {};

app.get('/', (req: Request, res: Response) => {
  res.redirect('/posts');
});

app.get('/posts', (req: Request, res: Response) => {
  res.status(200).send(posts);
});

app.post('/posts', async(req: Request, res: Response) => {
  const id = randomBytes(4).toString('hex');
  const content = req.body.content;
  posts[id] = { id, content: content };
  await axios.post(EVENT_BUS_URL, {type: 'PostCreated', data: {id, content}});
  res.status(201).send(posts[id]);
});

app.post('/events', (req: Request, res: Response) => {
  console.log('Received Event', req.body.type);
  res.send({});
});

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
