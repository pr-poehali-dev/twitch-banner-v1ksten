import { useState, useEffect, useRef } from "react";

const BUTTERFLY_COUNT = 16;
const ONLINE = "offline"; // "online" | "offline" | "starting" | "afk"

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

interface Butterfly {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  hue: number;
}

const generateButterflies = (): Butterfly[] =>
  Array.from({ length: BUTTERFLY_COUNT }, (_, i) => ({
    id: i,
    x: randomBetween(0, 100),
    y: randomBetween(0, 100),
    size: randomBetween(10, 26),
    duration: randomBetween(7, 18),
    delay: randomBetween(0, 12),
    opacity: randomBetween(0.3, 0.8),
    hue: randomBetween(270, 315),
  }));

const ButterflyIcon = ({ size, hue, opacity }: { size: number; hue: number; opacity: number }) => (
  <svg width={size * 2} height={size * 1.4} viewBox="0 0 60 42" fill="none" style={{ opacity }}>
    <ellipse cx="16" cy="18" rx="14" ry="10" fill={`hsla(${hue}, 90%, 75%, 0.7)`} />
    <ellipse cx="44" cy="18" rx="14" ry="10" fill={`hsla(${hue}, 90%, 75%, 0.7)`} />
    <ellipse cx="19" cy="28" rx="10" ry="7" fill={`hsla(${hue + 15}, 80%, 65%, 0.6)`} />
    <ellipse cx="41" cy="28" rx="10" ry="7" fill={`hsla(${hue + 15}, 80%, 65%, 0.6)`} />
    <ellipse cx="16" cy="18" rx="14" ry="10" fill={`hsla(${hue}, 100%, 90%, 0.2)`} />
    <ellipse cx="44" cy="18" rx="14" ry="10" fill={`hsla(${hue}, 100%, 90%, 0.2)`} />
    <line x1="30" y1="4" x2="30" y2="38" stroke={`hsla(${hue - 20}, 60%, 40%, 0.8)`} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M30 4 Q27 0 24 2" stroke={`hsla(${hue - 20}, 60%, 40%, 0.6)`} strokeWidth="1" fill="none" />
    <path d="M30 4 Q33 0 36 2" stroke={`hsla(${hue - 20}, 60%, 40%, 0.6)`} strokeWidth="1" fill="none" />
  </svg>
);

const panels = [
  {
    id: "about",
    icon: "✦",
    label: "ОБО МНЕ",
    image: "https://cdn.poehali.dev/projects/6e81497b-6f59-434e-8a70-5f4bc57ba281/bucket/0f3e04b9-c323-47db-be50-9fa78eaca11c.jpg",
    desc: "Я V1ksteN — стримерша и геймерша. Меня зовут Виктория. Я из Москвы. Я не слышу и владею жестовым языком.",
    color: "#c084fc",
    glow: "rgba(192,132,252,0.5)",
    link: null,
  },
  {
    id: "donate",
    icon: "♡",
    label: "DONATE",
    image: null,
    desc: "Support the stream — every donation is appreciated and motivates me to make better content!\nПоддержи стрим — любая сумма приятна и мотивирует делать контент лучше!",
    color: "#f0abfc",
    glow: "rgba(240,171,252,0.6)",
    link: "https://www.donationalerts.com/r/v1ksten",
  },
  {
    id: "steam",
    icon: "⚙",
    label: "STEAM",
    image: null,
    desc: "Мой профиль Steam — смотри что играю и добавляй в друзья.",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.5)",
    link: "https://steamcommunity.com/profiles/76561198220657831/",
  },

];

const statusConfig = {
  online: { label: "ОНЛАЙН", dot: "#c84fff", glowDot: true, badgeBg: "rgba(80,0,120,0.6)", border: "rgba(190,80,255,0.7)" },
  starting: { label: "STARTING SOON", dot: "#a855f7", glowDot: true, badgeBg: "rgba(60,0,100,0.6)", border: "rgba(168,85,247,0.7)" },
  afk: { label: "AFK", dot: "#7c3aed", glowDot: true, badgeBg: "rgba(50,10,90,0.6)", border: "rgba(124,58,237,0.6)" },
  offline: { label: "ОФЛАЙН", dot: "#6b5b85", glowDot: false, badgeBg: "rgba(30,20,50,0.55)", border: "rgba(100,80,130,0.4)" },
};

const Index = () => {
  const [butterflies] = useState<Butterfly[]>(generateButterflies);
  const status = ONLINE as keyof typeof statusConfig;
  const sc = statusConfig[status] ?? statusConfig.offline;
  const isLive = status !== "offline";
  const [tick, setTick] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() / 1000;
    for (let i = 0; i < 55; i++) {
      const x = (Math.sin(i * 2.4 + t * 0.25) * 0.5 + 0.5) * canvas.width;
      const y = (Math.cos(i * 1.7 + t * 0.18) * 0.5 + 0.5) * canvas.height;
      const r = Math.random() * 1.8 + 0.4;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${280 + Math.sin(i) * 30}, 90%, 80%, ${0.25 + Math.random() * 0.4})`;
      ctx.fill();
    }
  }, [tick]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#06010e",
        fontFamily: "'Montserrat', sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* ───── HERO BANNER ───── */}
      <div className="relative w-full overflow-hidden flex items-center justify-center" style={{ height: "100vh" }}>
        {/* BG image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(https://cdn.poehali.dev/projects/6e81497b-6f59-434e-8a70-5f4bc57ba281/bucket/3056a53c-3bac-4696-a4d3-05a1eb19ae31.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            filter: "brightness(0.5) saturate(1.4)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 90% 70% at 60% 40%, rgba(80,0,130,0.2) 0%, rgba(6,1,14,0.65) 100%)",
          }}
        />
        {/* bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: "180px", background: "linear-gradient(to top, #06010e, transparent)" }}
        />

        {/* Particles */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ mixBlendMode: "screen", opacity: 0.55 }}
        />

        {/* Butterflies */}
        {butterflies.map((b) => (
          <div
            key={b.id}
            className="absolute pointer-events-none"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              animation: `float-b${b.id % 4} ${b.duration}s ${b.delay}s infinite ease-in-out`,
              filter: `drop-shadow(0 0 5px hsla(${b.hue}, 100%, 80%, 0.9))`,
            }}
          >
            <ButterflyIcon size={b.size} hue={b.hue} opacity={b.opacity} />
          </div>
        ))}

        {/* Hero text — over legs area */}
        <div
          className="relative z-10 flex flex-col items-center"
          style={{ gap: "1.4rem", marginTop: "58vh" }}
        >
          {/* Glow halo */}
          <div style={{
            position: "absolute",
            width: "560px", height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(160,60,255,0.2) 0%, transparent 70%)",
            filter: "blur(30px)",
            pointerEvents: "none",
          }} />

          {/* Name */}
          <div className="flex flex-col items-center" style={{ gap: "0.4rem" }}>
            <span style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: "clamp(2.6rem, 7.5vw, 6rem)",
              fontWeight: 900,
              letterSpacing: "0.08em",
              color: "#fff",
              textShadow: "0 0 20px rgba(190,80,255,0.9), 0 0 60px rgba(160,40,255,0.7), 0 0 120px rgba(120,20,220,0.5), 0 2px 4px rgba(0,0,0,0.95)",
              lineHeight: 1,
              WebkitTextStroke: "1px rgba(210,120,255,0.35)",
              animation: "nameGlow 3s ease-in-out infinite alternate",
            }}>
              V1ksteN
            </span>
            <div style={{
              width: "100%", height: "2px",
              background: "linear-gradient(90deg, transparent, rgba(190,80,255,0.9), rgba(140,200,255,0.5), rgba(190,80,255,0.9), transparent)",
              boxShadow: "0 0 14px rgba(190,80,255,0.7)",
              animation: "linePulse 2s ease-in-out infinite alternate",
            }} />
          </div>

          <p style={{
            fontSize: "clamp(0.7rem, 1.8vw, 0.88rem)", fontWeight: 500,
            letterSpacing: "0.28em", textTransform: "uppercase",
            color: "rgba(200,160,255,0.5)", textAlign: "center",
          }}>
            twitch.tv/v1ksten
          </p>
        </div>
      </div>

      {/* ───── PANELS SECTION ───── */}
      <div style={{
        padding: "60px 24px 80px",
        background: "linear-gradient(180deg, #06010e 0%, #0d0220 50%, #06010e 100%)",
      }}>
        {/* Section label */}
        <div className="flex items-center justify-center" style={{ marginBottom: "40px", gap: "16px" }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(190,80,255,0.4))" }} />
          <span style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: "clamp(0.7rem, 1.5vw, 0.9rem)",
            letterSpacing: "0.35em", textTransform: "uppercase",
            color: "rgba(200,150,255,0.6)",
          }}>
            НАВИГАЦИЯ
          </span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(190,80,255,0.4))" }} />
        </div>

        {/* Panels grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}>
          {panels.map((p) => (
            <a
              key={p.id}
              href={p.link ?? "#"}
              target={p.link ? "_blank" : undefined}
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <div
                className="panel-card"
                style={{
                  position: "relative",
                  padding: "28px 22px",
                  borderRadius: "16px",
                  background: "rgba(20,6,40,0.7)",
                  border: `1px solid rgba(150,80,220,0.25)`,
                  backdropFilter: "blur(14px)",
                  cursor: p.link ? "pointer" : "default",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 48px ${p.glow}`;
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${p.color}55`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(150,80,220,0.25)";
                }}
              >
                {/* Corner glow */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "1px",
                  background: `linear-gradient(90deg, transparent, ${p.color}66, transparent)`,
                }} />

                {/* Panel image */}
                {p.image && (
                  <div style={{
                    width: "calc(100% + 44px)", marginLeft: "-22px", marginTop: "-28px",
                    marginBottom: "16px", height: "140px", overflow: "hidden",
                    borderRadius: "16px 16px 0 0",
                  }}>
                    <img src={p.image} alt={p.label} style={{
                      width: "100%", height: "100%", objectFit: "cover",
                      objectPosition: "center top",
                      filter: "brightness(0.85) saturate(1.3)",
                    }} />
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: "140px",
                      background: `linear-gradient(to bottom, transparent 50%, rgba(20,6,40,0.9) 100%)`,
                    }} />
                  </div>
                )}

                {/* Icon */}
                <div style={{
                  fontSize: "1.8rem", marginBottom: "12px",
                  color: p.color,
                  textShadow: `0 0 12px ${p.glow}`,
                  filter: `drop-shadow(0 0 8px ${p.color})`,
                }}>
                  {p.icon}
                </div>

                {/* Label */}
                <div style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: "clamp(0.65rem, 1.4vw, 0.8rem)",
                  fontWeight: 700, letterSpacing: "0.22em",
                  color: p.color,
                  textShadow: `0 0 8px ${p.glow}`,
                  marginBottom: "10px",
                }}>
                  {p.label}
                </div>

                {/* Divider */}
                <div style={{
                  width: "40px", height: "1px", marginBottom: "12px",
                  background: `linear-gradient(90deg, ${p.color}80, transparent)`,
                }} />

                {/* Description */}
                <p style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "clamp(0.72rem, 1.3vw, 0.82rem)",
                  fontWeight: 400, lineHeight: 1.65,
                  color: "rgba(200,180,220,0.7)",
                  margin: 0,
                }}>
                  {p.desc}
                </p>

                {/* Arrow if has link */}
                {p.link && (
                  <div style={{
                    marginTop: "16px", fontSize: "0.75rem",
                    color: `${p.color}99`, letterSpacing: "0.15em",
                    fontWeight: 600,
                  }}>
                    ПЕРЕЙТИ →
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Montserrat:wght@400;500;700&display=swap');

        @keyframes float-b0 {
          0%,100% { transform: translate(0,0) rotate(-5deg) scaleX(1); }
          25% { transform: translate(28px,-42px) rotate(5deg) scaleX(-1); }
          50% { transform: translate(-18px,-70px) rotate(-8deg) scaleX(1); }
          75% { transform: translate(38px,-28px) rotate(3deg) scaleX(-1); }
        }
        @keyframes float-b1 {
          0%,100% { transform: translate(0,0) rotate(8deg) scaleX(-1); }
          30% { transform: translate(-38px,-52px) rotate(-4deg) scaleX(1); }
          60% { transform: translate(22px,-78px) rotate(10deg) scaleX(-1); }
          80% { transform: translate(-14px,-18px) rotate(-6deg) scaleX(1); }
        }
        @keyframes float-b2 {
          0%,100% { transform: translate(0,0) rotate(-3deg); }
          40% { transform: translate(48px,-58px) rotate(6deg) scaleX(-1); }
          70% { transform: translate(-28px,-44px) rotate(-10deg) scaleX(1); }
        }
        @keyframes float-b3 {
          0%,100% { transform: translate(0,0) rotate(4deg) scaleX(1); }
          35% { transform: translate(-24px,-54px) rotate(-7deg) scaleX(-1); }
          65% { transform: translate(34px,-34px) rotate(8deg) scaleX(1); }
        }
        @keyframes nameGlow {
          0% { text-shadow: 0 0 20px rgba(190,80,255,0.9), 0 0 60px rgba(160,40,255,0.7), 0 0 120px rgba(120,20,220,0.5), 0 2px 4px rgba(0,0,0,0.95); }
          100% { text-shadow: 0 0 30px rgba(215,130,255,1), 0 0 80px rgba(185,65,255,0.9), 0 0 160px rgba(145,45,240,0.7), 0 2px 4px rgba(0,0,0,0.95); }
        }
        @keyframes dotPulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.45); opacity: 0.65; }
        }
        @keyframes badgeGlow {
          0% { box-shadow: 0 0 18px rgba(190,80,255,0.3), inset 0 1px 0 rgba(255,255,255,0.08); }
          100% { box-shadow: 0 0 34px rgba(190,80,255,0.58), inset 0 1px 0 rgba(255,255,255,0.14); }
        }
        @keyframes linePulse {
          0% { opacity: 0.65; }
          100% { opacity: 1; box-shadow: 0 0 22px rgba(190,80,255,0.9); }
        }
      `}</style>
    </div>
  );
};

export default Index;