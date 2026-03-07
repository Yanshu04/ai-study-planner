import { useState } from "react";
import { useStudyStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Plus, X, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SubjectForm() {
  const addSubject = useStudyStore(s => s.addSubject);
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState(3);
  const [examDate, setExamDate] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addTopic = () => {
    if (topicInput.trim()) {
      setTopics(prev => [...prev, topicInput.trim()]);
      setTopicInput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !examDate || topics.length === 0) return;
    addSubject(name, difficulty, examDate, topics);
    setName("");
    setDifficulty(3);
    setExamDate("");
    setTopics([]);
    setIsOpen(false);
  };

  return (
    <div>
      {!isOpen ? (
        <Button onClick={() => setIsOpen(true)} className="w-full gap-2" size="lg">
          <Plus className="h-5 w-5" /> Add Subject
        </Button>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-5 rounded-lg border border-border bg-card p-6 shadow-lg"
        >
          <div className="flex items-center gap-2 text-lg font-display font-semibold text-foreground">
            <BookOpen className="h-5 w-5 text-primary" />
            New Subject
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Subject Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Machine Learning" />
            </div>
            <div className="space-y-2">
              <Label>Exam Date</Label>
              <Input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Difficulty: {difficulty}/5</Label>
            <Slider value={[difficulty]} onValueChange={v => setDifficulty(v[0])} min={1} max={5} step={1} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Easy</span><span>Hard</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Topics / Chapters</Label>
            <div className="flex gap-2">
              <Input
                value={topicInput}
                onChange={e => setTopicInput(e.target.value)}
                placeholder="e.g. Linear Algebra"
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTopic())}
              />
              <Button type="button" variant="outline" size="icon" onClick={addTopic}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <AnimatePresence>
              <div className="flex flex-wrap gap-2 mt-2">
                {topics.map((t, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary font-medium"
                  >
                    {t}
                    <button type="button" onClick={() => setTopics(topics.filter((_, j) => j !== i))}>
                      <X className="h-3 w-3" />
                    </button>
                  </motion.span>
                ))}
              </div>
            </AnimatePresence>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={!name || !examDate || topics.length === 0}>
              Create Subject
            </Button>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </motion.form>
      )}
    </div>
  );
}
