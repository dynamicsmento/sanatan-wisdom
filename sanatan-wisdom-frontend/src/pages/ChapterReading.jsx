import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetChapterByIdQuery } from '../services/chapterApi';
import { SCRIPTURES_DATA } from '../constants/scriptures';
import { updateProgress } from '../features/books/bookSlice';
import { toggleBookmark } from '../features/bookmarks/bookmarkSlice';
import { addNote } from '../features/notes/noteSlice';
import { 
  increaseFontSize, decreaseFontSize, toggleTheme, addToast 
} from '../features/ui/uiSlice';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, 
  FileText, Moon, Sun, Type, Plus, ChevronDown, Check
} from 'lucide-react';
import { TextAreaField, InputField } from '../components/ReusableForms';

export const ChapterReading = () => {
  const { id: bookId, chapterId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const fontSize = useSelector(state => state.ui.fontSize);
  const theme = useSelector(state => state.ui.theme);
  const bookmarks = useSelector(state => state.bookmarks.items);
  const notes = useSelector(state => state.notes.items);

  const [notesOpen, setNotesOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [selectedVerseForNote, setSelectedVerseForNote] = useState(null);

  // Fallback local lookup
  const book = SCRIPTURES_DATA.find(b => b.id === bookId);
  const chapterIndex = book ? book.chapters.findIndex(c => c.id === chapterId) : -1;
  const chapter = book && chapterIndex !== -1 ? book.chapters[chapterIndex] : null;

  // Next and Previous Chapter references
  const prevChapter = book && chapterIndex > 0 ? book.chapters[chapterIndex - 1] : null;
  const nextChapter = book && chapterIndex < book.chapters.length - 1 ? book.chapters[chapterIndex + 1] : null;

  // Chapter bookmark check
  const isChapterBookmarked = bookmarks.some(b => 
    b.type === 'chapter' && b.bookId === bookId && b.chapterId === chapterId
  );

  // Auto-update reading progress when chapter is loaded
  useEffect(() => {
    if (book && chapter) {
      const percentage = Math.round(((chapterIndex + 1) / book.chapters.length) * 100);
      dispatch(updateProgress({
        bookId: book.id,
        chapterId: chapter.id,
        percentage
      }));
    }
  }, [bookId, chapterId, book, chapter, chapterIndex, dispatch]);

  if (!book || !chapter) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-serif font-bold text-accent">Chapter Not Found</h2>
        <Link to="/books" className="text-xs font-semibold text-primary mt-4 inline-block">
          Back to library
        </Link>
      </div>
    );
  }

  const handleChapterBookmark = () => {
    dispatch(toggleBookmark({
      type: 'chapter',
      bookId: book.id,
      bookTitle: book.title,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      label: `${book.title} - ${chapter.title.split(':')[0]}`
    }));
    dispatch(addToast({
      type: 'success',
      message: isChapterBookmarked ? 'Removed chapter bookmark' : 'Bookmarked this chapter'
    }));
  };

  const handleVerseBookmark = (verseNum, verseText) => {
    const isVerseBookmarked = bookmarks.some(b => 
      b.type === 'verse' && b.bookId === book.id && b.chapterId === chapter.id && b.verseId === verseNum
    );

    dispatch(toggleBookmark({
      type: 'verse',
      bookId: book.id,
      bookTitle: book.title,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      verseId: verseNum,
      label: `${book.title} ${chapter.id}:${verseNum}`
    }));

    dispatch(addToast({
      type: 'success',
      message: isVerseBookmarked ? `Removed verse ${verseNum} bookmark` : `Bookmarked verse ${verseNum}`
    }));
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!noteContent.trim()) {
      dispatch(addToast({ type: 'warning', message: 'Note reflection cannot be empty' }));
      return;
    }

    const titleText = noteTitle.trim() || (selectedVerseForNote 
      ? `Reflection on Verse ${selectedVerseForNote}`
      : `Reflection on Chapter ${chapter.id}`);

    dispatch(addNote({
      bookId: book.id,
      bookTitle: book.title,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      verseId: selectedVerseForNote,
      title: titleText,
      content: noteContent
    }));

    dispatch(addToast({ type: 'success', message: 'Saved reflection to your spiritual journal!' }));
    
    // Clear state
    setNoteTitle('');
    setNoteContent('');
    setNotesOpen(false);
    setSelectedVerseForNote(null);
  };

  const handleOpenNoteForVerse = (verseNum) => {
    setSelectedVerseForNote(verseNum);
    setNoteTitle(`Insights on Verse ${verseNum}`);
    setNotesOpen(true);
  };

  // Filter notes written for this chapter
  const chapterNotes = notes.filter(n => n.bookId === book.id && n.chapterId === chapter.id);

  return (
    <div className="relative py-4 space-y-6">
      {/* Sticky Reader Bar */}
      <div className="sticky top-[64px] z-30 flex justify-between items-center py-2 px-4 bg-card/90 backdrop-blur-md border border-gold/25 rounded-xl shadow-soft">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/books/${book.id}`)}
            className="p-1.5 text-accent hover:bg-primary/10 rounded-lg transition-colors"
            title="Table of Contents"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-serif font-bold text-accent hidden sm:inline">{book.title}</span>
          <span className="text-xs text-text/40 hidden sm:inline">/</span>
          <span className="text-xs font-serif font-bold text-text truncate max-w-[120px] sm:max-w-none">{chapter.title.split(':')[0]}</span>
        </div>

        {/* Action controls */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => dispatch(decreaseFontSize())}
            className="p-1.5 text-accent hover:bg-primary/10 rounded-lg font-bold text-xs"
            title="Decrease Font Size"
          >
            A-
          </button>
          <button
            onClick={() => dispatch(increaseFontSize())}
            className="p-1.5 text-accent hover:bg-primary/10 rounded-lg font-bold text-xs"
            title="Increase Font Size"
          >
            A+
          </button>
          <div className="h-4 w-[1px] bg-gold/25" />
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-1.5 text-accent hover:bg-primary/10 rounded-lg transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={handleChapterBookmark}
            className="p-1.5 text-accent hover:bg-primary/10 rounded-lg transition-colors"
            title="Bookmark Chapter"
          >
            {isChapterBookmarked ? <BookmarkCheck className="w-4 h-4 fill-accent" /> : <Bookmark className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              setSelectedVerseForNote(null);
              setNoteTitle(`Insights on ${chapter.title.split(':')[0]}`);
              setNotesOpen(true);
            }}
            className="p-1.5 text-accent hover:bg-primary/10 rounded-lg transition-colors"
            title="Take Chapter Notes"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Reading area */}
      <div className="max-w-3xl mx-auto space-y-12 pb-16 font-sans">
        {/* Chapter Header */}
        <div className="text-center space-y-3 py-6">
          <span className="text-2xs font-bold text-secondary uppercase tracking-widest bg-secondary/10 px-2.5 py-1 rounded-full">
            {book.title}
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-accent">{chapter.title}</h1>
          <p className="text-xs md:text-sm text-text/70 italic max-w-lg mx-auto font-sans leading-relaxed">
            {chapter.description}
          </p>
          <div className="w-16 h-[1.5px] bg-gold mx-auto mt-4" />
        </div>

        {/* Verses rendering */}
        <div className="space-y-12">
          {chapter.verses.map((verse) => {
            const isVerseSaved = bookmarks.some(b => 
              b.type === 'verse' && b.bookId === book.id && b.chapterId === chapter.id && b.verseId === verse.number
            );

            return (
              <div 
                key={verse.number} 
                className="bg-card/40 hover:bg-card border border-gold/15 hover:border-gold/30 rounded-2xl p-6 md:p-8 space-y-6 transition-all duration-300 shadow-soft relative group"
              >
                {/* Verse controls */}
                <div className="absolute top-4 right-4 flex items-center space-x-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleVerseBookmark(verse.number)}
                    className="p-1.5 hover:bg-primary/10 rounded-lg text-accent transition-colors"
                    title="Bookmark Verse"
                  >
                    {isVerseSaved ? <BookmarkCheck className="w-4 h-4 fill-accent" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleOpenNoteForVerse(verse.number)}
                    className="p-1.5 hover:bg-primary/10 rounded-lg text-accent transition-colors"
                    title="Journal reflection"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>

                {/* Verse index */}
                <div className="text-3xs font-bold uppercase tracking-widest text-secondary font-serif">
                  Verse {verse.number}
                </div>

                {/* Sanskrit text */}
                <div 
                  className="text-center font-serif leading-loose text-accent font-semibold select-none whitespace-pre-line"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {verse.text}
                </div>

                {/* Transliteration */}
                <div className="text-center text-text/60 italic text-xs leading-relaxed max-w-2xl mx-auto">
                  {verse.transliteration}
                </div>

                {/* English translation */}
                <div className="text-sm font-medium leading-relaxed text-text pt-2 text-center md:text-left border-t border-gold/10">
                  {verse.translation}
                </div>

                {/* Commentary */}
                {verse.commentary && (
                  <div className="bg-background/85 border-l-2 border-gold p-4 rounded-r-xl space-y-1">
                    <span className="text-2xs font-bold uppercase tracking-wider text-secondary">
                      Commentary
                    </span>
                    <p className="text-xs text-text/80 leading-relaxed leading-loose">
                      {verse.commentary}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Previous and Next Chapter navigations */}
        <div className="flex justify-between items-center pt-8 border-t border-gold/20">
          {prevChapter ? (
            <button
              onClick={() => {
                navigate(`/books/${book.id}/chapter/${prevChapter.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center space-x-2 text-xs font-semibold text-accent hover:text-primary transition-colors bg-card border border-gold/25 px-4 py-2.5 rounded-xl shadow-soft"
            >
              <ChevronLeft className="w-4 h-4" />
              <div className="text-left">
                <span className="block text-4xs uppercase tracking-wider text-text/40 font-semibold leading-none">Previous</span>
                <span className="block mt-0.5 font-serif">{prevChapter.title.split(':')[0]}</span>
              </div>
            </button>
          ) : (
            <div />
          )}

          {nextChapter ? (
            <button
              onClick={() => {
                navigate(`/books/${book.id}/chapter/${nextChapter.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center space-x-2 text-xs font-semibold text-accent hover:text-primary transition-colors bg-card border border-gold/25 px-4 py-2.5 rounded-xl shadow-soft ml-auto"
            >
              <div className="text-right">
                <span className="block text-4xs uppercase tracking-wider text-text/40 font-semibold leading-none">Next</span>
                <span className="block mt-0.5 font-serif">{nextChapter.title.split(':')[0]}</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* Floating Notes Slide Drawer (Mobile/Desktop side-sheet) */}
      {notesOpen && (
        <>
          {/* Overlay backdrop */}
          <div 
            onClick={() => setNotesOpen(false)}
            className="fixed inset-0 z-45 bg-text/40 backdrop-blur-xs"
          />
          {/* Drawer body */}
          <div className="fixed top-0 bottom-0 right-0 z-50 w-full max-w-md bg-background border-l border-gold/30 shadow-soft p-6 flex flex-col justify-between animate-slide-in">
            <div className="space-y-6 overflow-y-auto flex-1 pb-4">
              <div className="flex justify-between items-center border-b border-gold-light/20 pb-4">
                <h3 className="text-md font-serif font-bold text-accent flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>Journal Reflection</span>
                </h3>
                <button
                  onClick={() => setNotesOpen(false)}
                  className="p-1.5 text-text/60 hover:text-text hover:bg-primary/10 rounded-lg transition-all"
                >
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveNote} className="space-y-4">
                <div className="text-3xs font-semibold bg-primary/10 text-accent px-2 py-1 rounded w-fit uppercase tracking-wider">
                  Reference: {book.title} - Ch {chapter.id} {selectedVerseForNote ? `, Verse ${selectedVerseForNote}` : ''}
                </div>
                
                <InputField
                  label="Title (Optional)"
                  id="noteTitle"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder={selectedVerseForNote ? `Insights on Verse ${selectedVerseForNote}` : 'Chapter reflection insights'}
                />

                <TextAreaField
                  label="Reflections"
                  id="noteContent"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Record your spiritual insights or lessons here..."
                  rows={6}
                  required
                />

                <button
                  type="submit"
                  className="w-full py-2.5 bg-primary hover:bg-secondary text-white font-semibold rounded-xl shadow-soft transition-all duration-300 saffron-hover flex items-center justify-center space-x-2"
                >
                  <span>Save Note</span>
                </button>
              </form>

              {/* Existing notes for this chapter */}
              {chapterNotes.length > 0 && (
                <div className="space-y-3 pt-6 border-t border-gold/15">
                  <h4 className="text-xs font-serif font-bold text-accent">Journal Entries for this Chapter</h4>
                  <div className="space-y-2">
                    {chapterNotes.map((n) => (
                      <div key={n.id} className="p-3 bg-card border border-gold/10 rounded-lg text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-accent">{n.title}</span>
                          <span className="text-4xs text-text/45">{n.verseId ? `Verse ${n.verseId}` : 'Chapter'}</span>
                        </div>
                        <p className="text-text/80 leading-relaxed">{n.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChapterReading;
