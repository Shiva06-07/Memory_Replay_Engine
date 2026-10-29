import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Brain, ArrowLeft, Search as SearchIcon, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { emotionColors } from '../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const EMOTIONS = ['happy', 'sad', 'fear', 'anger', 'neutral'];

const Search = () => {
  const [query, setQuery] = useState('');
  const [emotion, setEmotion] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tags, setTags] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const payload = {};
      if (query.trim()) payload.query = query.trim();
      if (emotion && emotion !== 'all') payload.emotion = emotion;
      if (startDate) payload.start_date = new Date(startDate).toISOString();
      if (endDate) payload.end_date = new Date(endDate).toISOString();
      if (tags.trim()) payload.tags = tags.split(',').map(t => t.trim()).filter(Boolean);

      const { data } = await axios.post(`${API}/memories/search`, payload, { withCredentials: true });
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setEmotion('');
    setStartDate('');
    setEndDate('');
    setTags('');
    setResults([]);
    setSearched(false);
  };

  return (
    <div className="min-h-screen">
      <nav className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-[#D4AF37]" />
            <span className="text-xl font-light" style={{fontFamily: 'Cormorant Garamond, serif'}}>Memory Replay</span>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" className="text-[#94A3B8] hover:text-white" data-testid="back-to-dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-light tracking-tight mb-4" style={{fontFamily: 'Cormorant Garamond, serif'}} data-testid="search-page-title">
            Search Memories
          </h1>
          <p className="text-[#94A3B8] text-sm uppercase tracking-[0.2em]">Find moments that matter</p>
        </motion.div>

        <form onSubmit={handleSearch} className="glass rounded-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm text-[#94A3B8] uppercase tracking-wider">Keyword</Label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by keyword..."
                  className="bg-black/50 border-white/10 text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] pl-10"
                  data-testid="search-keyword-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-[#94A3B8] uppercase tracking-wider">Emotion</Label>
              <Select value={emotion} onValueChange={setEmotion}>
                <SelectTrigger className="bg-black/50 border-white/10 text-white focus:ring-1 focus:ring-[#D4AF37]" data-testid="search-emotion-select">
                  <SelectValue placeholder="Any emotion" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F172A] border-white/10">
                  <SelectItem value="all" className="text-white hover:bg-white/10">Any emotion</SelectItem>
                  {EMOTIONS.map(e => (
                    <SelectItem key={e} value={e} className="text-white hover:bg-white/10">
                      <span className="capitalize">{e}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-[#94A3B8] uppercase tracking-wider">Tags (comma-separated)</Label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., work, travel"
                className="bg-black/50 border-white/10 text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                data-testid="search-tags-input"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-[#94A3B8] uppercase tracking-wider">Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-black/50 border-white/10 text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                data-testid="search-start-date"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-[#94A3B8] uppercase tracking-wider">End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-black/50 border-white/10 text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                data-testid="search-end-date"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#D4AF37] hover:bg-[#C19B2B] text-black font-medium active:scale-95 transition-all duration-300"
              data-testid="search-submit-btn"
            >
              <SearchIcon className="w-4 h-4 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </Button>
            <Button
              type="button"
              onClick={clearSearch}
              variant="ghost"
              className="text-[#94A3B8] hover:text-white"
              data-testid="search-clear-btn"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </form>

        {searched && (
          <div className="mb-4">
            <p className="text-sm text-[#94A3B8] uppercase tracking-wider" data-testid="search-results-count">
              {results.length} {results.length === 1 ? 'result' : 'results'} found
            </p>
          </div>
        )}

        <AnimatePresence>
          <div className="space-y-4">
            {results.map((memory, index) => {
              const emotionStyle = emotionColors[memory.emotion] || emotionColors.neutral;
              return (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/memory/${memory.id}`}>
                    <div
                      className="glass rounded-lg p-6 hover:bg-white/5 transition-all duration-300 border-l-4"
                      style={{ borderLeftColor: emotionStyle.color }}
                      data-testid={`search-result-${memory.id}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs uppercase tracking-wider px-3 py-1 rounded-full ${emotionStyle.bg} ${emotionStyle.text}`}>
                          {memory.emotion}
                        </span>
                        <span className="text-xs text-[#94A3B8] uppercase tracking-wider">
                          {new Date(memory.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[#E2E8F0] leading-relaxed mb-3">{memory.content}</p>
                      {memory.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {memory.tags.map((tag, i) => (
                            <span key={i} className="text-xs text-[#94A3B8] bg-white/5 px-2 py-1 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>

        {searched && results.length === 0 && !loading && (
          <div className="text-center py-16 glass rounded-lg" data-testid="no-search-results">
            <SearchIcon className="w-16 h-16 text-[#475569] mx-auto mb-4" />
            <p className="text-[#94A3B8]">No memories match your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
