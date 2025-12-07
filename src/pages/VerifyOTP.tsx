import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { verifyOTP, verifyVoter, maskEmail, maskMobile, generateOTP, storePendingOTP } from '@/lib/votingSystem';
import { ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { epicNumber, email, mobile, demoOTP } = location.state || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [currentOTP, setCurrentOTP] = useState(demoOTP);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!epicNumber) {
      navigate('/signup');
    }
  }, [epicNumber, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    
    // Focus the last filled input or the next empty one
    const lastFilledIndex = newOtp.findIndex(v => !v);
    const focusIndex = lastFilledIndex === -1 ? 5 : lastFilledIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleResendOTP = () => {
    if (resendTimer > 0) return;
    
    const newOTP = generateOTP();
    storePendingOTP(epicNumber, newOTP);
    setCurrentOTP(newOTP);
    setResendTimer(60);
    setOtp(['', '', '', '', '', '']);
    toast.success('New OTP has been sent!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const enteredOTP = otp.join('');
    if (enteredOTP.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const result = verifyOTP(epicNumber, enteredOTP);
    
    if (result.success) {
      const verifyResult = verifyVoter(epicNumber);
      if (verifyResult.success) {
        toast.success('Account verified successfully! You can now login.');
        navigate('/login', { state: { verified: true, epicNumber } });
      } else {
        toast.error(verifyResult.message);
      }
    } else {
      toast.error(result.message);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }

    setIsSubmitting(false);
  };

  if (!epicNumber) return null;

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-success flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-success-foreground" />
          </div>
          <h1 className="section-title text-3xl mb-2">Verify Your Account</h1>
          <p className="text-muted-foreground">
            Enter the 6-digit OTP sent to your registered mobile and email
          </p>
        </div>

        {/* Form Card */}
        <div className="card-glass p-6 md:p-8 animate-fade-in-up">
          {/* Contact Info Display */}
          <div className="bg-secondary/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-2">OTP sent to:</p>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">📱 {maskMobile(mobile)}</p>
              <p className="text-sm font-medium text-foreground">📧 {maskEmail(email)}</p>
            </div>
          </div>

          {/* Demo OTP Display */}
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-6">
            <p className="text-xs text-accent font-medium mb-1">DEMO MODE - OTP for testing:</p>
            <p className="text-2xl font-mono font-bold text-accent tracking-widest">{currentOTP}</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* OTP Input */}
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-input bg-background text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || otp.join('').length !== 6}
              className="w-full btn-primary py-4 text-base disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify & Continue
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            {resendTimer > 0 ? (
              <p className="text-sm text-muted-foreground">
                Resend OTP in <span className="font-medium text-foreground">{resendTimer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResendOTP}
                className="inline-flex items-center gap-2 text-sm text-accent hover:underline font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Resend OTP
              </button>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Registration
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
