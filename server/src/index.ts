import express, { Request } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();
import databaseServices from "./services/database.services";
import routersApp from "./routes";
import path from "path";
import { createServer } from "http";
import { initializeSocket } from "./services/socket.services";

databaseServices.connect();

const app = express();
const httpServer = createServer(app);
// Initialize socket.io
initializeSocket(httpServer);

app.use(cors<Request>());
app.use(express.json({ limit: "500mb" }));
// Fix static file serving path
app.use('/static', express.static(path.join(__dirname, '..', 'public')));

app.get("/", (req, res) => {
  res.send("Hello World! From Kha");
});
app.use(
  bodyParser.json({
    limit: "500mb",
  }),
);

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "500mb",
  }),
);
const port = process.env.PORT;

app.use("/api", routersApp);

// app.listen(port, () => {
//   console.log(`App server listening on port ${port}`);
// });
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});