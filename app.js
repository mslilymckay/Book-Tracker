import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://jvsjzlvabtffhsnvmcto.supabase.co';
const supabaseKey = 'sb_publishable_H2EPwvAaziQVz8T4yExdEw_bQrB5f3V';
const supabase = createClient(supabaseUrl, supabaseKey);

const bookGrid = document.getElementById('book-grid');

function openDetails(book) {
  console.log("Opening details for:", book.title); // Debug log
  const sheet = document.querySelector('.bottom-sheet');
  const titleEl = document.querySelector('.book-title');
  const authorEl = document.querySelector('.book-author');
  const catEl = document.querySelector('.metadata[data-field="category"]');
  const ratingEl = document.querySelector('.metadata[data-field="rating"]');

  if (!titleEl) { console.error("Could not find .book-title in HTML!"); return; }

  titleEl.textContent = book.title;
  authorEl.textContent = book.author;
  catEl.textContent = `Category: ${book.category || 'N/A'}`;
  ratingEl.textContent = `Rating: ${book.rating ? book.rating + ' Stars' : 'No rating'}`;

  sheet.classList.add('open');
}

async function getCoverUrl(isbn) {
  if (!isbn) return 'https://via.placeholder.com/150x200?text=No+Cover';
  
  // Clean the ISBN: remove dashes and spaces
  const cleanIsbn = isbn.toString().replace(/[-\s]/g, '');
  
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`);
    const data = await response.json();
    if (data.totalItems > 0) {
      return data.items[0].volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150x200?text=No+Cover';
    }
  } catch (e) {
    console.error("Cover fetch failed for ISBN:", cleanIsbn, e);
  }
  return 'https://via.placeholder.com/150x200?text=No+Cover';
}

async function loadBooks() {
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .order('title', { ascending: true });

  if (error) {
    console.error('Database Error:', error);
    return;
  }

  bookGrid.innerHTML = '';

  for (const book of books) {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'book-cover';
    
    // We don't 'await' here to speed up loading; the images will pop in as they arrive
    const coverUrl = await getCoverUrl(book.isbn);
    
    bookDiv.innerHTML = `
      <img src="${coverUrl}" alt="${book.title}" class="cover-image">
      <h3 class="cover-title">${book.title}</h3>
      <p class="cover-author">${book.author}</p>
    `;
    
    bookDiv.addEventListener('click', () => openDetails(book));
    bookGrid.appendChild(bookDiv);
  }
}

loadBooks();
