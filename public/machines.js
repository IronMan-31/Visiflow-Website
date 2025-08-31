let latitude = 0;
let longitude = 0;
let status = "online";
let function1 = "Remote Vision System";
let depth = "10m";

const machinesData = [
  {
    id: 1,
    name: "Kamand",
    location: "Doordrishti",
    category: "doordrishti",
    machineType: "Doordrishti",
    machineCode: "riverbot-001",
    latitude: latitude,
    longitude: longitude,
    depth: depth,
    status: status,
    function: function1,
  },
];

let currentMachine = null;

// Create dynamic particle system
function createParticles() {
  const particleContainer = document.querySelector(".floating-particles");
  const particleCount = 25;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 12 + "s";
    particle.style.animationDuration = 8 + Math.random() * 8 + "s";

    const colors = [
      "rgba(59, 130, 246, 0.7)",
      "rgba(34, 197, 94, 0.6)",
      "rgba(168, 85, 247, 0.5)",
      "rgba(239, 68, 68, 0.4)",
      "rgba(245, 158, 11, 0.5)",
    ];
    particle.style.background =
      colors[Math.floor(Math.random() * colors.length)];
    particle.style.boxShadow = `0 0 10px ${
      colors[Math.floor(Math.random() * colors.length)]
    }`;

    particleContainer.appendChild(particle);
  }
}

// Render machines dynamically
function renderMachines(machines = machinesData) {
  const container = document.getElementById("machineContainer");
  container.innerHTML = "";

  machines.forEach((machine, index) => {
    const machineCard = document.createElement("div");
    machineCard.className = "machine-card";
    machineCard.dataset.category = machine.category;
    machineCard.style.animationDelay = `${0.3 + index * 0.2}s`;
    machineCard.style.animation = "fadeInUp 0.8s ease-out forwards";

    machineCard.innerHTML = `
            <div class="machine-header">
              <div class="machine-icon"></div>
              <div class="machine-info">
                <h3>${machine.name}</h3>
                <div class="machine-location">${machine.location}</div>
              </div>
              <div class="status-indicator ${machine.status}"></div>
            </div>

            <div class="machine-details">
              <div class="detail-item">
                <span class="detail-label">Status</span>
                <span class="detail-value" style="color: ${
                  machine.status === "online" ? "#22c55e" : "#ef4444"
                }">${
      machine.status.charAt(0).toUpperCase() + machine.status.slice(1)
    }</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Function</span>
                <span class="detail-value">${machine.function}</span>
              </div>
            </div>

            <div class="action-buttons">
              <button class="btn btn-primary" onclick="viewData(this, ${
                machine.id
              })">
                View Data
              </button>
              <button class="btn btn-secondary" onclick="configure(this, ${
                machine.id
              })">
                Configure
              </button>
              <button class="btn btn-danger" onclick="deleteMachine(this, ${
                machine.id
              })">
                Delete
              </button>
            </div>
          `;

    container.appendChild(machineCard);
  });

  updateStats();
  updateMachineCount(machines.length);
}

function updateStats() {
  const total = machinesData.length;
  const online = machinesData.filter((m) => m.status === "online").length;
  const offline = total - online;

  document.getElementById("totalMachines").textContent = total;
  document.getElementById("onlineMachines").textContent = online;
  document.getElementById("offlineMachines").textContent = offline;
}

function updateMachineCount(count) {
  document.getElementById(
    "machineCount"
  ).textContent = `${count} of ${machinesData.length} machines`;
}

function closePage() {
  document.querySelector(".container").style.transform = "translateY(-100vh)";
  document.querySelector(".container").style.opacity = "0";
  setTimeout(() => {
    window.location.href = "/";
  }, 500);
}

function setActiveTab(tab, category) {
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  tab.classList.add("active");

  let filteredMachines = machinesData;
  if (category !== "all") {
    filteredMachines = machinesData.filter(
      (machine) => machine.category === category
    );
  }

  renderMachines(filteredMachines);
}

function viewData(btn, machineId) {
  const machine = machinesData.find((m) => m.id === machineId);
  btn.innerHTML = "📊 VIEWING...";
  btn.style.background = "linear-gradient(135deg, #1d4ed8, #1e40af)";
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = "✅ DATA LOADED";
    setTimeout(() => {
      btn.innerHTML = "VIEW DATA";
      btn.style.background = "linear-gradient(135deg, #3b82f6, #1d4ed8)";
      btn.disabled = false;
      alert(`Viewing data for ${machine.name}`);
    }, 2000);
  }, 1500);
}

function configure(btn, machineId) {
  currentMachine = machinesData.find((m) => m.id === machineId);
  openConfigModal();
}

function openConfigModal() {
  if (!currentMachine) return;

  document.getElementById(
    "modalTitle"
  ).textContent = `Configure ${currentMachine.name}`;
  document.getElementById(
    "modalSubtitle"
  ).textContent = `${currentMachine.location} - ${currentMachine.function}`;

  document.getElementById("configName").value = currentMachine.name;
  document.getElementById("configMachineType").value =
    currentMachine.machineType;
  document.getElementById("configMachineCode").value =
    currentMachine.machineCode;
  document.getElementById("configLatitude").value = currentMachine.latitude;
  document.getElementById("configLongitude").value = currentMachine.longitude;
  document.getElementById("configDepth").value = currentMachine.depth;

  document.getElementById("configModal").classList.add("show");
}

function closeConfigModal() {
  document.getElementById("configModal").classList.remove("show");
  currentMachine = null;
}

function saveConfiguration() {
  if (!currentMachine) return;

  // Update machine data
  currentMachine.name = document.getElementById("configName").value;
  currentMachine.machineType =
    document.getElementById("configMachineType").value;
  currentMachine.machineCode =
    document.getElementById("configMachineCode").value;
  currentMachine.latitude = document.getElementById("configLatitude").value;
  currentMachine.longitude = document.getElementById("configLongitude").value;
  currentMachine.depth = document.getElementById("configDepth").value;

  // Update category based on machine type
  currentMachine.category = currentMachine.machineType.toLowerCase();
  currentMachine.location = currentMachine.machineType;

  const saveBtn = document.querySelector(".modal-btn-save");
  saveBtn.innerHTML = "💾 SAVING...";
  saveBtn.disabled = true;

  setTimeout(() => {
    saveBtn.innerHTML = "✅ SAVED!";
    setTimeout(() => {
      closeConfigModal();
      renderMachines();
      saveBtn.innerHTML = "SAVE CHANGES";
      saveBtn.disabled = false;
    }, 1500);
  }, 1000);
}

function deleteMachine(btn, machineId) {
  const machine = machinesData.find((m) => m.id === machineId);
  if (confirm(`Are you sure you want to delete ${machine.name}?`)) {
    const card = btn.closest(".machine-card");
    btn.innerHTML = "⚠️ DELETING...";
    btn.style.background = "linear-gradient(135deg, #dc2626, #b91c1c)";
    btn.disabled = true;

    setTimeout(() => {
      card.style.animation = "fadeOut 0.8s ease-out forwards";
      setTimeout(() => {
        const index = machinesData.findIndex((m) => m.id === machineId);
        if (index > -1) {
          machinesData.splice(index, 1);
        }
        renderMachines();
      }, 800);
    }, 1500);
  }
}

// Search functionality
document.getElementById("searchInput").addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const filteredMachines = machinesData.filter(
    (machine) =>
      machine.name.toLowerCase().includes(searchTerm) ||
      machine.location.toLowerCase().includes(searchTerm) ||
      machine.function.toLowerCase().includes(searchTerm)
  );
  renderMachines(filteredMachines);
});

// Close modal when clicking outside
document.getElementById("configModal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeConfigModal();
  }
});

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  createParticles();
  renderMachines();

  // Add ripple effect to buttons
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("btn") ||
      e.target.classList.contains("modal-btn")
    ) {
      const ripple = document.createElement("span");
      const rect = e.target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");

      e.target.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    }
  });
});
