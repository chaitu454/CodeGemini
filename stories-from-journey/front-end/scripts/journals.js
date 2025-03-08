function toggleModal(modalId) {
    document.getElementById(modalId).classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
}

const mockJournals = [
    { id: 1, title: "Paris Trip", description: "Visited Eiffel Tower!", image: "https://img.freepik.com/premium-photo/captivating-image-eiffel-tower-paris-france-breathtaking-public-domain-photograph-from_1000124-81990.jpg?w=2000", likes: 5, avgRating: 4.3, isSubscribed: false, isDeleted: false },
    { id: 2, title: "Beach Vacation", description: "Relaxed on the beach!", image: "https://t4.ftcdn.net/jpg/04/94/27/99/360_F_494279990_h6RCcVg0zOZOJRYqbv8AEnXZi15QmfxR.jpg", likes: 8, avgRating: 4.7, isSubscribed: false, isDeleted: false }
];

function loadJournals() {
    const journalList = document.querySelector(".journal-list");
    journalList.innerHTML = "";
    mockJournals.forEach(journal => {
        if (!journal.isDeleted) {
            const entry = document.createElement("div");
            entry.classList.add("journal-entry");
            entry.innerHTML = `
            <img src="${journal.image}" alt="Journal">
            <div class="journal-content">
                <h3>${journal.title}</h3>
                <p>${journal.description}</p>
                <div class="actions">
                    <button onclick="openJournalModal(true, this)">✏️ Edit</button>
                    <button onclick="toggleModal('rateModal')">⭐ Rate</button>
                    <button onclick="toggleModal('shareModal')">📤 Share</button>
                    <button onclick="likeJournal(${journal.id})">${journal.likes > 0 ? '❤️ Unlike' : '❤️ Like'}</button>
                    <button onclick="toggleSubscribe(${journal.id})">${journal.isSubscribed ? '❌ Unsubscribe' : '🔔 Subscribe'}</button>
                </div>
            </div>
            <div class="journal-stats">
                ❤️ Likes: <span id="likes-${journal.id}">${journal.likes}</span><br>
                Avg Rating: ${journal.avgRating}
            </div>
            <button class="delete-btn" onclick="deleteJournal(${journal.id})">
                    <i></i> Delete
            </button>
        `;
            journalList.appendChild(entry);
        }
    });
}

function likeJournal(id) {
    const journal = mockJournals.find(j => j.id === id);
    journal.likes = journal.likes > 0 ? 0 : 1;  // Toggle like/unlike
    loadJournals(); // Refresh the list with updated like status
}

function toggleSubscribe(id) {
    const journal = mockJournals.find(j => j.id === id);
    journal.isSubscribed = !journal.isSubscribed;
    loadJournals(); // Refresh the list with updated subscription status
}

function deleteJournal(id) {
    const journal = mockJournals.find(j => j.id === id);
    journal.isDeleted = true;
    loadJournals();
}

let isEditing = false;
let editingJournalId = null;

function openJournalModal(edit = false, buttonElement = null) {
    console.log("Opening Journal Modal...");

    isEditing = edit;

    // Show modal first to ensure elements are in the DOM
    toggleModal("journalModal");

    setTimeout(() => {
        const titleInput = document.getElementById("title");
        const descInput = document.getElementById("description");
        const notesInput = document.getElementById("notes");
        const saveButton = document.getElementById("save-journal-btn");

        if (!titleInput || !descInput || !notesInput || !saveButton) {
            console.error("❌ ERROR: One or more modal elements not found!");
            return;
        }

        if (edit && buttonElement) {
            // Fetch data from the card
            const card = buttonElement.closest(".journal-card"); // Assuming card has this class
            if (card) {
                titleInput.value = card.querySelector(".title").innerText.trim();
                descInput.value = card.querySelector(".description").innerText.trim();
                notesInput.value = card.querySelector(".notes").innerText.trim();
                console.log("Prepopulated values from card:", {
                    title: titleInput.value,
                    description: descInput.value,
                    notes: notesInput.value
                });
                saveButton.innerText = "Update Journal";
            }
        } else {
            console.log("Creating new journal");
            titleInput.value = "";
            descInput.value = "";
            notesInput.value = "";
            saveButton.innerText = "Save Journal";
        }
    }, 100);
}

function saveOrUpdateJournal(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("ddescription").value;

    if (isEditing && editingJournalId !== null) {
        const journal = mockJournals.find(j => j.id === editingJournalId);
        if (journal) {
            journal.title = title;
            journal.description = description;
        }
    } else {
        const newJournal = {
            id: mockJournals.length + 1,
            title,
            description,
            image: "default.jpg",
            likes: 0,
            avgRating: 0,
            isSubscribed: false,
            isDeleted: false
        };
        mockJournals.push(newJournal);
    }

    toggleModal("journalModal");
    loadJournals();
}


document.addEventListener("DOMContentLoaded", loadJournals);