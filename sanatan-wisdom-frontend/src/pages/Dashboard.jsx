import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { SCRIPTURES_DATA } from '../constants/scriptures';
import { BookOpen, Calendar, FileText, Bookmark, ArrowRight, BookMarked } from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const readingProgress = useSelector(state => state.books.readingProgress);
  const notes = useSelector(state => state.notes.items);
  const bookmarks = useSelector(state => state.bookmarks.items);

  const totalNotes = notes.length;
  const totalBookmarks = bookmarks.length;
  const activeStreak = user?.streak || 0;
  
  const progressList = Object.entries(readingProgress);
  let continueBook = null;
  let continueChapterId = '1';
  let continuePercent = 0;
  
  if (progressList.length > 0) {
    const sortedProgress = [...progressList].sort((a, b) => {
      const dateA = new Date(a[1].updatedAt || 0);
      const dateB = new Date(b[1].updatedAt || 0);
      return dateB - dateA;
    });
    const [bookId, progressObj] = sortedProgress[0];
    continueBook = SCRIPTURES_DATA.find(b => b.id === bookId);
    continueChapterId = progressObj.lastChapterId || '1';
    continuePercent = progressObj.percentage || 0;
  } else {
    continueBook = SCRIPTURES_DATA[0];
  }

  const handleContinue = () => {
    if (continueBook) {
      navigate(`/books/${continueBook.id}/chapter/${continueChapterId}`);
    }
  };

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      {/* Header greetings */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
        <div>
          <h1 className="text-2xl font-serif font-bold text-accent">Pranam, {user?.name || 'Seeker'}</h1>
          <p className="text-xs text-text/60 mt-1">May your day be filled with wisdom, mindfulness, and peace.</p>
        </div>
        <div className="flex items-center space-x-2 bg-card border border-gold/25 px-4 py-2 rounded-xl shadow-soft">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-text">Streak: {activeStreak} Days</span>
        </div>
      </div>

      {/* Grid: Continue Reading & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Reading Card */}
        <div className="lg:col-span-2 bg-card border border-gold/25 rounded-xl shadow-soft p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-4">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">
              Active Reading
            </span>
            <div className="flex items-start space-x-4">
              <div className="w-16 h-20 bg-text/5 border border-gold/10 rounded-lg overflow-hidden shrink-0">
                <img 
                  src={continueBook?.coverImage} 
                  alt={continueBook?.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-serif font-bold text-accent">{continueBook?.title}</h3>
                <p className="text-xs text-text/80 line-clamp-2 leading-relaxed">{continueBook?.description}</p>
                <p className="text-2xs font-semibold text-text/50 pt-1">
                  Last read: Chapter {continueChapterId}
                </p>
              </div>
            </div>

            {/* Reading progress bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-2xs font-semibold text-text/60">
                <span>Progress Rate</span>
                <span>{continuePercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-text/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                  style={{ width: `${continuePercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleContinue}
              className="px-5 py-2.5 bg-primary hover:bg-secondary text-white text-xs font-semibold rounded-xl shadow-soft flex items-center space-x-2 saffron-hover"
            >
              <span>Continue Reading</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="bg-card border border-gold/25 rounded-xl shadow-soft p-6 flex flex-col justify-between">
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">
            Sadhana Insights
          </span>

          <div className="grid grid-cols-2 gap-4 my-4">
            <div className="p-3 bg-background border border-gold/15 rounded-xl flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-accent" />
              <div>
                <p className="text-lg font-bold text-accent leading-none">{progressList.length}</p>
                <p className="text-3xs text-text/50 font-semibold uppercase tracking-wider mt-1">Reading</p>
              </div>
            </div>
            <div className="p-3 bg-background border border-gold/15 rounded-xl flex items-center space-x-3">
              <FileText className="w-5 h-5 text-accent" />
              <div>
                <p className="text-lg font-bold text-accent leading-none">{totalNotes}</p>
                <p className="text-3xs text-text/50 font-semibold uppercase tracking-wider mt-1">Notes</p>
              </div>
            </div>
            <div className="p-3 bg-background border border-gold/15 rounded-xl flex items-center space-x-3">
              <Bookmark className="w-5 h-5 text-accent" />
              <div>
                <p className="text-lg font-bold text-accent leading-none">{totalBookmarks}</p>
                <p className="text-3xs text-text/50 font-semibold uppercase tracking-wider mt-1">Saved</p>
              </div>
            </div>
            <div className="p-3 bg-background border border-gold/15 rounded-xl flex items-center space-x-3">
              <BookMarked className="w-5 h-5 text-accent" />
              <div>
                <p className="text-lg font-bold text-accent leading-none">{user ? '1' : '0'}</p>
                <p className="text-3xs text-text/50 font-semibold uppercase tracking-wider mt-1">Completed</p>
              </div>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-gold/10">
            <span className="text-2xs font-semibold text-text/60 italic">
              Level: {user?.level || 'Sadhaka (Seeker)'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Notes & Bookmarks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Notes */}
        <div className="bg-card border border-gold/25 rounded-xl shadow-soft p-6 space-y-4 flex flex-col justify-between min-h-[300px]">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-md font-serif font-bold text-accent flex items-center space-x-2">
                <FileText className="w-4.5 h-4.5 text-primary" />
                <span>Recent Reflections</span>
              </h2>
              <Link to="/notes" className="text-2xs font-semibold text-primary hover:text-secondary transition-colors">
                View All
              </Link>
            </div>

            {notes.length === 0 ? (
              <div className="py-8 text-center text-xs text-text/50 italic">
                No journal reflections have been penned down yet. Take notes while reading!
              </div>
            ) : (
              <div className="space-y-3">
                {notes.slice(0, 3).map((note) => (
                  <div key={note.id} className="p-3 bg-background border border-gold/10 rounded-lg hover:border-gold/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-semibold text-accent line-clamp-1">{note.title}</h4>
                      <span className="text-3xs text-text/45">{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-2xs text-text/75 line-clamp-2 mt-1 leading-relaxed">{note.content}</p>
                    <div className="flex items-center space-x-1.5 mt-2 text-3xs font-semibold text-primary">
                      <span>{note.bookTitle}</span>
                      <span>•</span>
                      <span>Ch {note.chapterId}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Saved Bookmarks */}
        <div className="bg-card border border-gold/25 rounded-xl shadow-soft p-6 space-y-4 flex flex-col justify-between min-h-[300px]">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-md font-serif font-bold text-accent flex items-center space-x-2">
                <Bookmark className="w-4.5 h-4.5 text-primary" />
                <span>Bookmarked Readings</span>
              </h2>
              <Link to="/bookmarks" className="text-2xs font-semibold text-primary hover:text-secondary transition-colors">
                View All
              </Link>
            </div>

            {bookmarks.length === 0 ? (
              <div className="py-8 text-center text-xs text-text/50 italic">
                No scriptures, chapters, or verses bookmarked yet. Toggle the bookmark icon to save.
              </div>
            ) : (
              <div className="space-y-2">
                {bookmarks.slice(0, 4).map((b) => (
                  <div 
                    key={b.id} 
                    onClick={() => {
                      if (b.type === 'book') navigate(`/books/${b.bookId}`);
                      else navigate(`/books/${b.bookId}/chapter/${b.chapterId}`);
                    }}
                    className="p-3 bg-background border border-gold/10 rounded-lg flex justify-between items-center hover:border-gold/30 cursor-pointer transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-accent leading-tight">{b.label}</h4>
                      <p className="text-3xs text-text/50 mt-0.5 font-semibold uppercase tracking-wider">
                        {b.type} {b.verseId ? `• Verse ${b.verseId}` : ''}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-text/40 hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
