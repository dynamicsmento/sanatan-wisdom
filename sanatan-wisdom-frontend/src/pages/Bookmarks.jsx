import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeBookmarkById } from '../features/bookmarks/bookmarkSlice';
import { addToast } from '../features/ui/uiSlice';
import { Bookmark, Trash2, BookOpen, Layers, Hash } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export const Bookmarks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bookmarks = useSelector(state => state.bookmarks.items);

  const handleRemoveBookmark = (id, label) => {
    dispatch(removeBookmarkById(id));
    dispatch(addToast({ type: 'success', message: `Removed bookmark for "${label}"` }));
  };

  const handleNavigate = (b) => {
    if (b.type === 'book') {
      navigate(`/books/${b.bookId}`);
    } else {
      navigate(`/books/${b.bookId}/chapter/${b.chapterId}`);
    }
  };

  return (
    <div className="space-y-6 py-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-serif font-bold text-accent">Saved Bookmarks</h1>
        <p className="text-xs text-text/60 mt-1">Quick access to saved scriptures, chapters, and holy verses.</p>
      </div>

      {bookmarks.length === 0 ? (
        <EmptyState
          title="No Bookmarks Saved"
          message="Keep track of chapters or verses by tapping the bookmark icon while reading scriptures."
          icon={Bookmark}
          actionText="Browse Scriptures"
          onAction={() => navigate('/books')}
        />
      ) : (
        <div className="space-y-6">
          {/* Books Group */}
          {bookmarks.some(b => b.type === 'book') && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Scriptures</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookmarks.filter(b => b.type === 'book').map(b => (
                  <div key={b.id} className="bg-card border border-gold/15 hover:border-gold/35 rounded-xl p-4 flex justify-between items-center shadow-soft hover:shadow-gold transition-all">
                    <div 
                      onClick={() => handleNavigate(b)}
                      className="flex-1 cursor-pointer"
                    >
                      <h4 className="text-sm font-serif font-bold text-accent leading-tight hover:text-primary transition-colors">{b.label}</h4>
                      <span className="text-4xs text-text/50 font-semibold uppercase tracking-wider block mt-1">Bookmarked Scripture</span>
                    </div>
                    <button
                      onClick={() => handleRemoveBookmark(b.id, b.label)}
                      className="p-2 text-text/40 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chapters Group */}
          {bookmarks.some(b => b.type === 'chapter') && (
            <div className="space-y-3 pt-4 border-t border-gold/10">
              <h3 className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center space-x-1.5">
                <Layers className="w-4 h-4" />
                <span>Chapters</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookmarks.filter(b => b.type === 'chapter').map(b => (
                  <div key={b.id} className="bg-card border border-gold/15 hover:border-gold/35 rounded-xl p-4 flex justify-between items-center shadow-soft hover:shadow-gold transition-all">
                    <div 
                      onClick={() => handleNavigate(b)}
                      className="flex-1 cursor-pointer"
                    >
                      <h4 className="text-sm font-serif font-bold text-accent leading-tight hover:text-primary transition-colors">{b.label}</h4>
                      <p className="text-4xs text-text/50 font-semibold uppercase tracking-wider block mt-1">
                        Chapter {b.chapterId} • {b.bookTitle}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveBookmark(b.id, b.label)}
                      className="p-2 text-text/40 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verses Group */}
          {bookmarks.some(b => b.type === 'verse') && (
            <div className="space-y-3 pt-4 border-t border-gold/10">
              <h3 className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center space-x-1.5">
                <Hash className="w-4 h-4" />
                <span>Verses</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookmarks.filter(b => b.type === 'verse').map(b => (
                  <div key={b.id} className="bg-card border border-gold/15 hover:border-gold/35 rounded-xl p-4 flex justify-between items-center shadow-soft hover:shadow-gold transition-all">
                    <div 
                      onClick={() => handleNavigate(b)}
                      className="flex-1 cursor-pointer"
                    >
                      <h4 className="text-sm font-serif font-bold text-accent leading-tight hover:text-primary transition-colors">{b.label}</h4>
                      <p className="text-4xs text-text/50 font-semibold uppercase tracking-wider block mt-1">
                        Verse {b.verseId} • {b.chapterTitle} • {b.bookTitle}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveBookmark(b.id, b.label)}
                      className="p-2 text-text/40 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
