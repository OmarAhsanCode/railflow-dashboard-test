import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  MessageSquare, 
  Table, 
  Activity, 
  Upload, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface WebhookResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  timestamp?: string;
  error?: string;
}

interface FormData {
  name: string;
  email: string;
  message: string;
  category: string;
  files: File[];
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'uploaded' | 'processing' | 'completed';
  file: File;
}

const WEBHOOK_URL = "https://submastery.app.n8n.cloud/webhook-test/InputScreen";

const fileTypes = [
  {
    id: 'logbook',
    title: 'Logbook',
    description: 'PDF format maintenance logs',
    icon: FileText,
    accept: '.pdf',
    color: 'text-railway-blue',
    bgColor: 'bg-railway-blue/10'
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp Messages',
    description: 'Text files or exported chats',
    icon: MessageSquare,
    accept: '.txt,.json',
    color: 'text-signal-green',
    bgColor: 'bg-signal-green/10'
  },
  {
    id: 'spreadsheet',
    title: 'Spreadsheet Data',
    description: 'Excel or CSV files',
    icon: Table,
    accept: '.xlsx,.xls,.csv',
    color: 'text-signal-orange',
    bgColor: 'bg-signal-orange/10'
  },
  {
    id: 'iot',
    title: 'IoT Sensor Data',
    description: 'Sensor readings and telemetry',
    icon: Activity,
    accept: '.json,.xml,.csv',
    color: 'text-signal-amber',
    bgColor: 'bg-signal-amber/10'
  }
];

export default function InputUpload() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    category: 'logbook',
    files: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<WebhookResponse | null>(null);
  const [showResponse, setShowResponse] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (type: string, file: File) => {
    const newFile: UploadedFile = {
      id: Math.random().toString(36).substring(7),
      name: file.name,
      type: type,
      size: (file.size / 1024).toFixed(1) + ' KB',
      status: 'uploaded',
      file: file
    };

    setUploadedFiles(prev => [...prev, newFile]);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, file]
    }));
    
    toast({
      title: "File Uploaded",
      description: `${file.name} uploaded successfully`,
    });
  };

  const removeFile = (id: string) => {
    const fileToRemove = uploadedFiles.find(f => f.id === id);
    if (fileToRemove) {
      setUploadedFiles(prev => prev.filter(file => file.id !== id));
      setFormData(prev => ({
        ...prev,
        files: prev.files.filter(file => file !== fileToRemove.file)
      }));
    }
  };

  const submitToWebhook = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in name and email fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setWebhookResponse(null);

    try {
      // Prepare the data to send to webhook
      const submissionData = {
        timestamp: new Date().toISOString(),
        formData: {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          category: formData.category,
          fileCount: formData.files.length,
          fileNames: formData.files.map(f => f.name),
          fileSizes: formData.files.map(f => `${(f.size / 1024).toFixed(1)} KB`),
          totalFileSize: `${(formData.files.reduce((acc, f) => acc + f.size, 0) / 1024).toFixed(1)} KB`
        },
        source: "Railway Operations Dashboard",
        version: "1.0.0"
      };

      console.log('Sending data to webhook:', submissionData);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      
      setWebhookResponse({
        success: true,
        message: 'Success',
        data: responseData,
        timestamp: new Date().toISOString()
      });

      setShowResponse(true);
      
      toast({
        title: "Submission Successful!",
        description: "Data sent to n8n webhook successfully",
      });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit to webhook';
      console.error('Webhook submission error:', error);
      
      setWebhookResponse({
        success: false,
        message: 'Error',
        error: errorMessage,
        timestamp: new Date().toISOString()
      });

      setShowResponse(true);

      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyResponseToClipboard = () => {
    if (webhookResponse) {
      navigator.clipboard.writeText(JSON.stringify(webhookResponse, null, 2));
      toast({
        title: "Copied!",
        description: "Response data copied to clipboard",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      message: '',
      category: 'logbook',
      files: []
    });
    setWebhookResponse(null);
    setShowResponse(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToDashboard')}
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Webhook Test - Input Upload</h1>
          <p className="text-muted-foreground">Test your n8n webhook integration</p>
        </div>
      </div>

      {/* Webhook Info Card */}
      <Card className="shadow-railway-md border-signal-green/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-signal-green" />
            n8n Webhook Configuration
          </CardTitle>
          <CardDescription>
            Connected to: <code className="bg-muted px-2 py-1 rounded text-sm">{WEBHOOK_URL}</code>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="shadow-railway-md">
          <CardHeader>
            <CardTitle>Test Data Form</CardTitle>
            <CardDescription>Fill out the form to test webhook submission</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select 
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {fileTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Enter your message or description"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="files">Files (Optional)</Label>
              <Input
                id="files"
                type="file"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="cursor-pointer"
              />
              {formData.files.length > 0 && (
                <div className="space-y-2 mt-3">
                  <p className="text-sm font-medium">Selected Files ({formData.files.length}):</p>
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button 
              onClick={submitToWebhook}
              disabled={isSubmitting || !formData.name || !formData.email}
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending to Webhook...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Submit to n8n Webhook
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Response Display */}
        <Card className="shadow-railway-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Webhook Response
            </CardTitle>
            <CardDescription>
              Real-time response from your n8n webhook
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showResponse ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Submit the form to see webhook response</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  {webhookResponse?.success ? (
                    <div className="flex items-center gap-2 text-signal-green">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Success</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-signal-orange">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">Error</span>
                    </div>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {webhookResponse?.timestamp && new Date(webhookResponse.timestamp).toLocaleString()}
                  </span>
                </div>

                {/* Response Data */}
                <div className="bg-muted/30 p-4 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Response Data:</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyResponseToClipboard}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm bg-background p-3 rounded border overflow-auto max-h-96">
                    {JSON.stringify(webhookResponse, null, 2)}
                  </pre>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button onClick={resetForm} variant="outline">
                    Reset Form
                  </Button>
                  <Button onClick={() => setShowResponse(false)} variant="ghost">
                    Clear Response
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}