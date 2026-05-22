import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://jvsjzlvabtffhsnvmcto.supabase.co';
const supabaseKey = 'sb_publishable_H2EPwvAaziQVz8T4yExdEw_bQrB5f3V';
const supabase = createClient(supabaseUrl, supabaseKey);

const bookGrid = document.getElementById('book-grid');

// Function to open and populate the bottom sheet
function openDetails(book) {
  const sheet = document.querySelector('.bottom-sheet');
  const titleEl = document.querySelector('.book-title');
  const authorEl = document.querySelector('.book-author');
  const catEl = document.querySelector('.metadata[data-field="category"]');
  const ratingEl = document.querySelector('.metadata[data-field="rating"]');

  // Update text content
  titleEl.textContent = book.title;
  authorEl.textContent = book.author;
  catEl.textContent = `Category: ${book.category || 'N/A'}`;
  ratingEl.textContent = `Rating: ${book.rating ? book.rating + ' Stars' : 'No rating'}`;

  // Slide up
  sheet.classList.add('open');
}

  // Clear existing content
  bookGrid.innerHTML = '';

  // Generate cards
  books.forEach(book => {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'book-cover';
    bookDiv.innerHTML = `
      <h3 class="cover-title">${book.title}</h3>
      <p class="cover-author">${book.author}</p>
    `;
    
    bookDiv.addEventListener('click', () => openDetails(book));
    bookDiv.addEventListener('click', () => {
      console.log('Clicked:', book.title);
      // We will trigger the bottom sheet here in the next step
    });

    bookGrid.appendChild(bookDiv);
  });
}

// Run on load
loadBooks();
