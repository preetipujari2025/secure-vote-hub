import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, FileText, Shield, Building2, Upload, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { registerCandidate, validateEmail, validateMobile } from '@/lib/votingSystem';

const INDIAN_PARTIES = [
  { id: 'bjp', name: 'Bharatiya Janata Party (BJP)', symbol: '🪷' },
  { id: 'inc', name: 'Indian National Congress (INC)', symbol: '✋' },
  { id: 'aap', name: 'Aam Aadmi Party (AAP)', symbol: '🧹' },
  { id: 'tmc', name: 'All India Trinamool Congress (TMC)', symbol: '🌸' },
  { id: 'dmk', name: 'Dravida Munnetra Kazhagam (DMK)', symbol: '☀️' },
  { id: 'sp', name: 'Samajwadi Party (SP)', symbol: '🚲' },
  { id: 'bsp', name: 'Bahujan Samaj Party (BSP)', symbol: '🐘' },
  { id: 'ncp', name: 'Nationalist Congress Party (NCP)', symbol: '⏰' },
  { id: 'shiv_sena', name: 'Shiv Sena', symbol: '🏹' },
  { id: 'jdu', name: 'Janata Dal (United)', symbol: '🔶' },
  { id: 'rjd', name: 'Rashtriya Janata Dal (RJD)', symbol: '🏮' },
  { id: 'cpi', name: 'Communist Party of India (CPI)', symbol: '🌾' },
  { id: 'cpim', name: 'Communist Party of India (Marxist)', symbol: '⚒️' },
  { id: 'trs', name: 'Bharat Rashtra Samithi (BRS)', symbol: '🚗' },
  { id: 'ysrcp', name: 'YSR Congress Party', symbol: '🏠' },
  { id: 'independent', name: 'Independent Candidate', symbol: '⭐' },
];

const CandidateRegistration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '', fatherName: '', dateOfBirth: '', gender: '', email: '', mobile: '',
    address: '', constituency: '', aadhaarNumber: '', panNumber: '', voterIdNumber: '',
    partyId: '', manifesto: '',
    aadhaarUploaded: false, panUploaded: false, voterIdUploaded: false,
    educationCertUploaded: false, criminalRecordUploaded: false, assetDeclarationUploaded: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateAge = (dob: string): number => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    else if (calculateAge(formData.dateOfBirth) < 25) newErrors.dateOfBirth = 'Must be at least 25 years old';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email).valid) newErrors.email = 'Invalid email format';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!validateMobile(formData.mobile).valid) newErrors.mobile = 'Invalid mobile number';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.constituency.trim()) newErrors.constituency = 'Constituency is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.aadhaarNumber.trim() || !/^\d{12}$/.test(formData.aadhaarNumber)) newErrors.aadhaarNumber = 'Valid 12-digit Aadhaar required';
    if (!formData.panNumber.trim() || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) newErrors.panNumber = 'Invalid PAN format';
    if (!formData.voterIdNumber.trim() || !/^[A-Z]{3}[0-9]{7}$/.test(formData.voterIdNumber.toUpperCase())) newErrors.voterIdNumber = 'Invalid EPIC format';
    if (!formData.aadhaarUploaded) newErrors.aadhaarUpload = 'Upload Aadhaar';
    if (!formData.panUploaded) newErrors.panUpload = 'Upload PAN';
    if (!formData.voterIdUploaded) newErrors.voterIdUpload = 'Upload Voter ID';
    if (!formData.educationCertUploaded) newErrors.educationUpload = 'Upload education certificate';
    if (!formData.criminalRecordUploaded) newErrors.criminalUpload = 'Upload criminal record affidavit';
    if (!formData.assetDeclarationUploaded) newErrors.assetUpload = 'Upload asset declaration';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.partyId) newErrors.partyId = 'Please select a party';
    if (!formData.manifesto.trim() || formData.manifesto.trim().length < 100) newErrors.manifesto = 'Manifesto must be at least 100 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;
    const selectedParty = INDIAN_PARTIES.find(p => p.id === formData.partyId);
    const result = registerCandidate({
      fullName: formData.fullName, fatherName: formData.fatherName, dateOfBirth: formData.dateOfBirth,
      gender: formData.gender, email: formData.email, mobile: formData.mobile, address: formData.address,
      constituency: formData.constituency, aadhaarNumber: formData.aadhaarNumber,
      panNumber: formData.panNumber.toUpperCase(), voterIdNumber: formData.voterIdNumber.toUpperCase(),
      partyId: formData.partyId, partyName: selectedParty?.name || '', partySymbol: selectedParty?.symbol || '',
      manifesto: formData.manifesto,
      documents: { aadhaar: formData.aadhaarUploaded, pan: formData.panUploaded, voterId: formData.voterIdUploaded,
        educationCert: formData.educationCertUploaded, criminalRecord: formData.criminalRecordUploaded, assetDeclaration: formData.assetDeclarationUploaded },
    });
    if (result.success) {
      toast({ title: "Registration Submitted!", description: `Application ID: ${result.applicationId}` });
      navigate('/candidate-success', { state: { applicationId: result.applicationId } });
    } else {
      toast({ title: "Registration Failed", description: result.message, variant: "destructive" });
    }
  };

  const simulateUpload = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: true }));
    toast({ title: "Document Uploaded", description: "Document uploaded successfully (simulated)" });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Candidate Registration</h1>
          <p className="text-muted-foreground">Register to contest in elections</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 3 && <div className={`w-16 h-1 rounded ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="card-glass p-8">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-6"><User className="w-6 h-6 text-primary" /><h2 className="text-xl font-semibold">Personal Information</h2></div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-2">Full Name *</label><input type="text" value={formData.fullName} onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))} className="input-field" />{errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName}</p>}</div>
                  <div><label className="block text-sm font-medium mb-2">Father's Name *</label><input type="text" value={formData.fatherName} onChange={(e) => setFormData(prev => ({ ...prev, fatherName: e.target.value }))} className="input-field" />{errors.fatherName && <p className="text-destructive text-sm mt-1">{errors.fatherName}</p>}</div>
                  <div><label className="block text-sm font-medium mb-2">Date of Birth *</label><input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))} className="input-field" /><p className="text-xs text-muted-foreground mt-1">Must be 25+ years old</p>{errors.dateOfBirth && <p className="text-destructive text-sm mt-1">{errors.dateOfBirth}</p>}</div>
                  <div><label className="block text-sm font-medium mb-2">Gender *</label><select value={formData.gender} onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))} className="input-field"><option value="">Select Gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select>{errors.gender && <p className="text-destructive text-sm mt-1">{errors.gender}</p>}</div>
                  <div><label className="block text-sm font-medium mb-2">Email *</label><input type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="input-field" />{errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}</div>
                  <div><label className="block text-sm font-medium mb-2">Mobile Number *</label><input type="tel" value={formData.mobile} onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))} className="input-field" />{errors.mobile && <p className="text-destructive text-sm mt-1">{errors.mobile}</p>}</div>
                </div>
                <div><label className="block text-sm font-medium mb-2">Full Address *</label><textarea value={formData.address} onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))} className="input-field min-h-[80px]" />{errors.address && <p className="text-destructive text-sm mt-1">{errors.address}</p>}</div>
                <div><label className="block text-sm font-medium mb-2">Constituency *</label><input type="text" value={formData.constituency} onChange={(e) => setFormData(prev => ({ ...prev, constituency: e.target.value }))} className="input-field" placeholder="e.g., Mumbai North" />{errors.constituency && <p className="text-destructive text-sm mt-1">{errors.constituency}</p>}</div>
                <div className="flex justify-end pt-4"><button type="button" onClick={handleNext} className="btn-primary px-8">Next: Documents</button></div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-6"><FileText className="w-6 h-6 text-primary" /><h2 className="text-xl font-semibold">Identity & Documents</h2></div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-2">Aadhaar Number *</label><input type="text" value={formData.aadhaarNumber} onChange={(e) => setFormData(prev => ({ ...prev, aadhaarNumber: e.target.value.replace(/\D/g, '').slice(0, 12) }))} className="input-field" maxLength={12} />{errors.aadhaarNumber && <p className="text-destructive text-sm mt-1">{errors.aadhaarNumber}</p>}</div>
                  <div><label className="block text-sm font-medium mb-2">Upload Aadhaar *</label><button type="button" onClick={() => simulateUpload('aadhaarUploaded')} disabled={formData.aadhaarUploaded} className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed ${formData.aadhaarUploaded ? 'border-success bg-success/10 text-success' : 'border-border hover:border-primary'}`}>{formData.aadhaarUploaded ? <CheckCircle className="w-5 h-5" /> : <Upload className="w-5 h-5" />}{formData.aadhaarUploaded ? 'Uploaded' : 'Upload'}</button>{errors.aadhaarUpload && <p className="text-destructive text-sm mt-1">{errors.aadhaarUpload}</p>}</div>
                  <div><label className="block text-sm font-medium mb-2">PAN Number *</label><input type="text" value={formData.panNumber} onChange={(e) => setFormData(prev => ({ ...prev, panNumber: e.target.value.toUpperCase().slice(0, 10) }))} className="input-field" maxLength={10} />{errors.panNumber && <p className="text-destructive text-sm mt-1">{errors.panNumber}</p>}</div>
                  <div><label className="block text-sm font-medium mb-2">Upload PAN *</label><button type="button" onClick={() => simulateUpload('panUploaded')} disabled={formData.panUploaded} className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed ${formData.panUploaded ? 'border-success bg-success/10 text-success' : 'border-border hover:border-primary'}`}>{formData.panUploaded ? <CheckCircle className="w-5 h-5" /> : <Upload className="w-5 h-5" />}{formData.panUploaded ? 'Uploaded' : 'Upload'}</button>{errors.panUpload && <p className="text-destructive text-sm mt-1">{errors.panUpload}</p>}</div>
                  <div><label className="block text-sm font-medium mb-2">Voter ID (EPIC) *</label><input type="text" value={formData.voterIdNumber} onChange={(e) => setFormData(prev => ({ ...prev, voterIdNumber: e.target.value.toUpperCase().slice(0, 10) }))} className="input-field" maxLength={10} />{errors.voterIdNumber && <p className="text-destructive text-sm mt-1">{errors.voterIdNumber}</p>}</div>
                  <div><label className="block text-sm font-medium mb-2">Upload Voter ID *</label><button type="button" onClick={() => simulateUpload('voterIdUploaded')} disabled={formData.voterIdUploaded} className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed ${formData.voterIdUploaded ? 'border-success bg-success/10 text-success' : 'border-border hover:border-primary'}`}>{formData.voterIdUploaded ? <CheckCircle className="w-5 h-5" /> : <Upload className="w-5 h-5" />}{formData.voterIdUploaded ? 'Uploaded' : 'Upload'}</button>{errors.voterIdUpload && <p className="text-destructive text-sm mt-1">{errors.voterIdUpload}</p>}</div>
                </div>
                <div className="border-t border-border pt-6"><h3 className="font-semibold mb-4">Government Certifications</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div><label className="block text-sm font-medium mb-2">Education Cert *</label><button type="button" onClick={() => simulateUpload('educationCertUploaded')} disabled={formData.educationCertUploaded} className={`w-full flex flex-col items-center gap-2 px-4 py-4 rounded-lg border-2 border-dashed ${formData.educationCertUploaded ? 'border-success bg-success/10 text-success' : 'border-border hover:border-primary'}`}>{formData.educationCertUploaded ? <CheckCircle className="w-6 h-6" /> : <Upload className="w-6 h-6" />}<span className="text-sm">{formData.educationCertUploaded ? 'Uploaded' : 'Upload'}</span></button>{errors.educationUpload && <p className="text-destructive text-sm mt-1">{errors.educationUpload}</p>}</div>
                    <div><label className="block text-sm font-medium mb-2">Criminal Record *</label><button type="button" onClick={() => simulateUpload('criminalRecordUploaded')} disabled={formData.criminalRecordUploaded} className={`w-full flex flex-col items-center gap-2 px-4 py-4 rounded-lg border-2 border-dashed ${formData.criminalRecordUploaded ? 'border-success bg-success/10 text-success' : 'border-border hover:border-primary'}`}>{formData.criminalRecordUploaded ? <CheckCircle className="w-6 h-6" /> : <Upload className="w-6 h-6" />}<span className="text-sm">{formData.criminalRecordUploaded ? 'Uploaded' : 'Upload'}</span></button>{errors.criminalUpload && <p className="text-destructive text-sm mt-1">{errors.criminalUpload}</p>}</div>
                    <div><label className="block text-sm font-medium mb-2">Asset Declaration *</label><button type="button" onClick={() => simulateUpload('assetDeclarationUploaded')} disabled={formData.assetDeclarationUploaded} className={`w-full flex flex-col items-center gap-2 px-4 py-4 rounded-lg border-2 border-dashed ${formData.assetDeclarationUploaded ? 'border-success bg-success/10 text-success' : 'border-border hover:border-primary'}`}>{formData.assetDeclarationUploaded ? <CheckCircle className="w-6 h-6" /> : <Upload className="w-6 h-6" />}<span className="text-sm">{formData.assetDeclarationUploaded ? 'Uploaded' : 'Upload'}</span></button>{errors.assetUpload && <p className="text-destructive text-sm mt-1">{errors.assetUpload}</p>}</div>
                  </div>
                </div>
                <div className="flex justify-between pt-4"><button type="button" onClick={() => setStep(1)} className="btn-secondary px-8">Back</button><button type="button" onClick={handleNext} className="btn-primary px-8">Next: Party Selection</button></div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-6"><Building2 className="w-6 h-6 text-primary" /><h2 className="text-xl font-semibold">Party & Manifesto</h2></div>
                <div><label className="block text-sm font-medium mb-3">Select Your Party *</label>
                  <div className="grid sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                    {INDIAN_PARTIES.map((party) => (
                      <label key={party.id} className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.partyId === party.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                        <input type="radio" name="party" value={party.id} checked={formData.partyId === party.id} onChange={(e) => setFormData(prev => ({ ...prev, partyId: e.target.value }))} className="sr-only" />
                        <span className="text-2xl">{party.symbol}</span><span className="text-sm font-medium">{party.name}</span>
                      </label>
                    ))}
                  </div>
                  {errors.partyId && <p className="text-destructive text-sm mt-2">{errors.partyId}</p>}
                </div>
                <div><label className="block text-sm font-medium mb-2">Your Manifesto *</label><textarea value={formData.manifesto} onChange={(e) => setFormData(prev => ({ ...prev, manifesto: e.target.value }))} className="input-field min-h-[150px]" placeholder="Describe your vision (minimum 100 characters)..." /><p className="text-xs text-muted-foreground mt-1">{formData.manifesto.length}/100 minimum</p>{errors.manifesto && <p className="text-destructive text-sm mt-1">{errors.manifesto}</p>}</div>
                <div className="bg-warning/10 border border-warning/30 rounded-lg p-4"><div className="flex items-start gap-3"><Shield className="w-5 h-5 text-warning mt-0.5" /><div className="text-sm"><p className="font-medium text-warning">Verification Notice</p><p className="text-muted-foreground mt-1">Your application will be reviewed by the Election Committee.</p></div></div></div>
                <div className="flex justify-between pt-4"><button type="button" onClick={() => setStep(2)} className="btn-secondary px-8">Back</button><button type="submit" className="btn-primary px-8">Submit Application</button></div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CandidateRegistration;
