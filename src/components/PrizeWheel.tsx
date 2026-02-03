import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import cimedLogo from "@/assets/cimed-logo.png";
import carmedProduct from "@/assets/carmed-product.jpg";

interface PrizeWheelProps {
  onWin: () => void;
  userName?: string;
}

const SEGMENTS = [
  { label: "20%", fullLabel: "20% de desconto", color: "url(#goldSegment)" },
  { label: "Tente\nnovamente", fullLabel: "Tente novamente", color: "url(#whiteSegment)" },
  { label: "40%", fullLabel: "40% de desconto", color: "url(#goldSegment)" },
  { label: "Carmed", fullLabel: "Carmed", color: "url(#whiteSegment)" },
  { label: "96%", fullLabel: "96% de desconto", color: "url(#goldSegment)" },
  { label: "Tente\nnovamente", fullLabel: "Tente novamente", color: "url(#whiteSegment)" },
  { label: "30%", fullLabel: "30% de desconto", color: "url(#goldSegment)" },
  { label: "Frete\nGrátis", fullLabel: "Frete Grátis", color: "url(#whiteSegment)" },
];

const SEGMENT_ANGLE = 360 / SEGMENTS.length; // 45 degrees per segment

// CIMED brand colors
const CIMED_COLORS = {
  primary: "#F7C217",
  secondary: "#E5B015",
  tertiary: "#D4A012",
  dark: "#8B7500",
};

// Confetti configuration
const CONFETTI_COLORS = [CIMED_COLORS.primary, CIMED_COLORS.secondary, "#FFFFFF", CIMED_COLORS.tertiary];

const generateConfetti = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 8 + Math.random() * 8,
    rotation: Math.random() * 360,
  }));
};

// Helper to play tick sound using Web Audio API
const playTickSound = (audioContext: AudioContext) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 800;
  oscillator.type = "square";
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.05);
};

const PrizeWheel = ({ onWin, userName }: PrizeWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const confettiPieces = useMemo(() => generateConfetti(), []);

  // Initialize audio context on first interaction
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Play tick sounds during spin
  const startTickSounds = useCallback((duration: number) => {
    const audioContext = initAudio();
    let tickDelay = 50;
    const maxDelay = 250;
    const startTime = Date.now();
    
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;
      
      if (progress < 1) {
        playTickSound(audioContext);
        tickDelay = 50 + (maxDelay - 50) * Math.pow(progress, 2);
        tickIntervalRef.current = setTimeout(tick, tickDelay);
      }
    };
    
    tick();
  }, [initAudio]);

  const stopTickSounds = useCallback(() => {
    if (tickIntervalRef.current) {
      clearTimeout(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTickSounds();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopTickSounds]);

  const spinWheel = useCallback(() => {
    if (isSpinning || spinCount >= 1) return;

    setIsSpinning(true);
    setResult(null);
    setShowCelebration(false);

    // Always land on "96% de desconto" (segment index 4)
    const targetSegmentIndex = 4;
    
    // Calculate the exact angle to land on the center of segment 4
    // Segments start at -90 degrees (top), so we need to compensate
    const segmentCenterAngle = targetSegmentIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    
    // Add extra rotations for effect (4-5 full rotations)
    const extraRotations = (4 + Math.random()) * 360;
    
    // Final rotation: extra spins + offset to align pointer with segment center
    // The pointer is at top (0°), segments are drawn starting at -90°
    const targetRotation = rotation + extraRotations + (360 - segmentCenterAngle + 90);
    
    const spinDuration = 7000;
    
    startTickSounds(spinDuration);
    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      stopTickSounds();
      setSpinCount((prev) => prev + 1);
      
      const resultLabel = SEGMENTS[targetSegmentIndex].fullLabel;
      setResult(resultLabel);
      
      if (targetSegmentIndex === 4) {
        setShowCelebration(true);
      }
    }, spinDuration);
  }, [isSpinning, spinCount, rotation, startTickSounds, stopTickSounds]);

  const handleButtonClick = () => {
    if (showCelebration) {
      onWin();
    } else {
      spinWheel();
    }
  };

  const getButtonText = () => {
    if (showCelebration) return "RESGATAR DESCONTO";
    if (spinCount === 0) return "GIRAR ROLETA";
    return "GIRANDO...";
  };

  // Generate pin positions for outer ring
  const generatePins = () => {
    const pins = [];
    const numPins = 24;
    for (let i = 0; i < numPins; i++) {
      const angle = (i * 360 / numPins - 90) * Math.PI / 180;
      const x = 50 + 47 * Math.cos(angle);
      const y = 50 + 47 * Math.sin(angle);
      pins.push({ x, y, key: i });
    }
    return pins;
  };

  const pins = generatePins();

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Confetti Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="absolute"
              style={{
                left: `${piece.x}%`,
                top: -20,
                width: piece.size,
                height: piece.size * 0.6,
                backgroundColor: piece.color,
                transform: `rotate(${piece.rotation}deg)`,
                animation: `confetti-fall ${piece.duration}s ease-out ${piece.delay}s forwards`,
                borderRadius: "2px",
              }}
            />
          ))}
        </div>
      )}

      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a1a2e] mb-2">
          {showCelebration ? "Parabéns!" : "Gire e ganhe seu desconto!"}
        </h2>
        {showCelebration && userName && (
          <p className="text-gray-600">
            {userName}, você ganhou <span className="font-bold" style={{ color: CIMED_COLORS.primary }}>96% de desconto</span>!
          </p>
        )}
      </div>

      {/* Wheel Container with Casino Style */}
      <div className="relative" style={{ perspective: "1000px" }}>
        {/* Outer Glow Effect */}
        <div 
          className="absolute -inset-6 rounded-full opacity-60"
          style={{
            background: `radial-gradient(circle, rgba(247,194,23,0.4) 0%, rgba(247,194,23,0) 70%)`,
            filter: "blur(15px)",
          }}
        />

        {/* Outer Decorative Ring with Metallic Effect */}
        <div 
          className="absolute -inset-4 rounded-full"
          style={{
            background: `linear-gradient(135deg, ${CIMED_COLORS.primary} 0%, ${CIMED_COLORS.secondary} 25%, ${CIMED_COLORS.dark} 50%, ${CIMED_COLORS.secondary} 75%, ${CIMED_COLORS.primary} 100%)`,
            boxShadow: `
              0 0 30px rgba(247,194,23,0.5),
              inset 0 2px 4px rgba(255,255,255,0.5),
              inset 0 -2px 4px rgba(0,0,0,0.3)
            `,
          }}
        />

        {/* Second Ring */}
        <div 
          className="absolute -inset-2 rounded-full"
          style={{
            background: "linear-gradient(180deg, #8B4513 0%, #654321 50%, #8B4513 100%)",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.5)",
          }}
        />
        
        {/* Pointer - Premium Casino Style */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 z-30">
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full"
            style={{
              background: `linear-gradient(180deg, ${CIMED_COLORS.primary} 0%, ${CIMED_COLORS.dark} 100%)`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
              border: "2px solid #8B4513",
            }}
          />
          <svg 
            width="40" 
            height="50" 
            viewBox="0 0 40 50" 
            className="relative"
            style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.4))" }}
          >
            <defs>
              <linearGradient id="pointerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF4444" />
                <stop offset="50%" stopColor="#CC0000" />
                <stop offset="100%" stopColor="#FF4444" />
              </linearGradient>
              <linearGradient id="pointerHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <path 
              d="M20 50 L8 15 L20 0 L32 15 Z" 
              fill="url(#pointerGradient)"
              stroke="#8B0000"
              strokeWidth="2"
            />
            <path 
              d="M20 48 L10 16 L20 3 L20 48 Z" 
              fill="url(#pointerHighlight)"
            />
          </svg>
        </div>

        {/* Main Wheel */}
        <div
          className="relative w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? "transform 7s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
              : "none",
            boxShadow: `
              0 10px 40px rgba(0,0,0,0.4),
              inset 0 0 20px rgba(0,0,0,0.2)
            `,
          }}
        >
          {/* SVG Wheel Segments */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              {/* Gold Segment Gradient - CIMED Colors */}
              <linearGradient id="goldSegment" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={CIMED_COLORS.primary} />
                <stop offset="50%" stopColor={CIMED_COLORS.secondary} />
                <stop offset="100%" stopColor={CIMED_COLORS.tertiary} />
              </linearGradient>
              
              {/* White Segment Gradient */}
              <linearGradient id="whiteSegment" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#F8F8F8" />
                <stop offset="100%" stopColor="#E8E8E8" />
              </linearGradient>

              {/* Text Shadow/Emboss Filter */}
              <filter id="textEmboss" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0.5" dy="0.5" stdDeviation="0.2" floodColor="#000" floodOpacity="0.7"/>
                <feDropShadow dx="-0.3" dy="-0.3" stdDeviation="0.15" floodColor="#fff" floodOpacity="0.5"/>
              </filter>

              {/* Pin Gradient - CIMED Colors */}
              <radialGradient id="pinGradient">
                <stop offset="0%" stopColor={CIMED_COLORS.primary} />
                <stop offset="50%" stopColor={CIMED_COLORS.secondary} />
                <stop offset="100%" stopColor={CIMED_COLORS.dark} />
              </radialGradient>
            </defs>

            {/* Outer ring with pins */}
            <circle cx="50" cy="50" r="49" fill="none" stroke="url(#pinGradient)" strokeWidth="3" />
            
            {/* Decorative pins */}
            {pins.map((pin) => (
              <circle 
                key={pin.key}
                cx={pin.x} 
                cy={pin.y} 
                r="1.8"
                fill="url(#pinGradient)"
                stroke={CIMED_COLORS.dark}
                strokeWidth="0.3"
              />
            ))}

            {/* Segments */}
            {SEGMENTS.map((segment, index) => {
              const startAngle = index * SEGMENT_ANGLE - 90;
              const endAngle = startAngle + SEGMENT_ANGLE;
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              
              const x1 = 50 + 44 * Math.cos(startRad);
              const y1 = 50 + 44 * Math.sin(startRad);
              const x2 = 50 + 44 * Math.cos(endRad);
              const y2 = 50 + 44 * Math.sin(endRad);
              
              const largeArcFlag = SEGMENT_ANGLE > 180 ? 1 : 0;
              
              const pathD = `M 50 50 L ${x1} ${y1} A 44 44 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
              
              const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180;
              const textX = 50 + 30 * Math.cos(midAngle);
              const textY = 50 + 30 * Math.sin(midAngle);
              const textRotation = (startAngle + endAngle) / 2;

              return (
                <g key={index}>
                  <path
                    d={pathD}
                    fill={segment.color}
                    stroke={CIMED_COLORS.dark}
                    strokeWidth="1"
                  />
                  {index === 3 ? (
                    <image
                      href={carmedProduct}
                      x={textX - 7}
                      y={textY - 7}
                      width="14"
                      height="14"
                      transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                      preserveAspectRatio="xMidYMid slice"
                      clipPath="circle(7px at 7px 7px)"
                    />
                  ) : (
                    <text
                      x={textX}
                      y={textY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                      filter="url(#textEmboss)"
                      style={{ 
                        fontSize: "5.5px", 
                        fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
                        fontWeight: 800,
                        letterSpacing: "0.05em",
                      }}
                      className="fill-[#1a1a2e]"
                    >
                      {segment.label.split("\n").map((line, i) => (
                        <tspan key={i} x={textX} dy={i === 0 ? 0 : "4.5"}>
                          {line}
                        </tspan>
                      ))}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Inner decorative ring */}
            <circle 
              cx="50" 
              cy="50" 
              r="15" 
              fill="none" 
              stroke="url(#pinGradient)" 
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Center Logo - STATIC (doesn't rotate) */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center z-30"
          style={{
            background: "linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 50%, #E0E0E0 100%)",
            boxShadow: `
              0 8px 25px rgba(0,0,0,0.4),
              inset 0 3px 6px rgba(255,255,255,0.9),
              inset 0 -3px 6px rgba(0,0,0,0.15)
            `,
            border: `5px solid ${CIMED_COLORS.dark}`,
            borderRadius: "50%",
          }}
        >
          <img
            src={cimedLogo}
            alt="CIMED"
            className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-md"
          />
        </div>
      </div>

      {/* Result Message */}
      {result && !showCelebration && (
        <div className="text-center animate-fade-in">
          <p className="text-lg font-medium text-gray-600">
            Você caiu em: <span className="font-bold text-[#1a1a2e]">{result}</span>
          </p>
          {result === "Tente novamente" && (
            <p className="text-sm text-gray-400 mt-1">Não desista! Tente mais uma vez.</p>
          )}
        </div>
      )}

      {/* Celebration Message - Professional, no emojis */}
      {showCelebration && (
        <div 
          className="text-center animate-fade-in p-4 rounded-2xl shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${CIMED_COLORS.primary} 0%, ${CIMED_COLORS.secondary} 100%)`,
          }}
        >
          <p className="text-lg font-bold text-[#1a1a2e]">
            Você ganhou 96% de desconto!
          </p>
          <p className="text-sm text-[#1a1a2e]/80 mt-1">
            Clique no botão abaixo para resgatar seu prêmio.
          </p>
        </div>
      )}

      {/* Action Button */}
      <Button
        onClick={handleButtonClick}
        disabled={isSpinning}
        className={`w-full h-14 text-lg font-bold rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
          showCelebration
            ? "bg-cta hover:bg-cta/90 text-white"
            : "text-[#1a1a2e] shadow-lg"
        } ${isSpinning ? "opacity-70 cursor-not-allowed hover:scale-100" : ""}`}
        style={!showCelebration ? {
          background: `linear-gradient(135deg, ${CIMED_COLORS.primary} 0%, ${CIMED_COLORS.secondary} 100%)`,
        } : undefined}
      >
        {getButtonText()}
      </Button>

      {/* CIMED Logo Footer */}
      <img
        src={cimedLogo}
        alt="CIMED"
        className="h-8 object-contain opacity-60"
      />
    </div>
  );
};

export default PrizeWheel;
