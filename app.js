let selectedBooks = [];

document.getElementById('searchQuery').addEventListener('input', function(e) {
    const query = e.target.value;
    if (query.length >= 3) {
        searchBooks(query);
    } else {
        clearSearchResults();
    }
});

function searchBooks(query) {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            displaySearchResults(data.items || []);
        })
        .catch(error => {
            console.error('Error:', error);
            clearSearchResults();
        });
}

function displaySearchResults(books) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';

    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.textContent = book.volumeInfo.title || 'No title available';
        bookDiv.className = 'search-result';
        resultsContainer.appendChild(bookDiv);
    });
}

function clearSearchResults() {
    document.getElementById('searchResults').innerHTML = '';
}
function selectBook(book) {
    if (!selectedBooks.find(b => b.id === book.id)) {
        selectedBooks.push(book);
        updateSelectedBooksDisplay();
    }
}

function updateSelectedBooksDisplay() {
    const selectedBooksContainer = document.getElementById('selectedBooks');
    selectedBooksContainer.innerHTML = '';

    selectedBooks.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'selected-book';

        const title = document.createElement('p');
        title.textContent = book.volumeInfo.title;
        bookDiv.appendChild(title);

        const detailsBtn = document.createElement('button');
        detailsBtn.textContent = 'Details';
        detailsBtn.addEventListener('click', () => showBookDetails(book));
        bookDiv.appendChild(detailsBtn);

        selectedBooksContainer.appendChild(bookDiv);
    });
}

function showBookDetails(book) {
    const detailsContainer = document.getElementById('selectedBooks');
    detailsContainer.innerHTML = ''; // Clearing previous details for simplicity

    // Dynamically create and append details
    const detailDiv = createDetailDiv(book);
    detailsContainer.appendChild(detailDiv);
}

function createDetailDiv(book) {
    const detailDiv = document.createElement('div');
    detailDiv.className = 'book-details';

    if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
        const img = document.createElement('img');
        img.src = book.volumeInfo.imageLinks.thumbnail;
        detailDiv.appendChild(img);
    }

    addDetail(detailDiv, 'Title', book.volumeInfo.title);
    addDetail(detailDiv, 'Authors', book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown');
    addDetail(detailDiv, 'Published Year', book.volumeInfo.publishedDate ? book.volumeInfo.publishedDate.split('-')[0] : 'Unknown');
    addDetail(detailDiv, 'Rating', book.volumeInfo.averageRating || 'No rating');
    addDetail(detailDiv, 'Genre', book.volumeInfo.categories ? book.volumeInfo.categories.join(', ') : 'Unknown');
    if (book.accessInfo.pdf.isAvailable) {
        addDetail(detailDiv, 'PDF Available', 'Yes', book.accessInfo.pdf.downloadLink);
    } else {
        addDetail(detailDiv, 'PDF Available', 'No');
    }
    if (book.accessInfo.epub.isAvailable) {
        addDetail(detailDiv, 'EPUB Available', 'Yes', book.accessInfo.epub.downloadLink);
    } else {
        addDetail(detailDiv, 'EPUB Available', 'No');
    }
    if (book.saleInfo.saleability === 'FOR_SALE') {
        addDetail(detailDiv, 'Price', `${book.saleInfo.retailPrice.amount} ${book.saleInfo.retailPrice.currencyCode}`);
    } else {
        addDetail(detailDiv, 'Saleability', book.saleInfo.saleability);
    }

    return detailDiv;
}

function addDetail(parent, label, value, link) {
    const p = document.createElement('p');
    p.textContent = `${label}: `;
    if (link) {
        const a = document.createElement('a');
        a.href = link;
        a.textContent = value;
        a.target = "_blank";
        p.appendChild(a);
    } else {
        p.textContent += value;
    }
    parent.appendChild(p);
}

