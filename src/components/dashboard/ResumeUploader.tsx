
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function ResumeUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;
    
    // Check file type
    const fileType = selectedFile.type;
    if (
      fileType !== "application/pdf" && 
      fileType !== "application/msword" && 
      fileType !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      toast.error("Please upload a PDF or Word document");
      return;
    }
    
    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }
    
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    
    setUploading(true);
    
    try {
      // Simulate upload with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Resume uploaded successfully!");
      
      // In a real app, you would upload to a server/storage here
    } catch (error) {
      toast.error("Failed to upload resume");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <span>Resume</span>
        </CardTitle>
        <CardDescription>
          Upload your resume to showcase your skills and experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-grow">
              <label 
                htmlFor="resume-upload" 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PDF or Word (max 5MB)</p>
                </div>
                <input 
                  id="resume-upload" 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <Button 
              onClick={handleUpload} 
              disabled={!file || uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
          
          {file && (
            <div className="flex items-center justify-between p-2 border rounded-md bg-muted/30">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setFile(null)}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
