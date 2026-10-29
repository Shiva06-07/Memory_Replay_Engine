import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Brain, ArrowLeft, Lightbulb, TrendingUp, Zap, Award, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { emotionColors } from '../utils/helpers';
import { motion } from 'framer-motion';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const categoryIcons = {
  pattern: TrendingUp,
  trigger: Zap,
  recommendation: Lightbulb,
  highlight: Award
};

const categoryLabels = {
  pattern: 'Pattern',
  trigger: 'Trigger',
  recommendation: 'Recommendation',
  highlight: 'Highlight'
};

const Insights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [memoriesAnalyzed, setMemoriesAnalyzed] = useState(0);
  const [fetched, setFetched] = useState(false);
  const [message, setMessage] = useState('');

  const fetchInsights = async () => {
    setLoading(true);
    setMessage('');
    try {
      const { data } = await axios.get(`${API}/memories/insights`, { withCredentials: true });
      setInsights(data.insights || []);
      setMemoriesAnalyzed(data.memories_analyzed || 0);
      setMessage(data.message || '');
      setFetched(true);
    } catch (err) {
      console.error(err);
      setMessage('Failed to generate insights.');
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
          className="mb-12 text-center"
        >
          <div className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-light tracking-tight mb-4" style={{fontFamily: 'Cormorant Garamond, serif'}} data-testid="insights-page-title">
            Memory Intelligence
          </h1>
          <p className="text-[#94A3B8] text-sm uppercase tracking-[0.2em] mb-8">
            AI-powered patterns and insights from your memories
          </p>

          {!fetched && !loading && (
            <Button
              onClick={fetchInsights}
              className="bg-[#D4AF37] hover:bg-[#C19B2B] text-black font-medium active:scale-95 transition-all duration-300 px-8 py-3"
              data-testid="generate-insights-btn"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Generate Insights
            </Button>
          )}
        </motion.div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Loader2 className="w-12 h-12 text-[#D4AF37] mx-auto mb-6 animate-spin" />
            <p className="text-[#94A3B8] text-sm uppercase tracking-[0.2em]">Analyzing your memories...</p>
            <p className="text-[#475569] text-xs mt-2">Discovering patterns, triggers, and recommendations</p>
          </motion.div>
        )}

        {message && !loading && insights.length === 0 && (
          <div className="text-center py-12 glass rounded-lg" data-testid="insights-message">
            <Lightbulb className="w-12 h-12 text-[#475569] mx-auto mb-4" />
            <p className="text-[#94A3B8]">{message}</p>
          </div>
        )}

        {insights.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center mb-8">
              <p className="text-xs text-[#94A3B8] uppercase tracking-[0.2em]">
                Based on {memoriesAnalyzed} memories analyzed
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insights.map((insight, index) => {
                const Icon = categoryIcons[insight.category] || Lightbulb;
                const emotionStyle = emotionColors[insight.emotion] || emotionColors.neutral;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="glass rounded-lg p-6 hover:bg-white/5 transition-all duration-300 group"
                    data-testid={`insight-card-${index}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${emotionStyle.bg}`}>
                        <Icon className={`w-5 h-5 ${emotionStyle.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                            {categoryLabels[insight.category] || insight.category}
                          </span>
                          <span className={`text-xs uppercase tracking-wider px-2 py-0.5 rounded-full ${emotionStyle.bg} ${emotionStyle.text}`}>
                            {insight.emotion}
                          </span>
                        </div>
                        <h3 className="text-lg text-[#F8FAFC] mb-2 leading-snug" style={{fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem'}}>
                          {insight.title}
                        </h3>
                        <p className="text-sm text-[#94A3B8] leading-relaxed">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <Button
                onClick={fetchInsights}
                variant="ghost"
                className="text-[#D4AF37] hover:text-white transition-colors"
                data-testid="refresh-insights-btn"
              >
                Refresh Insights
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Insights;
