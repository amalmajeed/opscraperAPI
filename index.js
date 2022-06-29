import express from "express";
import fs from "fs";
import { MongoClient } from "mongodb";

const app = express();
const PORT = 5000;

// Obtaining the username and password for DB access
const data = fs
  .readFileSync("passwords.txt", (err) => {
    if (err) {
      process.exit(0);
    }
  })
  .toString()
  .split(":");
let uname = data[0];
let pwd = data[1];
let mongoURL = `mongodb+srv://${uname}:${pwd}@episodestochapters.l8qrtlg.mongodb.net/?retryWrites=true&w=majority`;
const dbClient = new MongoClient(mongoURL);

// Routing logic
app.route("/episodeName/:ep").get((request, response, next) => {
  response.send(`This is hello from episodeName ${request.params.ep}`);
  //   IF ELSE LOGIC TO CHECK IF VALID EPISODE !
});

app.listen(PORT, async () => {
  console.log(
    `=============================The One Piece Scraper API service is running live on port: ${PORT} ============================= \n`
  );
  //   DB CONNECTION LOGIC HERE !
  try {
    await dbClient.connect();
    console.log(`Connected to cluster 'episodestochapters' successfully !`);
    const opdb = await dbClient.db("animetomanga");
    console.log(`Connected to DB 'animetomanga' successfully !`);
    const e2title = await opdb.collection("episodetotitle");
    const cursr = await e2title.find({ _id: "onepiecetitles" });
    const map = await cursr.toArray();
    console.log(map);
    console.log(`Connected to collection 'episodetotitle' successfully !`);
    dbClient.close().then(() => {
      console.log("Connection closed successfully !");
    });
  } catch (err) {
    console.error(err);
  }
});
