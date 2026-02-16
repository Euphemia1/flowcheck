<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>FlowCheck - Streamline Your Approval Process</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    <style>
        body {
            font-family: 'Figtree', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
        }
        .fc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .fc-header-title {
            font-size: 1.5rem;
            color: #0a3a32;
            font-weight: 700;
            letter-spacing: 1px;
        }
        .fc-header-nav {
            display: flex;
            gap: 2rem;
            align-items: center;
        }
        .fc-header-link {
            color: #0a3a32;
            font-weight: 500;
            text-decoration: none;
        }
        .fc-header-btn {
            background: #2e9c7a;
            color: #fff;
            font-weight: 600;
            border-radius: 2rem;
            padding: 0.7rem 2rem;
            text-decoration: none;
            font-size: 1rem;
        }
        .hero {
            text-align: center;
            padding: 6rem 1.5rem;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .features {
            padding: 6rem 1.5rem;
            background-color: #ffffff;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 4rem;
        }
        .feature-card {
            background: #f8fafc;
            border-radius: 12px;
            padding: 2.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .feature-icon {
            width: 3rem;
            height: 3rem;
            background-color: #e6f7f0;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.5rem;
        }
        footer {
            background: #2e9c7a;
            color: #fff;
            text-align: center;
            padding: 3rem 1rem;
            margin-top: 4rem;
        }
    </style>
</head>
<body>
    <div class="fc-landing-bg">
        <!-- Minimal Header -->
        <header class="fc-header">
            <div style="display:flex; align-items:center; gap:1rem;">
              <span style="font-size:1.8rem; font-weight:700; color:#2e9c7a; font-family:'Figtree', sans-serif;">FC</span>
<span style="height: 2rem; width: 2px; background-color: #2e9c7a; opacity: 0.5; margin: 0 0.75rem;"></span>
<a href="/" class="fc-header-title" style="text-decoration: none; font-size: 1.5rem; font-weight: 700; color: #0a3a32;">FlowCheck</a>
            </div>
            <nav class="fc-header-nav">
                <a href="#" class="fc-header-link">Product</a>
                <a href="#" class="fc-header-link">Solutions</a>
                <a href="#" class="fc-header-link">Customers</a>
                <a href="#" class="fc-header-link">Resources</a>
                <a href="#" class="fc-header-link">Pricing</a>
                <a href="{{ route('login') }}" class="fc-header-link">Login</a>
                <a href="{{ route('register') }}" class="fc-header-btn" style="background: #0a3a32;">Get Started</a>
            </nav>
        </header>

        <!-- Hero Section -->
        <section class="hero" style="text-align: center; padding: 4rem 1.5rem; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);">
            <div class="container">
                <h1 style="font-size: 3rem; font-weight: 800; color: #0a3a32; margin-bottom: 1.5rem; line-height: 1.2;">
                    Streamline Your Approval Process
                </h1>
                <p style="font-size: 1.5rem; color: #4b5563; max-width: 800px; margin: 0 auto 2rem; line-height: 1.5;">
                    Automate workflows, reduce manual tasks, and get approvals done faster.
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                    <a href="{{ route('register') }}" class="fc-header-btn" style="background: #2e9c7a; color: white; padding: 0.8rem 2rem; font-size: 1.1rem;">
                        Get Started Free
                    </a>
                    <a href="#" class="fc-header-btn" style="background: white; color: #0a3a32; padding: 0.8rem 2rem; font-size: 1.1rem; border: 2px solid #0a3a32;">
                        See How It Works
                    </a>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="features" style="padding: 4rem 0; overflow: hidden; position: relative;">
            <!-- <div class="container">
                <h2 style="text-align: center; font-size: 2.5rem; color: #0a3a32; margin-bottom: 3rem; font-weight: 700;">
                    Key Features
                </h2>
            </div> -->
            
            <div class="features-carousel" style="display: flex; gap: 2rem; padding: 1rem 0; animation: scroll 30s linear infinite; width: max-content;">
                <!-- Feature items will be duplicated for seamless looping -->
                <div class="feature-item" style="flex: 0 0 300px; padding: 0 1rem;">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem; color: #2e9c7a;">⚡</div>
                    <h3 style="font-size: 1.5rem; color: #0a3a32; margin-bottom: 1rem;">Lightning Fast</h3>
                    <p style="color: #4b5563; line-height: 1.6;">Approvals in seconds, not days. Our system processes requests instantly.</p>
                </div>
                
                <div class="feature-item" style="flex: 0 0 300px; padding: 0 1rem;">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem; color: #2e9c7a;">🔄</div>
                    <h3 style="font-size: 1.5rem; color: #0a3a32; margin-bottom: 1rem;">Automated Workflows</h3>
                    <p style="color: #4b5563; line-height: 1.6;">Set it and forget it. Our system handles the rest automatically.</p>
                </div>
                
                <div class="feature-item" style="flex: 0 0 300px; padding: 0 1rem;">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem; color: #2e9c7a;">📱</div>
                    <h3 style="font-size: 1.5rem; color: #0a3a32; margin-bottom: 1rem;">Mobile Friendly</h3>
                    <p style="color: #4b5563; line-height: 1.6;">Approve requests from anywhere, anytime, on any device.</p>
                </div>
                
                <div class="feature-item" style="flex: 0 0 300px; padding: 0 1rem;">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem; color: #2e9c7a;">�</div>
                    <h3 style="font-size: 1.5rem; color: #0a3a32; margin-bottom: 1rem;">Bank-Grade Security</h3>
                    <p style="color: #4b5563; line-height: 1.6;">Your data is protected with enterprise-level security measures.</p>
                </div>
                
                <!-- Duplicate items for seamless looping -->
                <div class="feature-item" style="flex: 0 0 300px; padding: 0 1rem;">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem; color: #2e9c7a;">⚡</div>
                    <h3 style="font-size: 1.5rem; color: #0a3a32; margin-bottom: 1rem;">Lightning Fast</h3>
                    <p style="color: #4b5563; line-height: 1.6;">Approvals in seconds, not days. Our system processes requests instantly.</p>
                </div>
                
                <div class="feature-item" style="flex: 0 0 300px; padding: 0 1rem;">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem; color: #2e9c7a;">🔄</div>
                    <h3 style="font-size: 1.5rem; color: #0a3a32; margin-bottom: 1rem;">Automated Workflows</h3>
                    <p style="color: #4b5563; line-height: 1.6;">Set it and forget it. Our system handles the rest automatically.</p>
                </div>
            </div>
            
            <style>
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-300px * 4 - 2rem * 4)); }
                }
                
                .features-carousel:hover {
                    animation-play-state: paused;
                }
                
                .feature-item {
                    transition: transform 0.3s ease;
                }
                
                .feature-item:hover {
                    transform: translateY(-5px);
                }
            </style>
            </div>
        </section>

        <!-- CTA Section -->
        <section style="padding: 5rem 1.5rem; text-align: center; background-color: #f8f9fa;;">
            <div class="container">
                <h2 style="color: #0a3a32; font-size: 2.5rem; margin-bottom: 1.5rem; font-weight: 700;">Ready to streamline your workflow?</h2>
                <p style="color: #4b5563; font-size: 1.25rem; max-width: 700px; margin: 0 auto 2.5rem; line-height: 1.6;">Schedule a demo and see how FlowCheck can transform your approval processes.</p>
                <a href="#" class="fc-header-btn" style="background: #2e9c7a; color: white; font-size: 1.1rem; padding: 1rem 2.5rem; font-weight: 600; display: inline-block; text-decoration: none; border-radius: 2rem;">
                    Book a Demo
                </a>
            </div>
        </section>

        <!-- Footer -->
        <footer>
            <div class="container">
                <div style="margin-bottom: 2rem;">
                    <span style="font-size:1.4rem; font-weight:700; color:#fff; letter-spacing:0.5px;">FlowCheck</span>
                </div>
                <div style="margin-top: 2rem; font-size: 0.875rem;">
                    <p>&copy; {{ date('Y') }} FlowCheck. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>
</body>
</html>