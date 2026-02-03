import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";
import slimhealthLogo from "@/assets/slimhealth-logo.png";
import cimedLogo from "@/assets/cimed-logo.png";

const STOCK_QUANTITY = 19;

const Index = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && name.trim()) {
      setStep(3);
    } else if (step === 3 && age.trim()) {
      navigate("/checkout");
    }
  };

  const isButtonEnabled = () => {
    if (step === 1) return true;
    if (step === 2) return name.trim().length > 0;
    if (step === 3) return age.trim().length > 0;
    return false;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardContent className="p-8 flex flex-col items-center gap-6">
          {step === 1 && (
            <>
              {/* Logos Section */}
              <div className="flex items-center justify-center gap-4">
                <img 
                  src={slimhealthLogo} 
                  alt="SlimHealth" 
                  className="h-16 md:h-20 object-contain"
                />
                <span className="text-2xl font-bold text-muted-foreground">+</span>
                <img 
                  src={cimedLogo} 
                  alt="CIMED" 
                  className="h-12 md:h-14 object-contain"
                />
              </div>

              {/* Offer Message */}
              <p className="text-center text-xl md:text-2xl">
                <span className="font-bold">Você vai garantir nosso produto</span>
                <br />
                em condição especial.
              </p>

              {/* Scarcity Alert */}
              <div className="w-full border-2 border-[#F5C842] bg-[#FFF8E7] rounded-xl p-4 flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FEF3C7] flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#D97706]" />
                </div>
                <p className="text-sm font-medium text-[#D97706]">
                  Restam apenas <span className="font-bold">{STOCK_QUANTITY}</span> unidades em estoque
                </p>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Name Capture */}
              <div className="w-full text-center">
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a1a2e] mb-2">Antes de continuar</h2>
                <p className="text-gray-400">Precisamos saber seu nome para prosseguir.</p>
              </div>

              <Input
                type="text"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-14 text-base border-0 rounded-2xl bg-[#F1F3F8] placeholder:text-gray-400 focus-visible:ring-cta"
              />
            </>
          )}

          {step === 3 && (
            <>
              {/* Age Confirmation */}
              <div className="w-full text-center">
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a1a2e] mb-2">Confirme sua idade</h2>
                <p className="text-gray-400">Este produto é destinado apenas para maiores de 18 anos.</p>
              </div>

              <Input
                type="number"
                placeholder="Digite sua idade"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full h-14 text-base border-0 rounded-2xl bg-[#F1F3F8] placeholder:text-gray-400 focus-visible:ring-cta"
                min="1"
                max="120"
              />
            </>
          )}

          {/* CTA Button */}
          <Button 
            onClick={handleContinue}
            disabled={!isButtonEnabled()}
            className={`w-full h-12 text-lg font-semibold rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
              isButtonEnabled() 
                ? "bg-cta hover:bg-cta/90 text-white" 
                : "bg-[#C5CAD4] text-white cursor-not-allowed hover:scale-100"
            }`}
          >
            Continuar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
