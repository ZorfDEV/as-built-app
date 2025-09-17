import React, { useMemo } from "react";
import MapView from "../components/Map/MapView";

const Homepage = () => {
   const token = localStorage.getItem('token');
      const headers = useMemo(() => ({
              Authorization: `Bearer ${token}`
           }), [token]);
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1">
        <MapView header={headers}/>
      </div>
    </div>
  );
}
export default Homepage;