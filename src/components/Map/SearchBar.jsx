import { useState, useMemo, useEffect } from "react";
import { useMap } from "react-leaflet";
import toast from "react-hot-toast";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { haversineDistance } from "../../utils/distance";
import Cardata from "../ui/Cardata";

const SearchBar = ({ points }) => {
  const [query, setQuery] = useState("");
  const map = useMap();
  const token = localStorage.getItem("token");

  //const [incidentId, setIncidentId] = useState("");
  const [listpoints, setListpoints] = useState([]); // ✅ toujours un tableau
  //const [distance, setDistance] = useState(null);
  const [currentPoint, setCurrentPoint] = useState(null);
  const [visible, setVisible] = useState(true);

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      toast.error("Veuillez entrer un nom ou des coordonnées GPS.");
      return;
    }

    // Vérifie si la recherche correspond à des coordonnées GPS
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

    // Recherche d’un point par nom
    const point = points.find((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );

    if (point) {
      setCurrentPoint(point);

      if (point.nature === "incident") {
        try {
          //setIncidentId(point._id);
          const res = await axios.get(`/api/points/closest/${point._id}`, {
            headers,
          });

          const { points: closestPoints = [], message, count } = res.data;

          // ✅ mise à jour propre de la liste
          setListpoints(closestPoints);
          setVisible(true);

          if (count === 0) {
            toast.error(message || "Aucun point trouvé à proximité.");
          } else {
            toast.success(message || `${count} points à proximité du PI.`);
          }
        } catch (error) {
          console.error(error);
          toast.error(
            error.response?.data?.message ||
              "Erreur lors de la recherche des points proches."
          );
        }
      }

      map.setView([point.latitude, point.longitude], 15);
      if (point.nature !== "incident") {
        toast.success(`Point trouvé : ${point.name}`);
      }
      
    } else {
      toast.error("Aucun point trouvé avec ce nom.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch(e);
    setVisible(true);
  };

  // Recalcul de la distance entre l’incident et les points proches
  // Recalcul de la distance entre l’incident et les points proches
  useEffect(() => {
    if (listpoints.length > 0 && currentPoint) {
      const latA = currentPoint.latitude;
      const lonA = currentPoint.longitude;

      const closest = listpoints[0]; // premier élément
      const dist = haversineDistance(latA, lonA, closest.latitude, closest.longitude);
      //setDistance(dist);

      console.log("Points proches :", listpoints, "Distance la plus courte :", dist);
    }
  }, [listpoints, currentPoint]);
  return (
    <div className="justify-center flex-col items-center">
      {/* Barre de recherche */}
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

      {/* Liste des points proches */}
      {listpoints.length > 0 && visible && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-[2000] flex gap-2 items-center w-[500px]">
          <Cardata
            className="bg-white/80"
            title="Calcul de distance"
            headerAction={
              <span
                className="relative flex size-3 cursor-pointer"
                onClick={() => setVisible(false)}
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex items-center justify-center text-[8px] text-white p-1 size-3 rounded-full bg-green-500">
                  x
                </span>
              </span>
            }
          >
            <ul className="list-disc pl-5 items-center justify-center">
              {listpoints.map((p, idx) => {
                const dist = haversineDistance(
                  currentPoint.latitude,
                  currentPoint.longitude,
                  p.latitude,
                  p.longitude
                );
                return (
                  <li
                    className="flex justify-center items-center m-2 text-gray-500"
                    key={p._id}
                  >
                    {p.name} – {dist} km
                    {idx === 0 && (
                      <span className="text-green-600 font-semibold px-2">
                        (le plus proche)
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </Cardata>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
