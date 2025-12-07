import { Shield, Lock, Vote, CheckCircle, Eye, UserCheck, Database, Key } from 'lucide-react';

const About = () => {
  const securityFeatures = [
    {
      icon: Key,
      title: 'EPIC-Based Authentication',
      description: 'Each voter is uniquely identified by their Electoral Photo ID Card (EPIC) number, ensuring only registered voters can participate.'
    },
    {
      icon: Shield,
      title: 'OTP Verification',
      description: 'Two-factor authentication via One-Time Password sent to registered mobile and email addresses confirms voter identity.'
    },
    {
      icon: Lock,
      title: 'Password Hashing',
      description: 'All passwords are hashed before storage. Plain text passwords are never saved, ensuring security even if data is compromised.'
    },
    {
      icon: Vote,
      title: 'One-Person-One-Vote',
      description: 'Strict enforcement ensures each verified voter can cast only one vote, preventing duplicate voting attempts.'
    },
    {
      icon: Database,
      title: 'Encrypted Vote Storage',
      description: 'Votes are encrypted before storage, with the voter identity separated from the vote itself to maintain ballot secrecy.'
    },
    {
      icon: Eye,
      title: 'Anonymized Records',
      description: 'Admin access shows only anonymized data. EPIC numbers are masked, and individual votes cannot be traced back to voters.'
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary flex items-center justify-center">
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="section-title text-4xl mb-4">About This System</h1>
          <p className="section-subtitle mx-auto">
            A demonstration of secure online voting principles for educational purposes
          </p>
        </div>

        {/* Mission Statement */}
        <div className="card-glass p-8 mb-12 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-foreground mb-4 font-display">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            This Online Voting System demonstrates how democratic processes can be conducted securely 
            in a digital environment. Built as an educational tool, it showcases best practices in 
            voter authentication, ballot secrecy, and vote integrity.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            While this is a frontend demonstration that simulates security measures, the principles 
            shown here—EPIC-based authentication, OTP verification, password hashing, and vote 
            encryption—are fundamental to real-world electronic voting systems.
          </p>
        </div>

        {/* Security Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center font-display">
            Security Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title}
                  className="card-glass p-6 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How Privacy is Protected */}
        <div className="card-glass p-8 mb-12 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-foreground mb-6 font-display flex items-center gap-3">
            <UserCheck className="w-7 h-7 text-success" />
            Privacy Protection
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <p><strong className="text-foreground">Ballot Secrecy:</strong> Your vote choice is separated from your identity in storage, ensuring no one can determine how you voted.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <p><strong className="text-foreground">Data Masking:</strong> Administrators only see masked EPIC numbers (like XXXXXX3456), never the full identifier.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <p><strong className="text-foreground">No Password Access:</strong> Even administrators cannot view or retrieve user passwords or OTPs.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <p><strong className="text-foreground">Vote Reference:</strong> Each voter receives a unique reference ID for their records, but this cannot be used to reveal their vote to others.</p>
            </div>
          </div>
        </div>

        {/* Technical Note */}
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-6 text-center animate-fade-in-up">
          <p className="text-sm text-foreground font-medium mb-2">
            ⚠️ Educational Demo Notice
          </p>
          <p className="text-sm text-muted-foreground">
            This system uses browser localStorage for data persistence and simulates security measures 
            that would normally require server-side implementation. It is designed for learning and 
            demonstration purposes only, not for actual elections.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
