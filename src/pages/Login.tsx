import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginVoter, validateEPIC, getCurrentSession } from '@/lib/votingSystem';
import { Vote, CreditCard, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    epicNumber: location.state?.epicNumber || '',
    password: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Show success message if coming from verification
  useEffect(() => {
    if (location.state?.verified) {
      toast.success('Account verified! Please login to continue.');
    }
  }, [location.state]);

  // Redirect if already logged in
  useEffect(() => {
    const session = getCurrentSession();
    if (session && session.role === 'voter') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'epicNumber') {
      processedValue = value.toUpperCase();
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const epicResult = validateEPIC(formData.epicNumber);
    if (!epicResult.valid) {
      newErrors.epicNumber = epicResult.message;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const result = loginVoter(formData.epicNumber, formData.password);

    if (result.success) {
      toast.success('Login successful! Redirecting to dashboard...');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
      if (result.message.includes('verify')) {
        setErrors({ general: 'Please verify your account first. Check your email for OTP.' });
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center">
            <Vote className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="section-title text-3xl mb-2">Voter Login</h1>
          <p className="text-muted-foreground">
            Access your account to cast your vote
          </p>
        </div>

        {/* Form Card */}
        <div className="card-glass p-6 md:p-8 animate-fade-in-up">
          {errors.general && (
            <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-6 text-sm text-warning">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EPIC Number */}
            <div>
              <label className="input-label">
                <CreditCard className="w-4 h-4 inline mr-2" />
                EPIC Number (Voter ID)
              </label>
              <input
                type="text"
                name="epicNumber"
                value={formData.epicNumber}
                onChange={handleChange}
                placeholder="e.g., ABC1234567"
                maxLength={10}
                className={`input-field uppercase ${errors.epicNumber ? 'error' : ''}`}
              />
              {errors.epicNumber && <p className="input-error">{errors.epicNumber}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="input-label">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`input-field pr-12 ${errors.password ? 'error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="input-error">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-4 text-base disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Login to Vote
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-accent hover:underline font-medium">
                Register now
              </Link>
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="card-glass p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <p className="text-xs text-muted-foreground">Secure & Encrypted</p>
          </div>
          <div className="card-glass p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-accent/10 flex items-center justify-center">
              <Vote className="w-5 h-5 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">One Vote Per Person</p>
          </div>
        </div>

        {/* Admin Link */}
        <div className="text-center mt-6">
          <Link to="/admin-login" className="text-sm text-muted-foreground hover:text-foreground">
            Election Officer? <span className="text-accent">Admin Login →</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
