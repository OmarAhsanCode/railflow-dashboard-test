import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Train, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Wrench,
  Shield,
  MapPin,
  Upload
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

const dashboardMetrics = [
  {
    title: "Trains Ready",
    value: "147",
    total: "180",
    icon: Train,
    color: "text-signal-green",
    bgColor: "bg-signal-green/10",
  },
  {
    title: "Maintenance Alerts", 
    value: "8",
    total: "Active",
    icon: AlertCircle,
    color: "text-signal-amber",
    bgColor: "bg-signal-amber/10",
  },
  {
    title: "Ad Deadlines",
    value: "3",
    total: "This Week",
    icon: Clock,
    color: "text-signal-orange",
    bgColor: "bg-signal-orange/10",
  },
  {
    title: "System Health",
    value: "98.2%",
    total: "Uptime",
    icon: CheckCircle,
    color: "text-signal-green",
    bgColor: "bg-signal-green/10",
  },
];

const quickActions = [
  {
    title: "Data Prediction",
    description: "View operational analytics",
    icon: TrendingUp,
    path: "/data-prediction",
  },
  {
    title: "Maintenance Hub",
    description: "Job cards and fitness tracking",
    icon: Wrench,
    path: "/data-prediction/jobs",
  },
  {
    title: "Train Audit",
    description: "Detailed train profiles",
    icon: Shield,
    path: "/train-audit",
  },
  {
    title: "Stabling Status",
    description: "Bay allocation overview",
    icon: MapPin,
    path: "/data-prediction/stabling",
  },
];

export default function Dashboard() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2 truncate">
            {isMobile ? t('dashboard') || 'Dashboard' : t('dashboardOverview')}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {isMobile ? 'Railway Ops' : t('railwayOperationsManagement')}
          </p>
        </div>
        <Link to="/input-upload" className="shrink-0">
          <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground flex items-center gap-2 w-full sm:w-auto">
            <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
            {t('inputUpload')}
          </Button>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {dashboardMetrics.map((metric, index) => (
          <Card key={index} className="shadow-railway-md hover:shadow-railway-lg transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                {metric.title}
              </CardTitle>
              <div className={`p-1.5 sm:p-2 rounded-md ${metric.bgColor} shrink-0`}>
                <metric.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{metric.value}</div>
              <p className="text-xs text-muted-foreground truncate">
                {metric.total}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-railway-md">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl text-foreground">Quick Actions</CardTitle>
          <CardDescription className="text-sm">
            Navigate to key operational areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path}>
                <Button 
                  variant="outline" 
                  className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2 hover:bg-accent transition-smooth w-full min-h-[80px] sm:min-h-[100px]"
                >
                  <action.icon className="h-6 w-6 sm:h-8 sm:w-8 text-railway-blue shrink-0" />
                  <div className="text-center min-w-0">
                    <div className="font-semibold text-foreground text-xs sm:text-sm truncate">{action.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{action.description}</div>
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        <Card className="shadow-railway-md">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg text-foreground">Today's Priorities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-3 p-2 sm:p-3 bg-signal-amber/10 rounded-md">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-signal-amber shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm sm:text-base truncate">Train TR-4521 Maintenance Due</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Scheduled for Bay 7 at 14:00</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 sm:p-3 bg-signal-orange/10 rounded-md">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-signal-orange shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm sm:text-base truncate">Advertisement Campaign Deadline</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Metro Express branding expires Friday</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 sm:p-3 bg-signal-green/10 rounded-md">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-signal-green shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm sm:text-base truncate">Monthly Inspection Complete</p>
                <p className="text-xs sm:text-sm text-muted-foreground">12 trains cleared for service</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-railway-md">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg text-foreground">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Operational Capacity</span>
                <span className="text-foreground font-medium">82%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-signal-green h-2 rounded-full transition-all duration-500" style={{width: "82%"}}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Maintenance Schedule</span>
                <span className="text-foreground font-medium">67%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-signal-amber h-2 rounded-full transition-all duration-500" style={{width: "67%"}}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Cleaning Operations</span>
                <span className="text-foreground font-medium">91%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-railway-blue h-2 rounded-full transition-all duration-500" style={{width: "91%"}}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}