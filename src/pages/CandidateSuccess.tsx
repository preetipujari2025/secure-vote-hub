import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle, Clock, FileText, Home } from 'lucide-react';
import Navbar from '../components/voting/Navbar';
import Footer from '../components/voting/Footer';

const CandidateSuccess = () => {
  const location = useLocation();
  const applicationId = location.state?.applicationId;

  if (!applicationId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="max-w-lg w-full text-center animate-fade-in">
          <div className="card-glass p-8">
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-2">
              Application Submitted Successfully!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your candidature application has been received and is pending verification.
            </p>

            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Application Reference ID</p>
              <p className="text-xl font-mono font-bold text-primary">{applicationId}</p>
            </div>

            <div className="space-y-4 text-left mb-8">
              <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Pending Verification</p>
                  <p className="text-xs text-muted-foreground">
                    The Election Committee will review your documents within 3-5 working days.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-sm">What's Next?</p>
                  <p className="text-xs text-muted-foreground">
                    You will receive an email/SMS notification once your candidature is approved or if additional documents are required.
                  </p>
                </div>
              </div>
            </div>

            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              <Home className="w-4 h-4" />
              Return to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CandidateSuccess;
