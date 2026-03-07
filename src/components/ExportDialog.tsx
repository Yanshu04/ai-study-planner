import { useStudyStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, FileJson, FileText } from "lucide-react";
import { exportStudyPlanAsJSON, exportStudyPlanAsCSV, exportStudyPlanAsPDF, downloadFile } from "@/lib/helpers";

export function ExportDialog() {
  const { subjects } = useStudyStore();

  const handleExportJSON = () => {
    const content = exportStudyPlanAsJSON(subjects);
    downloadFile(content, "study-plan.json", "application/json");
  };

  const handleExportCSV = () => {
    const content = exportStudyPlanAsCSV(subjects);
    downloadFile(content, "study-plan.csv", "text/csv");
  };

  const handleExportPDF = () => {
    try {
      exportStudyPlanAsPDF(subjects);
    } catch (e) {
      console.error("PDF export requires jsPDF library");
      alert("PDF export not available. Please use JSON or CSV instead.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Download className="h-4 w-4" /> Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Export Study Plan</DialogTitle>
          <DialogDescription>Choose a format to export your study plan</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Button onClick={handleExportJSON} variant="outline" className="w-full justify-start gap-2">
            <FileJson className="h-4 w-4" />
            Export as JSON
          </Button>
          <Button onClick={handleExportCSV} variant="outline" className="w-full justify-start gap-2">
            <FileText className="h-4 w-4" />
            Export as CSV
          </Button>
          <Button onClick={handleExportPDF} variant="outline" className="w-full justify-start gap-2">
            <Download className="h-4 w-4" />
            Export as PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
