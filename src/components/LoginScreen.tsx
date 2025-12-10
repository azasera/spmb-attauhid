import React, { useState } from 'react';
import { GraduationCap, LogIn, User, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => { success: boolean; message: string };
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Username dan password harus diisi!');
      return;
    }

    setIsLoading(true);
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      const result = onLogin(username.trim(), password);
      if (!result.success) {
        setError(result.message);
      }
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-400 to-blue-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-md w-full relative z-10 animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-white to-emerald-50 rounded-3xl mb-6 shadow-2xl hover-lift">
            <GraduationCap className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
            SPMB Ponpes IC At Tauhid
          </h1>
          <p className="text-white/90 text-lg font-medium drop-shadow">Sistem Penerimaan Murid Baru</p>
          <p className="text-white/70 text-sm mt-2 drop-shadow">Bangka Belitung</p>
        </div>

        <div className="glass rounded-3xl shadow-2xl p-8 hover-lift">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-8 text-center">
            Selamat Datang
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-fade-in">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <User className="h-5 w-5 text-amber-800 group-focus-within:text-amber-700 transition-colors" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all bg-white backdrop-blur-sm relative"
                  placeholder="Masukkan username"
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Lock className="h-5 w-5 text-amber-800 group-focus-within:text-amber-700 transition-colors" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all bg-white backdrop-blur-sm relative"
                  placeholder="Masukkan password"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform z-10"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-emerald-600 transition-colors" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-emerald-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white py-3.5 rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10 flex items-center">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Memuat...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Masuk
                  </>
                )}
              </span>
            </button>


          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

