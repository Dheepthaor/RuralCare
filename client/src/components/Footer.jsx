import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, PhoneCall, ShieldCheck, MapPin, WifiOff, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-emerald-200" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">{t('brand')}</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {lang === 'ml'
                ? 'കേരളത്തിലെ ഗ്രാമീണ, മലയോര ജനവിഭാഗങ്ങൾക്കായി സമഗ്ര പ്രാഥമികാരോഗ്യ സേവനങ്ങളും അടിയന്തര ഫോൺസഹായങ്ങളും ലഭ്യമാക്കുന്ന ഡിജിറ്റൽ വേദി.'
                : 'Better Healthcare for a Healthier Rural Tomorrow. Connecting remote and high-range communities in Kerala with public healthcare facilities, doctors, and offline medical guidance.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {lang === 'ml' ? 'ആരോഗ്യ സുരക്ഷാ മാർഗ്ഗരേഖകൾക്ക് വിധേയം' : 'Public Health Awareness Initiative'}
              </span>
            </div>
          </div>

          {/* Emergency Lines */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {lang === 'ml' ? 'അടിയന്തര ഹെൽപ്പ്‌ലൈനുകൾ' : 'Emergency Helplines'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="tel:108"
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 hover:bg-red-950/60 border border-slate-700 hover:border-red-600 transition group"
                >
                  <span className="text-slate-200 group-hover:text-red-300 font-medium">
                    108 Kanivu Ambulance
                  </span>
                  <span className="text-xs bg-red-600/30 text-red-300 font-bold px-2 py-0.5 rounded">
                    24/7 Toll-Free
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:1056"
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition"
                >
                  <span className="text-slate-200 font-medium">1056 DISHA Health Helpline</span>
                  <span className="text-xs bg-teal-900/60 text-teal-300 px-2 py-0.5 rounded">Advisory</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:102"
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition"
                >
                  <span className="text-slate-200 font-medium">102 Mother & Child Transport</span>
                  <span className="text-xs bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded">Maternal</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {lang === 'ml' ? 'പ്രധാന ലിങ്കുകൾ' : 'Quick Navigation'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="text-slate-400 hover:text-white transition">
                  {t('navServices')}
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="text-slate-400 hover:text-white transition">
                  {t('navDoctors')}
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="text-slate-400 hover:text-white transition">
                  {t('navEmergency')}
                </Link>
              </li>
              <li>
                <Link to="/health-info" className="text-slate-400 hover:text-white transition">
                  {t('navHealthInfo')}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-white transition">
                  {t('navDashboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Rural Coverage & Offline Notice */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {lang === 'ml' ? 'ഗ്രാമീണ പരിരക്ഷാ മേഖലകൾ' : 'High-Range Coverage'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Focusing on high-range tea estates, tribal blocks, and remote agrarian belts: Wayanad, Palakkad (Attappady), Idukki (Munnar/Devikulam), and forest fringe hamlets.
            </p>
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <WifiOff className="w-3.5 h-3.5" />
                <span>PWA Offline Readiness</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Install RuralCare on your Android or iPhone home screen to retain offline access to emergency numbers and saved medical guides.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 space-y-3">
          <p className="leading-relaxed">
            <strong className="text-slate-400">Educational Disclaimer:</strong> RuralCare is a community health access platform developed for academic demonstration and public health support. Content is based on published public health directives from the Kerala Health Department and WHO. This platform does not provide automated vehicle dispatch or clinical diagnostic evaluation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
            <p>© {new Date().getFullYear()} RuralCare. Built with MERN Stack, PWA & OpenStreetMap.</p>
            <p className="text-slate-400">
              {lang === 'ml' ? 'കേരളത്തിന് അനുയോജ്യമായ ആരോഗ്യ സാങ്കേതികവിദ്യ' : 'Engineered for Rural Kerala'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
