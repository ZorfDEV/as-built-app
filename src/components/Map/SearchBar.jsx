// src/components/SearchBar.jsx
import { useState } from "react";
import { useMap } from "react-leaflet";
import toast from "react-hot-toast";
import { AiOutlineSearch } from "react-icons/ai";

function SearchBar({ points }) {
  const [query, setQuery] = useState("");
  const map = useMap();

  const handleSearch = () => {
    if (!query.trim()) {
      toast.error("Veuillez entrer un nom ou des coordonnées GPS.");
      return;
    }

    const coordRegex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
    if (coordRegex.test(query)) {
      const [lat, lng] = query.split(",").map(Number);
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        toast.error("Coordonnées invalides !");
        return;
      }
      map.setView([lat, lng], 15);
      toast.success(`Carte centrée sur (${lat}, ${lng})`);
      return;
    }

    const point = points.find((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    if (point) {
      map.setView([point.latitude, point.longitude], 15);
      toast.success(`Point trouvé : ${point.name}`);
    } else {
      toast.error("Aucun point trouvé avec ce nom.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[2000] flex gap-2 items-center w-[500px] rounded-full bg-white/80 dark:bg-darkborder shadow-lg backdrop-blur-sm">
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nom ou coordonnées GPS (lat,lng)"
          className="w-full py-2 px-8 rounded-full border-white/90 dark:border-darkborder bg-transparent text-sm focus:outline-none dark:text-darktext-primary text-gray-500 placeholder-gray-400"
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-brandblue text-brandgreen hover:bg-brandgreen hover:text-brandblue focus:outline-none"
        >
          <AiOutlineSearch className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
