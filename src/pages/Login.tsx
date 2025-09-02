import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Train, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Check if user is already logged in (simple demo logic)
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("railway-auth");
    if (isLoggedIn) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Dummy validation for demo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (username === "admin" && password === "railway123") {
      localStorage.setItem("railway-auth", "true");
      toast({
        title: "Login Successful",
        description: "Welcome to Railway Operations Management System",
      });
      navigate("/");
    } else {
      toast({
        title: "Login Failed", 
        description: "Invalid credentials. Try admin / railway123",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-3 sm:p-4 lg:p-6">
      <Card className="w-full max-w-sm sm:max-w-md shadow-railway-lg">
        <CardHeader className="text-center pb-4 sm:pb-6">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-gradient-primary rounded-full">
              <Train className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
            {isMobile ? "Railway Ops" : "Railway Operations"}
          </CardTitle>
          <CardDescription className="text-sm">
            {isMobile ? "Access Portal" : "Management System Access Portal"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-10 sm:h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 sm:h-11"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:bg-railway-blue-dark h-10 sm:h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 animate-spin" />
                  Authenticating...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="text-xs text-center text-muted-foreground px-2">
            Demo credentials: admin / railway123
          </div>
        </CardContent>
      </Card>
    </div>
  );
}