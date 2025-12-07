import { Shield, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Online Voting</h3>
                <p className="text-xs opacity-80">System</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              A secure, transparent, and easy-to-use online voting platform designed for educational demonstration purposes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  About
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Help & FAQ
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Voter Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Voter Resources */}
          <div>
            <h4 className="font-semibold mb-4">Voter Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/signup" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Register to Vote
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  How to Vote
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  EPIC Guidelines
                </Link>
              </li>
              <li>
                <Link to="/admin-login" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm opacity-80">
                <Mail className="w-4 h-4" />
                support@votingsystem.demo
              </li>
              <li className="flex items-center gap-2 text-sm opacity-80">
                <Phone className="w-4 h-4" />
                +91 1800-XXX-XXXX
              </li>
              <li className="flex items-start gap-2 text-sm opacity-80">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Demo Election Commission<br />New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm opacity-80 text-center md:text-left">
              © 2025 Online Voting System. This is a demo project for academic purposes only.
            </p>
            <div className="flex items-center gap-4 text-sm opacity-80">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Accessibility</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
