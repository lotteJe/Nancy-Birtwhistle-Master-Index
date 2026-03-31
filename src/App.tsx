import { useState, useMemo, useEffect } from 'react';
import { Search, Book, Info, ExternalLink, Copy, Check, Sparkles, Filter, X, Leaf, Coins, CookingPot, Globe, Utensils, Wand2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { masterIndex } from './data';
import { SearchResult, BOOK_MAP } from './types';

const BOOK_ICONS: Record<string, any> = {
  GH: Leaf,
  BG: Coins,
  SD: CookingPot,
  CG: Sparkles,
  GL: Globe,
  GK: Utensils,
  CM: Wand2,
  default: Book
};

const BOOK_COLORS: Record<string, { bg: string, text: string, border: string, ring: string }> = {
  GH: { bg: 'bg-[#E8F3ED]', text: 'text-[#2D5A43]', border: 'border-[#D1E7DB]', ring: 'ring-[#2D5A43]' },
  BG: { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]', border: 'border-[#FDE68A]', ring: 'ring-[#92400E]' },
  SD: { bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]', border: 'border-[#FECACA]', ring: 'ring-[#991B1B]' },
  CG: { bg: 'bg-[#E0F2FE]', text: 'text-[#075985]', border: 'border-[#BAE6FD]', ring: 'ring-[#075985]' },
  GL: { bg: 'bg-[#F0FDF4]', text: 'text-[#166534]', border: 'border-[#DCFCE7]', ring: 'ring-[#166534]' },
  GK: { bg: 'bg-[#F5F3FF]', text: 'text-[#5B21B6]', border: 'border-[#EDE9FE]', ring: 'ring-[#5B21B6]' },
  CM: { bg: 'bg-[#FFF1F2]', text: 'text-[#9F1239]', border: 'border-[#FFE4E6]', ring: 'ring-[#9F1239]' },
  default: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-100', ring: 'ring-slate-500' }
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [activeSelectedBooks, setActiveSelectedBooks] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showKey, setShowKey] = useState(false);

  // Clear results immediately when search query is emptied
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setActiveSearchQuery('');
      setActiveSelectedBooks([]);
    }
  }, [searchQuery]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length > 0 && trimmedQuery.length < 2) {
      return; // Minimum 2 characters
    }

    setIsSearching(true);
    // Increased duration to make the loading state more perceptible
    setTimeout(() => {
      setActiveSearchQuery(trimmedQuery);
      setActiveSelectedBooks([...selectedBooks]);
      setIsSearching(false);
    }, 800);
  };

  const filteredResults = useMemo(() => {
    const query = activeSearchQuery.toLowerCase();
    
    if (!query && activeSelectedBooks.length === 0) return [];

    const results = masterIndex
      .filter(entry => {
        const matchesBook = activeSelectedBooks.length === 0 || activeSelectedBooks.includes(entry.book);
        if (!matchesBook) return false;
        
        if (!query) return activeSelectedBooks.length > 0;
        
        const fullTitle = BOOK_MAP[entry.book] || entry.book;
        return entry.topic.toLowerCase().includes(query) || 
               entry.book.toLowerCase().includes(query) ||
               fullTitle.toLowerCase().includes(query);
      })
      .map((entry, index) => ({
        ...entry,
        id: `${entry.topic}-${entry.book}-${entry.page}-${index}`,
        fullBookTitle: BOOK_MAP[entry.book] || entry.book
      }));

    if (!query) return results;

    return results.sort((a, b) => {
      const aTopic = a.topic.toLowerCase();
      const bTopic = b.topic.toLowerCase();

      if (aTopic === query && bTopic !== query) return -1;
      if (bTopic === query && aTopic !== query) return 1;

      if (aTopic.startsWith(query) && !bTopic.startsWith(query)) return -1;
      if (bTopic.startsWith(query) && !aTopic.startsWith(query)) return 1;

      return aTopic.localeCompare(bTopic);
    });
  }, [activeSearchQuery, activeSelectedBooks]);

  const toggleBookFilter = (bookCode: string) => {
    setSelectedBooks(prev => 
      prev.includes(bookCode) 
        ? prev.filter(b => b !== bookCode) 
        : [...prev, bookCode]
    );
  };

  const clearAll = () => {
    setSearchQuery('');
    setSelectedBooks([]);
    setActiveSearchQuery('');
    setActiveSelectedBooks([]);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F4] text-[#1A1A1A] font-sans selection:bg-[#E8F3ED] selection:text-[#2D5A43]">
      {/* Top Progress Bar */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 h-1 bg-[#2D5A43] z-50 origin-left"
          />
        )}
      </AnimatePresence>

      {/* Header Section */}
      <header className="max-w-4xl mx-auto px-6 pt-12 pb-8 text-center space-y-8">
        {/* Top Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E8F3ED] rounded-full border border-[#D1E7DB]"
        >
          <span className="text-xs font-semibold text-[#2D5A43] tracking-wide flex items-center gap-2">
            📚 7 Books · One Searchable Index
          </span>
        </motion.div>

        {/* Titles */}
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight text-[#1A1A1A]">
            Nancy Birtwhistle
          </h1>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#2D5A43]">
            Master Index
          </h2>
        </div>

        {/* Description */}
        <p className="text-lg md:text-xl text-[#6B7280] max-w-xl mx-auto font-medium leading-relaxed">
          Find any recipe, cleaning tip, or gardening advice across all seven books — instantly.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto pt-4">
          <form onSubmit={handleSearch} className="relative group flex gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#9CA3AF] group-focus-within:text-[#2D5A43] transition-colors" />
              <input
                type="text"
                placeholder="Search for a recipe, cleaning tip..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E5E7EB] rounded-2xl py-5 pl-14 pr-14 text-lg font-medium focus:ring-4 focus:ring-[#2D5A43]/5 focus:border-[#2D5A43] outline-none transition-all placeholder:text-[#9CA3AF] search-shadow"
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 rounded-full text-[#9CA3AF] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={searchQuery.trim().length > 0 && searchQuery.trim().length < 2}
              className="px-8 bg-[#2D5A43] text-white rounded-2xl font-bold text-lg hover:bg-[#1A1A1A] transition-all shadow-lg shadow-[#2D5A43]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Search
            </button>
          </form>
          {searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
            <p className="text-left mt-2 text-xs font-bold text-[#991B1B] ml-4">
              Type at least 2 characters to search.
            </p>
          )}
        </div>

        {/* Book Filters */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={clearAll}
              className={`px-6 h-12 rounded-full text-sm font-bold transition-all duration-200 border ${
                selectedBooks.length === 0 
                  ? 'bg-[#2D5A43] text-white border-[#2D5A43] shadow-lg shadow-[#2D5A43]/20' 
                  : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#2D5A43]/30'
              }`}
            >
              All Books
            </button>
            {Object.entries(BOOK_MAP).map(([code, title]) => {
              const Icon = BOOK_ICONS[code] || Book;
              const colors = BOOK_COLORS[code] || BOOK_COLORS.default;
              const isActive = selectedBooks.includes(code);
              return (
                <button
                  key={code}
                  onClick={() => toggleBookFilter(code)}
                  className="group relative flex flex-col items-center gap-1.5 transition-all duration-200"
                  title={title}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                    isActive 
                      ? `${colors.bg} ${colors.text} border-[#2D5A43] shadow-lg scale-110 ring-4 ring-[#2D5A43]/10` 
                      : `bg-white ${colors.text} ${colors.border} hover:scale-105 hover:shadow-md`
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-[#2D5A43]' : 'text-[#9CA3AF]'}`}>
                    {code}
                  </span>
                </button>
              );
            })}
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => setShowKey(!showKey)}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#2D5A43] hover:text-[#1A1A1A] transition-colors bg-white px-4 py-2 rounded-full border border-[#E5E7EB] shadow-sm"
            >
              <Info className="w-4 h-4" />
              {showKey ? 'Hide Book Legend' : 'Show Book Legend'}
              {showKey ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence>
              {showKey && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full max-w-3xl"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-6 bg-white rounded-3xl border border-[#E5E7EB] text-left shadow-xl shadow-black/5">
                    {Object.entries(BOOK_MAP).map(([code, title]) => {
                      const Icon = BOOK_ICONS[code] || Book;
                      const colors = BOOK_COLORS[code] || BOOK_COLORS.default;
                      return (
                        <div key={code} className="flex items-center gap-3 p-3 rounded-2xl bg-[#F9F8F4] border border-[#F3F4F6]">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.bg} ${colors.text}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-[#2D5A43] uppercase tracking-widest leading-none">{code}</span>
                            </div>
                            <p className="text-xs font-bold text-[#1A1A1A] leading-tight truncate">{title}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-6 pt-2 pb-12">
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 space-y-6"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-[#E8F3ED] rounded-full" />
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-[#2D5A43] rounded-full animate-spin" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-xl font-serif font-bold text-[#2D5A43] animate-pulse">Searching the Master Index</p>
                <p className="text-sm text-[#6B7280] font-medium">Please wait a moment...</p>
              </div>
            </motion.div>
          ) : !activeSearchQuery && activeSelectedBooks.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-20 text-center space-y-10"
            >
              <div className="flex gap-6">
                <div className="w-24 h-24 rounded-[2rem] bg-[#E8F3ED] flex items-center justify-center rotate-[-6deg] shadow-sm">
                  <Book className="w-10 h-10 text-[#2D5A43]" />
                </div>
                <div className="w-24 h-24 rounded-[2rem] bg-[#FEF3C7] flex items-center justify-center rotate-[6deg] shadow-sm">
                  <Leaf className="w-10 h-10 text-[#92400E]" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-serif font-bold text-[#1A1A1A]">Start searching the index</h2>
                <p className="text-lg text-[#6B7280] max-w-md mx-auto font-medium leading-relaxed">
                  Type any topic — from recipes and cleaning hacks to gardening tips — and find exactly which book and page to look at.
                </p>
              </div>
            </motion.div>
          ) : filteredResults.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                    {filteredResults.length} Results
                  </span>
                  {activeSelectedBooks.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {activeSelectedBooks.map(code => (
                        <div 
                          key={code}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${BOOK_COLORS[code].bg} ${BOOK_COLORS[code].text} border ${BOOK_COLORS[code].border}`}
                        >
                          {code}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredResults.map((result, index) => {
                  const colors = BOOK_COLORS[result.book] || BOOK_COLORS.default;
                  const Icon = BOOK_ICONS[result.book] || Book;
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.03, 0.4) }}
                      className="group bg-white p-6 rounded-3xl border border-[#E5E7EB] hover:border-[#2D5A43] hover:shadow-xl hover:shadow-[#2D5A43]/5 transition-all duration-500 relative overflow-hidden flex flex-col h-full"
                    >
                      <div className="space-y-4 flex-grow">
                        <h3 className="text-2xl font-serif font-bold text-[#1A1A1A] leading-tight group-hover:text-[#2D5A43] transition-colors">
                          {result.topic}
                        </h3>
                        
                        <div className="flex flex-col gap-3">
                          <div className={`inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                            <Icon className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{result.fullBookTitle}</span>
                          </div>

                          <div className="flex items-baseline gap-2 pt-1 border-t border-[#F3F4F6]">
                            <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Page(s)</span>
                            <span className="text-lg font-medium text-[#1A1A1A]">{result.page}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Decorative background element */}
                      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#2D5A43]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-center space-y-8"
            >
              <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto border border-[#E5E7EB] shadow-sm">
                <Info className="w-10 h-10 text-[#D1D5DB]" />
              </div>
              <div className="space-y-3">
                <p className="text-3xl font-serif font-bold text-[#1A1A1A]">No results found</p>
                <p className="text-lg font-medium text-[#6B7280]">Try another search term or check your filters</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-24 text-center space-y-12">
        <div className="space-y-6">
          <div className="w-12 h-[1px] bg-[#E5E7EB] mx-auto" />
          <div className="max-w-2xl mx-auto space-y-4">
            <h4 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-widest">About this Index</h4>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              This searchable index is an independent community tool created to help readers navigate Nancy Birtwhistle's books. 
              All index data is based on the Master Index provided by Nancy Birtwhistle on her official website. 
              We do not own this data and encourage all users to support Nancy by purchasing her wonderful books.
            </p>
            <a 
              href="https://www.nancybirtwhistle.co.uk/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#2D5A43] font-bold text-sm hover:underline underline-offset-4"
            >
              Visit Nancy's Official Website
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <p className="text-[10px] text-[#9CA3AF] font-black uppercase tracking-[0.4em]">
            Nancy Birtwhistle Master Index · 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
