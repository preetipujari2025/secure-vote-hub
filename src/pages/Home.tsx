import { Link } from 'react-router-dom';
import { Shield, Vote, Users, Lock, CheckCircle, Clock, UserCheck, Award } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'Login with your unique EPIC number and verified credentials',
      color: 'primary'
    },
    {
      icon: Vote,
      title: 'One Person, One Vote',
      description: 'Strict enforcement ensures each voter can cast only one vote',
      color: 'success'
    },
    {
      icon: Lock,
      title: 'Encrypted Storage',
      description: 'Your vote is encrypted and stored securely with full privacy',
      color: 'accent'
    },
    {
      icon: CheckCircle,
      title: 'Instant Confirmation',
      description: 'Receive a unique reference ID immediately after voting',
      color: 'warning'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Register',
      description: 'Sign up with your EPIC number, personal details, and create a password',
      icon: Users
    },
    {
      number: '02',
      title: 'Verify',
      description: 'Complete OTP verification to activate your voter account',
      icon: UserCheck
    },
    {
      number: '03',
      title: 'Vote',
      description: 'Log in and cast your vote for your preferred candidate',
      icon: Vote
    },
    {
      number: '04',
      title: 'Confirm',
      description: 'Receive your vote confirmation and reference ID',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8 animate-fade-in">
              <Shield className="w-4 h-4" />
              Secure • Transparent • Democratic
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in-up">
              Online Voting
              <span className="block gradient-text">System</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up stagger-1">
              Experience secure, transparent, and easy digital voting. 
              Exercise your democratic right from anywhere with complete confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-2">
              <Link to="/signup" className="btn-primary text-base px-8 py-4">
                <Vote className="w-5 h-5" />
                Register to Vote
              </Link>
              <Link to="/login" className="btn-secondary text-base px-8 py-4">
                <Users className="w-5 h-5" />
                Candidate Login
              </Link>
            </div>

            {/* Login Options */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 animate-fade-in-up stagger-3">
              <Link to="/admin-login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-accent/30 bg-accent/5 text-accent hover:bg-accent/10 transition-all font-medium">
                <Shield className="w-5 h-5" />
                Election Committee Login
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative max-w-3xl mx-auto animate-fade-in-up stagger-4">
            <div className="card-glass p-8 md:p-12">
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">End-to-End<br />Encryption</p>
                </div>
                <div className="hidden sm:block w-px h-16 bg-border" />
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-success/10 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Verified<br />Voters Only</p>
                </div>
                <div className="hidden sm:block w-px h-16 bg-border" />
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-accent" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Real-Time<br />Results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Why Choose Our Platform?</h2>
            <p className="section-subtitle mx-auto">
              Built with security and transparency at its core, our voting system ensures 
              every vote counts and remains protected.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title}
                  className="card-glass p-6 text-center hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                    feature.color === 'success' ? 'bg-success/10' :
                    feature.color === 'accent' ? 'bg-accent/10' :
                    feature.color === 'warning' ? 'bg-warning/10' :
                    'bg-primary/10'
                  }`}>
                    <Icon className={`w-7 h-7 ${
                      feature.color === 'success' ? 'text-success' :
                      feature.color === 'accent' ? 'text-accent' :
                      feature.color === 'warning' ? 'text-warning' :
                      'text-primary'
                    }`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">How It Works</h2>
            <p className="section-subtitle mx-auto">
              Four simple steps to cast your vote securely
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div 
                    key={step.number}
                    className="relative text-center animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border" />
                    )}
                    
                    {/* Step Circle */}
                    <div className="relative z-10 w-16 h-16 mx-auto mb-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Icon className="w-7 h-7" />
                    </div>
                    
                    {/* Step Number */}
                    <span className="text-xs font-bold text-accent">{step.number}</span>
                    
                    {/* Content */}
                    <h3 className="text-lg font-semibold text-foreground mt-2 mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Vote?</h2>
          <p className="text-lg opacity-90 max-w-xl mx-auto mb-8">
            Register now and become part of the democratic process. 
            Your vote matters and your voice counts.
          </p>
          <Link 
            to="/signup" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-foreground text-primary rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            <Vote className="w-5 h-5" />
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Election Info Banner */}
      <section className="py-12 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="card-glass p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Vote className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Student Council Election 2025</h3>
                <p className="text-sm text-muted-foreground">
                  Voting Period: December 1 - December 31, 2025
                </p>
              </div>
            </div>
            <Link to="/login" className="btn-primary whitespace-nowrap">
              Cast Your Vote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
