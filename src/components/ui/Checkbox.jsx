import { useState } from "react";

export default function ToggleCheckbox() {
  const [checked, setChecked] = useState(false);

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
        className="sr-only peer"
      />
      <div
        className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 
                   peer-focus:ring-green-400 rounded-full peer dark:bg-gray-600 
                   peer-checked:bg-green-600 transition-colors"
      ></div>
      <div
        className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full 
                   transition-transform peer-checked:translate-x-5"
      ></div>
      <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
        Activer
      </span>
    </label>
  );
}
