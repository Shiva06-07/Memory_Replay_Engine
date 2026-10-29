import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Brain, Mic, Image as ImageIcon, Camera, X, RotateCcw, MapPin, Hash, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CaptureMemory = () => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageAnalysis, setImageAnalysis] = useState(null);

  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      toast.error('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');

      const { data } = await axios.post(`${API}/memories/transcribe`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setContent(prev => prev ? `${prev} ${data.text}` : data.text);
      toast.success('Voice transcribed successfully');
    } catch (err) {
      toast.error('Transcription failed');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await axios.post(`${API}/memories/upload-image`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setImageUrl(data.path);
      setCapturedImage(null);
      setImageAnalysis(null);

      await analyzeImage(file);

     toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error('Image upload failed');
    }
  };
  
  const analyzeImage = async (file) => {
    setImageAnalysis(null);

    try {
      const formData = new FormData();
      formData.append('file', file, file.name || 'memory-photo.jpg');

      const { data } = await axios.post(
        `${API}/memories/analyze-image`,
        formData,
        { withCredentials: true }
      );

      setImageAnalysis(data);
      toast.success('Photo analysis complete');
    } catch (err) {
      console.error('Image analysis failed:', err);
      toast.error('Could not analyze photo. Please try again.');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
     if (!content.trim() && !capturedImage && !imageUrl) {
        toast.error('Please add text or capture/upload a photo');
    return;
}

    setLoading(true);
    try {
    
const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);

let finalImageUrl = imageUrl;

// Upload the photo captured by the camera, if present
if (capturedImage && !finalImageUrl) {
  const response = await fetch(capturedImage);
  const blob = await response.blob();
  const formData = new FormData();
  formData.append('file', blob, 'camera-photo.jpg');

  const uploadResponse = await axios.post(
    `${API}/memories/upload-image`,
    formData,
    { withCredentials: true }
  );

  finalImageUrl = uploadResponse.data.path;
}

await axios.post(`${API}/memories`, {
  content,
  tags: tagsArray,
  location: location || null,
  media_url: finalImageUrl || null,
  image_analysis: imageAnalysis || null
}, { withCredentials: true });

      toast.success('Memory captured successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to capture memory');
    } finally {
      setLoading(false);
    }
  };
  const openCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true
    });

    cameraStreamRef.current = stream;
    setIsCameraOpen(true);

    // Give React time to render the video element
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }, 100);
  } catch (err) {
    console.error('Camera access error:', err);
    toast.error('Could not access camera');
  }
};
 
const capturePhoto = async () => {
  const video = videoRef.current;

  if (!video) return;

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const image = canvas.toDataURL('image/jpeg', 0.9);
  setCapturedImage(image);
  setImageAnalysis(null);

  // Convert the captured photo into a file and analyze it with Gemini
  const response = await fetch(image);
  const blob = await response.blob();
  const file = new File([blob], 'camera-photo.jpg', {
    type: 'image/jpeg'
  });

  await analyzeImage(file);

  // Stop the camera after taking the photo
  if (cameraStreamRef.current) {
    cameraStreamRef.current.getTracks().forEach(track => track.stop());
    cameraStreamRef.current = null;
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
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-light tracking-tight mb-4" style={{fontFamily: 'Cormorant Garamond, serif'}} data-testid="capture-page-title">
            Capture Memory
          </h1>
          <p className="text-[#94A3B8] text-sm uppercase tracking-[0.2em]">Record your thoughts, emotions, and experiences</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-lg p-8 space-y-8">
          {isCameraOpen && (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full max-h-[500px] object-contain"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="button"
                  onClick={capturePhoto}
                  className="flex-1 bg-[#D4AF37] hover:bg-[#C19B2B] text-black"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Capture Photo
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    if (cameraStreamRef.current) {
                      cameraStreamRef.current.getTracks().forEach(track => track.stop());
                      cameraStreamRef.current = null;
                    }
                    setIsCameraOpen(false);
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close Camera
                </Button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="space-y-4">
              <p className="text-sm text-[#94A3B8] uppercase tracking-wider">
                Photo preview
              </p>
              <img
                src={capturedImage}
                alt="Captured memory"
                className="w-full max-h-[500px] object-contain rounded-lg border border-white/10 bg-black"
              />

{imageAnalysis && (
  <div className="mt-4 p-4 rounded-lg bg-slate-800 border border-slate-700">
    <h3 className="text-white font-semibold mb-3">
      AI Photo Analysis
    </h3>

    <p className="text-slate-300 mb-3">
      {imageAnalysis.scene_description}
    </p>

    {imageAnalysis.expressions?.length > 0 ? (
      imageAnalysis.expressions.map((expression, index) => (
        <div
          key={index}
          className="mb-3 p-3 bg-slate-900 rounded-lg"
        >
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
      These are estimates of visible expressions, not proof
      of someone's actual emotions.
    </p>
  </div>
)}


              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="button"
                  onClick={async () => {
                    setCapturedImage(null);
                    await openCamera();
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Photo
                </Button>
<Button
  type="button"
  onClick={() => {
    if (!capturedImage && !imageUrl) {
      toast.error('Please capture or upload a photo first.');
      return;
    }

    toast.success('Photo selected. You can now save your memory.');
  }}
  className="flex-1 bg-white/10 hover:bg-white/20 text-white"
>
  Use This Photo
</Button>

              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm text-[#94A3B8] uppercase tracking-wider">Memory Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={8}
              className="bg-black/50 border-white/10 text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] resize-none"
              data-testid="memory-content-input"
            />
          </div>

          <div className="flex gap-4">
<Button
  type="button"
  onClick={openCamera}
  className="flex-1 bg-white/10 hover:bg-white/20 text-white active:scale-95 transition-all duration-300"
  data-testid="camera-button"
>
  <Camera className="w-4 h-4 mr-2" />
  Open Camera
</Button>
            <Button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex-1 ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              } active:scale-95 transition-all duration-300`}
              data-testid="voice-record-button"
            >
              <Mic className="w-4 h-4 mr-2" />
              {isRecording ? 'Stop Recording' : 'Record Voice'}
            </Button>

            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white active:scale-95 transition-all duration-300"
              data-testid="image-upload-button"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              {imageUrl ? 'Image Uploaded' : 'Upload Image'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location (Optional)
              </Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Coffee shop downtown"
                className="bg-black/50 border-white/10 text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                data-testid="memory-location-input"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Tags (comma-separated)
              </Label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., work, family, travel"
                className="bg-black/50 border-white/10 text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                data-testid="memory-tags-input"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !content.trim()}
            className="w-full bg-[#D4AF37] hover:bg-[#C19B2B] text-black font-medium active:scale-95 transition-all duration-300"
            data-testid="capture-memory-submit-button"
          >
            {loading ? 'Analyzing & Saving...' : 'Capture Memory'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CaptureMemory;
