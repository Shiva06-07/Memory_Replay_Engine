import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Brain, ArrowLeft, GitBranch, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { emotionColors } from '../utils/helpers';
import { motion } from 'framer-motion';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const WhatIf = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateWhatIf = async () => {
    setLoading(true);
    try {
      const { data: result } = await axios.post(`${API}/memories/${id}/what-if`, {}, { withCredentials: true });
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateWhatIf();
  }, [id]);

  const originalStyle = data?.original_emotion ? emotionColors[data.original_emotion] : emotionColors.neutral;

  return (
    <div className="min-h-screen">
      <nav className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-[#D4AF37]" />
            <span className="text-xl font-light" style={{fontFamily: 'Cormorant Garamond, serif'}}>Memory Replay</span>
          </Link>
          <Link to={`/memory/${id}`}>
            <Button variant="ghost" className="text-[#94A3B8] hover:text-white" data-testid="back-to-memory">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Memory
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-6">
            <GitBranch className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-light tracking-tight mb-4" style={{fontFamily: 'Cormorant Garamond, serif'}} data-testid="whatif-page-title">
            What If...?
          </h1>
          <p className="text-[#94A3B8] text-sm uppercase tracking-[0.2em]">Explore alternate realities of this memory</p>
        </motion.div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Loader2 className="w-12 h-12 text-[#D4AF37] mx-auto mb-6 animate-spin" />
            <p className="text-[#94A3B8] text-sm uppercase tracking-[0.2em]">Simulating alternate realities...</p>
          </motion.div>
        )}

        {data && !loading && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-lg p-8 border-l-4"
              style={{ borderLeftColor: originalStyle?.color || '#9CA3AF' }}
              data-testid="original-memory"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded">
                  What Actually Happened
                </span>
                {data.original_emotion && (
                  <span className={`text-xs uppercase tracking-wider px-3 py-1 rounded-full ${originalStyle?.bg} ${originalStyle?.text}`}>
                    {data.original_emotion}
                  </span>
                )}
              </div>
              <p className="text-xl leading-loose text-[#E2E8F0]" style={{fontFamily: 'Cormorant Garamond, serif'}}>
                {data.original}
              </p>
            </motion.div>

            <div className="flex justify-center">
              <div className="w-px h-12 bg-gradient-to-b from-[#D4AF37] to-transparent" />
            </div>

            <div className="space-y-6">
              {data.scenarios?.map((scenario, index) => {
                const scenarioStyle = emotionColors[scenario.emotion] || emotionColors.neutral;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.15 }}
                    className="glass rounded-lg p-8 hover:bg-white/5 transition-all duration-300 border-l-4"
                    style={{ borderLeftColor: scenarioStyle.color }}
                    data-testid={`whatif-scenario-${index}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs uppercase tracking-wider px-3 py-1 rounded bg-white/5 text-[#94A3B8]">
                        Scenario {index + 1}
                      </span>
                      <span className={`text-xs uppercase tracking-wider px-3 py-1 rounded-full ${scenarioStyle.bg} ${scenarioStyle.text}`}>
                        {scenario.emotion}
                      </span>
                    </div>

                    <h3 className="text-2xl text-[#F8FAFC] mb-4 leading-snug" style={{fontFamily: 'Cormorant Garamond, serif'}}>
                      {scenario.title}
                    </h3>

                    <p className="text-[#E2E8F0] leading-relaxed mb-4" style={{fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem'}}>
                      {scenario.narrative}
                    </p>

                    {scenario.divergence && (
                      <div className="flex items-start gap-2 pt-4 border-t border-white/5">
                        <GitBranch className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                        <p className="text-sm text-[#94A3B8]">
                          <span className="text-[#D4AF37]">Divergence point:</span> {scenario.divergence}
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {data.scenarios?.length === 0 && (
              <div className="text-center py-12 glass rounded-lg" data-testid="no-scenarios">
                <GitBranch className="w-12 h-12 text-[#475569] mx-auto mb-4" />
                <p className="text-[#94A3B8]">Could not generate alternate scenarios. Try again.</p>
              </div>
            )}

            <div className="text-center mt-8">
              <Button
                onClick={generateWhatIf}
                variant="ghost"
                className="text-[#D4AF37] hover:text-white transition-colors"
                data-testid="regenerate-whatif-btn"
              >
                Regenerate Scenarios
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatIf;
