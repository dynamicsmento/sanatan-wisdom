import React, { useState } from 'react';
import { useGetBooksQuery } from '../services/booksApi';
import { SCRIPTURES_DATA } from '../constants/scriptures';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';

export const Books = () => {
  const [search, setSearch] = useState('');
  
  const { data: apiBooks } = useGetBooksQuery();
  const books = apiBooks || SCRIPTURES_DATA;

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.description.toLowerCase().includes(search.toLowerCase()) ||
    book.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 py-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-serif font-bold text-accent">Sacred Scriptures</h1>
        <p className="text-xs text-text/60 mt-1">
          Divine histories, cosmic guidelines, and transcendental knowledge of Bharatvarsha.
        </p>
      </div>

      <div className="max-w-md">
        <SearchBar value={search} onChange={setSearch} placeholder="Search Gita, Upanishads, Vedas..." />
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 text-xs text-text/60 italic bg-card border border-gold/15 rounded-xl">
          No scriptures found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;
