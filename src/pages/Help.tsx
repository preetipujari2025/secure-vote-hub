import { useState } from 'react';
import { HelpCircle, UserPlus, ShieldCheck, LogIn, Vote, FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const Help = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'What is an EPIC Number?',
      answer: 'EPIC (Electoral Photo Identity Card) Number is a unique identification number printed on your Voter ID card. It consists of 3 letters followed by 7 digits (e.g., ABC1234567). This number is mandatory for registration and serves as your primary identifier in the voting system.'
    },
    {
      question: 'How do I register as a voter?',
      answer: 'Click on "Sign Up" or "Register to Vote" button. Fill in your details including Full Name, EPIC Number, Date of Birth, Mobile Number, Email, and create a password. After submitting, you\'ll receive an OTP for verification. Enter the OTP to complete your registration.'
    },
    {
      question: 'What is OTP verification?',
      answer: 'OTP (One-Time Password) verification is a security measure. After registration, a 6-digit code is sent to your registered mobile and email. You must enter this code correctly to verify your identity. In this demo, the OTP is displayed on screen for testing purposes.'
    },
    {
      question: 'Can I change my vote after casting it?',
      answer: 'No. Once you confirm your vote, it cannot be changed or withdrawn. This is a fundamental principle of secure voting—ensuring vote finality and preventing manipulation. Please review your choice carefully before confirming.'
    },
    {
      question: 'What is the Vote Reference ID?',
      answer: 'After casting your vote, you receive a unique Vote Reference ID (e.g., VR-ABC12345). This is your proof of voting. Save it for your records. It confirms your vote was recorded but cannot be used by anyone to see who you voted for.'
    },
    {
      question: 'Is my vote secret?',
      answer: 'Yes. Your vote is encrypted and stored separately from your identity. Even administrators can only see anonymized records with masked EPIC numbers. No one can trace your specific vote back to you.'
    },
    {
      question: 'What if I forget my password?',
      answer: 'In this demo system, there is no password recovery feature. In a real implementation, you would verify your identity through OTP and create a new password. For the demo, you can re-register with a new EPIC number to test the system.'
    },
    {
      question: 'Can I vote multiple times?',
      answer: 'No. The system strictly enforces one-person-one-vote. Once your vote is recorded under your EPIC number, all voting options are disabled. Attempting to vote again will show a message that you have already voted.'
    },
    {
      question: 'Who can access the admin dashboard?',
      answer: 'Only authorized election officers with admin credentials can access the admin dashboard. The dashboard shows aggregate statistics and anonymized vote records. Admin credentials for this demo: username "admin", password "Admin@123".'
    },
    {
      question: 'Is this system suitable for real elections?',
      answer: 'This is an educational demonstration. While it implements many security concepts correctly, a production voting system would require server-side implementation, proper encryption protocols, secure databases, audit trails, and compliance with election regulations.'
    }
  ];

  const steps = [
    {
      icon: UserPlus,
      title: 'Step 1: Register',
      description: 'Go to the Sign Up page and fill in your details. Your EPIC number must be valid (3 letters + 7 digits). Create a strong password with at least 8 characters, including numbers and special characters.'
    },
    {
      icon: ShieldCheck,
      title: 'Step 2: Verify OTP',
      description: 'After registration, you\'ll be redirected to OTP verification. Enter the 6-digit code shown on screen (demo mode). This step confirms your identity and activates your account.'
    },
    {
      icon: LogIn,
      title: 'Step 3: Login',
      description: 'Go to the Voter Login page. Enter your EPIC number and password. If credentials are correct and account is verified, you\'ll access your Voter Dashboard.'
    },
    {
      icon: Vote,
      title: 'Step 4: Cast Your Vote',
      description: 'Review the candidate cards in your dashboard. Click "Vote" on your preferred candidate. A confirmation dialog will appear—confirm your choice to finalize your vote.'
    },
    {
      icon: FileText,
      title: 'Step 5: Save Reference',
      description: 'After voting, you\'ll receive a Vote Reference ID. Copy and save this for your records. This is your proof of participation in the election.'
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-accent flex items-center justify-center">
            <HelpCircle className="w-10 h-10 text-accent-foreground" />
          </div>
          <h1 className="section-title text-4xl mb-4">Help & FAQ</h1>
          <p className="section-subtitle mx-auto">
            Everything you need to know about using the Online Voting System
          </p>
        </div>

        {/* How to Vote Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center font-display">
            How to Vote: Step-by-Step Guide
          </h2>
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.title}
                  className="card-glass p-6 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center font-display">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="card-glass overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
                >
                  <span className="font-medium text-foreground pr-4">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-5 animate-fade-in">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 card-glass p-8 text-center animate-fade-in-up">
          <h3 className="text-xl font-bold text-foreground mb-3">Still Have Questions?</h3>
          <p className="text-muted-foreground mb-4">
            For additional support or technical issues with this demo system
          </p>
          <p className="text-sm text-muted-foreground">
            📧 support@votingsystem.demo<br />
            📞 +91 1800-XXX-XXXX (Toll Free)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Help;
