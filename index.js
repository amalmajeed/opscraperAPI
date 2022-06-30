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

// ALL ROUTING LOGIC

// episodetottileAPI
app.route("/episodetitle/:ep").get(async (request, response, next) => {
  //   DB CONNECTION LOGIC HERE !
  try {
    await dbClient.connect();
    console.log(`Connected to cluster 'episodestochapters' successfully !`);
    const opdb = await dbClient.db("animetomanga");
    console.log(`Connected to DB 'animetomanga' successfully !`);
    const e2title = await opdb.collection("episodetotitle");
    const cursr = await e2title.find({ _id: "onepiecetitles" });
    // The below variable is used outside the try block - hence var function scope is necessary
    var map = await cursr.toArray();
    console.log(
      `Succesfully retrieved the episode to title maps from collection 'episodetotitle' !`
    );
    dbClient.close().then(() => {
      console.log("Connection closed successfully !");
    });
  } catch (err) {
    console.error(err);
    server.close(() => {
      console.log(`Connection to the server at port ${PORT} has been closed !`);
    });
  }
  let epMap = map[0].content;
  try {
    let mapKeys = Object.keys(epMap);
    if (mapKeys.includes(request.params.ep)) {
      response.json({
        episode: request.params.ep,
        title: epMap[request.params.ep],
      });
    } else {
      response.json({ error: `No entry for episode ${request.params.ep}` });
    }
  } catch (err) {
    response.json({ error: err });
  }
});

var server = app.listen(PORT, async () => {
  console.log(
    `=============================The One Piece Scraper API service is running live on port: ${PORT} ============================= \n`
  );
  //   //   DB CONNECTION LOGIC HERE !
  //   try {
  //     await dbClient.connect();
  //     console.log(`Connected to cluster 'episodestochapters' successfully !`);
  //     const opdb = await dbClient.db("animetomanga");
  //     console.log(`Connected to DB 'animetomanga' successfully !`);
  //     const e2title = await opdb.collection("episodetotitle");
  //     const cursr = await e2title.find({ _id: "onepiecetitles" });
  //     const map = await cursr.toArray();
  //     console.log(`Succesfully retrieved the episode to title maps`);
  //     console.log(`Connected to collection 'episodetotitle' successfully !`);
  //     dbClient.close().then(() => {
  //       console.log("Connection closed successfully !");
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     server.close(() => {
  //       console.log(`Connection to the server at port ${PORT} has been closed !`);
  //     });
  //   }
});
