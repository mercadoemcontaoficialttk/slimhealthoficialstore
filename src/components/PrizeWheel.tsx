import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import cimedLogo from "@/assets/cimed-logo.png";
import carmedProduct from "@/assets/carmed-product.jpg";

interface PrizeWheelProps {
  onWin: () => void;
  userName?: string;
}

const SEGMENTS = [
  { label: "20%", fullLabel: "20% de desconto", color: "#F5C842" },
  { label: "Tente\nnovamente", fullLabel: "Tente novamente", color: "#FFFFFF" },
  { label: "40%", fullLabel: "40% de desconto", color: "#F5C842" },
  { label: "Carmed", fullLabel: "Carmed", color: "#FFFFFF" },
  { label: "96%", fullLabel: "96% de desconto", color: "#F5C842" },
  { label: "Tente\nnovamente", fullLabel: "Tente novamente", color: "#FFFFFF" },
  { label: "30%", fullLabel: "30% de desconto", color: "#F5C842" },
  { label: "Frete\nGrátis", fullLabel: "Frete Grátis", color: "#FFFFFF" },
];

const SEGMENT_ANGLE = 360 / SEGMENTS.length; // 45 degrees per segment

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
    let tickDelay = 50; // Start fast
    const maxDelay = 250; // End slow
    const startTime = Date.now();
    
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;
      
      if (progress < 1) {
        playTickSound(audioContext);
        // Gradually slow down ticks
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
    if (isSpinning || spinCount >= 2) return;

    setIsSpinning(true);
    setResult(null);
    setShowCelebration(false);

    // Calculate target segment based on spin count
    // First spin: land on "Tente novamente" (segment index 1)
    // Second spin: land on "96% de desconto" (segment index 4)
    const targetSegmentIndex = spinCount === 0 ? 1 : 4;
    
    // Calculate the angle to land on the center of the target segment
    // The wheel rotates clockwise, and the pointer is at the top (0 degrees)
    // Each segment spans 45 degrees, starting from the top
    const segmentCenterAngle = targetSegmentIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    
    // We need to rotate so that the target segment is at the top (under the pointer)
    // Add extra rotations for effect (4-5 full rotations)
    const extraRotations = (4 + Math.random()) * 360;
    const targetRotation = rotation + extraRotations + (360 - segmentCenterAngle);
    
    const spinDuration = 5000; // 5 seconds
    
    // Start tick sounds
    startTickSounds(spinDuration);

    // Animate to target rotation
    setRotation(targetRotation);

    // After animation completes
    setTimeout(() => {
      setIsSpinning(false);
      stopTickSounds();
      setSpinCount((prev) => prev + 1);
      
      const resultLabel = SEGMENTS[targetSegmentIndex].fullLabel;
      setResult(resultLabel);
      
      if (targetSegmentIndex === 4) {
        // Won the 96% discount!
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
    if (showCelebration) return "RESGATAR PRÊMIO";
    if (spinCount === 0) return "GIRAR ROLETA";
    if (spinCount === 1 && !isSpinning) return "TENTAR NOVAMENTE";
    return "GIRANDO...";
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a1a2e] mb-2">
          {showCelebration ? "🎉 Parabéns!" : "Gire e ganhe seu desconto!"}
        </h2>
        {showCelebration && userName && (
          <p className="text-gray-600">
            {userName}, você ganhou <span className="font-bold text-[#F5C842]">96% de desconto</span>!
          </p>
        )}
      </div>

      {/* Wheel Container with 3D Effect */}
      <div className="relative" style={{ perspective: "1000px" }}>
        {/* Outer Decorative Ring */}
        <div className="absolute -inset-3 rounded-full bg-gradient-to-b from-[#F5C842] via-[#D4A934] to-[#B8941F] opacity-60 blur-sm" />
        <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-[#FFE082] via-[#F5C842] to-[#D4A934]" />
        
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
          <div 
            className="w-0 h-0 border-l-[18px] border-r-[18px] border-t-[30px] border-l-transparent border-r-transparent border-t-[#D4A934]"
            style={{
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.4))",
            }}
          />
        </div>

        {/* Wheel with 3D Effects */}
        <div
          className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? "transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
              : "none",
            boxShadow: `
              0 10px 40px rgba(0,0,0,0.35),
              0 5px 15px rgba(0,0,0,0.25),
              inset 0 -8px 20px rgba(0,0,0,0.15),
              inset 0 8px 20px rgba(255,255,255,0.1)
            `,
            border: "6px solid transparent",
            backgroundImage: "linear-gradient(145deg, #FFE082, #D4A934, #B8941F)",
            backgroundOrigin: "border-box",
            transformStyle: "preserve-3d",
          }}
        >
          {/* SVG Wheel Segments */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {SEGMENTS.map((segment, index) => {
              const startAngle = index * SEGMENT_ANGLE - 90; // Start from top
              const endAngle = startAngle + SEGMENT_ANGLE;
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              
              const x1 = 50 + 50 * Math.cos(startRad);
              const y1 = 50 + 50 * Math.sin(startRad);
              const x2 = 50 + 50 * Math.cos(endRad);
              const y2 = 50 + 50 * Math.sin(endRad);
              
              const largeArcFlag = SEGMENT_ANGLE > 180 ? 1 : 0;
              
              const pathD = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
              
              // Calculate text position (center of segment)
              const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180;
              const textX = 50 + 32 * Math.cos(midAngle);
              const textY = 50 + 32 * Math.sin(midAngle);
              const textRotation = (startAngle + endAngle) / 2 + 90;

              return (
                <g key={index}>
                  <path
                    d={pathD}
                    fill={segment.color}
                    stroke="#D4A934"
                    strokeWidth="0.5"
                  />
                  {index === 3 ? (
                    /* Carmed segment - show product image */
                    <image
                      href={carmedProduct}
                      x={textX - 8}
                      y={textY - 8}
                      width="16"
                      height="16"
                      transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                      style={{ borderRadius: "50%" }}
                      preserveAspectRatio="xMidYMid slice"
                    />
                  ) : (
                    <text
                      x={textX}
                      y={textY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                      className="font-bold fill-[#1a1a2e]"
                      style={{ fontSize: "4px" }}
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
          </svg>

          {/* Center Logo with 3D Effect */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-b from-white to-gray-100 flex items-center justify-center"
            style={{
              boxShadow: `
                0 4px 15px rgba(0,0,0,0.3),
                inset 0 2px 4px rgba(255,255,255,0.8),
                inset 0 -2px 4px rgba(0,0,0,0.1)
              `,
              border: "4px solid",
              borderImage: "linear-gradient(145deg, #FFE082, #D4A934) 1",
              borderRadius: "50%",
              borderColor: "#D4A934",
            }}
          >
            <img
              src={cimedLogo}
              alt="CIMED"
              className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-sm"
            />
          </div>
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

      {/* Celebration Message */}
      {showCelebration && (
        <div className="text-center animate-fade-in bg-gradient-to-r from-[#F5C842] to-[#FFE082] p-4 rounded-2xl">
          <p className="text-lg font-bold text-[#1a1a2e]">
            🎁 Você ganhou 96% de desconto!
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
            : "bg-[#F5C842] hover:bg-[#D4A934] text-[#1a1a2e]"
        } ${isSpinning ? "opacity-70 cursor-not-allowed hover:scale-100" : ""}`}
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
