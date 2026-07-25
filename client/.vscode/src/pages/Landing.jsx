import { Link } from "react-router-dom";
import { ArrowRight, BarChart2, Shield, TrendingUp } from "lucide-react";

function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 bg-white dark:bg-slate-800 shadow-sm border-b border-transparent dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 dark:bg-blue-500 p-2 rounded-lg">
            <BarChart2 className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-slate-800 dark:text-white">InvestTrack</span>
        </div>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">
          Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Investments</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12">
          Track your portfolio in real-time. Analyze performance, manage holdings, and make smarter financial decisions with our beautiful and intuitive dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/register"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-lg transition-transform hover:scale-105"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-lg transition-colors"
          >
            Login to Dashboard
          </Link>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto text-left">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="bg-blue-100 dark:bg-blue-900/40 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="text-blue-600 dark:text-blue-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Real-time Analytics</h3>
            <p className="text-slate-600 dark:text-slate-400">Watch your portfolio grow with real-time value updates and beautiful visualization charts.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="bg-indigo-100 dark:bg-indigo-900/40 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BarChart2 className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Deep Insights</h3>
            <p className="text-slate-600 dark:text-slate-400">Discover your best and worst performers instantly to make data-driven decisions.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="bg-purple-100 dark:bg-purple-900/40 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="text-purple-600 dark:text-purple-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Secure Tracking</h3>
            <p className="text-slate-600 dark:text-slate-400">Your data is stored securely in the cloud, accessible only by you from anywhere.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landing;
