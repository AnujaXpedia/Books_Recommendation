// Function to search books using the Google Books API
function searchBooks() {
    const query = document.getElementById('searchQuery').value;
    if (!query) {
        alert('Please enter a search query.');
        return;
    }

    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => displaySearchResults(data.items))
        .catch(error => console.error('Error fetching data:', error));
}

// Function to display search results
function displaySearchResults(books) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; // Clear previous results

    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.textContent = book.volumeInfo.title;
        bookDiv.style.cursor = 'pointer';
        bookDiv.onclick = () => selectBook(book);
        resultsContainer.appendChild(bookDiv);
    });
}

const selectedBooks = [];

// Function to handle book selection
function selectBook(book) {
    if (selectedBooks.length >= 10) {
        alert('You can select up to 10 books.');
        return;
    }

    selectedBooks.push(book);
    updateSelectedBooksDisplay();
}

// Function to update the display of selected books
function updateSelectedBooksDisplay() {
    const selectedBooksContainer = document.getElementById('selectedBooks');
    selectedBooksContainer.innerHTML = ''; // Clear previous display

    selectedBooks.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.textContent = book.volumeInfo.title;
        selectedBooksContainer.appendChild(bookDiv);
    });
}
