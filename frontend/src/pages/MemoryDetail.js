import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Brain, ArrowLeft, Calendar, MapPin, Hash, Link2, Pencil, Trash2, Star, Loader2, X, Check, GitBranch, Share2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { emotionColors } from '../utils/helpers';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const MemoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memory, setMemory] = useState(null);
  const [relatedMemories, setRelatedMemories] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [saving, setSaving] = useState(false);
  const [ranking, setRanking] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    fetchMemory();
    fetchRelatedMemories();
  }, [id]);

  const fetchMemory = async () => {
    try {
      const { data } = await axios.get(`${API}/memories/${id}`, { withCredentials: true });
      setMemory(data);
      setEditContent(data.content);
      setEditTags(data.tags.join(', '));
      setEditLocation(data.location || '');
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRelatedMemories = async () => {
    try {
      const { data } = await axios.get(`${API}/memories/${id}/related`, { withCredentials: true });
      setRelatedMemories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const tagsArray = editTags.split(',').map(t => t.trim()).filter(Boolean);
      const { data } = await axios.put(`${API}/memories/${id}`, {
        content: editContent,
        tags: tagsArray,
        location: editLocation || null
      }, { withCredentials: true });
      setMemory(data);
      setEditing(false);
      toast.success('Memory updated successfully');
    } catch (err) {
      toast.error('Failed to update memory');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/memories/${id}`, { withCredentials: true });
      toast.success('Memory deleted');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to delete memory');
    }
  };

  const handleRank = async () => {
    setRanking(true);
    try {
      const { data } = await axios.post(`${API}/memories/${id}/rank`, {}, { withCredentials: true });
      setMemory(prev => ({ ...prev, importance: data.importance, importance_reason: data.reason }));
      toast.success(`Importance: ${data.importance}/10`);
    } catch (err) {
      toast.error('Failed to rank memory');
    } finally {
      setRanking(false);
    }
  };

  const handleShare = async () => {
    if (!shareEmail.trim()) return;
    setSharing(true);
    try {
      await axios.post(`${API}/memories/${id}/share`, { email: shareEmail }, { withCredentials: true });
      toast.success(`Memory shared with ${shareEmail}`);
      setShareEmail('');
      setShowShare(false);
    } catch (err) {
      const detail = err.response?.data?.detail;
      toast.error(typeof detail === 'string' ? detail : 'Failed to share memory');
    } finally {
      setSharing(false);
    }
  };

  if (!memory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#D4AF37] text-lg font-mono">Loading...</div>
      </div>
    );
  }

  const emotionStyle = emotionColors[memory.emotion] || emotionColors.neutral;

  return (
    <div className="min-h-screen">
      <nav className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-[#D4AF37]" />
            <span className="text-xl font-light" style={{fontFamily: 'Cormorant Garamond, serif'}}>Memory Replay</span>
          </Link>
          <Link to="/timeline">
            <Button variant="ghost" className="text-[#94A3B8] hover:text-white" data-testid="back-to-timeline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Timeline
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="glass rounded-lg p-12 mb-8" data-testid="memory-detail-card">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <span className={`text-sm uppercase tracking-wider px-4 py-2 rounded-full ${emotionStyle.bg} ${emotionStyle.text}`}>
                {memory.emotion}
              </span>
              {memory.emotion_score && (
                <span className="text-xs text-[#94A3B8]">Confidence: {(memory.emotion_score * 100).toFixed(0)}%</span>
              )}
              {memory.importance && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30" data-testid="importance-badge">
                  <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                  <span className="text-xs text-[#D4AF37] font-medium">{memory.importance}/10</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!editing && (
                <>
                  <Button
                    onClick={() => setEditing(true)}
                    variant="ghost"
                    className="text-[#94A3B8] hover:text-white"
                    data-testid="edit-memory-btn"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" className="text-red-400 hover:text-red-300" data-testid="delete-memory-btn">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#0F172A] border-white/10">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-[#F8FAFC]" style={{fontFamily: 'Cormorant Garamond, serif'}}>Delete Memory</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#94A3B8]">
                          This action cannot be undone. This memory will be permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/10 text-white border-white/10 hover:bg-white/20" data-testid="cancel-delete-btn">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-red-500 hover:bg-red-600 text-white"
                          data-testid="confirm-delete-btn"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    onClick={handleRank}
                    disabled={ranking}
                    variant="ghost"
                    className="text-[#D4AF37] hover:text-white"
                    data-testid="rank-memory-btn"
                  >
                    {ranking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                  </Button>
                  <Link to={`/what-if/${id}`}>
                    <Button variant="ghost" className="text-[#94A3B8] hover:text-white" data-testid="whatif-memory-btn">
                      <GitBranch className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    onClick={() => setShowShare(!showShare)}
                    variant="ghost"
                    className="text-[#94A3B8] hover:text-white"
                    data-testid="share-memory-btn"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {showShare && (
            <div className="flex items-center gap-3 mb-6 p-4 bg-white/5 rounded-lg" data-testid="share-form">
              <Input
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                placeholder="Enter email to share with"
                className="bg-black/50 border-white/10 text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] flex-1"
                data-testid="share-email-input"
              />
              <Button
                onClick={handleShare}
                disabled={sharing || !shareEmail.trim()}
                className="bg-[#D4AF37] hover:bg-[#C19B2B] text-black active:scale-95 transition-all duration-300"
                data-testid="share-submit-btn"
              >
                {sharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4 mr-2" />}
                {sharing ? 'Sharing...' : 'Share'}
              </Button>
              <Button onClick={() => setShowShare(false)} variant="ghost" className="text-[#94A3B8] hover:text-white">
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {editing ? (
            <div className="space-y-6" data-testid="edit-form">
              <div className="space-y-2">
                <Label className="text-sm text-[#94A3B8] uppercase tracking-wider">Content</Label>
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={6}
                  className="bg-black/50 border-white/10 text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] resize-none text-lg"
                  style={{fontFamily: 'Cormorant Garamond, serif'}}
                  data-testid="edit-content-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-[#94A3B8] uppercase tracking-wider">Tags (comma-separated)</Label>
                  <Input
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    className="bg-black/50 border-white/10 text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    data-testid="edit-tags-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-[#94A3B8] uppercase tracking-wider">Location</Label>
                  <Input
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="bg-black/50 border-white/10 text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    data-testid="edit-location-input"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#D4AF37] hover:bg-[#C19B2B] text-black active:scale-95 transition-all duration-300"
                  data-testid="save-edit-btn"
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  onClick={() => { setEditing(false); setEditContent(memory.content); setEditTags(memory.tags.join(', ')); setEditLocation(memory.location || ''); }}
                  variant="ghost"
                  className="text-[#94A3B8] hover:text-white"
                  data-testid="cancel-edit-btn"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="prose prose-invert max-w-none">
                <p className="text-2xl leading-loose text-[#E2E8F0]" style={{fontFamily: 'Cormorant Garamond, serif'}}>
                  {memory.content}
                </p>
              </div>

              {memory.importance_reason && (
                <div className="mt-6 p-4 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-lg" data-testid="importance-reason">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-xs text-[#D4AF37] uppercase tracking-wider">Importance: {memory.importance}/10</span>
                  </div>
                  <p className="text-sm text-[#E2E8F0] leading-relaxed">{memory.importance_reason}</p>
                </div>
              )}
            </>
          )}

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="space-y-4">
              {memory.location && (
                <div className="flex items-center gap-3 text-[#94A3B8]">
                  <MapPin className="w-4 h-4" />
                  <span>{memory.location}</span>
                </div>
              )}
              {memory.tags.length > 0 && (
                <div className="flex items-start gap-3">
                  <Hash className="w-4 h-4 text-[#94A3B8] mt-1" />
                  <div className="flex gap-2 flex-wrap">
                    {memory.tags.map((tag, i) => (
                      <span key={i} className="text-sm text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-[#94A3B8]">
              <Calendar className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wider">
                {new Date(memory.created_at).toLocaleString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>

        {relatedMemories.length > 0 && (
          <div className="glass rounded-lg p-8" data-testid="related-memories-section">
            <div className="flex items-center gap-3 mb-6">
              <Link2 className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-2xl font-light" style={{fontFamily: 'Cormorant Garamond, serif'}}>Related Memories</h2>
            </div>
            <div className="space-y-4">
              {relatedMemories.map((related) => {
                const relatedEmotionStyle = emotionColors[related.emotion] || emotionColors.neutral;
                return (
                  <Link key={related.id} to={`/memory/${related.id}`}>
                    <div className="bg-black/30 hover:bg-black/50 border border-white/10 hover:border-white/30 rounded-lg p-4 transition-all duration-300" data-testid={`related-memory-${related.id}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs uppercase tracking-wider px-2 py-1 rounded-full ${relatedEmotionStyle.bg} ${relatedEmotionStyle.text}`}>
                            {related.emotion}
                          </span>
                          {related.importance && (
                            <span className="text-xs text-[#D4AF37] flex items-center gap-1">
                              <Star className="w-3 h-3 fill-[#D4AF37]" />{related.importance}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#94A3B8]">
                          {new Date(related.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[#E2E8F0] line-clamp-2">{related.content}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryDetail;
