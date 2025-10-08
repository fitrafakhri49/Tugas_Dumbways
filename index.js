import express from "express";
import { Pool } from "pg";
const app = express();
const port = 3000;
app.set("view engine", "hbs");
app.set("views", "src/views");
app.use("/assets", express.static("src/assets"));
app.use(express.urlencoded({ extended: false }));

const db = new Pool({
  user: "postgres",
  password: "219102",
  host: "localhost",
  port: 5432,
  database: "MyProject",
  max: 20,
});

app.get("/contact", contact);
app.get("/", home);
app.get("/myProject", myproject);
app.get("/details/:id", details);
app.post("/myProject", addProject);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function home(req, res) {
  res.render("home");
}

async function myproject(req, res) {
  const query = `SELECT * FROM public.myproject
  ORDER BY id ASC `;
  const result = await db.query(query);
  res.render("myProject", { result });
}

function contact(req, res) {
  res.render("contact");
}

async function addProject(req, res) {
  let { projectName, description, startDate, endDate } = req.body;
  let project = {
    projectName,
    description,
    startDate,
    endDate,
  };
  const query = `INSERT INTO myproject(
    name, "desc", "startDate", "endDate")
    VALUES ( '${project.projectName}', '${project.description}', '${project.startDate}', '${project.endDate}')`;
  // projects.push(project);
  await db.query(query);
  res.redirect("/myProject");
}

async function details(req, res) {
  const { id } = req.params;
  const result = await db.query(`SELECT * FROM myproject WHERE id = ${id}`);
  res.render("details", { result });
}
