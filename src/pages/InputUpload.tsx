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
  ExternalLink,
  FileUp
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
    setShowResponse(false);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('message', formData.message);
      submitData.append('category', formData.category);
      
      formData.files.forEach((file, index) => {
        submitData.append(`file_${index}`, file);
      });

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: submitData,
      });

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
    setUploadedFiles([]);
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
          <h1 className="text-3xl font-bold text-foreground">{t('inputUpload')}</h1>
          <p className="text-muted-foreground">{t('uploadDataForProcessing')}</p>
        </div>
      </div>

      {/* Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fileTypes.map((type) => (
          <Card key={type.id} className="shadow-railway-md hover:shadow-railway-lg transition-smooth">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md ${type.bgColor}`}>
                  <type.icon className={`h-5 w-5 ${type.color}`} />
                </div>
                <div>
                  <CardTitle className="text-lg">{t(type.title.toLowerCase())}</CardTitle>
                  <CardDescription>{t(type.description)}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label htmlFor={`file-${type.id}`} className="text-sm font-medium">
                  {t('selectFile')}
                </Label>
                <Input
                  id={`file-${type.id}`}
                  type="file"
                  accept={type.accept}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(type.id, file);
                      e.target.value = '';
                    }
                  }}
                  className="cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card className="shadow-railway-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5" />
              {t('uploadedFiles')}
            </CardTitle>
            <CardDescription>
              {uploadedFiles.length} {t('filesReady')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file) => {
                const fileType = fileTypes.find(ft => ft.id === file.type);
                return (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-3">
                      {fileType && <fileType.icon className={`h-4 w-4 ${fileType.color}`} />}
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === 'completed' && (
                        <CheckCircle className="h-4 w-4 text-signal-green" />
                      )}
                      {file.status === 'processing' && (
                        <div className="h-4 w-4 border-2 border-railway-blue border-t-transparent rounded-full animate-spin" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        disabled={processing}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Section for additional data */}
      {uploadedFiles.length > 0 && (
        <Card className="shadow-railway-md">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Provide context for your uploaded files</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Add any additional context or notes..."
                rows={4}
              />
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={submitToWebhook}
                disabled={isSubmitting || uploadedFiles.length === 0}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 py-3 text-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Send to Webhook
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Webhook Response Display */}
      {showResponse && webhookResponse && (
        <Card className="shadow-railway-md border-signal-green/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {webhookResponse.success ? (
                <CheckCircle className="h-5 w-5 text-signal-green" />
              ) : (
                <AlertCircle className="h-5 w-5 text-signal-orange" />
              )}
              Webhook Response
            </CardTitle>
            <CardDescription>
              Response from n8n webhook - {webhookResponse?.timestamp && new Date(webhookResponse.timestamp).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  webhookResponse.success 
                    ? 'bg-signal-green/10 text-signal-green' 
                    : 'bg-signal-orange/10 text-signal-orange'
                }`}>
                  {webhookResponse.success ? 'Success' : 'Error'}
                </span>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Raw Response:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyResponseToClipboard}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <pre className="text-xs overflow-auto max-h-40 bg-background p-2 rounded border">
                  {JSON.stringify(webhookResponse, null, 2)}
                </pre>
              </div>

              <div className="flex gap-2">
                <Button onClick={resetForm} variant="outline">
                  Reset Form
                </Button>
                <Button 
                  onClick={() => setShowResponse(false)} 
                  variant="ghost"
                >
                  Close Response
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
