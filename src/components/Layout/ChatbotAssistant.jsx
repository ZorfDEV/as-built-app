// components/ChatbotAssistant.jsx
import { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";

import "leaflet/dist/leaflet.css";

const ChatbotAssistant = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Exemple : on suppose que l'utilisateur entre directement l'ID du point incident
      const res = await axios.get(`/points/closest/${input}`);
      setResponse(res.data);
      console.log(res.data);
    } catch (error) {
      console.error(error);
      setResponse({ error: "Erreur lors de la recherche." });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Chatbot Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nom ou ID du point incident"
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Rechercher
        </button>
      </form>

      {/* Réponse IA */}
      {response && !response.error && (
        <div className="p-4 border rounded bg-gray-50">
          <h3 className="font-bold mb-2">Résultats :</h3>
          <p>Incident : <strong>cd</strong></p>
          <ul className="list-disc pl-5">
            {response.closestPoints.map((p, idx) => (
              <li key={p._id}>
                {p.name} – {Math.round(p.distance)} m
                {idx === 0 && <span className="text-green-600 font-semibold"> (le plus proche)</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Carte Leaflet */}
      {response && !response.error && (
        <MapContainer
          center={[
            response.incident.location.coordinates[1],
            response.incident.location.coordinates[0],
          ]}
          zoom={13}
          className="h-96 w-full rounded shadow"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Point incident */}
          <Marker
            position={[
              response.incident.location.coordinates[1],
              response.incident.location.coordinates[0],
            ]}
          >
            <Popup>📍 Incident : {response.incident.name}</Popup>
          </Marker>

          {/* Points les plus proches */}
          {response.closestPoints.map((p, idx) => (
            <Marker
              key={p._id}
              position={[p.location.coordinates[1], p.location.coordinates[0]]}
            >
              <Popup>
                {p.name} – {Math.round(p.distance)} m{" "}
                {idx === 0 && <b>(le plus proche)</b>}
              </Popup>
            </Marker>
          ))}

          {/* Ligne vers le plus proche */}
          {response.shortest && (
            <Polyline
              positions={[
                [
                  response.incident.location.coordinates[1],
                  response.incident.location.coordinates[0],
                ],
                [
                  response.shortest.location.coordinates[1],
                  response.shortest.location.coordinates[0],
                ],
              ]}
              color="red"
            />
          )}
        </MapContainer>
      )}
    </div>
  );
};

export default ChatbotAssistant;
