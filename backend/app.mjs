import express from "express";
import session from "express-session";
import cors from "cors";
import { createServer } from "http";

import { usersRouter } from "./routes/users.mjs"
import { filesRouter } from "./routes/files.mjs";
import { blocksRouter } from "./routes/blocks.mjs";

const PORT = 3000;
const app = express();

app.use(express.json());

const corsOptions = {
  origin: 'https://webtorrent.wlt.life',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors());
// app.use(cors(corsOptions));

app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false, httpOnly: true, sameSite: true, maxAge: 24 * 60 * 60 * 1000}
  })
);

app.use("/users", usersRouter);
app.use("/files", filesRouter);
app.use("/blocks", blocksRouter);

export const server = createServer(app).listen(PORT, function (err) {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
})