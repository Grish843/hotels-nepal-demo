// This is the phone number shown on the Google Maps listing you shared.
// Verify it is the correct WhatsApp number before showing this demo publicly.
const WHATSAPP_NUMBER = "9779803486892";

function makeWhatsAppLink(message) {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

// Add WhatsApp chat links to the page buttons.
document.querySelectorAll("[data-whatsapp]").forEach(function (link) {
    const message =
        link.dataset.message || "Namaste, I have a question about Hotels Nepal.";

    link.href = makeWhatsAppLink(message);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
});

// Filter sample stays by destination.
const destinationSelect = document.getElementById("destination");
const searchButton = document.getElementById("searchButton");
const hotelCards = document.querySelectorAll(".hotel-card");
const searchMessage = document.getElementById("searchMessage");

searchButton.addEventListener("click", function () {
    const destination = destinationSelect.value;
    let visibleCount = 0;

    hotelCards.forEach(function (card) {
        const matches =
            destination === "all" || card.dataset.location === destination;

        card.hidden = !matches;

        if (matches) {
            visibleCount++;
        }
    });

    if (destination === "all") {
        searchMessage.textContent = "Showing all sample stays.";
    } else if (visibleCount > 0) {
        searchMessage.textContent =
            "Showing sample stays for " + destinationSelect.options[
                destinationSelect.selectedIndex
            ].text + ".";
    } else {
        searchMessage.textContent = "No sample stays found for that destination.";
    }

    document.getElementById("stays").scrollIntoView({ behavior: "smooth" });
});

// Rating demo: ratings are saved only in this browser.
const RATING_KEY = "hotelsNepalConceptRatings";
const ratingForm = document.getElementById("ratingForm");
const ratingMessage = document.getElementById("ratingMessage");
const ratingButtons = document.querySelectorAll(".star-button");
const reviewText = document.getElementById("reviewText");
const reviewList = document.getElementById("reviewList");

let selectedRating = 0;
let ratings = loadRatings();

function loadRatings() {
    try {
        return JSON.parse(localStorage.getItem(RATING_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function saveRatings() {
    localStorage.setItem(RATING_KEY, JSON.stringify(ratings));
}

function chooseRating(value) {
    selectedRating = value;

    ratingButtons.forEach(function (button) {
        const buttonRating = Number(button.dataset.rating);
        const isSelected = buttonRating <= selectedRating;

        button.classList.toggle("selected", isSelected);
        button.textContent = isSelected ? "★" : "☆";
        button.setAttribute("aria-pressed", String(buttonRating === selectedRating));
    });
}

ratingButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        chooseRating(Number(button.dataset.rating));
        ratingMessage.textContent = "Your rating: " + selectedRating + " out of 5.";
    });
});

function showRatings() {
    const averageRating = document.getElementById("averageRating");
    const summaryStars = document.getElementById("summaryStars");
    const ratingCount = document.getElementById("ratingCount");

    reviewList.textContent = "";

    if (ratings.length === 0) {
        averageRating.textContent = "—";
        summaryStars.textContent = "☆☆☆☆☆";
        ratingCount.textContent = "No ratings yet";
        return;
    }

    const total = ratings.reduce(function (sum, rating) {
        return sum + rating.score;
    }, 0);

    const average = total / ratings.length;
    averageRating.textContent = average.toFixed(1);
    summaryStars.textContent =
        "★".repeat(Math.round(average)) + "☆".repeat(5 - Math.round(average));
    ratingCount.textContent =
        ratings.length + (ratings.length === 1 ? " rating" : " ratings");

    ratings.slice().reverse().forEach(function (rating) {
        const item = document.createElement("article");
        item.className = "review-item";

        const stars = document.createElement("div");
        stars.className = "review-stars";
        stars.textContent =
            "★".repeat(rating.score) + "☆".repeat(5 - rating.score);

        item.appendChild(stars);

        if (rating.comment) {
            const comment = document.createElement("p");
            comment.className = "review-comment";
            comment.textContent = rating.comment;
            item.appendChild(comment);
        }

        reviewList.appendChild(item);
    });
}

ratingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (selectedRating === 0) {
        ratingMessage.textContent = "Choose a star rating first.";
        return;
    }

    ratings.push({
        score: selectedRating,
        comment: reviewText.value.trim(),
        date: new Date().toISOString()
    });

    saveRatings();
    showRatings();
    ratingForm.reset();
    chooseRating(0);
    ratingMessage.textContent =
        "Thanks! Your rating is saved in this browser’s demo.";
});

showRatings();