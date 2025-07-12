import { FiUpload } from "react-icons/fi";
import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';

const ExportExcel = ({ data, fileName, buttonText = "Exporter" }) => {
  const exportToExcel = () => {
    try {
      // Création d'un nouveau classeur
      const workbook = XLSX.utils.book_new();
      
      // Conversion des données en feuille de calcul
      const worksheet = XLSX.utils.json_to_sheet(data);
      
      // Ajout de la feuille au classeur
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');
      
      // Génération du fichier Excel
      XLSX.writeFile(workbook, `${fileName || 'export'}.xlsx`);
    } catch (error) {
      console.error("Erreur lors de l'exportation:", error);
    }
  };

  return (
    <div>
    <button
      onClick={exportToExcel}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
       bg-white text-gray-700 hover:bg-gray-50 border border-gray-200
        transition-colors duration-200 text-sm font-medium shadow-sm"
    >
      <FiUpload className="w-4 h-4" />
      {buttonText}
    </button>
    </div>
  );
};

ExportExcel.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  fileName: PropTypes.string,
  buttonText: PropTypes.string
};

export default ExportExcel;