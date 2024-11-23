import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/store/settingsStore";
import { useEffect } from "react";

export function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useSettingsStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDarkMode}
      className="hover:bg-primary/20"
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-primary" />
      ) : (
        <Moon className="h-5 w-5 text-primary" />
      )}
    </Button>
  );
}