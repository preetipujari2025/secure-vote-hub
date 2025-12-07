// ============================================
// ONLINE VOTING SYSTEM - Core Logic
// ============================================

// Types
export interface Voter {
  epicNumber: string;
  fullName: string;
  dateOfBirth: string;
  mobileNumber: string;
  email: string;
  passwordHash: string;
  isVerified: boolean;
  registeredAt: string;
}

export interface Vote {
  encryptedData: string;
  candidateId: string;
  timestamp: string;
  referenceId: string;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  manifesto: string;
  color: string;
}

export interface Admin {
  username: string;
  passwordHash: string;
}

// ============================================
// ENCRYPTION & HASHING UTILITIES
// ============================================

/**
 * Simple hash function for passwords (for demo purposes)
 * In production, use bcrypt or similar
 */
export function hashPassword(password: string): string {
  let hash = 0;
  const salt = "VotingSalt2025";
  const salted = password + salt;
  
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return btoa(hash.toString(16) + salt.substring(0, 4));
}

/**
 * Simulate vote encryption
 */
export function encryptVote(epicNumber: string, candidateId: string): string {
  const timestamp = Date.now().toString(36);
  const data = `${epicNumber}:${candidateId}:${timestamp}`;
  return btoa(data.split('').reverse().join(''));
}

/**
 * Generate a random reference ID
 */
export function generateReferenceId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'VR-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Mask email for display
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  const maskedLocal = local.charAt(0) + '*'.repeat(local.length - 2) + local.charAt(local.length - 1);
  return `${maskedLocal}@${domain}`;
}

/**
 * Mask mobile number for display
 */
export function maskMobile(mobile: string): string {
  return '*'.repeat(mobile.length - 4) + mobile.slice(-4);
}

/**
 * Mask EPIC number for display
 */
export function maskEPIC(epic: string): string {
  return 'XXXXXX' + epic.slice(-4);
}

// ============================================
// VALIDATION UTILITIES
// ============================================

export function validateEPIC(epic: string): { valid: boolean; message: string } {
  const pattern = /^[A-Z]{3}[0-9]{7}$/;
  if (!epic) {
    return { valid: false, message: 'EPIC Number is required' };
  }
  if (!pattern.test(epic.toUpperCase())) {
    return { valid: false, message: 'EPIC must be 3 letters followed by 7 digits (e.g., ABC1234567)' };
  }
  return { valid: true, message: '' };
}

export function validatePassword(password: string): { 
  valid: boolean; 
  message: string; 
  strength: 'weak' | 'fair' | 'good' | 'strong' 
} {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters', strength: 'weak' };
  }
  
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  
  const score = [hasNumber, hasSpecial, hasUpper, hasLower].filter(Boolean).length;
  
  if (!hasNumber || !hasSpecial) {
    return { 
      valid: false, 
      message: 'Password must include at least one number and one special character',
      strength: score <= 1 ? 'weak' : 'fair'
    };
  }
  
  const strength = score <= 2 ? 'fair' : score === 3 ? 'good' : 'strong';
  return { valid: true, message: '', strength };
}

export function validateEmail(email: string): { valid: boolean; message: string } {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { valid: false, message: 'Email is required' };
  }
  if (!pattern.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  return { valid: true, message: '' };
}

export function validateMobile(mobile: string): { valid: boolean; message: string } {
  const pattern = /^[0-9]{10}$/;
  if (!mobile) {
    return { valid: false, message: 'Mobile number is required' };
  }
  if (!pattern.test(mobile)) {
    return { valid: false, message: 'Please enter a valid 10-digit mobile number' };
  }
  return { valid: true, message: '' };
}

// ============================================
// LOCAL STORAGE OPERATIONS
// ============================================

const STORAGE_KEYS = {
  VOTERS: 'voting_system_voters',
  VOTES: 'voting_system_votes',
  CURRENT_USER: 'voting_system_current_user',
  PENDING_OTP: 'voting_system_pending_otp',
};

// Hard-coded admin credentials
const ADMIN_CREDENTIALS: Admin = {
  username: 'admin',
  passwordHash: hashPassword('Admin@123'),
};

/**
 * Get all registered voters
 */
export function getVoters(): Record<string, Voter> {
  const data = localStorage.getItem(STORAGE_KEYS.VOTERS);
  return data ? JSON.parse(data) : {};
}

/**
 * Save voters to storage
 */
export function saveVoters(voters: Record<string, Voter>): void {
  localStorage.setItem(STORAGE_KEYS.VOTERS, JSON.stringify(voters));
}

/**
 * Register a new voter
 */
export function registerVoter(voter: Omit<Voter, 'passwordHash' | 'isVerified' | 'registeredAt'> & { password: string }): 
  { success: boolean; message: string } {
  const voters = getVoters();
  const epicUpper = voter.epicNumber.toUpperCase();
  
  if (voters[epicUpper]) {
    return { success: false, message: 'This EPIC number is already registered' };
  }
  
  voters[epicUpper] = {
    epicNumber: epicUpper,
    fullName: voter.fullName,
    dateOfBirth: voter.dateOfBirth,
    mobileNumber: voter.mobileNumber,
    email: voter.email,
    passwordHash: hashPassword(voter.password),
    isVerified: false,
    registeredAt: new Date().toISOString(),
  };
  
  saveVoters(voters);
  return { success: true, message: 'Registration successful' };
}

/**
 * Verify voter with OTP
 */
export function verifyVoter(epicNumber: string): { success: boolean; message: string } {
  const voters = getVoters();
  const epicUpper = epicNumber.toUpperCase();
  
  if (!voters[epicUpper]) {
    return { success: false, message: 'Voter not found' };
  }
  
  voters[epicUpper].isVerified = true;
  saveVoters(voters);
  return { success: true, message: 'Verification successful' };
}

/**
 * Login voter
 */
export function loginVoter(epicNumber: string, password: string): 
  { success: boolean; message: string; voter?: Voter } {
  const voters = getVoters();
  const epicUpper = epicNumber.toUpperCase();
  const voter = voters[epicUpper];
  
  if (!voter) {
    return { success: false, message: 'Invalid EPIC number or password' };
  }
  
  if (!voter.isVerified) {
    return { success: false, message: 'Please verify your account with OTP first' };
  }
  
  if (voter.passwordHash !== hashPassword(password)) {
    return { success: false, message: 'Invalid EPIC number or password' };
  }
  
  sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ 
    epicNumber: epicUpper, 
    role: 'voter',
    name: voter.fullName
  }));
  
  return { success: true, message: 'Login successful', voter };
}

/**
 * Login admin
 */
export function loginAdmin(username: string, password: string): { success: boolean; message: string } {
  if (username === ADMIN_CREDENTIALS.username && 
      hashPassword(password) === ADMIN_CREDENTIALS.passwordHash) {
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ 
      epicNumber: 'ADMIN', 
      role: 'admin',
      name: 'Administrator'
    }));
    return { success: true, message: 'Admin login successful' };
  }
  return { success: false, message: 'Invalid admin credentials' };
}

/**
 * Get current session
 */
export function getCurrentSession(): { epicNumber: string; role: 'voter' | 'admin'; name: string } | null {
  const data = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

/**
 * Logout
 */
export function logout(): void {
  sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

/**
 * Store pending OTP
 */
export function storePendingOTP(epicNumber: string, otp: string): void {
  sessionStorage.setItem(STORAGE_KEYS.PENDING_OTP, JSON.stringify({ epicNumber, otp }));
}

/**
 * Verify OTP
 */
export function verifyOTP(epicNumber: string, otp: string): { success: boolean; message: string } {
  const data = sessionStorage.getItem(STORAGE_KEYS.PENDING_OTP);
  if (!data) {
    return { success: false, message: 'OTP session expired. Please request a new OTP.' };
  }
  
  const pending = JSON.parse(data);
  if (pending.epicNumber !== epicNumber.toUpperCase()) {
    return { success: false, message: 'Invalid OTP session' };
  }
  
  if (pending.otp !== otp) {
    return { success: false, message: 'Invalid OTP. Please try again.' };
  }
  
  sessionStorage.removeItem(STORAGE_KEYS.PENDING_OTP);
  return { success: true, message: 'OTP verified successfully' };
}

// ============================================
// VOTING OPERATIONS
// ============================================

/**
 * Get all votes
 */
export function getVotes(): Record<string, Vote> {
  const data = localStorage.getItem(STORAGE_KEYS.VOTES);
  return data ? JSON.parse(data) : {};
}

/**
 * Check if voter has already voted
 */
export function hasVoted(epicNumber: string): boolean {
  const votes = getVotes();
  return !!votes[epicNumber.toUpperCase()];
}

/**
 * Get voter's vote
 */
export function getVoterVote(epicNumber: string): Vote | null {
  const votes = getVotes();
  return votes[epicNumber.toUpperCase()] || null;
}

/**
 * Cast a vote
 */
export function castVote(epicNumber: string, candidateId: string): 
  { success: boolean; message: string; referenceId?: string } {
  const epicUpper = epicNumber.toUpperCase();
  
  if (hasVoted(epicUpper)) {
    return { success: false, message: 'You have already cast your vote' };
  }
  
  const votes = getVotes();
  const referenceId = generateReferenceId();
  
  votes[epicUpper] = {
    encryptedData: encryptVote(epicUpper, candidateId),
    candidateId,
    timestamp: new Date().toISOString(),
    referenceId,
  };
  
  localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
  return { success: true, message: 'Vote cast successfully', referenceId };
}

// ============================================
// CANDIDATES DATA
// ============================================

export const CANDIDATES: Candidate[] = [
  {
    id: 'candidate-1',
    name: 'Rahul Sharma',
    party: 'Progressive Students Union',
    manifesto: 'Committed to improving campus infrastructure, increasing scholarship opportunities, and promoting sustainable initiatives across all departments.',
    color: '#3B82F6',
  },
  {
    id: 'candidate-2',
    name: 'Priya Patel',
    party: 'Unity Student Front',
    manifesto: 'Focused on mental health support, diversity & inclusion programs, and creating more recreational spaces for student activities.',
    color: '#10B981',
  },
  {
    id: 'candidate-3',
    name: 'Amit Kumar',
    party: 'Innovation Alliance',
    manifesto: 'Advocating for modernized learning facilities, industry partnerships for internships, and technology-driven campus solutions.',
    color: '#F59E0B',
  },
  {
    id: 'candidate-4',
    name: 'Neha Singh',
    party: 'Student Welfare Party',
    manifesto: 'Prioritizing affordable housing, enhanced security measures, and transparent governance in all student body decisions.',
    color: '#EF4444',
  },
];

/**
 * Get candidate by ID
 */
export function getCandidateById(id: string): Candidate | undefined {
  return CANDIDATES.find(c => c.id === id);
}

// ============================================
// ADMIN STATISTICS
// ============================================

export function getStatistics(): {
  totalRegistered: number;
  totalVerified: number;
  totalVotes: number;
  votesPerCandidate: Record<string, number>;
} {
  const voters = getVoters();
  const votes = getVotes();
  
  const voterList = Object.values(voters);
  const voteList = Object.values(votes);
  
  const votesPerCandidate: Record<string, number> = {};
  CANDIDATES.forEach(c => {
    votesPerCandidate[c.id] = 0;
  });
  
  voteList.forEach(vote => {
    if (votesPerCandidate[vote.candidateId] !== undefined) {
      votesPerCandidate[vote.candidateId]++;
    }
  });
  
  return {
    totalRegistered: voterList.length,
    totalVerified: voterList.filter(v => v.isVerified).length,
    totalVotes: voteList.length,
    votesPerCandidate,
  };
}

/**
 * Get anonymized vote records for admin
 */
export function getAnonymizedVotes(): Array<{
  maskedEPIC: string;
  candidateName: string;
  timestamp: string;
}> {
  const votes = getVotes();
  return Object.entries(votes).map(([epic, vote]) => ({
    maskedEPIC: maskEPIC(epic),
    candidateName: getCandidateById(vote.candidateId)?.name || 'Unknown',
    timestamp: new Date(vote.timestamp).toLocaleString(),
  }));
}
