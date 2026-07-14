import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateNote, deleteNote, addNote } from '../features/notes/noteSlice';
import { addToast } from '../features/ui/uiSlice';
import { SCRIPTURES_DATA } from '../constants/scriptures';
import { FileText, Search, Plus, Trash2, Edit3, Calendar, BookOpen, AlertTriangle } from 'lucide-react';
import { InputField, TextAreaField } from '../components/ReusableForms';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';

export const Notes = () => {
  const dispatch = useDispatch();
  const notes = useSelector(state => state.notes.items);
  
  const [search, setSearch] = useState('');
  const [selectedBookFilter, setSelectedBookFilter] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState(null);
  
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteBookId, setNoteBookId] = useState('gita');
  const [noteChapterId, setNoteChapterId] = useState('1');
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase()) ||
      note.bookTitle.toLowerCase().includes(search.toLowerCase());
      
    const matchesBook = selectedBookFilter === '' || note.bookId === selectedBookFilter;
    
    return matchesSearch && matchesBook;
  });

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setNoteTitle('');
    setNoteContent('');
    setNoteBookId('gita');
    setNoteChapterId('1');
    setModalOpen(true);
  };

  const handleOpenEditModal = (note) => {
    setIsEditing(true);
    setActiveNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteBookId(note.bookId);
    setNoteChapterId(note.chapterId);
    setModalOpen(true);
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!noteContent.trim()) {
      dispatch(addToast({ type: 'warning', message: 'Note content cannot be empty' }));
      return;
    }

    const selectedBookObj = SCRIPTURES_DATA.find(b => b.id === noteBookId);
    const bookTitle = selectedBookObj ? selectedBookObj.title : 'Scripture';

    if (isEditing) {
      dispatch(updateNote({
        id: activeNoteId,
        title: noteTitle.trim() || 'Untitled Reflection',
        content: noteContent
      }));
      dispatch(addToast({ type: 'success', message: 'Note updated successfully!' }));
    } else {
      dispatch(addNote({
        bookId: noteBookId,
        bookTitle: bookTitle,
        chapterId: noteChapterId || '1',
        chapterTitle: `Chapter ${noteChapterId || '1'}`,
        title: noteTitle.trim() || 'Untitled Reflection',
        content: noteContent
      }));
      dispatch(addToast({ type: 'success', message: 'Reflection saved to journal!' }));
    }

    setModalOpen(false);
  };

  const handleOpenDeleteConfirm = (noteId) => {
    setNoteToDelete(noteId);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (noteToDelete) {
      dispatch(deleteNote(noteToDelete));
      dispatch(addToast({ type: 'success', message: 'Journal reflection deleted.' }));
      setDeleteConfirmOpen(false);
      setNoteToDelete(null);
    }
  };

  return (
    <div className="space-y-6 py-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-serif font-bold text-accent">Journal Reflections</h1>
          <p className="text-xs text-text/60 mt-1">Meditate on teachings and record your digital scripture journal.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-primary hover:bg-secondary text-white text-xs font-semibold rounded-xl shadow-soft flex items-center space-x-1.5 saffron-hover"
        >
          <Plus className="w-4 h-4" />
          <span>New Reflection</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="sm:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text/40">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes title, content, scripture..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-gold/25 rounded-xl shadow-soft text-sm text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder-text/40"
          />
        </div>
        {/* Filter Scripture */}
        <select
          value={selectedBookFilter}
          onChange={(e) => setSelectedBookFilter(e.target.value)}
          className="px-3 py-2.5 bg-card border border-gold/25 rounded-xl shadow-soft text-xs text-text focus:outline-none focus:border-primary"
        >
          <option value="">All Scriptures</option>
          {SCRIPTURES_DATA.map(b => (
            <option key={b.id} value={b.id}>{b.title}</option>
          ))}
        </select>
      </div>

      {/* Notes list */}
      {filteredNotes.length === 0 ? (
        <EmptyState
          title={search || selectedBookFilter ? "No Notes Found" : "Your Journal is Empty"}
          message={search || selectedBookFilter ? "No entries match your search query or book filters." : "Pen down your thoughts and realizations while reading holy verses."}
          icon={FileText}
          actionText={search || selectedBookFilter ? null : "Write First Entry"}
          onAction={search || selectedBookFilter ? null : handleOpenAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div 
              key={note.id} 
              className="bg-card border border-gold/20 rounded-xl p-5 shadow-soft hover:shadow-gold flex flex-col justify-between space-y-4 hover:border-gold/30 transition-all duration-300 relative group"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex justify-between items-start space-x-2">
                  <h3 className="text-sm font-serif font-bold text-accent line-clamp-1">{note.title}</h3>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-1 shrink-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEditModal(note)}
                      className="p-1 text-text/50 hover:text-accent rounded hover:bg-primary/10 transition-colors"
                      title="Edit note"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteConfirm(note.id)}
                      className="p-1 text-text/50 hover:text-red-700 rounded hover:bg-red-50 transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs text-text/80 leading-relaxed line-clamp-4 whitespace-pre-line font-sans">
                  {note.content}
                </p>
              </div>

              {/* Footer info */}
              <div className="pt-3 border-t border-gold/5 flex justify-between items-center text-3xs font-semibold text-text/55">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-secondary" />
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </span>
                <span className="flex items-center space-x-1 text-primary">
                  <BookOpen className="w-3 h-3" />
                  <span className="truncate max-w-[100px]">{note.bookTitle} Ch {note.chapterId}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Reflection' : 'New Journal Reflection'}
      >
        <form onSubmit={handleSaveNote} className="space-y-4">
          {!isEditing && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs font-semibold text-text/70 mb-1.5">Select Scripture</label>
                <select
                  value={noteBookId}
                  onChange={(e) => setNoteBookId(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-gold/30 rounded-xl text-xs focus:outline-none focus:border-primary"
                >
                  {SCRIPTURES_DATA.map(b => (
                    <option key={b.id} value={b.id}>{b.title}</option>
                  ))}
                </select>
              </div>
              <InputField
                label="Chapter Number"
                id="noteChapterId"
                type="number"
                value={noteChapterId}
                onChange={(e) => setNoteChapterId(e.target.value)}
                placeholder="1"
                min="1"
              />
            </div>
          )}

          <InputField
            label="Reflection Title"
            id="noteTitle"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Key takeaway or realization"
          />

          <TextAreaField
            label="Spiritual Insights"
            id="noteContent"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Record your realizations, lessons, and thoughts..."
            rows={5}
            required
          />

          <div className="flex justify-end space-x-2 pt-2 border-t border-gold/10">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-text/5 hover:bg-text/10 text-text/70 text-xs font-semibold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary hover:bg-secondary text-white text-xs font-semibold rounded-xl shadow-soft saffron-hover"
            >
              {isEditing ? 'Update Entry' : 'Save Entry'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-xs font-semibold leading-relaxed">
              Are you sure you want to delete this reflection? This action is permanent and cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setDeleteConfirmOpen(false)}
              className="px-4 py-2 bg-text/5 hover:bg-text/10 text-text/70 text-xs font-semibold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow transition-colors"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Notes;
