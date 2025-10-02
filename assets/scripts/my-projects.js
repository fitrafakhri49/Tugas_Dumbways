const projectForm = document.querySelector(".form");
const projectList = document.getElementById("project-list");
let projects = JSON.parse(localStorage.getItem("projects")) || [];
let projectId = JSON.parse(localStorage.getItem("lastProjectId")) || 1;

projectForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("projectName").value;
  const desc = document.getElementById("description").value;
  const imageFile = document.getElementById("formFile").files[0];
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;

  let imageURL = "https://placehold.co/600x400";
  if (imageFile) {
    imageURL = URL.createObjectURL(imageFile);
  }

  const project = { id: projectId++, name, desc, start, end, image: imageURL };

  projects.push(project);
  localStorage.setItem("projects", JSON.stringify(projects));
  localStorage.setItem("lastProjectId", JSON.stringify(projectId));

  renderProjects();
  projectForm.reset();
});

function renderProjects() {
  const html = projects
    .map((p) => {
      return `
      <div class="card" style="width: 18rem; margin-bottom: 10px;">
        <img src="${p.image}" class="card-img-top" alt="Project Image">
        <div class="card-body">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text">${p.desc}</p>
          <p class="card-text"><strong>Start:</strong> ${p.start}</p>
          <p class="card-text"><strong>End:</strong> ${p.end}</p>
          <a href="detail.html?id=${p.id}" class="btn btn-primary">Detail</a>
        </div>
      </div>
    `;
    })
    .join("");

  projectList.innerHTML = html;
}
