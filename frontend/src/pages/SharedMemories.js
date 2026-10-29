import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Brain, ArrowLeft, Users, Share2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { emotionColors } from '../utils/helpers';
import { motion } from 'framer-motion';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SharedMemories = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSharedMemories();
  }, []);

  const fetchSharedMemories = async () => {
    try {
      const { data } = await axios.get(`${API}/memories/shared`, { withCredentials: true });
      setMemories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
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

      <div className="max-w-5xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <Users className="w-10 h-10 text-[#D4AF37]" />
            <h1 className="text-5xl font-light tracking-tight" style={{fontFamily: 'Cormorant Garamond, serif'}} data-testid="shared-page-title">
              Shared Memories
            </h1>
          </div>
          <p className="text-[#94A3B8] text-sm uppercase tracking-[0.2em]">Memories others have shared with you</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#94A3B8]">Loading shared memories...</p>
          </div>
        ) : memories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 glass rounded-lg"
            data-testid="no-shared-memories"
          >
            <Share2 className="w-16 h-16 text-[#475569] mx-auto mb-4" />
            <p className="text-[#94A3B8] text-lg mb-2" style={{fontFamily: 'Cormorant Garamond, serif'}}>No shared memories yet</p>
            <p className="text-[#475569] text-sm">When someone shares a memory with you, it will appear here</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {memories.map((memory, index) => {
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
                      data-testid={`shared-memory-${memory.id}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className={`text-xs uppercase tracking-wider px-3 py-1 rounded-full ${emotionStyle.bg} ${emotionStyle.text}`}>
                            {memory.emotion}
                          </span>
                          {memory.shared_by && (
                            <span className="text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                              <Share2 className="w-3 h-3" />
                              Shared by {memory.shared_by}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#94A3B8] uppercase tracking-wider">
                          {new Date(memory.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[#E2E8F0] leading-relaxed mb-3" style={{fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem'}}>
                        {memory.content}
                      </p>
                      {memory.tags?.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

export default SharedMemories;
