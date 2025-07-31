document.addEventListener("DOMContentLoaded", () => {
  const locationInput = document.getElementById("locationInput");
  const previewField = document.getElementById("previewSelections");
  const venueSelectors = document.getElementById("venueSelectors");
  const customVenueContainer = document.getElementById("customVenueContainer");
  let venueOptions = ["Cafe", "Museum", "Park", "Theater", "Restaurant"];

  // Load saved custom venues from localStorage
const savedCustomVenues = JSON.parse(localStorage.getItem("customVenues")) || [];
  
  // Sanitize and deduplicate the combined list
const mergedSet = new Set(
  [...venueOptions, ...savedCustomVenues].map(v =>
    v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
  )
);

venueOptions = Array.from(mergedSet).sort((a, b) => a.localeCompare(b));
  
  const attachCustomListeners = () => {
    const customInputs = document.querySelectorAll(".custom-value");
    customInputs.forEach(input => {
      input.removeEventListener("input", updatePreview); // Prevent duplicates
      input.addEventListener("input", updatePreview);
    });
  };

  const updatePreview = () => {
    const location = locationInput.value.trim() || "[no location]";
    const dropdownVenues = Array.from(document.querySelectorAll(".venue-type"))
      .map(select => select.value)
      .filter(v => v);
    const customVenues = Array.from(document.querySelectorAll(".custom-value"))
      .map(input => input.value.trim())
      .filter(v => v);
    const allVenues = [...dropdownVenues, ...customVenues];
    previewField.textContent = `📍 Trip to ${location} with: ${allVenues.join(", ") || "no venues yet"}`;
    previewField.classList.add("pulse");
    setTimeout(() => previewField.classList.remove("pulse"), 1200);
  };
  
  const getUsedDropdownValues = () =>
    Array.from(document.querySelectorAll(".venue-type"))
      .map(select => select.value)
      .filter(v => v);

  const populateDropdown = select => {
    const used = getUsedDropdownValues();
    const available = venueOptions.filter(v => !used.includes(v));
    select.innerHTML = `<option value="">Select a venue type</option>` +
      available.map(v => `<option value="${v}">${v}</option>`).join("");
  };

  const createDropdownRow = () => {
    const row = document.createElement("div");
    row.className = "dropdown-row";

    const select = document.createElement("select");
    select.className = "venue-type";
    populateDropdown(select);
    select.addEventListener("change", updatePreview);

    const addBtn = document.createElement("button");
    addBtn.className = "add-btn";
    addBtn.textContent = "+";
    addBtn.addEventListener("click", createDropdownRow);

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "-";
    removeBtn.addEventListener("click", () => {
      row.remove();
      updatePreview();
    });

    row.appendChild(select);
    row.appendChild(addBtn);
    row.appendChild(removeBtn);
    venueSelectors.appendChild(row);
  };

  const createCustomRow = () => {
    const row = document.createElement("div");
    row.className = "custom-row";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "custom-value";
    input.placeholder = "e.g. Jazz Bar";
    input.addEventListener("input", updatePreview);

    const addBtn = document.createElement("button");
    addBtn.className = "add-btn";
    addBtn.textContent = "+";
    addBtn.addEventListener("click", createCustomRow);

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "-";
    removeBtn.addEventListener("click", () => {
      row.remove();
      updatePreview();
    });

    row.appendChild(input);
    row.appendChild(addBtn);
    row.appendChild(removeBtn);
    customVenueContainer.appendChild(row);
    
    attachCustomListeners();
  };

  // Attach listeners to hardcoded elements
  const initialVenueSelect = document.querySelector(".venue-type");
  populateDropdown(initialVenueSelect);
  initialVenueSelect.addEventListener("change", updatePreview);

  const initialDropdownAddBtn = document.querySelector(".dropdown-row .add-btn.top-row");
  initialDropdownAddBtn.addEventListener("click", createDropdownRow);

  const locationEvents = ["input", "blur"];
  locationEvents.forEach(e => locationInput.addEventListener(e, updatePreview));

  const customAddBtn = document.getElementById("addCustomVenue");
  customAddBtn.addEventListener("click", createCustomRow);

  document.getElementById("customVenue").addEventListener("input", updatePreview);

  updatePreview();
});

function sanitizeInput(input) {
  const temp = document.createElement('div');
  temp.textContent = input;
  return temp.innerHTML
    .replace(/(<([^>]+)>)/gi, '')        // Strip HTML tags
    .replace(/javascript:/gi, '')        // Remove JS schemes
    .replace(/on\w+=["'][^"']*["']/gi, '') // Remove inline event handlers
    .trim();
}

function normalizeVenue(name) {
  name = sanitizeInput(name);
  if (!name) return '';
  const lower = name.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function saveCustomVenues(venueInputs) {
  // Get current venues from local storage or initialize
  let storedVenues = JSON.parse(localStorage.getItem('customVenues')) || [];

  venueInputs.forEach(input => {
    const venue = normalizeVenue(input);
    if (
      venue &&
      !storedVenues.includes(venue) &&
      !/[<>]/.test(venue) // basic XSS filter
    ) {
      storedVenues.push(venue);
    }
  });

  // Sort alphabetically
  storedVenues.sort((a, b) => a.localeCompare(b));

  // Store back to local storage
  localStorage.setItem('customVenues', JSON.stringify(storedVenues));
}

window.addEventListener('load', () => {
  const storedVenues = JSON.parse(localStorage.getItem('customVenues')) || [];
  console.log('🗂️ Stored Custom Venues:', storedVenues);
});


document.getElementById("frameTrip").addEventListener("click", () => {
  const customInputs = Array.from(document.querySelectorAll(".custom-value"))
    .map(input => input.value.trim())
    .filter(v => v);

  saveCustomVenues(customInputs);
});


const GOOGLE_MAPS_API_KEY = ""; // Add a key if you have one, leave empty to use static images

document.getElementById("frameTrip").addEventListener("click", () => {
  const location = document.getElementById("locationInput").value.trim();
  const mapResults = document.getElementById("mapResults");
  mapResults.innerHTML = "";

  const dropdownVenues = Array.from(document.querySelectorAll(".venue-type"))
    .map(select => select.value.trim())
    .filter(v => v);

  const customVenues = Array.from(document.querySelectorAll(".custom-value"))
    .map(input => input.value.trim())
    .filter(v => v);

  const allVenues = [...dropdownVenues, ...customVenues];

// Save trip to localStorage
  const tripData = {
    location,
    venues: allVenues
  };

let savedTrips = JSON.parse(localStorage.getItem("recentTrips")) || [];
  savedTrips.push(tripData);
  localStorage.setItem("recentTrips", JSON.stringify(savedTrips));

  saveCustomVenues(customVenues);

  allVenues.forEach((venue) => {
    const label = document.createElement("h3");
    label.innerHTML = `<strong>${venue}</strong> <em>${location}</em>`;

    const container = document.createElement("div");
    container.style.marginBottom = "30px";
    container.appendChild(label);

    if (GOOGLE_MAPS_API_KEY) {
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.google.com/maps/embed/v1/search?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(venue + " near " + location)}`;
      iframe.width = "100%";
      iframe.height = "400";
      iframe.style.border = "0";
      iframe.setAttribute("loading", "lazy");

      const zoomBtn = document.createElement("button");
      zoomBtn.textContent = "Zoom In";
      let zoomed = false;

      zoomBtn.onclick = () => {
        zoomed = !zoomed;
        iframe.style.transform = zoomed ? "scale(1.2)" : "scale(1)";
        zoomBtn.textContent = zoomed ? "Zoom Out" : "Zoom In";
      };

      container.appendChild(iframe);
      container.appendChild(zoomBtn);
    } else {
  // Static mock preview using local screenshots inside an iframe
  const normalizedVenue = venue.toLowerCase().replace(/\s+/g, "_"); // e.g. "Jazz Bar" → "jazz_bar"
  const staticImgPath = `img/${normalizedVenue}.jpg`;

  const iframe = document.createElement("iframe");
  iframe.src = staticImgPath;
  iframe.width = "100%";
  iframe.height = "400";
  iframe.style.border = "0";
  iframe.setAttribute("loading", "lazy");
  iframe.setAttribute("title", `${venue} near ${location}`);

  container.appendChild(iframe);
}


    mapResults.appendChild(container);
  });
});

const layoutGridBtn = document.getElementById("layoutGrid");
const layoutStackBtn = document.getElementById("layoutStacked");
const mapResults = document.getElementById("mapResults");

layoutGridBtn.addEventListener("click", () => {
  mapResults.classList.add("grid-view");
  mapResults.classList.remove("stack-view");
});

layoutStackBtn.addEventListener("click", () => {
  mapResults.classList.add("stack-view");
  mapResults.classList.remove("grid-view");
});

// Restore trip


document.getElementById("loadHistory").addEventListener("click", () => {
  const savedTrips = JSON.parse(localStorage.getItem("recentTrips")) || [];
  if (savedTrips.length === 0) {
    alert("No recent trips found.");
    return;
  }

  const modal = document.createElement("div");
  modal.className = "modal";

  savedTrips.forEach((trip, index) => {
    const btn = document.createElement("button");
    const previewText = `${trip.venues.join(", ")} at ${trip.location}`;
    btn.textContent = `Trip ${index + 1}: ${previewText}`;
    btn.onclick = () => {
  document.getElementById("locationInput").value = trip.location;
  updatePreviewFromTrip(trip);
  document.body.removeChild(modal);

  const container = document.getElementById("mapResults");
  container.innerHTML = "";

  trip.venues.forEach(venue => {
    const normalizedVenue = venue.toLowerCase().replace(/\s+/g, "_");
    const staticImgPath = `img/${normalizedVenue}.jpg`;

    const label = document.createElement("h3");
    label.innerHTML = `<strong>${venue}</strong> <em>${trip.location}</em>`;

    const iframe = document.createElement("iframe");
    iframe.src = staticImgPath;
    iframe.width = "100%";
    iframe.height = "400";
    iframe.style.border = "0";
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("title", `${venue} near ${trip.location}`);

    const block = document.createElement("div");
    block.style.marginBottom = "30px";
    block.appendChild(label);
    block.appendChild(iframe);

    container.appendChild(block);
  });
};


    modal.appendChild(btn);
  });

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.onclick = () => document.body.removeChild(modal);
  modal.appendChild(closeBtn);

  document.body.appendChild(modal);
});

function updatePreviewFromTrip(trip) {
  const previewField = document.getElementById("previewSelections");
  previewField.textContent = `📍 Trip to ${trip.location} with: ${trip.venues.join(", ") || "no venues yet"}`;
  previewField.classList.add("pulse");
  setTimeout(() => previewField.classList.remove("pulse"), 1200);
}

document.getElementById("clearSelections").addEventListener("click", () => {
  localStorage.removeItem("recentTrips");
  alert("Trip history cleared.");
});

