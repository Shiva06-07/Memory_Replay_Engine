import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Brain, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { emotionColors } from '../utils/helpers';
import { motion } from 'framer-motion';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const BrainMap = () => {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [ForceGraph, setForceGraph] = useState(null);
  const graphRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    import('react-force-graph-3d').then(mod => {
      setForceGraph(() => mod.default);
    });
    fetchBrainMap();
  }, []);

  const fetchBrainMap = async () => {
    try {
      const { data } = await axios.get(`${API}/memories/brain-map`, { withCredentials: true });
      setGraphData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nodeColor = useCallback((node) => {
    return emotionColors[node.emotion]?.color || '#9CA3AF';
  }, []);

  const nodeSize = useCallback((node) => {
    return Math.max(3, (node.importance || 5) * 1.2);
  }, []);

  const linkColor = useCallback((link) => {
    return link.type === 'tag' ? '#D4AF37' : 'rgba(255,255,255,0.15)';
  }, []);

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node);
  }, []);

  const handleNodeDoubleClick = useCallback((node) => {
    navigate(`/memory/${node.id}`);
  }, [navigate]);

  return (
    <div className="min-h-screen relative">
      <nav className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-full mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-[#D4AF37]" />
            <span className="text-xl font-light" style={{fontFamily: 'Cormorant Garamond, serif'}}>Memory Replay</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/insights">
              <Button variant="ghost" className="text-[#D4AF37] hover:text-white text-sm" data-testid="nav-insights">
                Insights
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" className="text-[#94A3B8] hover:text-white" data-testid="back-to-dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {loading ? (
        <div className="flex items-center justify-center" style={{height: 'calc(100vh - 64px)'}}>
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#D4AF37] mx-auto mb-6 animate-spin" />
            <p className="text-[#94A3B8] text-sm uppercase tracking-[0.2em]">Building your brain map...</p>
          </div>
        </div>
      ) : graphData && graphData.nodes.length === 0 ? (
        <div className="flex items-center justify-center" style={{height: 'calc(100vh - 64px)'}}>
          <div className="text-center glass rounded-lg p-12" data-testid="no-brain-data">
            <Brain className="w-16 h-16 text-[#475569] mx-auto mb-4" />
            <p className="text-[#94A3B8]">No memories to visualize yet. Start capturing!</p>
          </div>
        </div>
      ) : (
        <>
          <div className="absolute top-20 left-6 z-40">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-lg p-6 max-w-xs"
              data-testid="brain-map-legend"
            >
              <h2 className="text-lg font-light mb-4" style={{fontFamily: 'Cormorant Garamond, serif'}}>
                3D Memory Brain Map
              </h2>
              <p className="text-xs text-[#94A3B8] mb-4">
                Each node is a memory. Size = importance. Color = emotion. Click to preview, double-click to open.
              </p>
              <div className="space-y-2">
                {Object.entries(emotionColors).map(([emotion, style]) => (
                  <div key={emotion} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: style.color }} />
                    <span className="text-xs text-[#94A3B8] capitalize">{emotion}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-px bg-[#D4AF37]" />
                  <span className="text-xs text-[#94A3B8]">Shared tags</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-px bg-white/20" />
                  <span className="text-xs text-[#94A3B8]">Same emotion</span>
                </div>
              </div>
            </motion.div>
          </div>

          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-20 right-6 z-40 glass rounded-lg p-6 max-w-sm"
              data-testid="brain-map-node-detail"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs uppercase tracking-wider px-3 py-1 rounded-full ${emotionColors[selectedNode.emotion]?.bg || ''} ${emotionColors[selectedNode.emotion]?.text || ''}`}>
                  {selectedNode.emotion}
                </span>
                <span className="text-xs text-[#94A3B8]">{selectedNode.date}</span>
              </div>
              <p className="text-sm text-[#E2E8F0] leading-relaxed mb-3" style={{fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem'}}>
                {selectedNode.content}
              </p>
              {selectedNode.tags?.length > 0 && (
                <div className="flex gap-1 flex-wrap mb-3">
                  {selectedNode.tags.map((tag, i) => (
                    <span key={i} className="text-xs text-[#94A3B8] bg-white/5 px-2 py-0.5 rounded">#{tag}</span>
                  ))}
                </div>
              )}
              <Link to={`/memory/${selectedNode.id}`}>
                <Button className="w-full bg-[#D4AF37] hover:bg-[#C19B2B] text-black text-sm" data-testid="brain-map-open-memory">
                  Open Memory
                </Button>
              </Link>
            </motion.div>
          )}

          {ForceGraph && graphData && (
            <div style={{height: 'calc(100vh - 64px)'}} data-testid="brain-map-3d">
              <ForceGraph
                ref={graphRef}
                graphData={graphData}
                nodeId="id"
                nodeColor={nodeColor}
                nodeVal={nodeSize}
                nodeLabel={(node) => `${node.emotion}: ${node.content}`}
                nodeOpacity={0.9}
                linkColor={linkColor}
                linkWidth={(link) => link.type === 'tag' ? 1.5 : 0.5}
                linkOpacity={0.4}
                backgroundColor="#030712"
                onNodeClick={handleNodeClick}
                onNodeRightClick={handleNodeDoubleClick}
                showNavInfo={false}
                width={typeof window !== 'undefined' ? window.innerWidth : 1200}
                height={typeof window !== 'undefined' ? window.innerHeight - 64 : 700}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrainMap;
