import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { DAILY_SHLOKAS, SCRIPTURES_DATA } from '../constants/scriptures';
import { ArrowRight, BookOpen, Compass, Award } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dailyShloka = DAILY_SHLOKAS[0];

  return (
    <div className="space-y-12 py-4">
      {/* Hero section */}
      <section className="text-center py-12 md:py-20 px-6 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent border border-gold/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <span className="text-xs font-bold text-accent uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
          Welcome to Sacred Wisdom
        </span>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-accent tracking-wide mt-4 max-w-2xl mx-auto leading-tight">
          Explore the Eternal Truths of <span className="saffron-text-gradient">Sanatan Dharma</span>
        </h1>
        <p className="text-sm md:text-base text-text/80 mt-4 max-w-lg mx-auto leading-relaxed">
          Embark on a peaceful spiritual journey through the Bhagavad Gita, Upanishads, Vedas, and other holy scriptures. Keep journals, track progress, and find inner silence.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
            className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-secondary text-white font-semibold rounded-xl shadow-soft flex items-center justify-center space-x-2 transition-all saffron-hover"
          >
            <span>{isAuthenticated ? 'Go to Dashboard' : 'Begin Your Journey'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/books"
            className="w-full sm:w-auto px-6 py-3 bg-card border border-gold/30 hover:border-gold text-accent font-semibold rounded-xl shadow-soft flex items-center justify-center space-x-2 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse Scriptures</span>
          </Link>
        </div>
      </section>

      {/* Daily Shloka Card */}
      <section className="max-w-3xl mx-auto">
        <div className="bg-card border gold-border rounded-xl shadow-soft p-6 md:p-8 text-center relative overflow-hidden">
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">
            Shloka of the Day
          </span>
          <h2 className="text-sm font-semibold text-accent/60 mt-1 mb-4">{dailyShloka.book} ({dailyShloka.citation})</h2>
          
          <div className="bg-background/80 py-6 px-4 rounded-xl border border-gold/10 inline-block w-full max-w-2xl">
            <p className="text-base md:text-lg font-serif font-semibold text-accent leading-loose whitespace-pre-line select-none">
              {dailyShloka.text}
            </p>
            <p className="text-xs md:text-sm text-text/60 italic font-medium mt-4 font-sans leading-relaxed">
              {dailyShloka.transliteration}
            </p>
          </div>

          <div className="mt-6 space-y-2 max-w-2xl mx-auto">
            <p className="text-sm text-text font-medium leading-relaxed">
              "{dailyShloka.translation}"
            </p>
            <div className="h-[1px] bg-gold/25 w-24 mx-auto my-3" />
            <p className="text-xs text-text/70 leading-relaxed font-sans">
              <strong>Reflections:</strong> {dailyShloka.meaning}
            </p>
          </div>
        </div>
      </section>

      {/* Core Scriptures Grid preview */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-accent">Scriptures Covered</h2>
          <p className="text-xs text-text/70 mt-1">Sacred texts available for study and contemplation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SCRIPTURES_DATA.slice(0, 3).map((book) => (
            <div key={book.id} className="bg-card rounded-xl border border-gold/20 p-5 shadow-soft hover:shadow-gold transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-accent">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-md font-serif font-bold text-accent">{book.title}</h3>
                <p className="text-xs text-text/80 line-clamp-3 leading-relaxed">{book.description}</p>
              </div>
              <div className="pt-4 flex justify-between items-center text-xs font-semibold text-accent border-t border-gold/5 mt-4">
                <span>{book.chaptersCount} Chapters</span>
                <Link to={`/books/${book.id}`} className="hover:text-primary flex items-center space-x-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center pt-2">
          <Link 
            to="/books" 
            className="inline-flex items-center space-x-2 text-sm font-semibold text-accent hover:text-primary transition-colors"
          >
            <span>See all holy scriptures</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="flex flex-col items-center text-center p-4">
          <div className="p-3 bg-secondary/10 rounded-full text-secondary mb-3">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-accent text-sm">Spiritual Guidance</h3>
          <p className="text-xs text-text/75 mt-1 max-w-xs">Gain timeless insight and clear solutions for everyday challenges directly from historical wisdom.</p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <div className="p-3 bg-secondary/10 rounded-full text-secondary mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-accent text-sm">Offline Study Ready</h3>
          <p className="text-xs text-text/75 mt-1 max-w-xs">Designed for deep study, bookmarked readings, and digital journals.</p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <div className="p-3 bg-secondary/10 rounded-full text-secondary mb-3">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-accent text-sm">Pure Peaceful Layout</h3>
          <p className="text-xs text-text/75 mt-1 max-w-xs">Saffron-tinged peaceful layout with high-readability fonts and adjustable controls.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
