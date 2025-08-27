// Prayer filtering and search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const categoryCards = document.querySelectorAll('.category-card');

    // Function to filter prayers based on search text and category
    function filterPrayers() {
        const searchText = searchInput.value.toLowerCase().trim();
        const filterCategory = categoryFilter.value;

        categoryCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardText = card.textContent.toLowerCase();
            
            // Check if card matches category filter
            const matchesCategory = filterCategory === 'सभी' || cardCategory === filterCategory;
            
            // Check if card matches search text (searches in title and description)
            const matchesText = searchText === '' || cardText.includes(searchText);
            
            // Show/hide card based on both criteria
            if (matchesCategory && matchesText) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.3s ease-out';
            } else {
                card.style.display = 'none';
            }
        });

        // Show "no results" message if no cards are visible
        showNoResultsMessage();
    }

    // Function to show/hide "no results found" message
    function showNoResultsMessage() {
        const visibleCards = Array.from(categoryCards).filter(card => 
            card.style.display !== 'none'
        );

        // Remove existing "no results" message
        const existingMessage = document.querySelector('.no-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Add "no results" message if no cards are visible
        if (visibleCards.length === 0) {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results-message';
            noResultsDiv.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                    <h3>कोई परिणाम नहीं मिला</h3>
                    <p>कृपया अपनी खोज को संशोधित करें</p>
                </div>
            `;
            
            const categoryGrid = document.querySelector('.category-grid');
            categoryGrid.appendChild(noResultsDiv);
        }
    }

    // Function to clear search and reset filters
    function clearSearch() {
        searchInput.value = '';
        categoryFilter.value = 'सभी';
        filterPrayers();
    }

    // Function to highlight matching text in search results
    function highlightSearchText(text, searchTerm) {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Event listeners
    searchInput.addEventListener('input', filterPrayers);
    categoryFilter.addEventListener('change', filterPrayers);

    // Add clear search functionality (optional)
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            clearSearch();
        }
    });

    // Add click handlers for prayer cards
    categoryCards.forEach(card => {
        const readBtn = card.querySelector('.read-btn');
        if (readBtn) {
            readBtn.addEventListener('click', function() {
                const prayerTitle = card.querySelector('h3').textContent;
                alert(`${prayerTitle} खोला जा रहा है...`);
                // Here you can add navigation to specific prayer page
                // window.location.href = `prayer.html?type=${encodeURIComponent(prayerTitle)}`;
            });
        }
    });

    // Add smooth scroll animation for better UX
    function smoothScrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Initialize - show all prayers on page load
    filterPrayers();
});

// Additional utility functions
function searchByVoice() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'hi-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.start();

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('searchInput').value = transcript;
            filterPrayers();
        };

        recognition.onerror = function(event) {
            console.log('Speech recognition error:', event.error);
        };
    }
}

// Function to add to favorites (for future enhancement)
function addToFavorites(prayerName) {
    let favorites = JSON.parse(localStorage.getItem('favoriteprayers') || '[]');
    if (!favorites.includes(prayerName)) {
        favorites.push(prayerName);
        localStorage.setItem('favoriteprayers', JSON.stringify(favorites));
        alert(`${prayerName} पसंदीदा में जोड़ा गया!`);
    }
}
