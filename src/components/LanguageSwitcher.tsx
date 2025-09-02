import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

export default function LanguageSwitcher() {
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors touch-target p-1 sm:p-2"
        >
          <Languages className="h-4 w-4 shrink-0" />
          {!isMobile && (
            <span className="text-xs font-medium">
              {currentLang?.nativeName || 'EN'}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 sm:w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => {
              setLanguage(language.code);
              setIsOpen(false);
            }}
            className="flex items-center justify-between cursor-pointer py-2 sm:py-3"
          >
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-sm truncate">{language.nativeName}</span>
              {!isMobile && (
                <span className="text-xs text-muted-foreground truncate">{language.name}</span>
              )}
            </div>
            {currentLanguage === language.code && (
              <Check className="h-3 w-3 sm:h-4 sm:w-4 text-primary shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}