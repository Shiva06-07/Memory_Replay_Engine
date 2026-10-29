import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatApiErrorDetail } from '../utils/helpers';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Brain } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, name);
      navigate('/dashboard');
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full glass flex items-center justify-center">
              <Brain className="w-8 h-8 text-[#D4AF37]" />
            </div>
          </div>
          <h1 className="text-4xl font-light tracking-tight text-[#F8FAFC] mb-2" style={{fontFamily: 'Cormorant Garamond, serif'}}>
            Memory Replay Engine
          </h1>
          <p className="text-sm text-[#94A3B8] uppercase tracking-[0.2em]" style={{fontFamily: 'JetBrains Mono, monospace'}}>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-lg p-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-400" data-testid="register-error">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-[#94A3B8] uppercase tracking-wider">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black/50 border-white/10 text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
              required
              data-testid="register-name-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-[#94A3B8] uppercase tracking-wider">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/50 border-white/10 text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
              required
              data-testid="register-email-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-[#94A3B8] uppercase tracking-wider">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black/50 border-white/10 text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
              required
              data-testid="register-password-input"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4AF37] hover:bg-[#C19B2B] text-black font-medium active:scale-95 transition-all duration-300"
            data-testid="register-submit-button"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>

          <p className="text-center text-sm text-[#94A3B8]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#D4AF37] hover:text-white transition-colors" data-testid="login-link">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
