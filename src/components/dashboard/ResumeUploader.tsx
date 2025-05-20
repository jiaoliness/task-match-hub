
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Check, Trash2, AlertTriangle, Eye, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Resume } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";

export function ResumeUploader() {
  const { user } = useAuth();
  const { addResumeToUser, getUserResumes, setActiveResume, deleteResume } = useData();
  
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [viewingResume, setViewingResume] = useState<Resume | null>(null);
  
  // Get user's existing resumes
  const userResumes = user ? getUserResumes(user.id) : [];
  
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
    if (!file || !user) {
      toast.error("Please select a file first");
      return;
    }
    
    if (userResumes.length >= 5) {
      toast.error("Maximum 5 resumes allowed. Please delete one before uploading more.");
      return;
    }
    
    setUploading(true);
    
    try {
      const resumeData = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      };
      
      await addResumeToUser(user.id, resumeData);
      toast.success("Resume uploaded successfully!");
      setFile(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload resume");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };
  
  const handleSetActive = async (resumeId: string) => {
    if (!user) return;
    
    try {
      await setActiveResume(user.id, resumeId);
      toast.success("Active resume updated");
    } catch (error) {
      toast.error("Failed to update active resume");
    }
  };
  
  const handleDeleteResume = async () => {
    if (!user || !deleteTarget) return;
    
    try {
      await deleteResume(user.id, deleteTarget);
      setDeleteTarget(null);
      toast.success("Resume deleted successfully");
    } catch (error) {
      toast.error("Failed to delete resume");
    }
  };

  const handleViewResume = (resume: Resume) => {
    setViewingResume(resume);
  };

  const handleDownloadResume = (resume: Resume) => {
    // In a real application, this would fetch the actual file from storage
    // For now, we'll create a mock file for download demonstration
    const mockContent = `Mock resume content for ${resume.fileName}`;
    const blob = new Blob([mockContent], { type: resume.fileType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = resume.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Downloading ${resume.fileName}`);
  };

  const hasActiveResume = userResumes.some(resume => resume.isActive);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <span>Resumes</span>
        </CardTitle>
        <CardDescription>
          Upload your resume to showcase your skills and experience. Maximum 5 resumes allowed.
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
                  {userResumes.length >= 5 && (
                    <p className="text-xs text-red-500 mt-1 flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Maximum 5 resumes reached
                    </p>
                  )}
                </div>
                <input 
                  id="resume-upload" 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                  onChange={handleFileChange}
                  disabled={userResumes.length >= 5}
                />
              </label>
            </div>
            <Button 
              onClick={handleUpload} 
              disabled={!file || uploading || userResumes.length >= 5}
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
          
          {userResumes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Your Resumes ({userResumes.length}/5)</h3>
              <div className="space-y-2">
                {userResumes.map((resume) => (
                  <div 
                    key={resume.id} 
                    className={`flex items-center justify-between p-3 border rounded-md ${resume.isActive ? 'bg-primary/10 border-primary' : 'bg-muted/30'}`}
                  >
                    <div className="flex items-center gap-2 flex-grow mr-2 min-w-0">
                      <FileText className={`h-5 w-5 ${resume.isActive ? 'text-primary' : ''}`} />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center">
                          <span className="text-sm font-medium truncate mr-2">{resume.fileName}</span>
                          {resume.isActive && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground">
                              <Check className="h-3 w-3 mr-1" />
                              Active
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {(resume.fileSize / 1024 / 1024).toFixed(2)} MB • Uploaded on {format(new Date(resume.uploadDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!resume.isActive && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSetActive(resume.id)}
                          className="whitespace-nowrap"
                        >
                          Set as Active
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                        onClick={() => handleViewResume(resume)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-500 hover:text-green-700 hover:bg-green-100"
                        onClick={() => handleDownloadResume(resume)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => setDeleteTarget(resume.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {!hasActiveResume && userResumes.length > 0 && (
                <p className="mt-2 text-sm text-amber-600 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  No active resume selected. Please set one resume as active.
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this resume.
              {userResumes.find(r => r.id === deleteTarget)?.isActive && (
                <p className="mt-2 text-amber-600 font-medium">
                  This is your active resume. Deleting it will require you to set another resume as active.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteResume} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Resume View Dialog */}
      <Dialog open={viewingResume !== null} onOpenChange={() => setViewingResume(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewingResume?.fileName}</DialogTitle>
            <DialogDescription>
              Uploaded on {viewingResume && format(new Date(viewingResume.uploadDate), 'MMMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="border rounded-md p-4 min-h-[400px] max-h-[60vh] overflow-auto bg-white">
            <div className="flex justify-center items-center h-full">
              {/* In a real application, this would display the actual resume content */}
              {/* For now, we'll show a mock display */}
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="mb-2 text-lg font-medium">
                  {viewingResume?.fileName}
                </p>
                <p className="text-muted-foreground">
                  This is a mock display of the resume content. In a real application, the actual resume would be displayed or embedded here.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setViewingResume(null)}
            >
              Close
            </Button>
            {viewingResume && (
              <Button 
                onClick={() => {
                  handleDownloadResume(viewingResume);
                }}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
