// Ambil id dari query parameter
const urlParams = new URLSearchParams(window.location.search);
const projectId = parseInt(urlParams.get("id")); // pastikan integer

// Ambil semua project dari localStorage
let projects = JSON.parse(localStorage.getItem("projects")) || [];

// Cari project sesuai id dari URL
const project = projects.find((p) => p.id === projectId);

// Tampilkan detail project
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
