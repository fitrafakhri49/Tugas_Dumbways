import express from "express";
import { Pool } from "pg";
import flash from "express-flash";
import session from "express-session";
import multer from "multer";
import path from "path";

const app = express();
const port = 3000;
app.set("view engine", "hbs");
app.set("views", "src/views");
app.use("/assets", express.static("src/assets"));
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({ secret: "secretKey", resave: false, saveUninitialized: true })
);

const db = new Pool({
  user: "postgres",
  password: "219102",
  host: "localhost",
  port: 5432,
  database: "FinalProject",
  max: 20,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/assets/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
app.get("/", home);
app.get("/addProject", addProject);
app.get("/loginExperience", loginExperience);
app.get("/loginProject", loginProject);
app.get("/addExperience", addExperience);
app.post("/addProject", upload.single("image"), handleProject);
app.post("/addExperience", upload.single("image"), handleExperience);
app.post("/experience/delete/:id", deleteExperience);
app.post("/project/delete/:id", deleteProject);
app.post("/loginExperience", handleLoginAddExperience);
app.post("/loginProject", handleLoginAddProject);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function home(req, res) {
  const queryProject = `SELECT id, title, description, technologies, image
FROM public."Project"`;
  const queryExperience = `SELECT * FROM public.experience
ORDER BY id ASC `;
  const resultProject = await db.query(queryProject);
  const resultExperience = await db.query(queryExperience);
  res.render("home", {
    projects: resultProject.rows,
    experiences: resultExperience.rows,
  });
}

function addProject(req, res) {
  res.render("addProject");
}
function loginProject(req, res) {
  res.render("loginProject", { message: req.flash("message") });
}

function loginExperience(req, res) {
  res.render("loginExperience", { message: req.flash("message") });
}

function addExperience(req, res) {
  res.render("addExperience");
}

async function handleProject(req, res) {
  let { title, description, tech } = req.body;
  if (Array.isArray(tech)) {
    tech = tech.join(", ");
  }
  const query = `INSERT INTO public."Project"(
    title, description, technologies, image)
    VALUES ('${title}', '${description}', '${tech}', '${req.file.filename}' )`;
  await db.query(query);
  res.redirect("/");
}

async function handleExperience(req, res) {
  let { experience, location, description, tech } = req.body;
  if (Array.isArray(tech)) {
    tech = tech.join(", ");
  }
  const query = `INSERT INTO public.experience(
    experience, description, technology, image, location)
    VALUES ('${experience}', '${description}', '${tech}','${req.file.filename}' ,'${location}')`;
  await db.query(query);
  res.redirect("/");
}

async function deleteExperience(req, res) {
  const { id } = req.params;
  const query = `DELETE FROM public.experience WHERE id = ${id}`;
  await db.query(query);
  res.redirect("/");
}

async function deleteProject(req, res) {
  const { id } = req.params;
  const query = `DELETE FROM public."Project"WHERE id = ${id}`;
  await db.query(query);
  res.redirect("/");
}
async function handleLoginAddProject(req, res) {
  const { email, password } = req.body;
  const IsRegistered = await db.query(`SELECT id, name, password, email
	FROM public."Login" WHERE email='${email}'`);

  if (IsRegistered.rows.length === 0) {
    req.flash("message", "Email Salah!");
    return res.redirect("/loginProject");
  }
  const user = IsRegistered.rows[0];

  if (password === user.password) {
    req.session.user = {
      name: IsRegistered.rows[0].name,
      email: IsRegistered.rows[0].email,
    };
    return res.redirect("/addProject");
  } else {
    req.flash("message", "Password Salah");
    return res.redirect("/loginProject");
  }
}

async function handleLoginAddExperience(req, res) {
  const { email, password } = req.body;
  const IsRegistered = await db.query(`SELECT id, name, password, email
	FROM public."Login" WHERE email='${email}'`);

  if (IsRegistered.rows.length === 0) {
    req.flash("message", "Email Salah");
    return res.redirect("/loginExperience");
  }
  const user = IsRegistered.rows[0];

  if (password === user.password) {
    req.session.user = {
      name: IsRegistered.rows[0].name,
      email: IsRegistered.rows[0].email,
    };
    return res.redirect("/addExperience");
  } else {
    req.flash("message", "Password Salah");
    return res.redirect("/loginExperience");
  }
}
