import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Sparkles, Camera, Mic, Video, Film, Zap, ArrowLeft } from "lucide-react";

interface LoginPageProps {
  onNavigateToSignup: () => void;
  onNavigateToHome: () => void;
}

export function LoginPage({ onNavigateToSignup, onNavigateToHome }: LoginPageProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Login form */}
      <div className="flex flex-col p-6 lg:p-16 bg-white">
        <button 
          onClick={onNavigateToHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-violet-600">CreatorFlow</span>
          </div>

          <div className="mb-8">
            <h1 className="text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600">Log in to continue to your account</p>
          </div>

          <div className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-gray-900 mb-2 block">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-gray-50 border-gray-200 h-12"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-900 mb-2 block">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-gray-50 border-gray-200 h-12"
              />
              <div className="text-right mt-2">
                <a href="#" className="text-violet-600 text-sm hover:text-violet-700">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button 
              className="w-full h-12 bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 text-white"
            >
              Log In
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <button 
                onClick={onNavigateToSignup}
                className="text-violet-600 hover:text-violet-700"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Gradient with icons */}
      <div className="hidden lg:flex flex-col items-center justify-center p-16 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        
        <div className="relative z-10 text-center mb-12">
          <h2 className="mb-3">Create. Share. Grow.</h2>
          <p className="text-white/80 max-w-xs mx-auto">
            Everything you need to power your creative workflow
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
            <Video className="w-8 h-8 text-white" />
          </div>
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
            <Film className="w-8 h-8 text-white" />
          </div>
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-8 relative z-10">
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <div className="w-2 h-2 rounded-full bg-white/40"></div>
          <div className="w-2 h-2 rounded-full bg-white/40"></div>
        </div>
      </div>
    </div>
  );
}
