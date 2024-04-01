document.getElementById('searchQuery').addEventListener('input', function() {
    const query = this.value;
    if (query.length >= 3) {
        searchBooks(query);
    } else {
        document.getElementById('searchResults').innerHTML = '';
    }
});

let selectedBooks = [];

function searchBooks(query) {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=40`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('searchResults');
            resultsContainer.innerHTML = '';

            // Filter for books with integer ratings and limit to 5
            const booksWithIntegerRatings = data.items.filter(book => 
                Number.isInteger(book.volumeInfo.averageRating)
            ).slice(0, 5);

            booksWithIntegerRatings.forEach(book => {
                const bookDiv = document.createElement('div');
                bookDiv.textContent = book.volumeInfo.title;
                bookDiv.classList.add('book-item');
                bookDiv.onclick = () => {
                    addBook(book);
                    document.getElementById('searchQuery').value = ''; // Clear the search field upon selection
                    document.getElementById('searchResults').innerHTML = ''; // Optionally clear the search results
                };
                resultsContainer.appendChild(bookDiv);
            });
        })
        .catch(error => console.error('Error:', error));
}

function addBook(book) {
    if (selectedBooks.length >= 5) {
        alert('You can select up to 5 books.');
        return;
    }

    if (!selectedBooks.find(b => b.id === book.id)) {
        selectedBooks.push(book);
        updateSelectedBooks();
        document.getElementById('searchQuery').value = ''; // Clear the search field
    } else {
        alert('This book is already selected.');
    }

    // Show the clear button if 5 books have been selected
    if (selectedBooks.length === 5) {
        document.getElementById('clearSelections').style.display = 'block';
    }
}

function updateSelectedBooks() {
    const favoriteBooksContainer = document.getElementById('favoriteBooks');
    favoriteBooksContainer.innerHTML = '';

    selectedBooks.forEach(book => {
        const detailDiv = document.createElement('div');
        detailDiv.classList.add('book-detail');

        if (book.volumeInfo.imageLinks?.thumbnail) {
            const img = document.createElement('img');
            img.src = book.volumeInfo.imageLinks.thumbnail;
              img.style.cursor = 'pointer'; // Make it obvious it's clickable
            // When the image is clicked, open a Google search for the book's Amazon link
            img.onclick = () => {
                const bookTitleForSearch = encodeURIComponent(book.volumeInfo.title + " Amazon");
                window.open(`https://www.google.com/search?q=${bookTitleForSearch}`, '_blank');
            };
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

        // Creating and appending the links for PDF, ePub, and Sales (if available)
        const linksDiv = document.createElement('div');
        linksDiv.classList.add('book-links');

        if (book.saleInfo.isEbook && book.saleInfo.buyLink) {
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
            pdfLink.href = book.accessInfo.pdf.downloadLink || '#';
            pdfLink.textContent = 'PDF Link';
            pdfLink.target = '_blank';
            linksDiv.appendChild(pdfLink);
        }

        if (book.accessInfo.epub.isAvailable) {
            const epubLink = document.createElement('a');
            epubLink.href = book.accessInfo.epub.downloadLink || '#';
            epubLink.textContent = 'ePub Link';
            epubLink.target = '_blank';
            linksDiv.appendChild(epubLink);
        }

        detailDiv.appendChild(infoDiv);
        detailDiv.appendChild(linksDiv);
        favoriteBooksContainer.appendChild(detailDiv);
    });
}
function addBook(book) {
    if (selectedBooks.length >= 5) {
        alert('You can select up to 5 books.');
        return;
    }

    if (!selectedBooks.find(b => b.id === book.id)) {
        selectedBooks.push(book);
        updateSelectedBooks();
        document.getElementById('searchQuery').value = ''; // Clear the search field
        suggestBooks(book); // Suggest other books based on this selection
    } else {
        alert('This book is already selected.');
    }
}
function suggestBooks(latestBook) {
    // Combine titles from selectedBooks and suggestedBooks for deduplication
    let existingTitles = selectedBooks.map(book => book.volumeInfo.title.toLowerCase());

    const author = latestBook.volumeInfo.authors ? latestBook.volumeInfo.authors[0] : null;
    if (!author) return; // Exit if the latest book has no author info

    const query = `+inauthor:"${encodeURIComponent(author)}"&maxResults=40`;
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
        .then(response => response.json())
        .then(data => {
            const filteredSuggestions = data.items.filter(book => {
                const bookTitleLower = book.volumeInfo.title.toLowerCase();
                return !existingTitles.includes(bookTitleLower);
            }).slice(0, 5); // Limit to 5 suggestions after filtering

            // Update existingTitles to prevent future duplicates
            filteredSuggestions.forEach(book => existingTitles.push(book.volumeInfo.title.toLowerCase()));

            displaySuggestions(filteredSuggestions);
        })
        .catch(error => console.error('Error:', error));
}

function displaySuggestions(books) {
    const suggestedBooksContainer = document.getElementById('suggestedBooks');
    suggestedBooksContainer.innerHTML = ''; // Clear previous suggestions

    books.forEach(book => {
        const detailDiv = document.createElement('div');
        detailDiv.classList.add('book-detail');

        // Book cover with onclick event to search for buy link
        if (book.volumeInfo.imageLinks?.thumbnail) {
            const img = document.createElement('img');
            img.src = book.volumeInfo.imageLinks.thumbnail;
            img.style.cursor = 'pointer'; // Make it look clickable
            img.onclick = () => {
                const titleSearch = encodeURIComponent(book.volumeInfo.title + " buy");
                window.open(`https://www.google.com/search?q=${titleSearch}`, '_blank');
            };
            detailDiv.appendChild(img);
        }

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('book-info');

        // Book title
        const title = document.createElement('p');
        title.textContent = `Title: ${book.volumeInfo.title}`;
        infoDiv.appendChild(title);

        // Author name
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


        // PDF and ePub links if available
        const linksDiv = document.createElement('div');
        linksDiv.classList.add('book-links');

        if (book.accessInfo.pdf.isAvailable) {
            const pdfLink = document.createElement('a');
            pdfLink.href = book.accessInfo.pdf.downloadLink || '#';
            pdfLink.textContent = 'PDF';
            pdfLink.target = '_blank';
            linksDiv.appendChild(pdfLink);
        }

        if (book.accessInfo.epub.isAvailable) {
            const epubLink = document.createElement('a');
            epubLink.href = book.accessInfo.epub.downloadLink || '#';
            epubLink.textContent = 'ePub';
            epubLink.target = '_blank';
            linksDiv.appendChild(epubLink);
        }

        detailDiv.appendChild(infoDiv);
        detailDiv.appendChild(linksDiv);
        suggestedBooksContainer.appendChild(detailDiv);
    });
}
document.getElementById('clearSelections').addEventListener('click', function() {
    // Clear the selected books array
    selectedBooks = [];

    // Clear the UI elements for selected and suggested books
    document.getElementById('favoriteBooks').innerHTML = '';
    document.getElementById('suggestedBooks').innerHTML = '';

    // Hide the "Clear Selections" button
    this.style.display = 'none';
});
