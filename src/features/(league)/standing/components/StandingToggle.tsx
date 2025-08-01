"use client";

import { Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";

type Props = {
  isExtended: boolean;
  onToggle: (extended: boolean) => void;
};

export function StandingToggle({ isExtended, onToggle }: Props) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700 mb-6">
      <div className="flex items-center space-x-3">
        <Settings className="w-5 h-5 text-gray-400" />
        <span className="text-white font-medium">
          Impostazioni visualizzazione
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <span
          className={`text-sm ${
            !isExtended ? "text-blue-400" : "text-gray-400"
          }`}
        >
          Normale
        </span>
        <Switch checked={isExtended} onCheckedChange={onToggle} />
        <span
          className={`text-sm ${
            isExtended ? "text-blue-400" : "text-gray-400"
          }`}
        >
          Estesa
        </span>
      </div>
    </div>
  );
}
