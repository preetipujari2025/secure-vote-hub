import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  registerVoter, 
  validateEPIC, 
  validateEmail, 
  validateMobile, 
  validatePassword,
  generateOTP,
  storePendingOTP,
  getVoters
} from '@/lib/votingSystem';
import { User, Mail, Phone, Calendar, CreditCard, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    epicNumber: '',
    dateOfBirth: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'fair' | 'good' | 'strong'>('weak');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Auto-uppercase EPIC number
    if (name === 'epicNumber') {
      processedValue = value.toUpperCase();
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));

    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Update password strength
    if (name === 'password') {
      const result = validatePassword(value);
      setPasswordStrength(result.strength);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    // EPIC Number
    const epicResult = validateEPIC(formData.epicNumber);
    if (!epicResult.valid) {
      newErrors.epicNumber = epicResult.message;
    }

    // Date of Birth
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = 'You must be at least 18 years old to register';
      }
    }

    // Mobile Number
    const mobileResult = validateMobile(formData.mobileNumber);
    if (!mobileResult.valid) {
      newErrors.mobileNumber = mobileResult.message;
    }

    // Email
    const emailResult = validateEmail(formData.email);
    if (!emailResult.valid) {
      newErrors.email = emailResult.message;
    }

    // Password
    const passwordResult = validatePassword(formData.password);
    if (!passwordResult.valid) {
      newErrors.password = passwordResult.message;
    }

    // Confirm Password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const result = registerVoter({
      epicNumber: formData.epicNumber,
      fullName: formData.fullName,
      dateOfBirth: formData.dateOfBirth,
      mobileNumber: formData.mobileNumber,
      email: formData.email,
      password: formData.password
    });

    setIsSubmitting(false);

    if (result.success) {
      // Generate and store OTP
      const otp = generateOTP();
      storePendingOTP(formData.epicNumber, otp);
      
      toast.success('Registration successful! Redirecting to OTP verification...');
      
      // Navigate to OTP page with necessary data
      navigate('/verify-otp', { 
        state: { 
          epicNumber: formData.epicNumber,
          email: formData.email,
          mobile: formData.mobileNumber,
          demoOTP: otp // For demo purposes
        }
      });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="section-title text-3xl mb-2">Voter Registration</h1>
          <p className="text-muted-foreground">
            Create your account to participate in secure online voting
          </p>
        </div>

        {/* Form Card */}
        <div className="card-glass p-6 md:p-8 animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="input-label">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`input-field ${errors.fullName ? 'error' : ''}`}
              />
              {errors.fullName && <p className="input-error">{errors.fullName}</p>}
            </div>

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
              <p className="text-xs text-muted-foreground mt-1">
                Format: 3 letters followed by 7 digits
              </p>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="input-label">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                className={`input-field ${errors.dateOfBirth ? 'error' : ''}`}
              />
              {errors.dateOfBirth && <p className="input-error">{errors.dateOfBirth}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="input-label">
                <Phone className="w-4 h-4 inline mr-2" />
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                maxLength={10}
                className={`input-field ${errors.mobileNumber ? 'error' : ''}`}
              />
              {errors.mobileNumber && <p className="input-error">{errors.mobileNumber}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="input-label">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`input-field ${errors.email ? 'error' : ''}`}
              />
              {errors.email && <p className="input-error">{errors.email}</p>}
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
                  placeholder="Create a strong password"
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
              
              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-2">
                  <div className="password-strength">
                    <div className={`password-strength-bar ${passwordStrength}`} />
                  </div>
                  <p className={`text-xs mt-1 ${
                    passwordStrength === 'strong' ? 'text-success' :
                    passwordStrength === 'good' ? 'text-accent' :
                    passwordStrength === 'fair' ? 'text-warning' :
                    'text-destructive'
                  }`}>
                    Password strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="input-label">
                <Lock className="w-4 h-4 inline mr-2" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={`input-field pr-12 ${errors.confirmPassword ? 'error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="input-error">{errors.confirmPassword}</p>}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-xs text-success mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Passwords match
                </p>
              )}
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
                  Registering...
                </>
              ) : (
                <>
                  Register & Verify
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Already registered?{' '}
              <Link to="/login" className="text-accent hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>

        {/* Info Note */}
        <p className="text-center text-xs text-muted-foreground mt-6 max-w-md mx-auto">
          By registering, you confirm that you are an eligible voter and the information 
          provided is accurate. This is a demo system for educational purposes.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
