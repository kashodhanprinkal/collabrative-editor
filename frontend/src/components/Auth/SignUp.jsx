// client/src/components/Auth/SignUp.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Logic will be added later
    console.log('SignUp form submitted:', formData);
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    return strength;
  };

  const getStrengthLabel = (strength) => {
    const labels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
    return labels[strength] || 'Very Weak';
  };

  const getStrengthColor = (strength) => {
    const colors = ['#ef4444', '#f59e0b', '#fbbf24', '#34d399', '#10b981'];
    return colors[strength] || '#ef4444';
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-8">
      <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl p-8 shadow-2xl animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">✏️</div>
          <h1 className="text-3xl font-bold text-white">
            Code<span className="text-yellow-400">Sync</span>
          </h1>
          <p className="text-gray-400 mt-1">Create your account to start collaborating</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1.5">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] border-2 border-[#333] text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              required
              minLength="3"
              maxLength="20"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">3-20 characters, letters and numbers only</p>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] border-2 border-[#333] text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] border-2 border-[#333] text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                required
                minLength="8"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
            
            {/* Password strength indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="h-1 rounded-full bg-[#333] overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${(passwordStrength / 5) * 100}%`,
                      backgroundColor: getStrengthColor(passwordStrength)
                    }}
                  ></div>
                </div>
                <p className="text-xs mt-1" style={{ color: getStrengthColor(passwordStrength) }}>
                  {getStrengthLabel(passwordStrength)}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1.5">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] border-2 border-[#333] text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              disabled={isLoading}
              className="w-4 h-4 mt-1 accent-yellow-400 cursor-pointer disabled:opacity-50"
              required
            />
            <label htmlFor="agreeTerms" className="text-sm text-gray-400 cursor-pointer">
              I agree to the{' '}
              <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-yellow-400 text-[#0a0a0a] font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors">
            Login
          </Link>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#333]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#1a1a1a] text-gray-500">or continue with</span>
          </div>
        </div>

        {/* Social Signup */}
        <div className="flex gap-3">
          <button className="flex-1 py-2.5 rounded-lg border-2 border-[#333] text-gray-300 hover:bg-[#2a2a2a] hover:border-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            🐙 GitHub
          </button>
          <button className="flex-1 py-2.5 rounded-lg border-2 border-[#333] text-gray-300 hover:bg-[#2a2a2a] hover:border-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            🔴 Google
          </button>
        </div>
      </div>
    </div>
  );
}