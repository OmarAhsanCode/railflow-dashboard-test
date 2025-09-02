import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function AppLayout() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  // Check authentication
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("railway-auth");
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("railway-auth");
    navigate("/login");
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="h-14 lg:h-16 flex items-center justify-between border-b bg-card px-2 sm:px-4 lg:px-6 shadow-railway-sm transition-colors duration-300 shrink-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <SidebarTrigger className="shrink-0" />
              <h1 className="text-sm sm:text-lg lg:text-xl font-semibold text-foreground truncate">
                {isMobile ? "Railway Ops" : "Railway Operations Management"}
              </h1>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 shrink-0">
              {!isMobile && (
                <div className="text-xs sm:text-sm text-muted-foreground hidden md:block">
                  {t('welcome')} back, Operations Manager
                </div>
              )}
              <ThemeToggle />
              <LanguageSwitcher />
              <button 
                onClick={handleLogout}
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 px-2 py-1 rounded"
              >
                {isMobile ? t('logout') : t('logout')}
              </button>
            </div>
          </header>
          <main className="flex-1 p-2 sm:p-4 lg:p-6 bg-gradient-subtle transition-colors duration-300 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}