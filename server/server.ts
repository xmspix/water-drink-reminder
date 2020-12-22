import express from "express";
import bodyParser = require("body-parser");
import { slackConnect, sendMessage } from "./util/slack";
import fs from "fs";

export let slackUsers: any = {};
export const users: any[] = require("./users.json");

const app = express();

const PORT = 3232;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.get("/api/hello", (req, res) => {
  res.status(200).send("hello world");
});

app.get("/api/users", (req, res) => {
  res.send(users);
});

app.get("/api/update", (req, res) => {
  const user = {
    name: req.query.name,
    dayTarget: Number(req.query.dayTarget),
    current: Number(req.query.current),
  };

  console.log(user);

  const users = JSON.parse(fs.readFileSync("./users.json", "utf8"));
  const other = users.filter((itm: any) => itm.name !== user.name);
  other.push(user);
  fs.writeFileSync("./users.json", JSON.stringify(other));
  res.send(other);
});

slackConnect().then((data) => {
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
    slackUsers = data;
    require("./util/cron");
  });
});
