let depthChart, rainfallChart, velocityChart;
let currentRanges = {
  depth: "1d",
  rainfall: "1d",
  velocity: "1d",
};
let allData = generateMockData();

// Media archive variables
let currentMediaType = "photos";
let currentMediaTimeRange = "today";
let selectedMediaItem = null;
let mediaData = {
  photos: generateMockPhotos(),
  videos: generateMockVideos(),
};

Chart.register(window["chartjs-plugin-annotation"]);

// Add data downsampling function
function downsampleData(data, maxPoints = 200) {
  if (data.length <= maxPoints) {
    return data;
  }

  const factor = Math.ceil(data.length / maxPoints);
  const downsampled = [];

  for (let i = 0; i < data.length; i += factor) {
    const chunk = data.slice(i, i + factor);

    if (chunk.length === 0) continue;

    // For depth/rainfall data (with x, y properties)
    if (chunk[0].hasOwnProperty("y")) {
      const avgY =
        chunk.reduce((sum, point) => sum + point.y, 0) / chunk.length;
      downsampled.push({
        x: chunk[Math.floor(chunk.length / 2)].x, // Use middle timestamp
        y: avgY,
      });
    }
    // For velocity data (with surface, average properties)
    else if (chunk[0].hasOwnProperty("surface")) {
      const avgSurface =
        chunk.reduce((sum, point) => sum + point.surface, 0) / chunk.length;
      const avgAverage =
        chunk.reduce((sum, point) => sum + point.average, 0) / chunk.length;
      downsampled.push({
        x: chunk[Math.floor(chunk.length / 2)].x,
        surface: avgSurface,
        average: avgAverage,
      });
    }
  }

  return downsampled;
}

// Generate mock media data
function generateMockPhotos() {
  const photos = [];
  const now = new Date();

  for (let i = 0; i < 15; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    photos.push({
      id: `photo_${i + 1}`,
      type: "photo",
      timestamp: timestamp,
      filename: `river_photo_${timestamp.toISOString().split("T")[0]}_${String(
        i + 1
      ).padStart(3, "0")}.jpg`,
      size: (Math.random() * 3 + 1).toFixed(1) + "MB",
      description: `River monitoring photo captured at depth ${(
        2 + Math.random()
      ).toFixed(2)}m`,
    });
  }

  return photos.sort((a, b) => b.timestamp - a.timestamp);
}

function generateMockVideos() {
  const videos = [];
  const now = new Date();

  for (let i = 0; i < 8; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    videos.push({
      id: `video_${i + 1}`,
      type: "video",
      timestamp: timestamp,
      filename: `river_video_${timestamp.toISOString().split("T")[0]}_${String(
        i + 1
      ).padStart(3, "0")}.mp4`,
      duration: `${Math.floor(Math.random() * 120 + 30)}s`,
      size: (Math.random() * 30 + 20).toFixed(1) + "MB",
      description: `${Math.floor(
        Math.random() * 120 + 30
      )}-second monitoring clip with velocity analysis`,
    });
  }

  return videos.sort((a, b) => b.timestamp - a.timestamp);
}

// Generate mock data for different time ranges
function generateMockData() {
  const data = { depth: {}, rainfall: {}, velocity: {} };
  const now = new Date();

  // Generate depth data
  ["1m", "1w", "1d", "1h"].forEach((range) => {
    const intervals = {
      "1m": { count: 30 * 24 * 4, interval: 15 * 60 * 1000 },
      "1w": { count: 7 * 24 * 4, interval: 15 * 60 * 1000 },
      "1d": { count: 24 * 4, interval: 15 * 60 * 1000 },
      "1h": { count: 4, interval: 15 * 60 * 1000 },
    };

    data.depth[range] = [];
    data.rainfall[range] = [];
    data.velocity[range] = [];

    for (let i = intervals[range].count; i >= 0; i--) {
      const date = new Date(now.getTime() - i * intervals[range].interval);

      const baseDepth = 2.3;
      const depthVariation = 1 + Math.random() * 0.3 - 0.15;
      data.depth[range].push({
        x: date,
        y: Math.max(0.5, Math.min(4.0, baseDepth + depthVariation)),
      });

      // Rainfall data (sporadic)
      const rainIntensity = Math.random() < 0.1 ? Math.random() * 15 : 0;
      data.rainfall[range].push({
        x: date,
        y: rainIntensity,
      });

      // Velocity data
      const baseSurfaceVel = 1.2;
      const baseAvgVel = 0.8;
      const velVariation = Math.random() * 0.2 - 0.1;
      data.velocity[range].push({
        surface: Math.max(0, Math.min(3.0, baseSurfaceVel + velVariation)),
        average: Math.max(0, Math.min(2.5, baseAvgVel + velVariation * 0.7)),
        x: date,
      });
    }
  });

  return data;
}

// Initialize all charts
function initCharts() {
  initDepthChart();
  initRainfallChart();
  initVelocityChart();
  updateStats();
  updateLastUpdateTime();
  updateDataPointsCount();
  updateMediaGrid();
}

// Initialize depth chart
function initDepthChart() {
  const ctx = document.getElementById("depthChart").getContext("2d");

  const rawData = allData.depth[currentRanges.depth];
  const downsampledData = downsampleData(rawData, 144);

  depthChart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "River Depth",
          data: downsampledData,
          borderColor: "oklch(0.488 0.243 264.376)",
          backgroundColor: "oklch(0.488 0.243 264.376 / 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "oklch(0.2029 0.0037 345.62)",
          titleColor: "oklch(0.9851 0 0)",
          bodyColor: "oklch(0.9851 0 0)",
          borderColor: "oklch(1 0 0 / 10%)",
          borderWidth: 1,
          displayColors: false,
          callbacks: {
            title: function (context) {
              return new Date(context[0].parsed.x).toLocaleString();
            },
            label: function (context) {
              return `Depth: ${context.parsed.y.toFixed(3)}m`;
            },
          },
        },
        annotation: {
          annotations: {
            alertLine: {
              type: "line",
              yMin: 3.0,
              yMax: 3.0,
              borderColor: "oklch(0.769 0.188 70.08)",
              borderWidth: 2,
              borderDash: [5, 5],
              label: {
                content: "Alert Level",
                enabled: true,
                position: "end",
              },
            },
            criticalLine: {
              type: "line",
              yMin: 3.5,
              yMax: 3.5,
              borderColor: "oklch(0.5961 0.2006 36.48)",
              borderWidth: 2,
              borderDash: [5, 5],
              label: {
                content: "Critical Level",
                enabled: true,
                position: "end",
              },
            },
          },
        },
      },
      scales: {
        x: {
          type: "time",
          time: {
            displayFormats: {
              minute: "HH:mm",
              hour: "HH:mm",
              day: "MM/dd",
              week: "MM/dd",
              month: "MM/dd",
            },
          },
          grid: {
            color: "oklch(0.708 0 0 / 0.1)",
            drawBorder: false,
          },
          ticks: {
            color: "oklch(0.708 0 0)",
            maxRotation: 45,
            minRotation: 45,
          },
        },
        y: {
          beginAtZero: false,
          grid: {
            color: "oklch(0.708 0 0 / 0.1)",
            drawBorder: false,
          },
          ticks: {
            color: "oklch(0.708 0 0)",
            callback: function (value) {
              return value.toFixed(1) + "m";
            },
          },
          title: {
            display: true,
            text: "Depth (meters)",
            color: "oklch(0.708 0 0)",
          },
        },
      },
    },
  });
}

// Initialize rainfall chart
function initRainfallChart() {
  const ctx = document.getElementById("rainfallChart").getContext("2d");

  const rawData = allData.rainfall[currentRanges.rainfall];
  const downsampledData = downsampleData(rawData, 144);

  rainfallChart = new Chart(ctx, {
    type: "bar",
    data: {
      datasets: [
        {
          label: "Rainfall",
          data: downsampledData,
          backgroundColor: "oklch(0.696 0.17 162.48 / 0.8)",
          borderColor: "oklch(0.696 0.17 162.48)",
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "oklch(0.2029 0.0037 345.62)",
          titleColor: "oklch(0.9851 0 0)",
          bodyColor: "oklch(0.9851 0 0)",
          borderColor: "oklch(1 0 0 / 10%)",
          borderWidth: 1,
          displayColors: false,
          callbacks: {
            title: function (context) {
              return new Date(context[0].parsed.x).toLocaleString();
            },
            label: function (context) {
              return `Rainfall: ${context.parsed.y.toFixed(1)}mm/h`;
            },
          },
        },
        annotation: {
          annotations: {
            heavyRainLine: {
              type: "line",
              yMin: 10,
              yMax: 10,
              borderColor: "oklch(0.769 0.188 70.08)",
              borderWidth: 2,
              borderDash: [5, 5],
              label: {
                content: "Heavy Rain",
                enabled: true,
                position: "end",
              },
            },
          },
        },
      },
      scales: {
        x: {
          type: "time",
          time: {
            displayFormats: {
              minute: "HH:mm",
              hour: "HH:mm",
              day: "MM/dd",
              week: "MM/dd",
              month: "MM/dd",
            },
          },
          grid: {
            color: "oklch(0.708 0 0 / 0.1)",
            drawBorder: false,
          },
          ticks: {
            color: "oklch(0.708 0 0)",
            maxRotation: 45,
            minRotation: 45,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "oklch(0.708 0 0 / 0.1)",
            drawBorder: false,
          },
          ticks: {
            color: "oklch(0.708 0 0)",
            callback: function (value) {
              return value.toFixed(1) + "mm/h";
            },
          },
          title: {
            display: true,
            text: "Rainfall (mm/hour)",
            color: "oklch(0.708 0 0)",
          },
        },
      },
    },
  });
}

// Initialize velocity chart
function initVelocityChart() {
  const ctx = document.getElementById("velocityChart").getContext("2d");

  const rawData = allData.velocity[currentRanges.velocity];
  const downsampledData = downsampleData(rawData, 144);

  velocityChart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Average Velocity",
          data: downsampledData.map((d) => ({ x: d.x, y: d.average })),
          borderColor: "oklch(0.55 0.22 180)",
          backgroundColor: "oklch(0.55 0.22 180 / 0.1)",
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "oklch(0.2029 0.0037 345.62)",
          titleColor: "oklch(0.9851 0 0)",
          bodyColor: "oklch(0.9851 0 0)",
          borderColor: "oklch(1 0 0 / 10%)",
          borderWidth: 1,
          displayColors: true,
          callbacks: {
            title: function (context) {
              return new Date(context[0].parsed.x).toLocaleString();
            },
            label: function (context) {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(
                2
              )}m/s`;
            },
          },
        },
        annotation: {
          annotations: {
            criticalVelLine: {
              type: "line",
              yMin: 2.5,
              yMax: 2.5,
              borderColor: "oklch(0.5961 0.2006 36.48)",
              borderWidth: 2,
              borderDash: [5, 5],
              label: {
                content: "Critical Velocity",
                enabled: true,
                position: "end",
              },
            },
          },
        },
      },
      scales: {
        x: {
          type: "time",
          time: {
            displayFormats: {
              minute: "HH:mm",
              hour: "HH:mm",
              day: "MM/dd",
              week: "MM/dd",
              month: "MM/dd",
            },
          },
          grid: {
            color: "oklch(0.708 0 0 / 0.1)",
            drawBorder: false,
          },
          ticks: {
            color: "oklch(0.708 0 0)",
            maxRotation: 45,
            minRotation: 45,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "oklch(0.708 0 0 / 0.1)",
            drawBorder: false,
          },
          ticks: {
            color: "oklch(0.708 0 0)",
            callback: function (value) {
              return value.toFixed(1) + "m/s";
            },
          },
          title: {
            display: true,
            text: "Velocity (m/s)",
            color: "oklch(0.708 0 0)",
          },
        },
      },
    },
  });
}

// Set time range for specific chart with downsampling
function setTimeRange(chartType, range) {
  currentRanges[chartType] = range;

  // Update active button
  const timeControls = document.getElementById(`${chartType}TimeControls`);
  timeControls.querySelectorAll(".time-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  // Hide custom range
  document.getElementById(`${chartType}CustomRange`).classList.remove("show");

  // Define max points based on time range
  const maxPointsConfig = {
    "1h": 60, // Show all points for 1 hour
    "1d": 144, // Reduce to ~144 points for 1 day
    "1w": 168, // Reduce to ~168 points for 1 week
    "1m": 200,
  };

  const maxPoints = maxPointsConfig[range] || 200;

  // Update chart data with downsampling
  if (chartType === "depth") {
    const rawData = allData.depth[range];
    const downsampledData = downsampleData(rawData, maxPoints);
    depthChart.data.datasets[0].data = downsampledData;
    depthChart.update();
  } else if (chartType === "rainfall") {
    const rawData = allData.rainfall[range];
    const downsampledData = downsampleData(rawData, maxPoints);
    rainfallChart.data.datasets[0].data = downsampledData;
    rainfallChart.update();
  } else if (chartType === "velocity") {
    const rawData = allData.velocity[range];
    const downsampledData = downsampleData(rawData, maxPoints);

    velocityChart.data.datasets[0].data = downsampledData.map((d) => ({
      x: d.x,
      y: d.surface,
    }));
    velocityChart.update();
  }

  updateStats();
  updateDataPointsCount();
}

// Toggle custom range
function toggleCustomRange(chartType) {
  const customRange = document.getElementById(`${chartType}CustomRange`);
  customRange.classList.toggle("show");

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  document.getElementById(`${chartType}StartDate`).value = yesterday
    .toISOString()
    .slice(0, 16);
  document.getElementById(`${chartType}EndDate`).value = now
    .toISOString()
    .slice(0, 16);

  const timeControls = document.getElementById(`${chartType}TimeControls`);
  timeControls.querySelectorAll(".time-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");
}

// Apply custom range with proper data filtering and downsampling
function applyCustomRange(chartType) {
  const startDate = new Date(
    document.getElementById(`${chartType}StartDate`).value
  );
  const endDate = new Date(
    document.getElementById(`${chartType}EndDate`).value
  );

  if (startDate >= endDate) {
    alert("Start date must be before end date");
    return;
  }

  // Filter data from the largest dataset (1m) for most granular data
  const maxPoints = 200; // For custom ranges, limit to 200 points

  if (chartType === "depth") {
    const filteredData = allData.depth["1m"].filter((point) => {
      const pointDate = new Date(point.x);
      return pointDate >= startDate && pointDate <= endDate;
    });

    if (filteredData.length === 0) {
      alert("No data found in selected date range");
      return;
    }

    const downsampledData = downsampleData(filteredData, maxPoints);
    depthChart.data.datasets[0].data = downsampledData;
    depthChart.update();
  } else if (chartType === "rainfall") {
    const filteredData = allData.rainfall["1m"].filter((point) => {
      const pointDate = new Date(point.x);
      return pointDate >= startDate && pointDate <= endDate;
    });

    if (filteredData.length === 0) {
      alert("No data found in selected date range");
      return;
    }

    const downsampledData = downsampleData(filteredData, maxPoints);
    rainfallChart.data.datasets[0].data = downsampledData;
    rainfallChart.update();
  } else if (chartType === "velocity") {
    const filteredData = allData.velocity["1m"].filter((point) => {
      const pointDate = new Date(point.x);
      return pointDate >= startDate && pointDate <= endDate;
    });

    if (filteredData.length === 0) {
      alert("No data found in selected date range");
      return;
    }

    const downsampledData = downsampleData(filteredData, maxPoints);

    velocityChart.data.datasets[0].data = downsampledData.map((d) => ({
      x: d.x,
      y: d.surface,
    }));
    velocityChart.data.datasets[1].data = downsampledData.map((d) => ({
      x: d.x,
      y: d.average,
    }));
    velocityChart.update();
  }

  currentRanges[chartType] = "custom";
  updateStats();
  updateDataPointsCount();
}

// Update statistics
function updateStats() {
  const currentDepthData = depthChart.data.datasets[0].data;
  const currentRainfallData = rainfallChart.data.datasets[0].data;

  if (currentDepthData.length === 0) return;

  const latestDepth = currentDepthData[currentDepthData.length - 1].y;
  const avgDepth =
    currentDepthData.reduce((sum, point) => sum + point.y, 0) /
    currentDepthData.length;

  document.getElementById("currentLevel").textContent =
    latestDepth.toFixed(3) + "m";
  document.getElementById("averageLevel").textContent =
    avgDepth.toFixed(3) + "m";

  // Update status
  const statusElement = document.getElementById("currentStatus");
  const statusDot = document.querySelector(".status-dot");

  if (latestDepth >= 3.5) {
    statusElement.textContent = "CRITICAL";
    statusElement.style.color = "var(--destructive)";
    statusDot.className = "status-dot alert-status";
  } else if (latestDepth >= 3.0) {
    statusElement.textContent = "WARNING";
    statusElement.style.color = "var(--warning)";
    statusDot.className = "status-dot warning-status";
  } else {
    statusElement.textContent = "NORMAL";
    statusElement.style.color = "var(--success)";
    statusDot.className = "status-dot";
  }
}

// Update data points count
function updateDataPointsCount() {}

// Update last update time
function updateLastUpdateTime() {
  const now = new Date();
  document.getElementById("lastUpdate").textContent = now.toLocaleTimeString();
}

// Media functions
function switchMediaType(type) {
  currentMediaType = type;

  // Update button states
  document
    .getElementById("photosBtn")
    .classList.toggle("active", type === "photos");
  document
    .getElementById("videosBtn")
    .classList.toggle("active", type === "videos");

  updateMediaGrid();
}

function setMediaTimeRange(range) {
  currentMediaTimeRange = range;

  // Update button states
  document.querySelectorAll(".media-time-controls .time-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  updateMediaGrid();
}

function applyDateFilter() {
  const startDate = document.getElementById("mediaDateStart").value;
  const endDate = document.getElementById("mediaDateEnd").value;

  if (startDate && endDate) {
    currentMediaTimeRange = "custom";
    updateMediaGrid(new Date(startDate), new Date(endDate));
  }
}

function updateMediaGrid(customStart = null, customEnd = null) {
  const mediaGrid = document.getElementById("mediaGrid");
  const mediaArray = mediaData[currentMediaType];

  // Filter by time range
  let filteredMedia = mediaArray;
  const now = new Date();

  if (customStart && customEnd) {
    filteredMedia = mediaArray.filter(
      (item) => item.timestamp >= customStart && item.timestamp <= customEnd
    );
  } else {
    switch (currentMediaTimeRange) {
      case "today":
        const startOfDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        filteredMedia = mediaArray.filter(
          (item) => item.timestamp >= startOfDay
        );
        break;
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredMedia = mediaArray.filter((item) => item.timestamp >= weekAgo);
        break;
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredMedia = mediaArray.filter((item) => item.timestamp >= monthAgo);
        break;
      case "all":
      default:
        // No filtering
        break;
    }
  }

  // Sort by timestamp (newest first)
  filteredMedia.sort((a, b) => b.timestamp - a.timestamp);

  // Generate grid HTML
  if (filteredMedia.length === 0) {
    mediaGrid.innerHTML = `
            <div class="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="m9 9 3 3 3-3"/>
              </svg>
              <h3>No ${currentMediaType} found</h3>
              <p>No ${currentMediaType} available for the selected time range</p>
            </div>
          `;
    return;
  }

  mediaGrid.innerHTML = filteredMedia
    .map(
      (item) => `
          <div class="media-item" onclick="selectMediaItem('${
            item.id
          }')" id="media-${item.id}">
            <div class="media-thumbnail">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${
                  item.type === "photo"
                    ? '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>'
                    : '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>'
                }
              </svg>
              <p>${item.type === "photo" ? "PHOTO" : "VIDEO"}</p>
              <p style="font-size: 0.6rem">${item.size}</p>
            </div>
            <div class="media-timestamp">
              ${item.timestamp.toLocaleDateString()}<br>
              ${item.timestamp.toLocaleTimeString()}
            </div>
          </div>
        `
    )
    .join("");
}

function selectMediaItem(itemId) {
  selectedMediaItem = itemId;

  // Update visual selection
  document.querySelectorAll(".media-item").forEach((item) => {
    item.classList.remove("selected");
  });
  document.getElementById(`media-${itemId}`).classList.add("selected");

  // Find the item data
  const allMedia = [...mediaData.photos, ...mediaData.videos];
  const item = allMedia.find((m) => m.id === itemId);

  // Update preview
  const preview = document.getElementById("mediaPreview");
  preview.innerHTML = `
          <div class="media-preview-placeholder">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              ${
                item.type === "photo"
                  ? '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>'
                  : '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>'
              }
            </svg>
            <h3>${item.filename}</h3>
            <p>${item.description}</p>
            <div style="margin-top: 1rem; font-size: 0.875rem; color: var(--muted-foreground);">
              <p><strong>Captured:</strong> ${item.timestamp.toLocaleString()}</p>
              <p><strong>Size:</strong> ${item.size}</p>
              ${
                item.duration
                  ? `<p><strong>Duration:</strong> ${item.duration}</p>`
                  : ""
              }
            </div>
            <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: center;">
              <button class="time-btn" onclick="downloadMedia('${item.id}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download
              </button>
              <button class="time-btn" onclick="deleteMedia('${
                item.id
              }')" style="background-color: var(--destructive); border-color: var(--destructive);">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="m19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        `;
}

function downloadMedia(itemId) {
  const allMedia = [...mediaData.photos, ...mediaData.videos];
  const item = allMedia.find((m) => m.id === itemId);
  alert(`Downloading ${item.filename}...`);
}

function deleteMedia(itemId) {
  if (confirm("Are you sure you want to delete this media file?")) {
    // Remove from data
    mediaData.photos = mediaData.photos.filter((item) => item.id !== itemId);
    mediaData.videos = mediaData.videos.filter((item) => item.id !== itemId);

    // Update grid
    updateMediaGrid();

    // Clear preview if this item was selected
    if (selectedMediaItem === itemId) {
      selectedMediaItem = null;
      document.getElementById("mediaPreview").innerHTML = `
              <div class="media-preview-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
                <h3>Select media to preview</h3>
                <p>Choose a photo or video from the archive above to view it here</p>
              </div>
            `;
    }
  }
}

// Simulate real-time updates with downsampling awareness
function simulateRealtimeUpdate() {
  const now = new Date();
  const baseDepth = 2.4;
  const depthVariation = Math.random() * 0.2 - 0.1;
  const rainIntensity = Math.random() < 0.05 ? Math.random() * 8 : 0;
  const baseSurfaceVel = 1.2;
  const baseAvgVel = 0.8;
  const velVariation = Math.random() * 0.15 - 0.075;

  const newDepthPoint = {
    x: now,
    y: Math.max(0.5, Math.min(4.0, baseDepth + depthVariation)),
  };

  const newRainfallPoint = {
    x: now,
    y: rainIntensity,
  };

  const newVelocityPoint = {
    x: now,
    surface: Math.max(0, Math.min(3.0, baseSurfaceVel + velVariation)),
    average: Math.max(0, Math.min(2.5, baseAvgVel + velVariation * 0.7)),
  };

  // Update charts if showing recent data
  if (currentRanges.depth === "1h" || currentRanges.depth === "1d") {
    depthChart.data.datasets[0].data.push(newDepthPoint);

    const maxPoints = currentRanges.depth === "1h" ? 60 : 144;
    if (depthChart.data.datasets[0].data.length > maxPoints) {
      depthChart.data.datasets[0].data.shift();
    }
    depthChart.update("none");
  }

  if (currentRanges.rainfall === "1h" || currentRanges.rainfall === "1d") {
    rainfallChart.data.datasets[0].data.push(newRainfallPoint);

    const maxPoints = currentRanges.rainfall === "1h" ? 60 : 144;
    if (rainfallChart.data.datasets[0].data.length > maxPoints) {
      rainfallChart.data.datasets[0].data.shift();
    }
    rainfallChart.update("none");
  }

  if (currentRanges.velocity === "1h" || currentRanges.velocity === "1d") {
    velocityChart.data.datasets[0].data.push({
      x: now,
      y: newVelocityPoint.surface,
    });

    const maxPoints = currentRanges.velocity === "1h" ? 60 : 144;
    if (velocityChart.data.datasets[0].data.length > maxPoints) {
      velocityChart.data.datasets[0].data.shift();
      velocityChart.data.datasets[1].data.shift();
    }
    velocityChart.update("none");
  }

  updateStats();
  updateDataPointsCount();
  updateLastUpdateTime();
}

// Export data functionality
function exportData() {
  const depthData = depthChart.data.datasets[0].data;
  const rainfallData = rainfallChart.data.datasets[0].data;
  const velocityData = velocityChart.data.datasets[0].data;

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Timestamp,Depth (m),Rainfall (mm/h),Average Velocity (m/s)\n";

  const maxLength = Math.max(
    depthData.length,
    rainfallData.length,
    velocityData.length
  );

  for (let i = 0; i < maxLength; i++) {
    const timestamp =
      depthData[i]?.x || rainfallData[i]?.x || velocityData[i]?.x;
    const depth = depthData[i]?.y.toFixed(3) || "";
    const rainfall = rainfallData[i]?.y.toFixed(1) || "";
    const surfaceVel =
      velocityChart.data.datasets[0].data[i]?.y.toFixed(2) || "";
    const avgVel = velocityChart.data.datasets[1].data[i]?.y.toFixed(2) || "";

    const row = `${new Date(
      timestamp
    ).toISOString()},${depth},${rainfall},${surfaceVel},${avgVel}`;
    csvContent += row + "\n";
  }

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `river_monitoring_data_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Toggle fullscreen functionality for charts
function toggleFullscreen(chartType) {
  const chartSection = event.target.closest(".chart-section");
  if (!document.fullscreenElement) {
    chartSection.requestFullscreen().then(() => {
      chartSection.style.height = "100vh";
      chartSection.style.display = "flex";
      chartSection.style.flexDirection = "column";
      document
        .querySelector(`#${chartType}Chart`)
        .closest(".chart-container").style.flex = "1";
      document
        .querySelector(`#${chartType}Chart`)
        .closest(".chart-container").style.height = "auto";

      if (chartType === "depth") depthChart.resize();
      else if (chartType === "rainfall") rainfallChart.resize();
      else if (chartType === "velocity") velocityChart.resize();
    });
  } else {
    document.exitFullscreen().then(() => {
      chartSection.style.height = "";
      chartSection.style.display = "";
      chartSection.style.flexDirection = "";
      document
        .querySelector(`#${chartType}Chart`)
        .closest(".chart-container").style.flex = "";
      document
        .querySelector(`#${chartType}Chart`)
        .closest(".chart-container").style.height = "500px";

      if (chartType === "depth") depthChart.resize();
      else if (chartType === "rainfall") rainfallChart.resize();
      else if (chartType === "velocity") velocityChart.resize();
    });
  }
}

// Initialize everything when page loads
document.addEventListener("DOMContentLoaded", function () {
  initCharts();
  setInterval(simulateRealtimeUpdate, 5000);
  setInterval(updateLastUpdateTime, 1000);

  // Add fullscreen buttons to all chart headers
  document.getElementById("depthTimeControls").innerHTML += `
          <button class="time-btn" onclick="toggleFullscreen('depth')" title="Toggle Fullscreen">
            Fullscreen
          </button>
        `;

  document.getElementById("rainfallTimeControls").innerHTML += `
          <button class="time-btn" onclick="toggleFullscreen('rainfall')" title="Toggle Fullscreen">
            Fullscreen
          </button>
        `;

  document.getElementById("velocityTimeControls").innerHTML += `
          <button class="time-btn" onclick="toggleFullscreen('velocity')" title="Toggle Fullscreen">
            Fullscreen
          </button>
        `;

  // Add download and refresh buttons to header
  document.querySelector(".header-description").innerHTML += `
          <button onclick="exportData()" style="
            margin-left: 1rem;
            padding: 0.5rem 1rem;
            background-color: var(--success);
            color: var(--foreground);
            border: none;
            border-radius: var(--radius);
            cursor: pointer;
            font-size: 0.75rem;
            font-weight: 500;
            text-transform: uppercase;
            transition: opacity 0.3s ease;
          " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
            Download CSV
          </button>
          <button onclick="location.reload()" style="
            margin-left: 0.5rem;
            padding: 0.5rem 1rem;
            background-color: var(--primary);
            color: var(--primary-foreground);
            border: none;
            border-radius: var(--radius);
            cursor: pointer;
            font-size: 0.75rem;
            font-weight: 500;
            text-transform: uppercase;
            transition: opacity 0.3s ease;
          " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
            Refresh
          </button>
        `;
});

// Handle window resize
window.addEventListener("resize", function () {
  if (depthChart) depthChart.resize();
  if (rainfallChart) rainfallChart.resize();
  if (velocityChart) velocityChart.resize();
});

// Add keyboard shortcuts
document.addEventListener("keydown", function (event) {
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case "1":
        event.preventDefault();
        setTimeRange("depth", "1h");
        break;
      case "2":
        event.preventDefault();
        setTimeRange("depth", "1d");
        break;
      case "3":
        event.preventDefault();
        setTimeRange("depth", "1w");
        break;
      case "4":
        event.preventDefault();
        setTimeRange("depth", "1m");
        break;
      case "r":
        event.preventDefault();
        // Refresh data
        allData = generateMockData();
        mediaData = {
          photos: generateMockPhotos(),
          videos: generateMockVideos(),
        };

        // Update all charts with downsampling
        const depthMaxPoints =
          currentRanges.depth === "1h"
            ? 60
            : currentRanges.depth === "1d"
            ? 144
            : currentRanges.depth === "1w"
            ? 168
            : 200;
        const downsampledDepth = downsampleData(
          allData.depth[currentRanges.depth],
          depthMaxPoints
        );
        depthChart.data.datasets[0].data = downsampledDepth;
        depthChart.update();

        const rainfallMaxPoints =
          currentRanges.rainfall === "1h"
            ? 60
            : currentRanges.rainfall === "1d"
            ? 144
            : currentRanges.rainfall === "1w"
            ? 168
            : 200;
        const downsampledRainfall = downsampleData(
          allData.rainfall[currentRanges.rainfall],
          rainfallMaxPoints
        );
        rainfallChart.data.datasets[0].data = downsampledRainfall;
        rainfallChart.update();

        const velocityMaxPoints =
          currentRanges.velocity === "1h"
            ? 60
            : currentRanges.velocity === "1d"
            ? 144
            : currentRanges.velocity === "1w"
            ? 168
            : 200;
        const downsampledVelocity = downsampleData(
          allData.velocity[currentRanges.velocity],
          velocityMaxPoints
        );
        velocityChart.data.datasets[0].data = downsampledVelocity.map((d) => ({
          x: d.x,
          y: d.surface,
        }));
        velocityChart.data.datasets[1].data = downsampledVelocity.map((d) => ({
          x: d.x,
          y: d.average,
        }));
        velocityChart.update();

        updateStats();
        updateDataPointsCount();
        updateMediaGrid();
        break;
    }
  }
});

console.log(
  "River Monitoring System with Data Downsampling initialized successfully!"
);
