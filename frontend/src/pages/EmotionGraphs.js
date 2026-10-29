import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Brain, ArrowLeft, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { emotionColors } from '../utils/helpers';
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const EMOTIONS = ['happy', 'sad', 'fear', 'anger', 'neutral'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-[#0F172A] border border-white/10 rounded-lg p-4 shadow-xl">
      <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="capitalize text-[#E2E8F0]">{entry.dataKey}: {entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const EmotionGraphs = () => {
  const [timelineData, setTimelineData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [timelineRes, statsRes] = await Promise.all([
        axios.get(`${API}/memories/stats/emotion-timeline`, { withCredentials: true }),
        axios.get(`${API}/memories/stats/overview`, { withCredentials: true })
      ]);
      setTimelineData(timelineRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pieData = stats?.emotion_breakdown
    ? Object.entries(stats.emotion_breakdown).map(([emotion, count]) => ({
        name: emotion,
        value: count,
        color: emotionColors[emotion]?.color || '#9CA3AF'
      }))
    : [];

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
            <BarChart3 className="w-10 h-10 text-[#D4AF37]" />
            <h1 className="text-5xl font-light tracking-tight" style={{fontFamily: 'Cormorant Garamond, serif'}} data-testid="emotion-graphs-title">
              Emotion Analytics
            </h1>
          </div>
          <p className="text-[#94A3B8] text-sm uppercase tracking-[0.2em]">Visualize your emotional landscape over time</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#94A3B8]">Loading analytics...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {timelineData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-lg p-8"
                data-testid="emotion-timeline-chart"
              >
                <h2 className="text-2xl font-light mb-6" style={{fontFamily: 'Cormorant Garamond, serif'}}>
                  Emotion Timeline
                </h2>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={timelineData}>
                    <defs>
                      {EMOTIONS.map(emotion => (
                        <linearGradient key={emotion} id={`gradient-${emotion}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={emotionColors[emotion].color} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={emotionColors[emotion].color} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <XAxis
                      dataKey="date"
                      stroke="#94A3B8"
                      style={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                      tickFormatter={(val) => {
                        const d = new Date(val);
                        return `${d.getMonth() + 1}/${d.getDate()}`;
                      }}
                    />
                    <YAxis stroke="#94A3B8" style={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
                    <Tooltip content={<CustomTooltip />} />
                    {EMOTIONS.map(emotion => (
                      <Area
                        key={emotion}
                        type="monotone"
                        dataKey={emotion}
                        stroke={emotionColors[emotion].color}
                        fill={`url(#gradient-${emotion})`}
                        strokeWidth={2}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pieData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass rounded-lg p-8"
                  data-testid="emotion-pie-chart"
                >
                  <h2 className="text-2xl font-light mb-6" style={{fontFamily: 'Cormorant Garamond, serif'}}>
                    Emotion Distribution
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {pieData.map((entry) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-xs text-[#94A3B8] capitalize">{entry.name} ({entry.value})</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-lg p-8"
                data-testid="emotion-summary"
              >
                <h2 className="text-2xl font-light mb-6" style={{fontFamily: 'Cormorant Garamond, serif'}}>
                  Emotional Summary
                </h2>
                <div className="space-y-4">
                  {EMOTIONS.map(emotion => {
                    const count = stats?.emotion_breakdown?.[emotion] || 0;
                    const total = stats?.total_memories || 1;
                    const percentage = ((count / total) * 100).toFixed(0);
                    const style = emotionColors[emotion];
                    return (
                      <div key={emotion} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm capitalize ${style.text}`}>{emotion}</span>
                          <span className="text-xs text-[#94A3B8]">{count} ({percentage}%)</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: style.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-3xl font-light text-[#D4AF37]" style={{fontFamily: 'Cormorant Garamond, serif'}}>
                    {stats?.total_memories || 0}
                  </p>
                  <p className="text-xs text-[#94A3B8] uppercase tracking-wider mt-1">Total Memories</p>
                </div>
              </motion.div>
            </div>

            {timelineData.length === 0 && pieData.length === 0 && (
              <div className="text-center py-16 glass rounded-lg" data-testid="no-emotion-data">
                <BarChart3 className="w-16 h-16 text-[#475569] mx-auto mb-4" />
                <p className="text-[#94A3B8]">Not enough data to display charts. Start capturing memories!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionGraphs;
