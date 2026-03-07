import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudyStore } from "@/lib/store";
import { toast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export function QuickAddFAB() {
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  
  const { subjects, logStudyHours } = useStudyStore();

  const currentSubject = subjects.find(s => s.id === selectedSubject);
  const topics = currentSubject?.topics || [];

  const handleSubmit = () => {
    const parsedHours = parseFloat(hours);

    if (!selectedSubject || !selectedTopic || !hours) {
      toast({
        title: "Missing details",
        description: "Pick a subject, a topic, and hours before logging.",
        variant: "destructive",
      });
      return;
    }

    if (Number.isNaN(parsedHours) || parsedHours <= 0) {
      toast({
        title: "Invalid hours",
        description: "Hours studied must be greater than 0.",
        variant: "destructive",
      });
      return;
    }

    logStudyHours(selectedSubject, selectedTopic, parsedHours);
    toast({
      title: "Study hours logged",
      description: `${parsedHours}h added successfully.`,
    });
    setHours("");
    setSelectedSubject("");
    setSelectedTopic("");
    setOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          onClick={() => setOpen(true)}
          size="lg"
          className="rounded-full shadow-lg h-16 w-16"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Study Hours</DialogTitle>
            <DialogDescription>Quickly add your study session</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {currentSubject && (
              <div>
                <Label htmlFor="topic">Topic</Label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map(t => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="hours">Hours Studied</Label>
              <Input
                id="hours"
                type="number"
                placeholder="e.g., 2.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                step="0.5"
                min="0"
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Log Hours
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
