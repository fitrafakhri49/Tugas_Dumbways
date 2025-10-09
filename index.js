import express from "express";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import flash from "express-flash";
import session from "express-session";
const app = express();
const port = 3000;
app.set("view engine", "hbs");
app.set("views", "src/views");
app.use("/assets", express.static("src/assets"));
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
  })
);
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
app.get("/login", login);
app.get("/register", register);
app.post("/login", handleLogin);
app.post("/register", handleRegister);
app.get("/logout", logout);
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
  const query = `INSERT INTO myproject(
    name, "desc", "startDate", "endDate")
    VALUES ( '${projectName}', '${description}', '${startDate}', '${endDate}')`;
  // projects.push(project);
  await db.query(query);
  res.redirect("/myProject");
}

async function details(req, res) {
  const { id } = req.params;
  const result = await db.query(`SELECT * FROM myproject WHERE id = ${id}`);
  res.render("details", { result });
}

function login(req, res) {
  res.render("login", { message: req.flash("message") });
}

function register(req, res) {
  res.render("register", { message: req.flash("message") });
}

async function handleRegister(req, res) {
  let { name, email, password } = req.body;
  const IsRegistered = await db.query(
    `SELECT * FROM public.user WHERE email='${email}' `
  );
  if (IsRegistered.rows.length) {
    req.flash("message", "EMAIL SUDAH TERDAFTAR!!!");
    return res.redirect("/register");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `INSERT INTO public.user(
    name, password, email)
    VALUES ( '${name}', '${hashedPassword}', '${email}')`;
  const results = await db.query(query);
  res.redirect("login");
}

async function handleLogin(req, res) {
  const { email, password } = req.body;
  const IsRegistered = await db.query(
    `SELECT * FROM public.user WHERE email='${email}' `
  );

  const isMatch = await bcrypt.compare(password, IsRegistered.rows[0].password);

  if (!isMatch) {
    req.flash("message", "PASSWORD SALAH!!!!");
    return res.redirect("/login");
  }

  req.session.user = {
    name: IsRegistered.rows[0].name,
    email: IsRegistered.rows[0].email,
  };
  res.redirect("/");
}

function logout(req, res) {
  req.session.destroy();
  res.redirect("login");
}
