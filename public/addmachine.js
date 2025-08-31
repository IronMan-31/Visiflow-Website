let selectedMachineType = null;

// Create dynamic particle system
function createParticles() {
  const particleContainer = document.querySelector(".floating-particles");
  const particleCount = 25;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 15 + "s";
    particle.style.animationDuration = 12 + Math.random() * 8 + "s";

    // Random colors for particles
    const colors = [
      "rgba(59, 130, 246, 0.7)",
      "rgba(34, 197, 94, 0.6)",
      "rgba(168, 85, 247, 0.5)",
      "rgba(239, 68, 68, 0.4)",
      "rgba(245, 158, 11, 0.5)",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = color;
    particle.style.boxShadow = `0 0 12px ${color}`;

    particleContainer.appendChild(particle);
  }
}

function selectMachineType(element, type) {
  // Remove selected class from all machine types
  document.querySelectorAll(".machine-type").forEach((mt) => {
    mt.classList.remove("selected");
  });

  // Add selected class to clicked element
  element.classList.add("selected");
  selectedMachineType = type;

  // Check if form is valid to enable button
  validateForm();

  // Add selection animation
  element.style.animation = "pulse 0.6s ease-out";
  setTimeout(() => {
    element.style.animation = "";
  }, 600);
}

function validateForm() {
  const machineName = document.getElementById("machineName").value.trim();
  const machineCode = document.getElementById("machineCode").value.trim();
  const addBtn = document.getElementById("addMachineBtn");

  if (selectedMachineType && machineName && machineCode) {
    addBtn.disabled = false;
    addBtn.style.opacity = "1";
  } else {
    addBtn.disabled = true;
    addBtn.style.opacity = "0.5";
  }
}

function validateFormField(input) {
  const value = input.value.trim();
  if (value.length > 0) {
    input.classList.remove("invalid");
    input.classList.add("valid");
  } else {
    input.classList.remove("valid");
    input.classList.add("invalid");
  }
}

function generateMachineCode(name, type) {
  const typePrefix = {
    pravaah: "PRV",
    tarang: "TRG",
    drishti: "DRS",
    doordrishti: "DDR",
  };

  const nameCode = name.substring(0, 3).toUpperCase();
  const randomNum = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `${typePrefix[type]}-${nameCode}-${randomNum}`;
}

function addMachine() {
  const addBtn = document.getElementById("addMachineBtn");
  const machineName = document.getElementById("machineName").value.trim();
  const machineCode = document.getElementById("machineCode").value.trim();

  if (!selectedMachineType || !machineName || !machineCode) {
    // Show validation errors
    if (!machineName)
      document.getElementById("machineName").classList.add("invalid");
    if (!machineCode)
      document.getElementById("machineCode").classList.add("invalid");
    if (!selectedMachineType) {
      showNotification("Please select a machine type.", "error");
    }
    return;
  }

  // Add loading state
  console.log(machineName, machineCode, selectedMachineType);

  addBtn.classList.add("btn-loading");
  addBtn.disabled = true;

  // Show progress messages
  const steps = [
    "Validating machine configuration...",
    "Establishing connection...",
    "Registering device...",
    "Finalizing setup...",
  ];

  let currentStep = 0;
  const progressInterval = setInterval(() => {
    if (currentStep < steps.length) {
      addBtn.innerHTML = `<span class="loading-dots">${steps[currentStep]}</span>`;
      currentStep++;
    } else {
      clearInterval(progressInterval);
    }
  }, 800);

  // Simulate API call
  setTimeout(() => {
    clearInterval(progressInterval);

    // Success state
    addBtn.classList.remove("btn-loading");
    addBtn.style.background = "linear-gradient(135deg, #22c55e, #16a34a)";
    addBtn.innerHTML = "<span>🎉 Machine Added Successfully!</span>";

    // Create celebration effect
    createCelebrationEffect();

    setTimeout(() => {
      showSuccessNotification(
        `${machineName} (${machineCode}) has been successfully added to the system!`
      );

      // Reset form after success
      setTimeout(() => {
        resetForm();
      }, 3000);
    }, 1000);
  }, 3500);
}

function createCelebrationEffect() {
  const colors = ["#3b82f6", "#22c55e", "#a855f7", "#f59e0b", "#ef4444"];

  for (let i = 0; i < 40; i++) {
    const particle = document.createElement("div");
    particle.style.position = "fixed";
    particle.style.left = "50%";
    particle.style.top = "60%";
    particle.style.width = "8px";
    particle.style.height = "8px";
    particle.style.background =
      colors[Math.floor(Math.random() * colors.length)];
    particle.style.borderRadius = "50%";
    particle.style.pointerEvents = "none";
    particle.style.zIndex = "10001";
    particle.style.boxShadow = `0 0 10px ${
      colors[Math.floor(Math.random() * colors.length)]
    }`;

    const angle = (i / 40) * Math.PI * 2;
    const velocity = 100 + Math.random() * 150;
    const x = Math.cos(angle) * velocity;
    const y = Math.sin(angle) * velocity;

    particle.style.transform = `translate(-50%, -50%)`;

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.style.transition = "all 2s ease-out";
      particle.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0)`;
      particle.style.opacity = "0";
    }, 50);

    setTimeout(() => particle.remove(), 2500);
  }
}

function showSuccessNotification(message) {
  const notification = document.createElement("div");
  notification.className = "success-message";
  notification.innerHTML = `
                <span>✅</span>
                <span>${message}</span>
            `;

  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = "slideOutToRight 0.6s ease-in forwards";
    setTimeout(() => notification.remove(), 600);
  }, 5000);
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  const bgColor =
    type === "error"
      ? "linear-gradient(135deg, #ef4444, #dc2626)"
      : "linear-gradient(135deg, #3b82f6, #1d4ed8)";

  notification.style.cssText = `
                position: fixed;
                top: 30px;
                right: 30px;
                background: ${bgColor};
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                animation: slideInFromRight 0.5s ease-out;
                font-weight: 500;
            `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOutToRight 0.5s ease-in forwards";
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

function resetForm() {
  // Reset form fields
  document.getElementById("machineName").value = "";
  document.getElementById("machineCode").value = "";

  // Reset machine type selection
  document.querySelectorAll(".machine-type").forEach((mt) => {
    mt.classList.remove("selected");
  });
  selectedMachineType = null;

  // Reset button
  const addBtn = document.getElementById("addMachineBtn");
  addBtn.style.background = "linear-gradient(135deg, #3b82f6, #1d4ed8)";
  addBtn.innerHTML = "<span>+ Add Machine</span>";
  addBtn.disabled = true;
  addBtn.style.opacity = "0.5";

  // Reset form validation classes
  document.querySelectorAll(".form-input").forEach((input) => {
    input.classList.remove("valid", "invalid");
  });
}

function goBack() {
  // Add exit animation
  const container = document.querySelector(".container");
  container.style.animation = "slideOutToRight 0.6s ease-in forwards";

  window.location.href = "/";
}

// Add event listeners for form validation
document.getElementById("machineName").addEventListener("input", function () {
  validateFormField(this);
  validateForm();

  // Auto-generate machine code if machine type is selected
  const machineName = this.value.trim();
  const machineCodeInput = document.getElementById("machineCode");

  if (machineName && selectedMachineType && !machineCodeInput.value) {
    const code = generateMachineCode(machineName, selectedMachineType);
    machineCodeInput.value = code;
    validateFormField(machineCodeInput);
    validateForm();
  }
});

document.getElementById("machineCode").addEventListener("input", function () {
  validateFormField(this);
  validateForm();
});

// Add keyboard shortcuts
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    goBack();
  }
  if (e.key === "Enter" && !document.getElementById("addMachineBtn").disabled) {
    addMachine();
  }
});

// Add ripple effect to buttons
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple");

    this.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Enhanced focus animations
document.querySelectorAll(".form-input").forEach((input) => {
  input.addEventListener("focus", function () {
    this.style.transform = "translateY(-3px)";
    this.parentElement.querySelector(".form-label").style.color = "#3b82f6";
  });

  input.addEventListener("blur", function () {
    this.style.transform = "translateY(0)";
    this.parentElement.querySelector(".form-label").style.color = "#d1d5db";
  });
});

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  createParticles();

  // Auto-focus first input after animations
  setTimeout(() => {
    document.getElementById("machineName").focus();
  }, 1000);

  // Add staggered entrance animations for machine types
  const machineTypes = document.querySelectorAll(".machine-type");
  machineTypes.forEach((type, index) => {
    type.style.opacity = "0";
    type.style.transform = "translateY(30px)";

    setTimeout(() => {
      type.style.transition = "all 0.6s ease-out";
      type.style.opacity = "1";
      type.style.transform = "translateY(0)";
    }, 800 + index * 150);
  });
});

// Add CSS for additional animations
const additionalStyles = document.createElement("style");
additionalStyles.textContent = `
            @keyframes slideOutToRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }
            
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
            }
            
            @keyframes rippleEffect {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .loading-dots::after {
                content: '';
                animation: loadingDots 1.5s infinite;
            }
            
            @keyframes loadingDots {
                0%, 20% { content: '.'; }
                40% { content: '..'; }
                60%, 100% { content: '...'; }
            }
            
            .machine-type:hover .machine-type-icon {
                animation: rotate 2s linear infinite;
            }
            
            .selected .machine-type-icon {
                animation: rotate 3s ease-in-out infinite;
                box-shadow: 0 0 25px rgba(59, 130, 246, 0.6);
            }
            
            .form-group:focus-within .form-label {
                transform: translateY(-2px);
                transition: all 0.3s ease;
            }
            
            .btn:hover {
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
            }
            
            .btn-primary:hover {
                background: linear-gradient(135deg, #1d4ed8, #1e40af);
            }
        `;
document.head.appendChild(additionalStyles);

console.log("Add Machine page initialized with full page layout! 🚀");
