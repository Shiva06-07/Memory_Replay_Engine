import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Brain, ArrowLeft, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { emotionColors } from '../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const EMOTIONS = ['happy', 'sad', 'fear', 'anger', 'neutral'];

const EmotionReplay = () => {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [memories, setMemories] = useState([]);
  const [allMemories, setAllMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllMemories();
  }, []);

  const fetchAllMemories = async () => {
    try {
      const { data } = await axios.get(`${API}/memories`, { withCredentials: true });
      setAllMemories(data);
      setMemories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterByEmotion = (emotion) => {
    if (selectedEmotion === emotion) {
      setSelectedEmotion(null);
      setMemories(allMemories);
    } else {
      setSelectedEmotion(emotion);
      setMemories(allMemories.filter(m => m.emotion === emotion));
    }
  };

  const emotionCounts = EMOTIONS.reduce((acc, emotion) => {
    acc[emotion] = allMemories.filter(m => m.emotion === emotion).length;
    return acc;
  }, {});

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
          <div className="flex items-center gap-4 mb-4">
            <Heart className="w-10 h-10 text-[#D4AF37]" />
            <h1 className="text-5xl font-light tracking-tight" style={{fontFamily: 'Cormorant Garamond, serif'}} data-testid="emotion-replay-title">
              Emotion Replay
            </h1>
          </div>
          <p className="text-[#94A3B8] text-sm uppercase tracking-[0.2em]">Explore memories through the lens of emotions</p>
        </motion.div>

        <div className="flex flex-wrap gap-4 mb-12">
          {EMOTIONS.map((emotion) => {
            const style = emotionColors[emotion];
            const isActive = selectedEmotion === emotion;
            return (
              <motion.button
                key={emotion}
                onClick={() => filterByEmotion(emotion)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full border transition-all duration-300 flex items-center gap-3 ${
                  isActive
                    ? `${style.bg} ${style.text} ${style.border} border-2`
                    : 'border-white/10 text-[#94A3B8] hover:border-white/30 hover:text-white'
                }`}
                data-testid={`emotion-filter-${emotion}`}
              >
                <span className="capitalize font-medium">{emotion}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-white/5'}`}>
                  {emotionCounts[emotion]}
                </span>
              </motion.button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#94A3B8]">Loading memories...</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-[#94A3B8] uppercase tracking-wider">
                {memories.length} {memories.length === 1 ? 'memory' : 'memories'} 
                {selectedEmotion && <span> feeling <span className={emotionColors[selectedEmotion]?.text}>{selectedEmotion}</span></span>}
              </p>
              {selectedEmotion && (
                <Button
                  onClick={() => { setSelectedEmotion(null); setMemories(allMemories); }}
                  variant="ghost"
                  className="text-[#D4AF37] hover:text-white text-sm"
                  data-testid="clear-filter-btn"
                >
                  Clear Filter
                </Button>
              )}
            </div>

            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {memories.map((memory) => {
                  const emotionStyle = emotionColors[memory.emotion] || emotionColors.neutral;
                  return (
                    <motion.div
                      key={memory.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link to={`/memory/${memory.id}`}>
                        <div
                          className="glass rounded-lg p-6 hover:bg-white/5 transition-all duration-300 h-full border-l-4"
                          style={{ borderLeftColor: emotionStyle.color }}
                          data-testid={`emotion-memory-${memory.id}`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <span className={`text-xs uppercase tracking-wider px-3 py-1 rounded-full ${emotionStyle.bg} ${emotionStyle.text}`}>
                              {memory.emotion}
                            </span>
                            <span className="text-xs text-[#94A3B8] uppercase tracking-wider">
                              {new Date(memory.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-[#E2E8F0] leading-relaxed mb-4" style={{fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem'}}>
                            {memory.content}
                          </p>
                          {memory.tags.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                              {memory.tags.map((tag, i) => (
                                <span key={i} className="text-xs text-[#94A3B8] bg-white/5 px-2 py-1 rounded">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                          {memory.emotion_score && (
                            <div className="mt-3 pt-3 border-t border-white/5">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${memory.emotion_score * 100}%`, backgroundColor: emotionStyle.color }}
                                  />
                                </div>
                                <span className="text-xs text-[#94A3B8]">{(memory.emotion_score * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>

            {memories.length === 0 && (
              <div className="text-center py-16 glass rounded-lg" data-testid="no-emotion-memories">
                <Heart className="w-16 h-16 text-[#475569] mx-auto mb-4" />
                <p className="text-[#94A3B8]">No memories with this emotion yet</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmotionReplay;
