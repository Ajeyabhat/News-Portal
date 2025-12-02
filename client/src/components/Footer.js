import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { name: 'Facebook', icon: Facebook },
    { name: 'Twitter', icon: Twitter },
    { name: 'Instagram', icon: Instagram },
    { name: 'LinkedIn', icon: Linkedin },
  ];

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-100 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              📰 News Portal
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Your daily source for educational updates. Stay informed, stay ahead.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ name, icon: Icon }) => (
                <button
                  type="button"
                  key={name}
                  className="p-2 rounded-full bg-gray-800 text-gray-300 transition-colors cursor-not-allowed"
                  title={`${name} page coming soon`}
                  aria-label={`${name} page coming soon`}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Newsletter</h4>
            <p className="text-gray-400 text-sm">
              📧 Stay updated with latest news and updates.
            </p>
            <p className="text-gray-500 text-xs mt-4">Coming soon...</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800"></div>

        {/* Footer Bottom */}
        <div className="py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} News Portal. All Rights Reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-primary-400 transition-colors">Terms</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-primary-400 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

