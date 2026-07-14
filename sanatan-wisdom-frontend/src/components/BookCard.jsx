import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleBookmark } from '../features/bookmarks/bookmarkSlice';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { addToast } from '../features/ui/uiSlice';

export const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const bookmarks = useSelector(state => state.bookmarks.items);
  const readingProgress = useSelector(state => state.books.readingProgress);
  
  const isBookmarked = bookmarks.some(b => b.type === 'book' && b.bookId === book.id);
  const progress = readingProgress[book.id]?.percentage || 0;
  const lastChapter = readingProgress[book.id]?.lastChapterId || '1';

  const handleBookmarkToggle = (e) => {
    e.stopPropagation();
    dispatch(toggleBookmark({
      type: 'book',
      bookId: book.id,
      bookTitle: book.title,
      label: book.title
    }));
    dispatch(addToast({
      type: 'success',
      message: isBookmarked ? `Removed ${book.title} from bookmarks.` : `Added ${book.title} to bookmarks.`
    }));
  };

  const handleContinueReading = () => {
    navigate(`/books/${book.id}/chapter/${lastChapter}`);
  };

  return (
    <div className="bg-card rounded-xl border border-gold/25 overflow-hidden shadow-soft flex flex-col hover:shadow-gold transition-all duration-300 group">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden bg-text/5">
        <img 
          src={book.coverImage} 
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <button 
          onClick={handleBookmarkToggle}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/95 hover:bg-white border border-gold/30 shadow-sm text-accent transition-colors"
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-5 h-5 fill-accent" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>
        <span className="absolute bottom-3 left-3 px-2 py-0.5 text-xs font-semibold bg-primary text-white rounded-md shadow-sm">
          {book.category}
        </span>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-serif font-bold text-accent group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-text/80 line-clamp-3 leading-relaxed">
            {book.description}
          </p>
        </div>

        {/* Progress and Actions */}
        <div className="space-y-3 pt-2">
          {progress > 0 && (
            <div className="space-y-1">
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
          )}

          <div className="flex justify-between items-center space-x-2 pt-1">
            <button
              onClick={() => navigate(`/books/${book.id}`)}
              className="text-xs font-semibold text-accent hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5 border border-transparent"
            >
              Chapters
            </button>
            <button
              onClick={handleContinueReading}
              className="px-4 py-2 bg-primary hover:bg-secondary text-white text-xs font-semibold rounded-lg shadow-sm saffron-hover"
            >
              {progress > 0 ? 'Continue' : 'Read Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
