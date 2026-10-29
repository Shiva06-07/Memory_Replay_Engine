import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Brain, Plus, TrendingUp, Calendar, Sparkles, BookOpen, Heart, Search, BarChart3, Star, Lightbulb, Waypoints, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { emotionColors } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentMemories, setRecentMemories] = useState([]);
  const [dailySummary, setDailySummary] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchRecentMemories();
    fetchDailySummary();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API}/memories/stats/overview`, { withCredentials: true });
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecentMemories = async () => {
    try {
      const { data } = await axios.get(`${API}/memories`, { withCredentials: true });
      setRecentMemories(data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDailySummary = async () => {
    try {
      const { data } = await axios.get(`${API}/memories/daily-summary`, { withCredentials: true });
      setDailySummary(data);
    } catch (err) {
      console.error(err);
    }
  };

  const emotionChartData = stats?.emotion_breakdown ? Object.entries(stats.emotion_breakdown).map(([emotion, count]) => ({
    emotion,
    count,
    color: emotionColors[emotion]?.color || '#9CA3AF'
  })) : [];

  return (
    <div className="min-h-screen">
      <nav className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-[#D4AF37]" />
            <span className="text-xl font-light" style={{fontFamily: 'Cormorant Garamond, serif'}}>Memory Replay</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/timeline">
              <Button variant="ghost" className="text-[#94A3B8] hover:text-white text-sm" data-testid="nav-timeline">
                <Calendar className="w-4 h-4 mr-1.5" />
                Timeline
              </Button>
            </Link>
            <Link to="/story-mode">
              <Button variant="ghost" className="text-[#94A3B8] hover:text-white text-sm" data-testid="nav-story-mode">
                <BookOpen className="w-4 h-4 mr-1.5" />
                Story
              </Button>
            </Link>
            <Link to="/emotion-replay">
              <Button variant="ghost" className="text-[#94A3B8] hover:text-white text-sm" data-testid="nav-emotion-replay">
                <Heart className="w-4 h-4 mr-1.5" />
                Emotions
              </Button>
            </Link>
            <Link to="/emotions">
              <Button variant="ghost" className="text-[#94A3B8] hover:text-white text-sm" data-testid="nav-emotion-graphs">
                <BarChart3 className="w-4 h-4 mr-1.5" />
                Analytics
              </Button>
            </Link>
            <Link to="/search">
              <Button variant="ghost" className="text-[#94A3B8] hover:text-white text-sm" data-testid="nav-search">
                <Search className="w-4 h-4 mr-1.5" />
                Search
              </Button>
            </Link>
            <Link to="/insights">
              <Button variant="ghost" className="text-[#94A3B8] hover:text-white text-sm" data-testid="nav-insights">
                <Lightbulb className="w-4 h-4 mr-1.5" />
                Insights
              </Button>
            </Link>
            <Link to="/brain-map">
              <Button variant="ghost" className="text-[#94A3B8] hover:text-white text-sm" data-testid="nav-brain-map">
                <Waypoints className="w-4 h-4 mr-1.5" />
                Brain Map
              </Button>
            </Link>
            <Link to="/shared">
              <Button variant="ghost" className="text-[#94A3B8] hover:text-white text-sm" data-testid="nav-shared">
                <Users className="w-4 h-4 mr-1.5" />
                Shared
              </Button>
            </Link>
            <Link to="/capture">
              <Button className="bg-[#D4AF37] hover:bg-[#C19B2B] text-black active:scale-95 transition-all duration-300" data-testid="capture-memory-nav-btn">
                <Plus className="w-4 h-4 mr-2" />
                Capture
              </Button>
            </Link>
            <div className="text-sm text-[#94A3B8] ml-2">{user?.name}</div>
            <Button onClick={logout} variant="ghost" className="text-[#94A3B8] hover:text-white" data-testid="logout-button">
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-light tracking-tight mb-4" style={{fontFamily: 'Cormorant Garamond, serif'}} data-testid="dashboard-title">
            Welcome back, {user?.name}
          </h1>
          <p className="text-[#94A3B8] text-sm uppercase tracking-[0.2em]">Your memory timeline</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass rounded-lg p-6" data-testid="total-memories-card">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-xs text-[#94A3B8] uppercase tracking-wider">Total Memories</span>
            </div>
            <div className="text-4xl font-light" style={{fontFamily: 'Cormorant Garamond, serif'}}>{stats?.total_memories || 0}</div>
          </div>

          <div className="glass rounded-lg p-6" data-testid="daily-count-card">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-[#94A3B8] uppercase tracking-wider">Today</span>
            </div>
            <div className="text-4xl font-light" style={{fontFamily: 'Cormorant Garamond, serif'}}>{dailySummary?.memories_count || 0}</div>
          </div>

          <div className="glass rounded-lg p-6" data-testid="emotions-card">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span className="text-xs text-[#94A3B8] uppercase tracking-wider">Emotions Tracked</span>
            </div>
            <div className="text-4xl font-light" style={{fontFamily: 'Cormorant Garamond, serif'}}>{Object.keys(stats?.emotion_breakdown || {}).length}</div>
          </div>
        </div>

        {dailySummary?.summary && (
          <div className="glass rounded-lg p-8 mb-12" data-testid="daily-summary-card">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-2xl font-light" style={{fontFamily: 'Cormorant Garamond, serif'}}>Today's Summary</h2>
            </div>
            <p className="text-[#E2E8F0] leading-loose max-w-3xl" style={{fontFamily: 'Cormorant Garamond, serif', fontSize: '1.125rem'}}>
              {dailySummary.summary}
            </p>
          </div>
        )}

        {emotionChartData.length > 0 && (
          <div className="glass rounded-lg p-8 mb-12" data-testid="emotion-chart">
            <h2 className="text-2xl font-light mb-6" style={{fontFamily: 'Cormorant Garamond, serif'}}>Emotion Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={emotionChartData}>
                <XAxis dataKey="emotion" stroke="#94A3B8" style={{fontSize: '12px', fontFamily: 'JetBrains Mono'}} />
                <YAxis stroke="#94A3B8" style={{fontSize: '12px', fontFamily: 'JetBrains Mono'}} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {emotionChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="glass rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-light" style={{fontFamily: 'Cormorant Garamond, serif'}}>Recent Memories</h2>
            <Link to="/timeline">
              <Button variant="ghost" className="text-[#D4AF37] hover:text-white" data-testid="view-all-link">
                View All
              </Button>
            </Link>
          </div>

          {recentMemories.length === 0 ? (
            <div className="text-center py-12" data-testid="no-memories-state">
              <Brain className="w-16 h-16 text-[#475569] mx-auto mb-4" />
              <p className="text-[#94A3B8] mb-4">No memories yet</p>
              <Link to="/capture">
                <Button className="bg-[#D4AF37] hover:bg-[#C19B2B] text-black" data-testid="create-first-memory-btn">
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first memory
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentMemories.map((memory) => {
                const emotionStyle = emotionColors[memory.emotion] || emotionColors.neutral;
                return (
                  <Link key={memory.id} to={`/memory/${memory.id}`}>
                    <div className="bg-black/30 hover:bg-black/50 border border-white/10 hover:border-white/30 rounded-lg p-6 transition-all duration-300" data-testid={`memory-card-${memory.id}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs uppercase tracking-wider px-3 py-1 rounded-full ${emotionStyle.bg} ${emotionStyle.text}`}>
                            {memory.emotion}
                          </span>
                          {memory.importance && (
                            <span className="text-xs text-[#D4AF37] flex items-center gap-1 px-2 py-1 rounded-full bg-[#D4AF37]/10">
                              <Star className="w-3 h-3 fill-[#D4AF37]" />{memory.importance}/10
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#94A3B8] uppercase tracking-wider">
                          {new Date(memory.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    
{memory.media_url && (
  <img
    src={`${process.env.REACT_APP_BACKEND_URL}/api/files/${memory.media_url}`}
    alt="Memory"
    className="mt-4 w-full max-h-64 object-contain rounded-lg"
    onError={(e) => {
      e.currentTarget.style.display = 'none';
    }}
  />
)}
                      
{memory.image_analysis && (
  <div className="mt-4 p-4 rounded-lg bg-slate-800 border border-slate-700">
    <h3 className="text-white font-semibold mb-3">
      AI Photo Analysis
    </h3>

    <p className="text-slate-300 mb-3">
      {memory.image_analysis.scene_description}
    </p>

    {memory.image_analysis.expressions?.length > 0 ? (
      memory.image_analysis.expressions.map((expression, index) => (
        <div key={index} className="mb-3 p-3 bg-slate-900 rounded-lg">
          <p className="text-white font-medium capitalize">
            {expression.label}
          </p>
          <p className="text-slate-400 text-sm mt-1">
            {expression.evidence}
          </p>
          <p className="text-slate-500 text-xs mt-1">
            AI confidence: {Math.round(expression.confidence * 100)}%
          </p>
        </div>
      ))
    ) : (
      <p className="text-slate-400 text-sm">
        No clear facial expression detected.
      </p>
    )}

    <p className="text-slate-500 text-xs mt-2">
      These observations describe visible expressions, not a person's
      confirmed internal feelings.
    </p>
  </div>
)}


                      {memory.tags.length > 0 && (
                        <div className="flex gap-2 mt-3">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
