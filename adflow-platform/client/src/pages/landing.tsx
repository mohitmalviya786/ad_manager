import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Users, 
  BarChart3, 
  Shield,
  ArrowRight,
  Menu,
  X,
  CheckCircle
} from "lucide-react";
import { SiGoogle, SiFacebook, SiInstagram, SiLinkedin, SiTiktok, SiYoutube } from "react-icons/si";
import { useLocation } from "wouter";

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [_, navigate] = useLocation();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const features = [
    {
      icon: <Target className="w-8 h-8 text-blue-500" />,
      title: "Multi-Platform Campaigns",
      description: "Manage campaigns across Google, Facebook, Instagram, TikTok, and more from one dashboard."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-green-500" />,
      title: "Real-time Analytics",
      description: "Get instant insights with comprehensive analytics and performance tracking."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "AI-Powered Optimization",
      description: "Leverage AI to automatically optimize your campaigns for better performance."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: "Team Collaboration",
      description: "Work seamlessly with your team with role-based access and collaboration tools."
    },
    {
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-indigo-500" />,
      title: "Growth Focused",
      description: "Tools designed to scale your advertising efforts and grow your business."
    }
  ];

  const platforms = [
    { icon: <SiGoogle className="w-6 h-6" />, name: "Google Ads", color: "text-blue-600" },
    { icon: <SiFacebook className="w-6 h-6" />, name: "Facebook", color: "text-blue-700" },
    { icon: <SiInstagram className="w-6 h-6" />, name: "Instagram", color: "text-pink-600" },
    { icon: <SiLinkedin className="w-6 h-6" />, name: "LinkedIn", color: "text-blue-800" },
    { icon: <SiTiktok className="w-6 h-6" />, name: "TikTok", color: "text-black" },
    { icon: <SiYoutube className="w-6 h-6" />, name: "YouTube", color: "text-red-600" }
  ];

  const benefits = [
    "Save 70% time on campaign management",
    "Increase ROI by up to 150%",
    "Unified reporting across all platforms",
    "AI-powered bid optimization",
    "Advanced audience targeting",
    "Real-time performance monitoring"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AdFlow</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#platforms" className="text-gray-300 hover:text-white transition-colors">Platforms</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Sign In
              </Button>
              <Button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Get Started
              </Button>
            </div>

            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-lg border-t border-white/10">
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-gray-300 hover:text-white">Features</a>
              <a href="#platforms" className="block text-gray-300 hover:text-white">Platforms</a>
              <a href="#pricing" className="block text-gray-300 hover:text-white">Pricing</a>
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                Sign In
              </Button>
              <Button 
                onClick={handleGetStarted}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
            <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Ad Management
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Unify Your
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Ad Campaigns</span>
            </h1>

            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Manage all your social media advertising from one powerful platform. 
              Create, optimize, and track campaigns across multiple platforms with AI-driven insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl"
              >
                Watch Demo
              </Button>
            </div>

            {/* Platform Icons */}
            <div className="flex justify-center items-center space-x-8 opacity-60">
              {platforms.map((platform, index) => (
                <div 
                  key={platform.name}
                  className={`${platform.color} transition-all duration-300 hover:scale-110 animate-pulse`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {platform.icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage successful ad campaigns across all major platforms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Why Choose AdFlow?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Card className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-white/10 backdrop-blur-lg">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">150%</div>
                    <div className="text-gray-300 mb-4">Average ROI Increase</div>
                    <div className="text-2xl font-bold text-white mb-2">70%</div>
                    <div className="text-gray-300 mb-4">Time Saved</div>
                    <div className="text-2xl font-bold text-white mb-2">99.9%</div>
                    <div className="text-gray-300">Uptime</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Advertising?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of marketers who trust AdFlow to manage their campaigns
          </p>
          <Button 
            size="lg"
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xl px-12 py-6 rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
          >
            Start Your Free Trial
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">AdFlow</span>
          </div>
          <p className="text-gray-400">
            © 2024 AdFlow. All rights reserved. Built for modern marketers.
          </p>
        </div>
      </footer>
    </div>
  );
}