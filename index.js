import express from "express";
import fs from "fs";
import https from "https";
import { MongoClient } from "mongodb";

const app = express();
const PORT = 5000;

// app.use(express.json());

var jsonParser = express.json();
var urlencodedParser = express.urlencoded({ extended: false });

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
      console.log("Connection to DB closed successfully !");
    });
  } catch (err) {
    console.error(err);
    sslServer.close(() => {
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

// episodetomangachaptersAPI
app.route("/episodechapters/:ep").get(async (request, response, next) => {
  //   DB CONNECTION LOGIC HERE !
  try {
    await dbClient.connect();
    console.log(`Connected to cluster 'episodestochapters' successfully !`);
    const opdb = await dbClient.db("animetomanga");
    console.log(`Connected to DB 'animetomanga' successfully !`);
    const e2chap = await opdb.collection("episodetochapter");
    const cursr = await e2chap.find({ _id: "onepiecemap" });
    // The below variable is used outside the try block - hence var function scope is necessary
    var map = await cursr.toArray();
    console.log(
      `Succesfully retrieved the episode to manga chapter list map from collection 'episodetochapter' !`
    );
    dbClient.close().then(() => {
      console.log("Connection to DB closed successfully !");
    });
  } catch (err) {
    console.error(err);
    sslServer.close(() => {
      console.log(`Connection to the server at port ${PORT} has been closed !`);
    });
  }
  let epMap = map[0].content;
  try {
    let mapKeys = Object.keys(epMap);
    if (mapKeys.includes(request.params.ep)) {
      response.json({
        episode: request.params.ep,
        chapters: epMap[request.params.ep],
      });
    } else {
      response.json({ error: `No entry for episode ${request.params.ep}` });
    }
  } catch (err) {
    response.json({ error: err });
  }
});

app.route("/api").post(jsonParser, (request, response) => {
  try {
    let serviceName = request.body.serviceName;
    let episodeNumber = request.body.episodeNumber;
    if (!serviceName) {
      throw new Error("Missing parameter 'serviceName'");
    }
    if (!episodeNumber) {
      throw new Error("Missing parameter 'episodeNumber'");
    }
    // permanent redirect code is 301
    response.redirect(301, `/${serviceName}/${episodeNumber}`);
  } catch (err) {
    response.status = 400;
    response.json({
      error: `400 : Bad request => ${err}`,
    });
  }
});

app.route("/a").get((req, res) => {
  console.log("Hello!");
  res.send("Hello!");
});

// APP  run on an SSL SERVER

const sslServer = https.createServer(
  {
    key: fs.readFileSync("./cert/key.pem"),
    cert: fs.readFileSync("./cert/cert.pem"),
  },
  app
);

sslServer.listen(PORT, async () => {
  console.log(
    `=============================The One Piece Scraper API service is running live on port: ${PORT} ============================= \n`
  );
});
