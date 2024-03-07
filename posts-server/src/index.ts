import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app: Express = express();
app.use(bodyParser.json());
app.use(cors());
const PORT: number = 4000;
import { randomBytes } from 'crypto';
type Post = {
  id: string;
  content: string;
};

const posts: { [id: string]: Post } = {};

app.get('/', (req: Request, res: Response) => {
  res.redirect('/posts');
});

app.get('/posts', (req: Request, res: Response) => {
  res.status(200).send(posts);
});

app.post('/posts', (req: Request, res: Response) => {
  const id = randomBytes(4).toString('hex');
  const content = req.body.content;
  posts[id] = { id, content: content };
  res.status(201).send(posts[id]);
});

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
