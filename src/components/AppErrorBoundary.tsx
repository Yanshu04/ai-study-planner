import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
    message: undefined,
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return {
      hasError: true,
      message: error.message,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Keep this console output to make debugging easier in browser devtools.
    console.error("App runtime error:", error, errorInfo);
  }

  private resetApp = () => {
    localStorage.removeItem("ai-study-planner");
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-sm">
            <h1 className="font-display text-xl font-bold mb-2">Something went wrong</h1>
            <p className="text-sm text-muted-foreground mb-4">
              The app hit a runtime error and could not render. You can reset saved local data and reload.
            </p>
            {this.state.message ? (
              <pre className="mb-4 rounded-md bg-muted p-3 text-xs text-muted-foreground overflow-auto">
                {this.state.message}
              </pre>
            ) : null}
            <div className="flex gap-2">
              <Button onClick={this.resetApp}>Reset saved data and reload</Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
