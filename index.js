import express from "express";
const app = express();
const port = 3000;
app.set("view engine", "hbs");
app.set("views", "src/views");

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/assets", express.static("src/assets"));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
