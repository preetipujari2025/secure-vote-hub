import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCurrentSession, 
  CANDIDATES, 
  hasVoted, 
  getVoterVote, 
  castVote,
  getCandidateById,
  Candidate
} from '@/lib/votingSystem';
import CandidateCard from '@/components/voting/CandidateCard';
import Modal from '@/components/voting/Modal';
import { Vote, Calendar, Clock, CheckCircle, AlertTriangle, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';

const VoterDashboard = () => {
  const navigate = useNavigate();
  const session = getCurrentSession();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [voteResult, setVoteResult] = useState<{ referenceId: string; candidateName: string } | null>(null);
  
  const [votedCandidateId, setVotedCandidateId] = useState<string | null>(null);
  const [existingVote, setExistingVote] = useState<ReturnType<typeof getVoterVote>>(null);

  useEffect(() => {
    if (!session || session.role !== 'voter') {
      navigate('/login');
      return;
    }

    // Check if user has already voted
    if (hasVoted(session.epicNumber)) {
      const vote = getVoterVote(session.epicNumber);
      setExistingVote(vote);
      if (vote) {
        setVotedCandidateId(vote.candidateId);
      }
    }
  }, [session, navigate]);

  const handleVoteClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowConfirmModal(true);
  };

  const handleConfirmVote = async () => {
    if (!selectedCandidate || !session) return;

    setIsVoting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = castVote(session.epicNumber, selectedCandidate.id);

    if (result.success) {
      setVotedCandidateId(selectedCandidate.id);
      setVoteResult({
        referenceId: result.referenceId!,
        candidateName: selectedCandidate.name
      });
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      
      // Update existing vote state
      setExistingVote(getVoterVote(session.epicNumber));
    } else {
      toast.error(result.message);
    }

    setIsVoting(false);
  };

  const copyReferenceId = () => {
    if (voteResult?.referenceId || existingVote?.referenceId) {
      navigator.clipboard.writeText(voteResult?.referenceId || existingVote?.referenceId || '');
      toast.success('Reference ID copied to clipboard!');
    }
  };

  if (!session) return null;

  const alreadyVoted = !!votedCandidateId;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Welcome Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="section-title text-3xl mb-2">
            Welcome, {session.name}!
          </h1>
          <p className="text-muted-foreground">
            Your voice matters. Make it count.
          </p>
        </div>

        {/* Election Info Card */}
        <div className="card-glass p-6 mb-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <Vote className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Student Council Election 2025</h2>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Dec 1 - Dec 31, 2025
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Voting Open
                  </span>
                </div>
              </div>
            </div>
            <div className="badge badge-success">
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </div>
          </div>
        </div>

        {/* Already Voted Banner */}
        {alreadyVoted && existingVote && (
          <div className="card-glass p-6 mb-8 border-2 border-success/30 bg-success/5 animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-1">Vote Recorded Successfully!</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  You voted for <span className="font-semibold text-foreground">{getCandidateById(existingVote.candidateId)?.name}</span> on {new Date(existingVote.timestamp).toLocaleString()}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-background rounded-lg border border-border">
                    <span className="text-xs text-muted-foreground">Reference ID:</span>
                    <span className="font-mono font-bold text-foreground">{existingVote.referenceId}</span>
                    <button onClick={copyReferenceId} className="p-1 hover:bg-secondary rounded transition-colors">
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Voting Instructions */}
        {!alreadyVoted && (
          <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-8 animate-fade-in-up">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Important Voting Rules:</p>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• You can vote for only <strong>one candidate</strong></li>
                  <li>• Your vote <strong>cannot be changed</strong> once submitted</li>
                  <li>• Save your Reference ID for your records</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Candidates Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6">
            {alreadyVoted ? 'Election Candidates' : 'Choose Your Candidate'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CANDIDATES.map((candidate, index) => (
              <div 
                key={candidate.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CandidateCard
                  candidate={candidate}
                  onVote={handleVoteClick}
                  disabled={alreadyVoted}
                  hasVoted={alreadyVoted}
                  isSelected={votedCandidateId === candidate.id}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Confirm Vote Modal */}
        <Modal
          isOpen={showConfirmModal}
          onClose={() => !isVoting && setShowConfirmModal(false)}
          title="Confirm Your Vote"
        >
          {selectedCandidate && (
            <div className="text-center">
              <div 
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${selectedCandidate.color}20` }}
              >
                <Vote className="w-10 h-10" style={{ color: selectedCandidate.color }} />
              </div>
              <p className="text-lg font-bold text-foreground mb-1">
                {selectedCandidate.name}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                {selectedCandidate.party}
              </p>
              
              <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm text-warning flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  This action cannot be undone. Are you sure you want to vote for this candidate?
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isVoting}
                  className="flex-1 btn-secondary py-3 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmVote}
                  disabled={isVoting}
                  className="flex-1 btn-primary py-3 disabled:opacity-50"
                >
                  {isVoting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Confirm Vote
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Vote Cast Successfully!"
        >
          {voteResult && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-success" />
              </div>
              <p className="text-lg font-medium text-foreground mb-2">
                Thank you for voting!
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Your vote for <span className="font-semibold">{voteResult.candidateName}</span> has been recorded securely.
              </p>

              <div className="bg-secondary rounded-xl p-4 mb-6">
                <p className="text-xs text-muted-foreground mb-2">Your Vote Reference ID</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl font-mono font-bold text-foreground">{voteResult.referenceId}</span>
                  <button onClick={copyReferenceId} className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-4">
                Please save this reference ID for your records.
              </p>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full btn-primary py-3"
              >
                Done
              </button>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default VoterDashboard;
