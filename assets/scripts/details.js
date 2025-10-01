const urlParams = new URLSearchParams(window.location.search);
const projectId = parseInt(urlParams.get("id"));

let projects = JSON.parse(localStorage.getItem("projects")) || [];

const project = projects.find((p) => p.id === projectId);

const detailContainer = document.getElementById("detailContainer");

if (project) {
  detailContainer.innerHTML = `
    <div class="card" style="width: 18rem; margin: 10px auto; padding: 10px;">
      <a href="${project.image}" target="_blank">
        <img src="${project.image}" alt="${
    project.name
  }" style="width:100%; height:auto;">
      </a>
      <h2>${project.name}</h2>
      <p>${project.desc}</p>
      <p><strong>Start:</strong> ${project.start || "-"}</p>
      <p><strong>End:</strong> ${project.end || "-"}</p>
    </div>
  `;
} else {
  detailContainer.innerHTML = `
    <p>Project not found.</p>
  `;
}
