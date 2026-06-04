import { useState, useEffect, useRef } from "react";

const BUTTERFLY_COUNT = 18;

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
    size: randomBetween(10, 28),
    duration: randomBetween(6, 16),
    delay: randomBetween(0, 10),
    opacity: randomBetween(0.35, 0.85),
    hue: randomBetween(270, 310),
  }));

const ButterflyIcon = ({ size, hue, opacity }: { size: number; hue: number; opacity: number }) => (
  <svg
    width={size * 2}
    height={size * 1.4}
    viewBox="0 0 60 42"
    fill="none"
    style={{ opacity }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="16" cy="18" rx="14" ry="10" fill={`hsla(${hue}, 90%, 75%, 0.7)`} />
    <ellipse cx="44" cy="18" rx="14" ry="10" fill={`hsla(${hue}, 90%, 75%, 0.7)`} />
    <ellipse cx="19" cy="28" rx="10" ry="7" fill={`hsla(${hue + 15}, 80%, 65%, 0.6)`} />
    <ellipse cx="41" cy="28" rx="10" ry="7" fill={`hsla(${hue + 15}, 80%, 65%, 0.6)`} />
    <ellipse cx="16" cy="18" rx="14" ry="10" fill={`hsla(${hue}, 100%, 85%, 0.25)`} />
    <ellipse cx="44" cy="18" rx="14" ry="10" fill={`hsla(${hue}, 100%, 85%, 0.25)`} />
    <line x1="30" y1="4" x2="30" y2="38" stroke={`hsla(${hue - 20}, 60%, 40%, 0.8)`} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M30 4 Q27 0 24 2" stroke={`hsla(${hue - 20}, 60%, 40%, 0.6)`} strokeWidth="1" fill="none" />
    <path d="M30 4 Q33 0 36 2" stroke={`hsla(${hue - 20}, 60%, 40%, 0.6)`} strokeWidth="1" fill="none" />
  </svg>
);

const ONLINE = "offline";

const Index = () => {
  const [butterflies] = useState<Butterfly[]>(generateButterflies);
  const status = ONLINE; // "online" | "offline" | "starting"
  const isOnline = status === "online" || status === "starting";
  const [tick, setTick] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 50);
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
    for (let i = 0; i < 60; i++) {
      const x = (Math.sin(i * 2.4 + t * 0.3) * 0.5 + 0.5) * canvas.width;
      const y = (Math.cos(i * 1.7 + t * 0.2) * 0.5 + 0.5) * canvas.height;
      const r = Math.random() * 2 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${280 + Math.sin(i) * 30}, 90%, 80%, ${0.3 + Math.random() * 0.4})`;
      ctx.fill();
    }
  }, [tick]);

  return (
    <div
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{
        minHeight: "100vh",
        background: "#08020f",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(https://cdn.poehali.dev/projects/6e81497b-6f59-434e-8a70-5f4bc57ba281/bucket/f09630a2-0999-4c1a-a0f5-dec04604aaaa.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.45) saturate(1.3)",
        }}
      />

      {/* Dark overlay gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(80,0,120,0.25) 0%, rgba(8,2,15,0.7) 100%)",
        }}
      />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: "screen", opacity: 0.6 }}
      />

      {/* Floating butterflies */}
      {butterflies.map((b) => (
        <div
          key={b.id}
          className="absolute pointer-events-none"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            animation: `float-butterfly-${b.id % 4} ${b.duration}s ${b.delay}s infinite ease-in-out`,
            filter: `drop-shadow(0 0 6px hsla(${b.hue}, 100%, 80%, 0.8))`,
          }}
        >
          <ButterflyIcon size={b.size} hue={b.hue} opacity={b.opacity} />
        </div>
      ))}

      {/* Main banner content */}
      <div className="relative z-10 flex flex-col items-center justify-center" style={{ gap: "2rem", marginTop: "58vh" }}>
        {/* Glow ring */}
        <div
          style={{
            position: "absolute",
            width: "520px",
            height: "220px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(160,60,255,0.18) 0%, transparent 70%)",
            filter: "blur(32px)",
            pointerEvents: "none",
          }}
        />

        {/* Streamer name */}
        <div className="flex flex-col items-center" style={{ gap: "0.5rem" }}>
          <span
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: "clamp(2.8rem, 8vw, 6.5rem)",
              fontWeight: 900,
              letterSpacing: "0.08em",
              color: "#fff",
              textShadow:
                "0 0 20px rgba(190,80,255,0.9), 0 0 60px rgba(160,40,255,0.7), 0 0 120px rgba(120,20,220,0.5), 0 2px 4px rgba(0,0,0,0.9)",
              lineHeight: 1,
              WebkitTextStroke: "1px rgba(210,120,255,0.4)",
              animation: "name-glow 3s ease-in-out infinite alternate",
            }}
          >
            V1ksteN
          </span>

          {/* Decorative line */}
          <div
            style={{
              width: "100%",
              height: "2px",
              background: "linear-gradient(90deg, transparent, rgba(190,80,255,0.8), rgba(140,200,255,0.6), rgba(190,80,255,0.8), transparent)",
              borderRadius: "2px",
              boxShadow: "0 0 12px rgba(190,80,255,0.6)",
              animation: "line-pulse 2s ease-in-out infinite alternate",
            }}
          />
        </div>

        {/* Status badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 28px",
            borderRadius: "100px",
            background: isOnline
              ? "rgba(80, 0, 120, 0.55)"
              : "rgba(30, 20, 50, 0.55)",
            border: isOnline
              ? "1.5px solid rgba(190,80,255,0.7)"
              : "1.5px solid rgba(100,80,130,0.4)",
            backdropFilter: "blur(10px)",
            boxShadow: isOnline
              ? "0 0 20px rgba(190,80,255,0.35), inset 0 1px 0 rgba(255,255,255,0.1)"
              : "0 0 8px rgba(80,60,100,0.2)",
            animation: isOnline ? "badge-glow 2.5s ease-in-out infinite alternate" : "none",
          }}
        >
          {/* Status dot */}
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: isOnline ? "#c84fff" : "#6b5b85",
              boxShadow: isOnline ? "0 0 8px 3px rgba(200,80,255,0.8)" : "none",
              animation: isOnline ? "dot-pulse 1.2s ease-in-out infinite" : "none",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "clamp(0.85rem, 2.5vw, 1.1rem)",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: isOnline ? "#e8b4ff" : "#8a7aa0",
              textShadow: isOnline ? "0 0 10px rgba(200,100,255,0.6)" : "none",
            }}
          >
            {status === "online" ? "ОНЛАЙН" : status === "starting" ? "STARTING SOON" : "ОФЛАЙН"}
          </span>

          {/* Twitch icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity: isOnline ? 0.9 : 0.4 }}>
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" fill={isOnline ? "#c84fff" : "#6b5b85"} />
          </svg>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "clamp(0.75rem, 2vw, 0.95rem)",
            fontWeight: 500,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(200,160,255,0.55)",
            textAlign: "center",
            textShadow: "0 0 8px rgba(150,80,220,0.4)",
          }}
        >
          twitch.tv/v1ksten
        </p>
      </div>

      {/* Bottom decorative wisteria glow */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "200px",
          background: "linear-gradient(to top, rgba(60,0,100,0.5), transparent)",
          pointerEvents: "none",
        }}
      />

      <style>{`
        @keyframes float-butterfly-0 {
          0%, 100% { transform: translate(0, 0) rotate(-5deg) scaleX(1); }
          25% { transform: translate(30px, -40px) rotate(5deg) scaleX(-1); }
          50% { transform: translate(-20px, -70px) rotate(-8deg) scaleX(1); }
          75% { transform: translate(40px, -30px) rotate(3deg) scaleX(-1); }
        }
        @keyframes float-butterfly-1 {
          0%, 100% { transform: translate(0, 0) rotate(8deg) scaleX(-1); }
          30% { transform: translate(-40px, -50px) rotate(-4deg) scaleX(1); }
          60% { transform: translate(25px, -80px) rotate(10deg) scaleX(-1); }
          80% { transform: translate(-15px, -20px) rotate(-6deg) scaleX(1); }
        }
        @keyframes float-butterfly-2 {
          0%, 100% { transform: translate(0, 0) rotate(-3deg); }
          40% { transform: translate(50px, -60px) rotate(6deg) scaleX(-1); }
          70% { transform: translate(-30px, -45px) rotate(-10deg) scaleX(1); }
        }
        @keyframes float-butterfly-3 {
          0%, 100% { transform: translate(0, 0) rotate(4deg) scaleX(1); }
          35% { transform: translate(-25px, -55px) rotate(-7deg) scaleX(-1); }
          65% { transform: translate(35px, -35px) rotate(8deg) scaleX(1); }
        }
        @keyframes name-glow {
          0% { text-shadow: 0 0 20px rgba(190,80,255,0.9), 0 0 60px rgba(160,40,255,0.7), 0 0 120px rgba(120,20,220,0.5), 0 2px 4px rgba(0,0,0,0.9); }
          100% { text-shadow: 0 0 30px rgba(210,120,255,1), 0 0 80px rgba(180,60,255,0.9), 0 0 160px rgba(140,40,240,0.7), 0 2px 4px rgba(0,0,0,0.9); }
        }
        @keyframes dot-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
        }
        @keyframes badge-glow {
          0% { box-shadow: 0 0 20px rgba(190,80,255,0.35), inset 0 1px 0 rgba(255,255,255,0.1); }
          100% { box-shadow: 0 0 35px rgba(190,80,255,0.6), inset 0 1px 0 rgba(255,255,255,0.15); }
        }
        @keyframes line-pulse {
          0% { opacity: 0.7; }
          100% { opacity: 1; box-shadow: 0 0 20px rgba(190,80,255,0.9); }
        }
      `}</style>
    </div>
  );
};

export default Index;