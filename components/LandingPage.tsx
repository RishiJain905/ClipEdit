import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Sparkles, Video, Type, Image as ImageIcon, Zap, Clock, Check, Play, ArrowRight, Youtube, Twitter, Linkedin, Mail, TrendingUp, Users, Star, Wand2, Scissors, Palette, BarChart3, Globe, MessageSquare } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
}

export function LandingPage({ onNavigateToLogin, onNavigateToSignup }: LandingPageProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900">CreatorFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900" onClick={onNavigateToLogin}>
              Sign In
            </Button>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white shadow-lg" onClick={onNavigateToSignup}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 opacity-60"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Hero content with asymmetric layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <Badge className="mb-6 bg-violet-100 text-violet-700 hover:bg-violet-200 border-0 px-4 py-1.5">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Next-gen AI for Creators
              </Badge>
              <h1 className="text-gray-900 mb-6 leading-tight">
                Stop Editing.<br />
                Start <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">Creating</span>
                  <span className="absolute bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-violet-200 to-fuchsia-200 -rotate-1"></span>
                </span>.
              </h1>
              <p className="text-gray-600 mb-8 text-lg">
                The AI that actually understands your content. Edit videos, generate captions, and design thumbnails 
                that get clicks—all while you sleep.
              </p>
              <div className="flex items-center gap-4 flex-wrap mb-8">
                <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white shadow-xl shadow-gray-900/20 group" onClick={onNavigateToSignup}>
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-violet-600" />
                  <span className="text-gray-600">No credit card needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-violet-600" />
                  <span className="text-gray-600">Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Floating cards - more creative layout */}
            <div className="relative h-[500px] hidden lg:block">
              {/* Main video preview card */}
              <div className="absolute top-0 right-0 w-80 bg-white rounded-2xl shadow-2xl shadow-purple-500/10 p-4 border border-gray-200/50 backdrop-blur-sm transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                      <Video className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-900">video_final_v3.mp4</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-0 text-xs">Ready</Badge>
                </div>
                <div className="aspect-video bg-gradient-to-br from-violet-100 via-purple-100 to-fuchsia-100 rounded-lg mb-3 flex items-center justify-center">
                  <Play className="w-12 h-12 text-purple-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Auto-edited</span>
                    <span className="text-violet-600">2m 34s saved</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-violet-600 to-fuchsia-600"></div>
                  </div>
                </div>
              </div>

              {/* Captions card - floating left */}
              <div className="absolute top-32 left-0 w-64 bg-white/80 backdrop-blur-xl rounded-xl shadow-xl shadow-blue-500/10 p-4 border border-gray-200/50 transform hover:scale-105 transition-transform">
                <div className="flex items-center gap-2 mb-3">
                  <Type className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-900">Smart Captions</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-2 rounded border-l-2 border-violet-600">
                    <span className="text-gray-500">00:00</span>
                    <p className="text-gray-700 mt-0.5">Hey everyone! Today we're diving into...</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-2 rounded border-l-2 border-blue-600">
                    <span className="text-gray-500">00:05</span>
                    <p className="text-gray-700 mt-0.5">The most amazing AI tool for creators</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
                  <Globe className="w-3 h-3" />
                  <span>50+ languages</span>
                </div>
              </div>

              {/* Thumbnails card - bottom right */}
              <div className="absolute bottom-0 right-12 w-72 bg-white rounded-xl shadow-xl shadow-fuchsia-500/10 p-4 border border-gray-200/50 transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-fuchsia-600" />
                    <span className="text-sm text-gray-900">AI Thumbnails</span>
                  </div>
                  <Badge className="bg-fuchsia-100 text-fuchsia-700 border-0 text-xs">+40% CTR</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-video bg-gradient-to-br from-violet-200 to-purple-300 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-white/80">A</div>
                  </div>
                  <div className="aspect-video bg-gradient-to-br from-fuchsia-200 to-pink-300 rounded-lg relative overflow-hidden ring-2 ring-fuchsia-600">
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-white/80">B</div>
                    <Star className="absolute top-0.5 right-0.5 w-3 h-3 text-fuchsia-600 fill-fuchsia-600" />
                  </div>
                  <div className="aspect-video bg-gradient-to-br from-blue-200 to-cyan-300 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-white/80">C</div>
                  </div>
                </div>
              </div>

              {/* Stats badge - top left */}
              <div className="absolute top-48 left-16 bg-white/90 backdrop-blur-xl rounded-full shadow-lg px-4 py-2 border border-gray-200/50 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-900">Processing 847 videos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-gray-900 mb-4">
              Everything you need.<br />Nothing you don't.
            </h2>
            <p className="text-gray-600 text-lg">
              Built for creators who refuse to waste time on repetitive tasks.
            </p>
          </div>

          {/* Bento grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Large feature - Auto Editing */}
            <div 
              className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl p-8 text-white relative overflow-hidden group cursor-pointer"
              onMouseEnter={() => setHoveredFeature(1)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <Scissors className="w-12 h-12 mb-4" />
                <h3 className="mb-3">Auto Editing Magic</h3>
                <p className="text-white/80 mb-6 max-w-md">
                  Our AI watches your content like a seasoned editor. It cuts silences, removes "uhms", 
                  adds smooth transitions, and even syncs B-roll based on what you're saying.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-sm">Cuts 6 hours to 15 minutes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Wand2 className="w-4 h-4" />
                    </div>
                    <span className="text-sm">Smart scene detection & transitions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <span className="text-sm">Auto-pacing for maximum retention</span>
                  </div>
                </div>
              </div>
              {/* Visual element */}
              <div className="absolute bottom-8 right-8 w-48 h-32 hidden lg:block">
                <div className="space-y-2">
                  <div className="h-8 bg-white/20 backdrop-blur-sm rounded-lg"></div>
                  <div className="h-8 bg-white/30 backdrop-blur-sm rounded-lg w-3/4"></div>
                  <div className="h-8 bg-white/20 backdrop-blur-sm rounded-lg w-1/2"></div>
                </div>
              </div>
            </div>

            {/* Smart Captions */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:border-violet-300 transition-colors group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Type className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-900 mb-3">Smart Captions</h3>
              <p className="text-gray-600 text-sm mb-4">
                99% accurate transcription with auto-styling that matches your brand. 50+ languages supported.
              </p>
              <div className="flex items-center gap-2 text-xs text-violet-600">
                <MessageSquare className="w-4 h-4" />
                <span>Real-time generation</span>
              </div>
            </div>

            {/* Instant Thumbnails */}
            <div className="bg-gradient-to-br from-fuchsia-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden group cursor-pointer">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-3">Instant Thumbnails</h3>
                <p className="text-white/80 text-sm mb-4">
                  CTR-optimized designs based on 10M+ data points. Get 5 variations in seconds.
                </p>
                <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
                  +40% avg CTR boost
                </Badge>
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:border-violet-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-900 mb-3">Performance Insights</h3>
              <p className="text-gray-600 text-sm">
                Track what's working. See retention curves, engagement peaks, and optimize for virality.
              </p>
            </div>

            {/* Collaboration */}
            <div className="bg-gray-900 rounded-3xl p-8 text-white">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="mb-3">Team Collaboration</h3>
              <p className="text-white/70 text-sm">
                Share projects, get feedback, and manage multiple channels from one dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of sections would continue here - I'll include key CTA buttons with navigation */}
      
      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNGgtMnYyaDJ2LTJ6bTAtOGgydi0yaC0ydjJ6bS0yLTJ2Mmgydi0yaC0yem0tMiAyaDJ2LTJoLTJ2MnptMCA0di0yaDJ2LTJoLTJ2LTJoLTJ2Mmgydjd6bS0yLTJoLTJ2Mmgydi0yem0wIDRoMnYtMmgtMnYyem00IDB2Mmgydi0yaC0yem0wLTRoMnYtMmgtMnYyem0tNi00aDJ2LTJoLTJ2MnptMTAgMGgydi0yaC0ydjJ6bS04IDBoMnYtMmgtMnYyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-white mb-6">
            Ready to 10x your content output?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of creators who've stopped wasting time on editing and started creating more.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button size="lg" className="bg-white hover:bg-gray-100 text-violet-600 shadow-xl" onClick={onNavigateToSignup}>
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
              <Play className="w-4 h-4 mr-2" />
              Watch 2-min Demo
            </Button>
          </div>
          <p className="text-white/70 text-sm mt-6">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl">CreatorFlow</span>
              </div>
              <p className="text-white/60 text-sm mb-6 max-w-xs">
                The AI toolkit that gives content creators their time back. Edit faster. Create more. Grow bigger.
              </p>
              <div className="flex items-center gap-3">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-violet-500"
                />
                <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="mb-4 text-sm text-white/90">Product</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-4 text-sm text-white/90">Company</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press Kit</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-4 text-sm text-white/90">Resources</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              © 2025 CreatorFlow. Built for creators, by creators.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/40 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
