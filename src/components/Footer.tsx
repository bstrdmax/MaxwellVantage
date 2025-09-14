
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center text-xs text-slate-400 mt-8 pt-6 border-t border-slate-200">
      <p>
        Powered by{' '}
        <a href="https://www.maxwellriskgroup.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-500 hover:text-[#6366f1] transition-colors">
          Maxwell Risk Group
        </a>{' '}
        &{' '}
        <a href="https://www.jwmautomation.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-500 hover:text-[#6366f1] transition-colors">
          JWM Automations
        </a>
      </p>
    </footer>
  );
};

export default Footer;
