import express from "express";
const app = express();
const port = 3000;
app.set("view engine", "hbs");
app.set("views", "src/views");
app.use("/assets", express.static("src/assets"));
app.use(express.urlencoded({ extended: false }));

app.get("/contact", contact);
app.get("/", home);
app.get("/myProject", myproject);
app.get("/details/:id", details);
app.post("/myProject", addProject);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

let projects = [];
let projectId = 1;

function home(req, res) {
  res.render("home");
}

function myproject(req, res) {
  res.render("myProject", { projects });
}

function contact(req, res) {
  res.render("contact");
}

function addProject(req, res) {
  const { projectName, description, startDate, endDate } = req.body;
  const project = {
    id: projectId++,
    name: projectName,
    desc: description,
    start: startDate,
    end: endDate,
    image: "https://placehold.co/600x400",
  };
  projects.push(project);
  res.render("myProject", { projects });
}

function details(req, res) {
  const project = projects.find((p) => p.id == req.params.id);
  res.render("details", { project });
}
