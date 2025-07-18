let tours = [];

function renderTours(filterDestination = null, filterActivity = null) {
  const tourList = document.getElementById('tour-list');
  tourList.innerHTML = '';

  if (!tours || tours.length === 0) {
    tourList.innerHTML = '<p>No tours currently available.</p>';
    return;
  }

  const filteredTours = tours.filter(tour => {
    const matchesDestination = !filterDestination || tour.location === filterDestination;
    const matchesActivity = !filterActivity || tour.activity === filterActivity;
    return matchesDestination && matchesActivity;
  });

  if (filteredTours.length === 0) {
    tourList.innerHTML = '<p>No matching tours found.</p>';
    return;
  }

  filteredTours.forEach(tour => {
    const card = document.createElement("div");
    card.classList.add("tour-card");

    // Use the tour's id to generate the local HTML file link
    card.innerHTML = `
      <div class="tour-card-img-wrapper">
        <img src="${tour.image}" alt="${tour.title}" />
      </div>
      <h2>${tour.title}</h2>
      <p><strong>Location:</strong> ${tour.location}</p>
      <p><strong>Activity:</strong> ${tour.activity}</p>
      <p><strong>Price:</strong> Rs. ${tour.price}</p>
      <p>${tour.description}</p>
      <a href="tours/id${tour.id}.html" class="button">Book Now</a>
    `;

    tourList.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Fetch tours from tours.json
  fetch('../data/tours.json')
    .then(response => response.json())
    .then(data => {
      tours = data;
      // Do NOT call renderTours() here
    })
    .catch(() => {
      document.getElementById('tour-list').innerHTML = '<p>Could not load tours.</p>';
    });

  // --- Header show/hide on scroll ---
  let lastScrollY = window.scrollY;
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY < lastScrollY) {
      // Scrolling up
      header.classList.remove('header-hidden');
    } else {
      // Scrolling down
      header.classList.add('header-hidden');
    }
    lastScrollY = window.scrollY;
  });

  // --- Sidebar toggle ---
  window.toggleMenu = function () {
    document.getElementById("sidebar").classList.toggle("open");
  };
  

  // --- Custom dropdown logic ---
  const destinations = {
  Asia: ["Nepal", "India", "China","Bhutan","Maldieves"],
  Europe: ["France", "Italy", "Germany","England"],
  Africa: ["Egypt", "Morocco", "Kenya"]
};

const activities = {
  Nepal: ["Trekking", "Cultural Tour","Chitwan safari","Helicopter Tour","Religious Tour","Luxury Trips", "Mountaineering"],
  India: ["Trekking", "Cultural Tour"],
  China: ["Trekking", "Cultural Tour", "Mountaineering"],
  France: ["Cultural Tour"],
  Italy: ["Cultural Tour"],
  Germany: ["Cultural Tour"],
  Egypt: ["Cultural Tour"],
  Morocco: ["Cultural Tour", "Trekking"],
  Kenya: ["Cultural Tour", "Trekking"]
};

const continentDropdown = document.getElementById('continent-dropdown');
const destinationDropdown = document.getElementById('destination-dropdown');
const activityDropdown = document.getElementById('activity-dropdown');
const findToursBtn = document.getElementById('find-tours-btn');

let selectedContinent = '';
let selectedDestination = '';
let selectedActivity = '';

function setDropdownText(dropdown, text) {
  dropdown.querySelector('.dropdown-btn').textContent = text;
}

continentDropdown.addEventListener('click', function (e) {
  if (e.target.matches('.dropdown-content a')) {
    e.preventDefault();
    selectedContinent = e.target.dataset.value;
    setDropdownText(continentDropdown, e.target.textContent);

    const destContent = destinationDropdown.querySelector('.dropdown-content');
    destContent.innerHTML = '';
    destinations[selectedContinent].forEach(dest => {
      destContent.innerHTML += `<a href="#" data-value="${dest}">${dest}</a>`;
    });

    destinationDropdown.style.display = '';
    activityDropdown.style.display = 'none';
    findToursBtn.style.display = 'none';
    setDropdownText(destinationDropdown, 'Select Destination');
    setDropdownText(activityDropdown, 'Select Activity');
  }
});

destinationDropdown.addEventListener('click', function (e) {
  if (e.target.matches('.dropdown-content a')) {
    e.preventDefault();
    selectedDestination = e.target.dataset.value;
    setDropdownText(destinationDropdown, e.target.textContent);

    // 👇 Dynamically populate activities for the selected destination
    const actContent = activityDropdown.querySelector('.dropdown-content');
    actContent.innerHTML = '';

    if (activities[selectedDestination]) {
      activities[selectedDestination].forEach(activity => {
        actContent.innerHTML += `<a href="#" data-value="${activity}">${activity}</a>`;
      });
    }

    activityDropdown.style.display = '';
    findToursBtn.style.display = 'none';
    setDropdownText(activityDropdown, 'Select Activity');
  }
});

activityDropdown.addEventListener('click', function (e) {
  if (e.target.matches('.dropdown-content a')) {
    e.preventDefault();
    selectedActivity = e.target.dataset.value;
    setDropdownText(activityDropdown, e.target.textContent);
    findToursBtn.style.display = '';
  }
});

document.getElementById('tour-form').addEventListener('submit', function (e) {
  e.preventDefault();
  if (!selectedContinent || !selectedDestination || !selectedActivity) {
    alert('Please select all options.');
    return;
  }
  renderTours(selectedDestination, selectedActivity);
});

//--reset button---
document.getElementById('reset-btn').addEventListener('click', () => {
  // Reset selected values
  selectedContinent = '';
  selectedDestination = '';
  selectedActivity = '';

  // Reset dropdown button text
  setDropdownText(continentDropdown, 'Select Continent');
  setDropdownText(destinationDropdown, 'Select Destination');
  setDropdownText(activityDropdown, 'Select Activity');

  // Hide dropdowns and button
  destinationDropdown.style.display = 'none';
  activityDropdown.style.display = 'none';
  findToursBtn.style.display = 'none';

  // Clear dropdown-content for destination and activity
  destinationDropdown.querySelector('.dropdown-content').innerHTML = '';
  activityDropdown.querySelector('.dropdown-content').innerHTML = `
    <a href="#" data-value="Trekking">Trekking</a>
    <a href="#" data-value="Cultural Tour">Cultural Tour</a>
    <a href="#" data-value="Mountaineering">Mountaineering</a>
  `;

  // Optionally reset the form fields (if any)
  document.getElementById('tour-form').reset?.();

  // Render all tours without any filter
  renderTours();

  document.getElementById('tour-list').innerHTML = '';
});

// Dropdown open/close logic for hover and click
document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
  const btn = dropdown.querySelector('.dropdown-btn');
  const content = dropdown.querySelector('.dropdown-content');

  // Toggle open on button click
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  // Close dropdown when an option is clicked
  content.addEventListener('click', function(e) {
    if (e.target.matches('a')) {
      dropdown.classList.remove('open');
      // Add .no-hover to prevent hover from reopening
      dropdown.classList.add('no-hover');
      setTimeout(() => {
        dropdown.classList.remove('no-hover');
      }, 200); // 200ms is enough for the mouse to leave
    }
  });
});

// Close all dropdowns when clicking outside
document.addEventListener('click', function() {
  document.querySelectorAll('.custom-dropdown.open').forEach(dropdown => {
    dropdown.classList.remove('open');
  });
});

// --- Testimonial carousel (customer feedback) ---
const cards = document.querySelectorAll('.testimonial-card');
let current = 0;
let timer = null;

function showCard(next) {
  cards.forEach((card, i) => {
    card.classList.remove('active', 'slide-out-left');
    if (i === current) card.classList.add('active');
    if (i === next) card.classList.add('slide-out-left');
  });
}

function nextCard(auto = true) {
  const prev = current;
  current = (current + 1) % cards.length;
  showCard(prev);
  setTimeout(() => {
    cards[prev].classList.remove('slide-out-left');
    showCard();
  }, 700);
  if (auto) {
    resetTimer();
  }
}

function resetTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    nextCard();
  }, 10000);
}

document.getElementById('testimonial-next').onclick = () => nextCard(false);
document.getElementById('testimonial-prev').onclick = () => {
  const prev = current;
  current = (current - 1 + cards.length) % cards.length;
  showCard(prev);
  setTimeout(() => {
    cards[prev].classList.remove('slide-out-left');
    showCard();
  }, 700);
  resetTimer();
};

showCard();
resetTimer();

// --- Travel Quotes Auto-Slider (no buttons, automatic only) ---
const quoteCards = document.querySelectorAll('.quotes-card');
let quoteCurrent = 0;

function showQuoteCard(prev = null) {
  quoteCards.forEach((card, i) => {
    card.classList.remove('active', 'slide-out-left');
    if (i === quoteCurrent) card.classList.add('active');
    if (i === prev) card.classList.add('slide-out-left');
  });
}

setInterval(() => {
  const prev = quoteCurrent;
  quoteCurrent = (quoteCurrent + 1) % quoteCards.length;
  showQuoteCard(prev);
  setTimeout(() => {
    quoteCards[prev].classList.remove('slide-out-left');
    showQuoteCard();
  }, 700);
}, 10000);

showQuoteCard();

});