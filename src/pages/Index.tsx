import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import slimhealthLogo from "@/assets/slimhealth-logo.png";
import cimedLogo from "@/assets/cimed-logo.png";

const STOCK_QUANTITY = 19;

const Index = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardContent className="p-8 flex flex-col items-center gap-6">
          {/* Logos Section */}
          <div className="flex items-center justify-center gap-4">
            <img 
              src={slimhealthLogo} 
              alt="SlimHealth" 
              className="h-12 md:h-14 object-contain"
            />
            <span className="text-2xl font-bold text-muted-foreground">+</span>
            <img 
              src={cimedLogo} 
              alt="CIMED" 
              className="h-8 md:h-10 object-contain"
            />
          </div>

          {/* Offer Message */}
          <p className="text-center text-lg">
            <span className="font-bold">Você vai garantir nosso produto</span>
            <br />
            em condição especial.
          </p>

          {/* Scarcity Alert */}
          <div className="w-full border-2 border-warning bg-warning/10 rounded-lg p-4 flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-warning flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning-foreground" />
            </div>
            <p className="text-sm font-medium">
              Restam apenas <span className="font-bold">{STOCK_QUANTITY}</span> unidades em estoque
            </p>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={handleContinue}
            className="w-full h-12 text-lg font-semibold bg-cta hover:bg-cta/90 text-cta-foreground transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Continuar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
