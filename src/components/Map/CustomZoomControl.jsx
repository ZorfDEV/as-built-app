import { useMap } from 'react-leaflet';
import { LuZoomIn, LuZoomOut } from 'react-icons/lu';

export default function CustomZoomControl() {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="absolute bottom-4 right-4 z-[1000] flex flex-col rounded-lg shadow-lg bg-white overflow-hidden dark:bg-surface">
      <button
        onClick={handleZoomIn}
        className="p-2 hover:bg-gray-100 transition-colors duration-200 scale-105 
        dark:hover:bg-brandblue cursor-pointer"
        title="Zoom In"
      >
        <LuZoomIn className="h-5 w-5 text-gray-700 dark:text-darktext-primary" />
      </button>
      <div className="border-t border-gray-200 dark:border-darkborder" />
      <button
        onClick={handleZoomOut}
        className="p-2 hover:bg-gray-100 transition-colors duration-200 scale-105
        dark:hover:bg-brandblue cursor-pointer"
        title="Zoom Out"
      >
        <LuZoomOut className="h-5 w-5 text-gray-700 dark:text-darktext-primary" />
      </button>
    </div>
  );
}
