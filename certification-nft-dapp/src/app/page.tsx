"use client";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { Shield, User, CheckCircle, BookOpen, Trophy, Star, Zap, Award, Sun, Moon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { AddAdminForm } from "@/components/AddAdminForm";
import { CertificateShelf } from "@/components/CertificateShelf";
import { ContractState } from "@/components/ContractState";
import { MintForm } from "@/components/MintForm";
import { NFTScanner } from "@/components/NFTScanner";
import { TokenViewer } from "@/components/TokenViewer";
import { useContractState } from "@/hooks/useContractState";
import { CONTRACT_ADDRESS } from "@/lib/constants";

export default function Home() {
  const userAddress = useTonAddress();
  const { isOwner, isAdmin, refetch } = useContractState();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [courseProgress, setCourseProgress] = useState({
    blockchain: false,
    ton: false,
    nfts: false,
  });
  const [showAlphaNotification, setShowAlphaNotification] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const autoGoTimer = useRef<number | null>(null);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const completedCourses = Object.values(courseProgress).filter(Boolean).length;
  const totalCourses = Object.keys(courseProgress).length;
  const progressPercentage = (completedCourses / totalCourses) * 100;

  const handleTransactionSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
    setTimeout(refetch, 3000);
  };

  const handleDisconnect = () => {
    if (typeof window === "undefined") return;
    try {
      Object.keys(localStorage).forEach((key) => {
        const k = key.toLowerCase();
        if (
          k.includes("tonconnect") ||
          k.includes("ton-connect") ||
          k.includes("ton:")
        ) {
          localStorage.removeItem(key);
        }
      });
      localStorage.removeItem("tonconnect");
    } catch (_e) {}
    setTimeout(() => location.reload(), 150);
  };

  const handleMarkAsRead = (course: keyof typeof courseProgress) => {
    setCourseProgress(prev => {
      const updated = { ...prev, [course]: true };
      // Check if all courses are completed
      if (Object.values(updated).every(complete => complete)) {
        setTimeout(() => setShowAlphaNotification(true), 500);
      }
      return updated;
    });
  };

  // Auto-go after some seconds, allow cancel or immediate "Go"
  const handleCloseAlphaNotification = () => {
    if (autoGoTimer.current) {
      clearTimeout(autoGoTimer.current);
      autoGoTimer.current = null;
    }
    setShowAlphaNotification(false);
  };

  const handleGoAlpha = () => {
    if (autoGoTimer.current) {
      clearTimeout(autoGoTimer.current);
      autoGoTimer.current = null;
    }
    const el = document.getElementById("certificate-gallery");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setShowAlphaNotification(false);
  };

  useEffect(() => {
    if (showAlphaNotification) {
      // auto-navigate after 6 seconds
      autoGoTimer.current = window.setTimeout(() => {
        handleGoAlpha();
      }, 6000);
    }
    return () => {
      if (autoGoTimer.current) {
        clearTimeout(autoGoTimer.current);
        autoGoTimer.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAlphaNotification]);

  return (
    <div className={`min-h-screen antialiased transition-colors duration-300 ${
      isDarkMode
        ? 'bg-[#0F0F0F] text-[#FAFAFA]'
        : 'bg-[#FAFAFA] text-[#171717]'
    }`}>
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-md transition-colors duration-300 ${
          isDarkMode ? 'bg-black/95' : 'bg-[#301934]/90'
        }`}>
          <div className={`p-8 rounded-3xl max-w-md mx-4 text-center border shadow-2xl transition-colors duration-300 ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-[#008080]/20'
          }`}>
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-[#008080] to-[#301934] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <img
                  src="/Daologo.png"
                  alt="Alpha DAO logo"
                  className="w-10 h-10"
                />
              </div>
              <h2 className={`text-3xl font-bold mb-3 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-[#301934]'
              }`}>
                Welcome to Alpha DAO
              </h2>
              <p className={`text-base leading-relaxed transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Learn the fundamentals of blockchain, TON, and NFTs. Complete short modules to earn a verified certification NFT on TON testnet.
              </p>
            </div>
            <button
              onClick={() => setShowWelcomeModal(false)}
              className="w-full relative bg-gradient-to-r from-[#008080] to-[#301934] hover:from-[#301934] hover:to-[#008080] text-white font-semibold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-[#008080]/30 overflow-hidden group text-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              <span className="relative">Start Learning</span>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
        isDarkMode
          ? 'bg-black/80 border-gray-800/50 shadow-2xl'
          : 'bg-white/90 border-gray-200/50 shadow-xl'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`absolute inset-0 rounded-xl blur-lg opacity-30 transition-colors duration-300 ${
                  isDarkMode ? 'bg-purple-500' : 'bg-cyan-400'
                }`}></div>
                <div className={`relative rounded-xl shadow-lg transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-800 p-2' : 'bg-white p-2 border border-gray-200'
                }`}>
                  <img
                    src="/Daologo.png"
                    alt="Alpha DAO logo"
                    className="w-5 h-5"
                  />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-xl font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Alpha DAO
                </h1>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Web3 Certification Mintplace
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-800'
                    : 'text-gray-600 hover:text-cyan-600 hover:bg-gray-50'
                }`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Wallet Connection */}
              <div className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${
                isDarkMode ? 'ring-1 ring-gray-700' : 'ring-1 ring-gray-200'
              }`}>
                <div className={`p-1 transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
                }`}>
                  <TonConnectButton />
                </div>
              </div>

              {userAddress && (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Disconnect
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Alpha Teaser - moved above Learning Progress */}
        <section className="mt-8 mb-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 transition-colors duration-300 ${
              isDarkMode
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-700'
            }`}>
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">
                Hands-on learning
              </span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Alpha DAO Certification Program
            </h2>
            <p className={`text-lg max-w-3xl mx-auto leading-relaxed transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-white/900'
            }`}>
              Short, practical modules to help you understand blockchain fundamentals, TON's architecture, and NFT mechanics — then mint a verifiable certificate to your wallet.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border transition-all duration-300 hover:scale-105 ${
              courseProgress.blockchain
                ? 'border-green-500 bg-gradient-to-br from-gray-800 to-green-900/20'
                : 'border-gray-700 hover:border-purple-500 hover:shadow-purple-500/10'
            }">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg w-fit transition-all ${
                  courseProgress.blockchain
                    ? 'bg-green-900/50'
                    : 'bg-purple-900/50'
                }`}>
                  <svg
                    className={`w-6 h-6 transition-colors ${
                      courseProgress.blockchain ? 'text-green-300' : 'text-purple-300'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                {courseProgress.blockchain && (
                  <div className="flex items-center gap-1 bg-green-900/50 px-2 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-300 font-medium">Completed</span>
                  </div>
                )}
              </div>
              <h3 className={`font-bold text-lg mb-3 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-white'
              }`}>
                Blockchain Fundamentals
              </h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Learn how distributed ledgers work, why they’re secure, and how transactions are validated — the core concepts you need to build on Web3.
              </p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <BookOpen className="w-3 h-3" />
                  <span>5 min read</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-yellow-400">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Beginner</span>
                </div>
              </div>
              <button
                onClick={() => handleMarkAsRead('blockchain')}
                disabled={courseProgress.blockchain}
                className={`w-full relative px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 transform ${
                  courseProgress.blockchain
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-purple-500/25 overflow-hidden group'
                }`}
              >
                {!courseProgress.blockchain && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                )}
                <div className="relative flex items-center justify-center gap-2">
                  {courseProgress.blockchain ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Completed
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <BookOpen className="w-4 h-4 group-hover:animate-bounce" />
                      Mark as Read
                    </span>
                  )}
                </div>
              </button>
            </div>

            <div className={`bg-gray-800 p-6 rounded-xl shadow-lg border transition-all duration-300 hover:scale-105 ${
              courseProgress.ton
                ? 'border-green-500 bg-gradient-to-br from-gray-800 to-green-900/20'
                : 'border-gray-700 hover:border-pink-500 hover:shadow-pink-500/10'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg w-fit transition-all ${
                  courseProgress.ton
                    ? 'bg-green-900/50'
                    : 'bg-pink-900/50'
                }`}>
                  <svg
                    className={`w-6 h-6 transition-colors ${
                      courseProgress.ton ? 'text-green-300' : 'text-pink-300'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                {courseProgress.ton && (
                  <div className="flex items-center gap-1 bg-green-900/50 px-2 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-300 font-medium">Completed</span>
                  </div>
                )}
              </div>
              <h3 className={`font-bold text-lg mb-3 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-white'
              }`}>
                TON Overview
              </h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Understand TON's design goals, performance characteristics, and how it enables fast, low-cost transactions for decentralized apps.
              </p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <BookOpen className="w-3 h-3" />
                  <span>7 min read</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-yellow-400">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Intermediate</span>
                </div>
              </div>
              <button
                onClick={() => handleMarkAsRead('ton')}
                disabled={courseProgress.ton}
                className={`w-full relative px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 transform ${
                  courseProgress.ton
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-pink-500/25 overflow-hidden group'
                }`}
              >
                {!courseProgress.ton && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                )}
                <div className="relative flex items-center justify-center gap-2">
                  {courseProgress.ton ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Completed
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <BookOpen className="w-4 h-4 group-hover:animate-bounce" />
                      Mark as Read
                    </span>
                  )}
                </div>
              </button>
            </div>

            <div className={`bg-gray-800 p-6 rounded-xl shadow-lg border transition-all duration-300 hover:scale-105 ${
              courseProgress.nfts
                ? 'border-green-500 bg-gradient-to-br from-gray-800 to-green-900/20'
                : 'border-gray-700 hover:border-green-500 hover:shadow-green-500/10'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg w-fit transition-all ${
                  courseProgress.nfts
                    ? 'bg-green-900/50'
                    : 'bg-green-900/50'
                }`}>
                  <svg
                    className={`w-6 h-6 transition-colors ${
                      courseProgress.nfts ? 'text-green-300' : 'text-green-300'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                {courseProgress.nfts && (
                  <div className="flex items-center gap-1 bg-green-900/50 px-2 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-300 font-medium">Completed</span>
                  </div>
                )}
              </div>
              <h3 className={`font-bold text-lg mb-3 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-white'
              }`}>
                NFTs & Digital Ownership
              </h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Learn how NFTs represent ownership, how metadata and provenance work, and how to mint and verify tokens on TON.
              </p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <BookOpen className="w-3 h-3" />
                  <span>6 min read</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-yellow-400">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Advanced</span>
                </div>
              </div>
              <button
                onClick={() => handleMarkAsRead('nfts')}
                disabled={courseProgress.nfts}
                className={`w-full relative px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 transform ${
                  courseProgress.nfts
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-green-500/25 overflow-hidden group'
                }`}
              >
                {!courseProgress.nfts && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                )}
                <div className="relative flex items-center justify-center gap-2">
                  {courseProgress.nfts ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Completed
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <BookOpen className="w-4 h-4 group-hover:animate-bounce" />
                      Mark as Read
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Progress Dashboard */}
        <section className="mb-8">
          <div className={`backdrop-blur-sm rounded-3xl p-8 border-2 shadow-2xl transition-colors duration-300 ${
            isDarkMode
              ? 'bg-gray-800/50 border-gray-700'
              : 'bg-white/90 border-[#008080]/20'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-2xl font-bold flex items-center gap-3 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-[#301934]'
                }`}>
                  <div className="p-2 bg-gradient-to-r from-[#008080] to-[#301934] rounded-xl">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  Learning Progress
                </h2>
                <p className={`text-base mt-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Complete all modules to earn a verified certificate NFT.
                </p>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-black transition-colors duration-300 ${
                  isDarkMode ? 'text-purple-400' : 'text-[#008080]'
                }`}>
                  {completedCourses}/{totalCourses}
                </div>
                <div className={`text-base font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Modules Completed
                </div>
              </div>
            </div>
            <div className={`w-full rounded-full h-4 mb-6 shadow-inner transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div
                className="bg-gradient-to-r from-[#008080] to-[#301934] h-4 rounded-full transition-all duration-700 shadow-lg"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-base">
              <span className={`font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Progress: {Math.round(progressPercentage)}%
              </span>
              {completedCourses === totalCourses && (
                <span className={`flex items-center gap-2 font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-green-400' : 'text-[#008080]'
                }`}>
                  <Award className="w-5 h-5" />
                  Certificate Ready
                </span>
              )}
            </div>
          </div>
        </section>

        {successMessage && (
          <div className="fixed inset-x-4 top-20 z-50 mx-auto max-w-md p-3 rounded-xl bg-green-900/80 border border-green-700 shadow-lg">
            <p className="text-green-200 font-medium text-sm text-center">
              {successMessage}
            </p>
          </div>
        )}

        {showAlphaNotification && (
          <div className="fixed inset-x-4 top-20 z-50 mx-auto max-w-md p-4 rounded-xl bg-gradient-to-r from-purple-900/80 to-pink-900/80 border border-purple-700 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mt-1">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">Achievement Unlocked</p>
                <p className="text-purple-200 text-xs mb-3">You completed all modules — your certified NFTs are available in the Alpha Vault.</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleGoAlpha}
                    className="px-3 py-1 rounded-md bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-medium hover:opacity-90 transition"
                  >
                    View Certificates
                  </button>
                  <button
                    onClick={handleCloseAlphaNotification}
                    className="px-3 py-1 rounded-md bg-gray-800/60 border border-gray-700 text-xs text-gray-200 hover:bg-gray-800 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
              <button
                onClick={handleCloseAlphaNotification}
                className="ml-3 text-gray-300 hover:text-white p-1"
                aria-label="Close notification"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <section id="contract-state" className="mb-8">
          <ContractState />
        </section>

        <section id="certificate-gallery" className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div>
              <h2 className={`text-xl sm:text-2xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Alpha Vault
              </h2>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Recently minted certifications and verified NFTs
              </p>
            </div>
          </div>
          <CertificateShelf />
        </section>

        {userAddress && (isAdmin || isOwner) && (
          <section id="admin-dashboard" className="mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <div>
                <h2 className={`text-xl sm:text-2xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Admin Console
                </h2>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Mint certificates and manage access
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {isAdmin && (
                <MintForm
                  onSuccess={() =>
                    handleTransactionSuccess("Certificate minted!")
                  }
                />
              )}
              {(isOwner || isAdmin) && (
                <AddAdminForm
                  onSuccess={() => handleTransactionSuccess("Admin added!")}
                />
              )}
            </div>
          </section>
        )}

        <section id="nft-scanner" className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div>
              <h2 className={`text-xl sm:text-2xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Blockchain Scanner
              </h2>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Inspect minted certificates and token data on TON
              </p>
            </div>
          </div>
          <NFTScanner />
        </section>

        <section id="certificate-explorer" className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div>
              <h2 className={`text-xl sm:text-2xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Token Viewer
              </h2>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Query token metadata and ownership details
              </p>
            </div>
          </div>
          <TokenViewer />
        </section>

        {!userAddress && (
          <section className="p-6 bg-gray-800 rounded-2xl text-center mb-8 shadow-lg border border-gray-700">
            <div className="max-w-xl mx-auto">
              <img
                src="/Daologo.png"
                alt="CertificationNFT logo"
                className="w-12 h-12 mx-auto mb-4"
              />
              <h3 className={`text-lg sm:text-2xl font-bold mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-white'
              }`}>
                Connect your wallet
              </h3>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              } mb-4`}>
                Sign in with TON to mint certificates, verify ownership, and interact with the DAO.
              </p>
              <div className="flex justify-center">
                <div className="rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-700">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-0.5 rounded-xl">
                    <div className="bg-gray-900 p-2 rounded-lg">
                      <TonConnectButton />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="mt-12">
          <div className="text-center mb-10">
            <h2 className={`text-3xl sm:text-4xl font-black mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Why Join Alpha DAO?
            </h2>
            <p className={`text-lg sm:text-xl font-semibold max-w-2xl mx-auto transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Learn, certify, and own your achievements on TON
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className={`p-8 rounded-3xl shadow-2xl border-2 hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 hover:border-purple-500'
                : 'bg-white border-[#008080]/20'
            }`}>
              <div className={`p-4 rounded-2xl w-fit mb-6 border transition-colors duration-300 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30'
                  : 'bg-gradient-to-r from-[#008080]/20 to-[#301934]/20 border-[#008080]/30'
              }`}>
                <svg
                  className={`w-8 h-8 transition-colors duration-300 ${
                    isDarkMode ? 'text-purple-300' : 'text-[#008080]'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className={`font-bold text-xl mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-[#301934]'
              }`}>
                Verifiable Records
              </h3>
              <p className={`text-base leading-relaxed transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Certificates are stored on-chain so anyone can verify authenticity and ownership.
              </p>
            </div>
            <div className={`p-8 rounded-3xl shadow-2xl border-2 hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 hover:border-pink-500'
                : 'bg-white border-[#008080]/20'
            }`}>
              <div className={`p-4 rounded-2xl w-fit mb-6 border transition-colors duration-300 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-pink-500/30'
                  : 'bg-gradient-to-r from-[#008080]/20 to-[#301934]/20 border-[#008080]/30'
              }`}>
                <Shield className={`w-8 h-8 transition-colors duration-300 ${
                  isDarkMode ? 'text-pink-300' : 'text-[#008080]'
                }`} />
              </div>
              <h3 className={`font-bold text-xl mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-[#301934]'
              }`}>
                Community Governance
              </h3>
              <p className={`text-base leading-relaxed transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Alpha members help shape curriculum and standards through DAO governance.
              </p>
            </div>
            <div className={`p-8 rounded-3xl shadow-2xl border-2 hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 hover:border-green-500'
                : 'bg-white border-[#008080]/20'
            }`}>
              <div className={`p-4 rounded-2xl w-fit mb-6 border transition-colors duration-300 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-green-500/30'
                  : 'bg-gradient-to-r from-[#008080]/20 to-[#301934]/20 border-[#008080]/30'
              }`}>
                <User className={`w-8 h-8 transition-colors duration-300 ${
                  isDarkMode ? 'text-green-300' : 'text-[#008080]'
                }`} />
              </div>
              <h3 className={`font-bold text-xl mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-[#301934]'
              }`}>
                True Ownership
              </h3>
              <p className={`text-base leading-relaxed transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Your certification lives in your wallet — portable, verifiable, and under your control.
              </p>
            </div>
          </div>
        </section>

      </main>

      <footer className={`mt-16 py-12 border-t-2 transition-colors duration-300 ${
        isDarkMode
          ? 'bg-black/80 border-gray-800'
          : 'bg-gradient-to-r from-[#E6E6FA] to-white border-[#008080]/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-[#008080] to-[#301934] rounded-2xl shadow-xl">
                  <img
                    src="/Daologo.png"
                    alt="ALPHA DAO logo"
                    className="w-6 h-6"
                  />
                </div>
                <span className={`text-2xl font-black transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-[#301934]'
                }`}>
                  ALPHA DAO
                </span>
              </div>
              <p className={`text-lg mb-6 leading-relaxed font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                A simple way to learn Web3 concepts and mint verifiable certifications on TON testnet.
              </p>
              <div className="flex items-center gap-4 text-base">
                <span className={`font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-[#301934]'
                }`}>
                  Contract:
                </span>
                <code className={`text-sm px-4 py-2 rounded-xl font-mono shadow-lg border-2 transition-colors duration-300 ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-600 text-gray-300'
                    : 'bg-white border-[#008080]/30 text-[#301934]'
                }`}>
                  {CONTRACT_ADDRESS.slice(0, 8)}...{CONTRACT_ADDRESS.slice(-6)}
                </code>
                <a
                  href={`https://testnet.tonviewer.com/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 transition-all duration-300 font-semibold hover:scale-105 ${
                    isDarkMode
                      ? 'text-purple-400 hover:text-purple-300'
                      : 'text-[#008080] hover:text-[#301934]'
                  }`}
                >
                  <span>View on TON Explorer</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className={`font-bold text-lg mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-[#301934]'
              }`}>
                Platform
              </h3>
              <ul className={`space-y-3 text-base transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <li>
                  <a href="#contract-state" className={`transition-colors font-medium ${
                    isDarkMode ? 'hover:text-purple-400' : 'hover:text-[#008080]'
                  }`}>
                    Explore
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className={`font-bold text-lg mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-[#301934]'
              }`}>
                Resources
              </h3>
              <ul className={`space-y-3 text-base transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <li>
                  <a
                    href="https://docs.ton.org"
                    target="_blank"
                    className={`transition-colors font-medium ${
                      isDarkMode ? 'hover:text-purple-400' : 'hover:text-[#008080]'
                    }`}
                  >
                    TON Docs
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className={`pt-8 border-t-2 flex flex-col sm:flex-row justify-between items-center gap-6 transition-colors duration-300 ${
            isDarkMode ? 'border-gray-800' : 'border-[#008080]/20'
          }`}>
            <p className={`text-base font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              © 2025 ALPHA DAO. All rights reserved.
            </p>
            <div className={`flex items-center gap-3 text-base font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <span className={`w-3 h-3 rounded-full animate-pulse shadow-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-purple-500' : 'bg-[#008080]'
              }`} />
              <span>TON Testnet</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
