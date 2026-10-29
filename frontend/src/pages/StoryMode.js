import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Brain, ArrowLeft, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const StoryMode = () => {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [memoriesUsed, setMemoriesUsed] = useState(0);

  const generateStory = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/memories/story-mode`, {}, { withCredentials: true });
      setStory(data.story);
      setMemoriesUsed(data.memories_used || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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

      <div className="max-w-2xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <BookOpen className="w-12 h-12 text-[#D4AF37] mx-auto mb-6" />
          <h1 className="text-5xl sm:text-6xl font-light tracking-tight mb-4" style={{fontFamily: 'Cormorant Garamond, serif'}} data-testid="story-mode-title">
            Story Mode
          </h1>
          <p className="text-[#94A3B8] text-sm uppercase tracking-[0.2em]">Your memories, woven into narrative</p>
        </motion.div>

        {!story && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="glass rounded-lg p-12 mb-8">
              <p className="text-[#E2E8F0] text-lg leading-relaxed mb-8" style={{fontFamily: 'Cormorant Garamond, serif'}}>
                Let AI weave your captured memories into a beautiful first-person narrative, transforming scattered moments into a cohesive story of your journey.
              </p>
              <Button
                onClick={generateStory}
                className="bg-[#D4AF37] hover:bg-[#C19B2B] text-black font-medium active:scale-95 transition-all duration-300 px-8 py-3"
                data-testid="generate-story-btn"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Generate My Story
              </Button>
            </div>
          </motion.div>
        )}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <Loader2 className="w-12 h-12 text-[#D4AF37] mx-auto mb-6 animate-spin" />
            <p className="text-[#94A3B8] text-sm uppercase tracking-[0.2em]">Weaving your memories into a story...</p>
          </motion.div>
        )}

        {story && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030712] pointer-events-none z-10 rounded-lg" style={{top: '80%'}} />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[#030712] pointer-events-none z-10 rounded-lg" style={{bottom: '95%'}} />

              <div className="glass rounded-lg p-12 relative" data-testid="story-content">
                <div className="text-center mb-8 pb-6 border-b border-white/10">
                  <p className="text-xs text-[#94A3B8] uppercase tracking-[0.2em]">
                    Composed from {memoriesUsed} memories
                  </p>
                </div>

                <div className="prose prose-invert max-w-none">
                  {story.split('\n\n').map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15, duration: 0.5 }}
                      className="text-xl leading-loose text-[#E2E8F0] mb-8"
                      style={{fontFamily: 'Cormorant Garamond, serif'}}
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button
                onClick={generateStory}
                variant="ghost"
                className="text-[#D4AF37] hover:text-white transition-colors"
                data-testid="regenerate-story-btn"
              >
                Regenerate Story
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StoryMode;


