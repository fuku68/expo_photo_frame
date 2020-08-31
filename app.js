import express from "express";
import http from "http";
import bodyParser from "body-parser";
import fileMiddleware from 'express-multipart-file-parser'
import api from "./routes/api";

const app = express();

app.use(express.static(__dirname + "/src"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileMiddleware);

app.use("/api", api);

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
app.set('port', port)

app.listen(port, () =>
  console.log(`Server is listening on port ${port}`)
);
