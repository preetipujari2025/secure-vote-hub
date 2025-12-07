import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginAdmin, getCurrentSession } from '@/lib/votingSystem';
import { Shield, User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const session = getCurrentSession();
    if (session && session.role === 'admin') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
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

    const result = loginAdmin(formData.username, formData.password);

    if (result.success) {
      toast.success('Admin login successful!');
      navigate('/admin');
    } else {
      toast.error(result.message);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="section-title text-3xl mb-2">Admin Portal</h1>
          <p className="text-muted-foreground">
            Election management dashboard access
          </p>
        </div>

        {/* Form Card */}
        <div className="card-glass p-6 md:p-8 animate-fade-in-up">
          {/* Demo Credentials */}
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-6">
            <p className="text-xs text-accent font-medium mb-2">DEMO CREDENTIALS</p>
            <div className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Username:</span> <span className="font-mono font-bold text-foreground">admin</span></p>
              <p><span className="text-muted-foreground">Password:</span> <span className="font-mono font-bold text-foreground">Admin@123</span></p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="input-label">
                <User className="w-4 h-4 inline mr-2" />
                Admin Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter admin username"
                className={`input-field ${errors.username ? 'error' : ''}`}
              />
              {errors.username && <p className="input-error">{errors.username}</p>}
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
                  Authenticating...
                </>
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Voter Login Link */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Not an admin?{' '}
              <Link to="/login" className="text-accent hover:underline font-medium">
                Voter Login
              </Link>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Shield className="w-3 h-3" />
            Secure administrative access only
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
