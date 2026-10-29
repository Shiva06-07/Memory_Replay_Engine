import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Brain, ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { emotionColors } from '../utils/helpers';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Timeline = () => {
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const { data } = await axios.get(`${API}/memories`, { withCredentials: true });
      setMemories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const groupByDate = (memories) => {
    const groups = {};
    memories.forEach(memory => {
      const date = new Date(memory.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(memory);
    });
    return groups;
  };

  const groupedMemories = groupByDate(memories);

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
        <div className="mb-12">
          <h1 className="text-5xl font-light tracking-tight mb-4" style={{fontFamily: 'Cormorant Garamond, serif'}} data-testid="timeline-page-title">
            Memory Timeline
          </h1>
          <p className="text-[#94A3B8] text-sm uppercase tracking-[0.2em]">Your journey through time</p>
        </div>

        {memories.length === 0 ? (
          <div className="text-center py-12 glass rounded-lg" data-testid="no-memories">
            <Calendar className="w-16 h-16 text-[#475569] mx-auto mb-4" />
            <p className="text-[#94A3B8]">No memories to display yet</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37] via-[#475569] to-transparent" />
            
            <div className="space-y-12">
              {Object.entries(groupedMemories).map(([date, dateMemories]) => (
                <div key={date} className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full glass flex items-center justify-center relative z-10">
                      <Calendar className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <h2 className="text-2xl font-light" style={{fontFamily: 'Cormorant Garamond, serif'}}>{date}</h2>
                  </div>

                  <div className="ml-24 space-y-4">
                    {dateMemories.map((memory) => {
                      const emotionStyle = emotionColors[memory.emotion] || emotionColors.neutral;
                      return (
                        <Link key={memory.id} to={`/memory/${memory.id}`}>
                          <div className="glass rounded-lg p-6 hover:bg-white/5 transition-all duration-300 border-l-4" style={{borderLeftColor: emotionStyle.color}} data-testid={`timeline-memory-${memory.id}`}>
                            <div className="flex items-start justify-between mb-3">
                              <span className={`text-xs uppercase tracking-wider px-3 py-1 rounded-full ${emotionStyle.bg} ${emotionStyle.text}`}>
                                {memory.emotion}
                              </span>
                              <span className="text-xs text-[#94A3B8] uppercase tracking-wider">
                                {new Date(memory.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[#E2E8F0] leading-relaxed mb-3">{memory.content}</p>
                            {memory.location && (
                              <p className="text-xs text-[#94A3B8] mb-2">📍 {memory.location}</p>
                            )}
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
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
