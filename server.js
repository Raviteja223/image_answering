import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
const __dirname = path.resolve();
import Replicate from "replicate";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/upload', (req, res) => {
  // Render the index.html file from public folder
  res.sendFile(__dirname + '/public/index.html');
});

app.post("/img_answering", async (req, res) => {
  const fileUrl = req.body.fileUrl;
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const model = "andreasjansson/blip-2:4b32258c42e9efd4288bb9910bc532a69727f9acd26aa08e175713a0a857a608";
  const input = {
    image: fileUrl,
    question: "Describe the image in detail in 100 words.",
  };
  const output = await replicate.run(model, { input });

    res.status(200).json({ statusCode: 200, result: output });
});

app.post("/img_enhancer", async (req, res) => {
    const fileUrl = req.body.fileUrl;

    console.log(fileUrl, "file");
    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
    });

    const output = await replicate.run(
        "tencentarc/gfpgan:9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
        {
          input: {
            img: fileUrl
          }
        }
    );

    res.status(200).json({ statusCode: 200, result: output });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
});