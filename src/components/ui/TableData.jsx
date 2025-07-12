import  { useState, useEffect  } from 'react';
import Search from './Search';
import BtnLink from "./BtnLink";
import Cardata from "./Cardata";
import ButtonAction from "./ButtonAction";
import { LuPlus } from "react-icons/lu";
import { FaSort } from "react-icons/fa";
import PropTypes from 'prop-types';
import ExportExcel from './ExportExcel';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';


const DataTable = ({ data, goto, columns,fileNames, handleView, handleEdit, handleDelete,formatDataForExport  }) => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setSortedData(data);
  }, [data]);
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setSortedData((prevData) =>
      [...prevData].sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === 'ascending' ? 1 : -1;
        }
        return 0;
      })
    );
  };

  const filteredData = sortedData.filter((item) =>
    
    columns.some((column) =>
      item[column.key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

 /*const filteredData = data.filter((item) => {
    return (
      (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.type_movement && item.type_movement.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });*/
  
  return (
    <Cardata>
    <div className="m-4">
      <div className="flex flex-row-reverse  space-x-reverse gap-x-4 mt-6 mb-3  w-full ">
      <BtnLink to={goto} actionName='Ajouter' 
      className='inline-flex items-center gap-2 p-2  bg-green-600 text-white rounded-lg hover:bg-green-700 
      transition-colors duration-200 text-sm font-medium shadow-sm' icon={<LuPlus />} />

       <ExportExcel 
      data={formatDataForExport}
      fileName={`${fileNames}-${new Date().toISOString().split('T')[0]}`}
     buttonText="Exporter"/>

        <Search
          datas={filteredData}
          type="text"
          name="searchTerm"
          value={searchTerm}
          onChange={handleChange}
          label="Search"
        />
      </div>
          <table className="min-w-full  whitespace-no-wrap border rounded-lg">
            <thead className="text-xs font-semibold tracking-wide text-left text-gray-700 uppercase border-b dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800">
              <tr className="bg-slate-200">
              <th scope="col" className="px-6 py-2">
                    <div className="flex items-center">
                        <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                    </div>
                </th>
                {columns.map((column) => (
                  <th key={column.key}
                  
                  onClick={() => handleSort(column.key)}
                  className="px-4 py-2 border-b cursor-pointer">
                    <div className="flex items-center justify-between">
                  {column.title}
                  <FaSort />
                </div>
                  </th>
                ))}
                <th key='actions' className="px-4 py-2">actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {currentData.map((item, index) => (
                <tr key={index} className="text-gray-700 dark:text-gray-400 hover:bg-gray-50">
                    <td scope="col" className="px-6 py-2">
                    <div className="flex items-center">
                        <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                    </div>
                </td>
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-2 text-sm">
                      {column.key === 'category_name'
                        ? item.category?.name || "Non défini"
                        : column.key === 'locations_name'
                          ? item.locations?.name || "Non défini"
                          :column.key === 'current_quantity'
                          ?<span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{item.current_quantity}</span>
                          :column.key === 'created_at'
                          ?<span className='inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'>{item.createdAt ?  format(parseISO(item.createdAt), 'dd/MM/yy HH:mm', { locale: fr }) : 'Date non disponible'}</span>
                          :column.key === 'quantity'
                          ?<span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">{item.quantity}</span>
                          :column.key === 'users_name'
                          ? item.users?.name || "Non défini"
                          : column.key === 'products_name'
                            ? item.products?.name || "Non défini"
                            : column.key === 'type_movement'
                    ? <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${item.type_movement === 'entry' ? 'bg-blue-50 text-blue-700 ring-blue-700/10' : 'bg-red-50 text-red-700 ring-red-700/10'}`}>
                        {item.type_movement}
                      </span>
                          : item[column.key]}
                    </td>
                  ))}
                  <td key='actions' className="px-4 py-2 text-sm">
                    <div onClick={(e) => e.stopPropagation()}>
                      <ButtonAction
                        itemId={item.id}
                        onView={() => handleView(item._id)}
                        onEdit={() => handleEdit(item._id)}
                        onDelete={() => handleDelete(item._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, data.length)}</span> of{' '}
                        <span className="font-medium">{data.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                          <span className="sr-only">Previous</span>
                          <FaChevronLeft aria-hidden="true" className="h-5 w-5" />
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                          <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === index + 1 ? 'z-10 bg-indigo-600 text-white focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-indigo-600' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'}`}
                          >
                            {index + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                          <span className="sr-only">Next</span>
                          <FaChevronRight aria-hidden="true" className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
        </div>
        </Cardata>
  );
};

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  goto: PropTypes.string,
  fileNames: PropTypes.string,
  handleView: PropTypes.func,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  formatDataForExport: PropTypes.array,
};


export default DataTable;
