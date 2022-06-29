import express from "express";

const app = express();
const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `==# The One Piece Scraper API service is running live on ${PORT} #==`
  );
});
