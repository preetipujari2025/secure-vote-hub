import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCurrentSession, 
  getStatistics, 
  getAnonymizedVotes, 
  getCandidateRegistrations,
  updateCandidateStatus,
  CANDIDATES,
  CandidateRegistration
} from '@/lib/votingSystem';
import StatCard from '@/components/voting/StatCard';
import BarChart from '@/components/voting/BarChart';
import { Users, UserCheck, Vote, BarChart3, Clock, Eye, EyeOff, RefreshCw, FileCheck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const session = getCurrentSession();
  const [stats, setStats] = useState(getStatistics());
  const [anonymizedVotes, setAnonymizedVotes] = useState(getAnonymizedVotes());
  const [candidateRegistrations, setCandidateRegistrations] = useState<CandidateRegistration[]>(getCandidateRegistrations());
  const [showVotes, setShowVotes] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'votes' | 'candidates'>('votes');

  useEffect(() => {
    if (!session || session.role !== 'admin') {
      navigate('/admin-login');
    }
  }, [session, navigate]);

  const refreshData = () => {
    setStats(getStatistics());
    setAnonymizedVotes(getAnonymizedVotes());
    setCandidateRegistrations(getCandidateRegistrations());
    setLastRefresh(new Date());
  };

  const handleCandidateAction = (applicationId: string, action: 'verified' | 'approved' | 'rejected') => {
    const result = updateCandidateStatus(applicationId, action);
    if (result.success) {
      toast({
        title: action === 'approved' ? 'Candidate Approved' : action === 'rejected' ? 'Candidate Rejected' : 'Documents Verified',
        description: result.message,
      });
      refreshData();
    } else {
      toast({
        title: 'Action Failed',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  const pendingCandidates = candidateRegistrations.filter(c => c.status === 'pending');
  const verifiedCandidates = candidateRegistrations.filter(c => c.status === 'verified');
  const approvedCandidates = candidateRegistrations.filter(c => c.status === 'approved');

  if (!session) return null;

  const turnoutPercentage = stats.totalVerified > 0 
    ? ((stats.totalVotes / stats.totalVerified) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="section-title text-3xl mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Election monitoring and management console
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
            <button onClick={refreshData} className="btn-secondary">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="animate-fade-in-up stagger-1">
            <StatCard
              icon={<Users className="w-6 h-6" />}
              value={stats.totalRegistered}
              label="Total Registered Voters"
              color="primary"
            />
          </div>
          <div className="animate-fade-in-up stagger-2">
            <StatCard
              icon={<UserCheck className="w-6 h-6" />}
              value={stats.totalVerified}
              label="Verified Voters"
              color="success"
            />
          </div>
          <div className="animate-fade-in-up stagger-3">
            <StatCard
              icon={<Vote className="w-6 h-6" />}
              value={stats.totalVotes}
              label="Votes Cast"
              color="accent"
            />
          </div>
          <div className="animate-fade-in-up stagger-4">
            <StatCard
              icon={<BarChart3 className="w-6 h-6" />}
              value={`${turnoutPercentage}%`}
              label="Voter Turnout"
              color="warning"
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <div className="card-glass p-6 animate-fade-in-up">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              Vote Distribution
            </h2>
            {stats.totalVotes > 0 ? (
              <BarChart data={stats.votesPerCandidate} total={stats.totalVotes} />
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                No votes cast yet
              </div>
            )}
          </div>

          {/* Results Table */}
          <div className="card-glass p-6 animate-fade-in-up stagger-1">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <Vote className="w-5 h-5 text-accent" />
              Election Results Summary
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-semibold text-foreground">Rank</th>
                    <th className="text-left py-3 px-2 font-semibold text-foreground">Candidate</th>
                    <th className="text-right py-3 px-2 font-semibold text-foreground">Votes</th>
                    <th className="text-right py-3 px-2 font-semibold text-foreground">%</th>
                  </tr>
                </thead>
                <tbody>
                  {CANDIDATES
                    .map(c => ({
                      ...c,
                      votes: stats.votesPerCandidate[c.id] || 0
                    }))
                    .sort((a, b) => b.votes - a.votes)
                    .map((candidate, index) => {
                      const percentage = stats.totalVotes > 0 
                        ? ((candidate.votes / stats.totalVotes) * 100).toFixed(1)
                        : '0.0';
                      return (
                        <tr key={candidate.id} className="border-b border-border/50">
                          <td className="py-3 px-2">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                              index === 0 && candidate.votes > 0 ? 'bg-warning text-warning-foreground' : 'bg-secondary text-secondary-foreground'
                            }`}>
                              {index + 1}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: candidate.color }}
                              />
                              <div>
                                <p className="font-medium text-foreground">{candidate.name}</p>
                                <p className="text-xs text-muted-foreground">{candidate.party}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-right font-semibold text-foreground">
                            {candidate.votes}
                          </td>
                          <td className="py-3 px-2 text-right text-muted-foreground">
                            {percentage}%
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('votes')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'votes' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Vote Records
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'candidates' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Candidate Applications
            {pendingCandidates.length > 0 && (
              <span className="px-2 py-0.5 text-xs bg-warning text-warning-foreground rounded-full">
                {pendingCandidates.length}
              </span>
            )}
          </button>
        </div>

        {/* Anonymized Vote Records */}
        {activeTab === 'votes' && (
          <div className="card-glass p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                Vote Records (Anonymized)
              </h2>
              <button
                onClick={() => setShowVotes(!showVotes)}
                className="btn-ghost"
              >
                {showVotes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showVotes ? 'Hide' : 'Show'} Records
              </button>
            </div>

            {showVotes ? (
              anonymizedVotes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Masked EPIC</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Candidate</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {anonymizedVotes.map((vote, index) => (
                        <tr key={index} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                          <td className="py-3 px-4 font-mono text-foreground">{vote.maskedEPIC}</td>
                          <td className="py-3 px-4 text-foreground">{vote.candidateName}</td>
                          <td className="py-3 px-4 text-muted-foreground">{vote.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  No votes have been cast yet
                </div>
              )
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                Click "Show Records" to view anonymized vote data
              </div>
            )}
          </div>
        )}

        {/* Candidate Registrations */}
        {activeTab === 'candidates' && (
          <div className="space-y-6 animate-fade-in">
            {/* Pending Section */}
            <div className="card-glass p-6">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-warning" />
                Pending Verification ({pendingCandidates.length})
              </h2>
              {pendingCandidates.length > 0 ? (
                <div className="space-y-4">
                  {pendingCandidates.map((candidate) => (
                    <div key={candidate.applicationId} className="border border-border rounded-lg p-4 bg-background">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{candidate.partySymbol}</span>
                            <div>
                              <h3 className="font-semibold text-foreground">{candidate.fullName}</h3>
                              <p className="text-sm text-muted-foreground">{candidate.partyName}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Application ID:</span>
                              <p className="font-mono text-foreground">{candidate.applicationId}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Constituency:</span>
                              <p className="text-foreground">{candidate.constituency}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Voter ID:</span>
                              <p className="font-mono text-foreground">{candidate.voterIdNumber}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Submitted:</span>
                              <p className="text-foreground">{new Date(candidate.submittedAt || '').toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {Object.entries(candidate.documents).map(([doc, uploaded]) => (
                              <span 
                                key={doc} 
                                className={`px-2 py-1 rounded text-xs ${
                                  uploaded ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                                }`}
                              >
                                {doc.replace(/([A-Z])/g, ' $1').trim()}: {uploaded ? '✓' : '✗'}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCandidateAction(candidate.applicationId!, 'verified')}
                            className="btn-secondary text-sm"
                          >
                            <FileCheck className="w-4 h-4" />
                            Verify Docs
                          </button>
                          <button
                            onClick={() => handleCandidateAction(candidate.applicationId!, 'rejected')}
                            className="px-3 py-2 rounded-lg text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No pending applications</p>
              )}
            </div>

            {/* Verified Section */}
            <div className="card-glass p-6">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
                <FileCheck className="w-5 h-5 text-accent" />
                Verified - Pending Approval ({verifiedCandidates.length})
              </h2>
              {verifiedCandidates.length > 0 ? (
                <div className="space-y-4">
                  {verifiedCandidates.map((candidate) => (
                    <div key={candidate.applicationId} className="border border-border rounded-lg p-4 bg-background">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{candidate.partySymbol}</span>
                          <div>
                            <h3 className="font-semibold text-foreground">{candidate.fullName}</h3>
                            <p className="text-sm text-muted-foreground">{candidate.partyName} • {candidate.constituency}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCandidateAction(candidate.applicationId!, 'approved')}
                            className="btn-primary text-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleCandidateAction(candidate.applicationId!, 'rejected')}
                            className="px-3 py-2 rounded-lg text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No candidates pending approval</p>
              )}
            </div>

            {/* Approved Section */}
            <div className="card-glass p-6">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-success" />
                Approved Candidates ({approvedCandidates.length})
              </h2>
              {approvedCandidates.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {approvedCandidates.map((candidate) => (
                    <div key={candidate.applicationId} className="border border-success/30 rounded-lg p-4 bg-success/5">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{candidate.partySymbol}</span>
                        <div>
                          <h3 className="font-semibold text-foreground">{candidate.fullName}</h3>
                          <p className="text-sm text-muted-foreground">{candidate.partyName}</p>
                          <p className="text-xs text-success">{candidate.constituency}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No approved candidates yet</p>
              )}
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            All voter data is anonymized. EPIC numbers are masked to protect voter privacy.
            <br />
            Passwords and OTPs are never displayed or accessible through the admin panel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
