document.getElementById('searchQuery').addEventListener('input', function() {
    const query = this.value;
    if (query.length >= 3) {
        searchBooks(query);
    } else {
        document.getElementById('searchResults').innerHTML = ''; // Clear results if under 3 characters
    }
});

let selectedBooks = [];

function searchBooks(query) {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=40`) // Fetch more to filter for integers
        .then(response => response.json())
        .then(data => {
            const filteredBooks = data.items.filter(book => Number.isInteger(book.volumeInfo.averageRating)).slice(0, 5); // Keep only books with integer ratings and limit to 5
            displaySearchResults(filteredBooks);
        }).catch(error => console.error('Error:', error));
}

function addBook(book) {
    if (selectedBooks.length >= 5) {
        alert('You can select up to 5 books.');
        return;
    }

    if (selectedBooks.find(b => b.id === book.id)) {
        alert('This book is already selected.');
        return;
    }

    selectedBooks.push(book);
    updateSelectedBooks();
    document.getElementById('searchQuery').value = ''; // Clear the search field
}
function displaySearchResults(books) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; // Clear previous results
    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.textContent = book.volumeInfo.title;
        bookDiv.classList.add('book-item');
        bookDiv.onclick = () => {
            if (selectedBooks.length >= 5) {
                alert('You can select up to 5 books.');
                return;
            }
            if (!selectedBooks.find(b => b.id === book.id)) {
                selectedBooks.push(book);
                updateSelectedBooks();
                document.getElementById('searchQuery').value = ''; // Clear the search field
                document.getElementById('searchResults').innerHTML = ''; // Clear the search results
            } else {
                alert('This book is already selected.');
            }
        };
        resultsContainer.appendChild(bookDiv);
    });
}
function updateSelectedBooks() {
    const favoriteBooksContainer = document.getElementById('favoriteBooks');
    favoriteBooksContainer.innerHTML = ''; // Clear the container

    selectedBooks.forEach(book => {
        const detailDiv = document.createElement('div');
        detailDiv.classList.add('book-detail');
        
        if (book.volumeInfo.imageLinks?.thumbnail) {
            const img = document.createElement('img');
            img.src = book.volumeInfo.imageLinks.thumbnail;
            detailDiv.appendChild(img);
        }

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('book-info');

        const title = document.createElement('p');
        title.textContent = `Title: ${book.volumeInfo.title}`;
        infoDiv.appendChild(title);

        const author = document.createElement('p');
        author.textContent = `Author: ${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'N/A'}`;
        infoDiv.appendChild(author);

        const rating = document.createElement('p');
        rating.textContent = `Rating: ${book.volumeInfo.averageRating || 'N/A'}`;
        infoDiv.appendChild(rating);

        const category = document.createElement('p');
        category.textContent = `Categories: ${book.volumeInfo.categories ? book.volumeInfo.categories.join(', ') : 'N/A'}`;
        infoDiv.appendChild(category);

        const description = document.createElement('p');
        description.textContent = `Description: ${book.volumeInfo.description ? book.volumeInfo.description.substring(0, 150) + '...' : 'N/A'}`;
        infoDiv.appendChild(description);

        const linksDiv = document.createElement('div');
        linksDiv.classList.add('book-links');

        if (book.saleInfo.buyLink) {
            const salesLink = document.createElement('a');
            salesLink.href = book.saleInfo.buyLink;
            salesLink.textContent = 'Buy Link';
            salesLink.target = '_blank';
            linksDiv.appendChild(salesLink);
        }

        if (book.accessInfo.webReaderLink) {
            const readLink = document.createElement('a');
            readLink.href = book.accessInfo.webReaderLink;
            readLink.textContent = 'Read Link';
            readLink.target = '_blank';
            linksDiv.appendChild(readLink);
        }

        if (book.accessInfo.pdf.isAvailable) {
            const pdfLink = document.createElement('a');
            pdfLink.href = book.accessInfo.pdf.downloadLink;
            pdfLink.textContent = 'PDF Link';
            pdfLink.target = '_blank';
            linksDiv.appendChild(pdfLink);
        }

        if (book.accessInfo.epub.isAvailable) {
            const epubLink = document.createElement('a');
            epubLink.href = book.accessInfo.epub.downloadLink;
            epubLink.textContent = 'ePub Link';
            epubLink.target = '_blank';
            linksDiv.appendChild(epubLink);
        }

        detailDiv.appendChild(infoDiv);
        detailDiv.appendChild(linksDiv);
        favoriteBooksContainer.appendChild(detailDiv);
    });
}
