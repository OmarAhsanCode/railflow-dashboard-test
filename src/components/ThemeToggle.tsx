import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <Button
      variant="ghost"
      size={isMobile ? "sm" : "sm"}
      onClick={toggleTheme}
      className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors touch-target p-1 sm:p-2"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}