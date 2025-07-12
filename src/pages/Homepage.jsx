import MapView from "../components/Map/MapView";

const Homepage = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1">
        <MapView />
      </div>
    </div>
  );
}
export default Homepage;