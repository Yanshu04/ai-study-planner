import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { MOTIVATION_QUOTES } from "@/lib/constants";

export function MotivationQuoteCard() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const randomQuote = MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)];
    setQuote(randomQuote);
  }, []);

  const handleNewQuote = () => {
    const randomQuote = MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)];
    setQuote(randomQuote);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Daily Motivation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base italic text-foreground leading-relaxed">
            "{quote}"
          </p>
          <button
            onClick={handleNewQuote}
            className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Get another inspiration →
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
