document.getElementById('searchQuery').addEventListener('input', function(e) {
    const query = e.target.value;
    if (query.length >= 3) {
        searchBooks(query); // Trigger search with at least 3 characters
    }
});

// Array to store the IDs of selected books
let selectedBooks = [];

function searchBooks(query) {
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displaySearchResults(data.items);
        })
        .catch(error => console.error('Error:', error));
}

function displaySearchResults(books) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; // Clear previous results

    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.textContent = book.volumeInfo.title;
        bookDiv.style.cursor = 'pointer';
        bookDiv.addEventListener('click', () => selectBook(book));
        resultsContainer.appendChild(bookDiv);
    });
}

function selectBook(book) {
    // Prevent adding more than 5 books and duplicate selections
    if (!selectedBooks.some(selectedBook => selectedBook.id === book.id) && selectedBooks.length < 5) {
        selectedBooks.push(book);
        updateSelectedBooksDisplay();
    } else {
        alert('You can select up to 5 unique books.');
    }
}

function updateSelectedBooksDisplay() {
    const selectedBooksContainer = document.getElementById('selectedBooks');
    selectedBooksContainer.innerHTML = ''; // Clear previous display

    selectedBooks.forEach(book => {
        const bookDiv = document.createElement('div');
        
        const title = document.createElement('p');
        title.textContent = 'Title: ' + book.volumeInfo.title;
        bookDiv.appendChild(title);

        const author = document.createElement('p');
        author.textContent = 'Author: ' + (book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'N/A');
        bookDiv.appendChild(author);

        const rating = document.createElement('p');
        rating.textContent = 'Rating: ' + (book.volumeInfo.averageRating || 'N/A');
        bookDiv.appendChild(rating);

        if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
            const img = document.createElement('img');
            img.src = book.volumeInfo.imageLinks.thumbnail;
            img.alt = 'Book cover';
            bookDiv.appendChild(img);
        }

        selectedBooksContainer.appendChild(bookDiv);
    });
}

// Clear selected books list when clicking on whitespace
document.body.addEventListener('click', function(e) {
    if (e.target === document.body) {
        selectedBooks = []; // Reset selected books
        updateSelectedBooksDisplay(); // Clear display
    }
}, true);


