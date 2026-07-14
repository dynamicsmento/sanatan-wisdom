import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetBookByIdQuery } from '../services/booksApi';
import { SCRIPTURES_DATA } from '../constants/scriptures';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';

export const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const readingProgress = useSelector(state => state.books.readingProgress);

  const { data: apiBook } = useGetBookByIdQuery(id);
  const book = apiBook || SCRIPTURES_DATA.find(b => b.id === id);

  if (!book) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-serif font-bold text-accent">Scripture Not Found</h2>
        <p className="text-xs text-text/60 mt-2">The path does not lead to this text.</p>
        <Link to="/books" className="inline-flex items-center space-x-2 text-xs font-semibold text-primary mt-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scriptures</span>
        </Link>
      </div>
    );
  }

  const progress = readingProgress[book.id]?.percentage || 0;
  const lastChapter = readingProgress[book.id]?.lastChapterId || '1';

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      {/* Back button */}
      <div>
        <Link to="/books" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-accent hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </Link>
      </div>

      {/* Book Summary Card */}
      <div className="bg-card border border-gold/25 rounded-xl shadow-soft p-6 md:p-8 flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0 relative overflow-hidden">
        {/* Cover */}
        <div className="w-full md:w-48 h-64 bg-text/5 border border-gold/15 rounded-xl overflow-hidden shadow-soft shrink-0">
          <img 
            src={book.coverImage} 
            alt={book.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-2xs font-bold text-secondary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">
              {book.category}
            </span>
            <h2 className="text-2xl font-serif font-bold text-accent">{book.title}</h2>
            <p className="text-xs text-text/80 leading-relaxed font-sans">{book.description}</p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex space-x-8 text-xs font-semibold text-accent">
              <div>
                <p className="text-text/50 font-sans text-2xs uppercase tracking-wider leading-none">Chapters</p>
                <p className="text-base font-bold mt-1">{book.chapters.length}</p>
              </div>
              <div>
                <p className="text-text/50 font-sans text-2xs uppercase tracking-wider leading-none font-semibold">Total Verses</p>
                <p className="text-base font-bold mt-1">{book.versesCount}</p>
              </div>
            </div>

            {/* Reading progress */}
            <div className="space-y-1.5 max-w-sm">
              <div className="flex justify-between text-2xs font-semibold text-text/60">
                <span>Reading Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-text/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate(`/books/${book.id}/chapter/${lastChapter}`)}
                className="px-6 py-2.5 bg-primary hover:bg-secondary text-white text-xs font-semibold rounded-xl shadow-soft flex items-center space-x-2 saffron-hover"
              >
                <span>{progress > 0 ? 'Continue Reading' : 'Start Reading Now'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Table of Contents */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif font-bold text-accent flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <span>Table of Contents</span>
        </h3>

        <div className="space-y-3">
          {book.chapters.map((chapter) => (
            <Link 
              key={chapter.id} 
              to={`/books/${book.id}/chapter/${chapter.id}`}
              className="flex justify-between items-center p-4 bg-card border border-gold/15 hover:border-gold/40 rounded-xl shadow-soft hover:shadow-gold transition-all group"
            >
              <div className="space-y-1 pr-4">
                <h4 className="text-sm font-serif font-bold text-accent group-hover:text-primary transition-colors">
                  {chapter.title}
                </h4>
                <p className="text-2xs text-text/75 line-clamp-1 font-sans">{chapter.description}</p>
              </div>
              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-3xs font-semibold bg-primary/10 text-accent px-2 py-0.5 rounded font-sans">
                  {chapter.verses?.length || chapter.versesCount} Verses
                </span>
                <ChevronRight className="w-4 h-4 text-text/40 group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
