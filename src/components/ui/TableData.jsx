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
import { getStatusBadge } from './../../utils/statusBage';


const DataTable = ({ data, goto, columns,fileNames, handleView, handleEdit,
      handleDelete,formatDataForExport, selectedRows = [],onSelectRow,onSelectAll,onDeleteSelected  }) => {
  
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

 const allSelected = selectedRows.length === data.length && data.length > 0;
  
  return (
    <Cardata className="flex-1">
    <div className="m-4">
      <div className="flex justify-between items-center mb-4 mt-6 ">
        <button
          onClick={onDeleteSelected}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Supprimer sélectionnés
        </button>
      </div>
      <div className="flex flex-row-reverse  space-x-reverse gap-x-4 mt-6 mb-3  w-full ">
      <BtnLink to={goto} actionName='Ajouter' 
      className='inline-flex items-center gap-2 p-2  bg-brandgreen text-white rounded-lg hover:text-brandgreen  hover:bg-brandblue
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
      <div className="hidden md:block ">
          <table className="w-full whitespace-no-wrap border border-gray-200 dark:border-darkborder">
            <thead className="text-sm font-semibold tracking-wide text-left text-gray-700 uppercase border-b-gray-200 dark:border-darkborder dark:text-darktext-primary">
              <tr className="bg-slate-200 dark:bg-surface">
              <th scope="col" className="p-3 dark:border-darkborder dark:border">
                    <div className="flex items-center">
                        <input id="checkbox-all-search" type="checkbox"
                         checked={allSelected}
                          onChange={onSelectAll}
                         className="w-4 h-4 bg-gray-100 text-brandblue border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-darktext-primary dark:ring-offset-surface dark:focus:ring-offset-gray-800 focus:ring-1 dark:bg-gray-700 dark:border-darkborder accent-brandgreen  " />
                        <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                    </div>
                </th>
                {columns.map((column, index) => (
                  <th key={column.key}
                  onClick={() => handleSort(column.key)}
                   className={`px-4 py-2 border-b-gray-200  dark:border-darkborder dark:border cursor-pointer 
                        ${index > 2 ? 'hidden lg:table-cell' : ''}`}>
                    <div className="flex items-center justify-between">
                  {column.title}
                  <FaSort />
                </div>
                  </th>
                ))}
                <th key='actions' className="px-4 py-2 dark:border-darkborder dark:border">actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {currentData.map((item, index) => (
                <tr key={index} className="text-brandblue hover:bg-green-100 border-gray-200 cursor-pointer dark:border-darkborder dark:hover:bg-gray-700 dark:bg-surface dark:text-darktext-secondary">
                    <td scope="col" className="p-3 hidden md:table-cell dark:border-darkborder dark:border">
                    <div className="flex items-center">
                        <input id="checkbox-all-search" type="checkbox"
                         checked={selectedRows.includes(item._id || item.id)}
                          onChange={() => onSelectRow(item._id || item.id)}
                         className="w-4 h-4 bg-gray-100  border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-darktext-primary dark:ring-offset-surface dark:focus:ring-offset-gray-800 focus:ring-1 dark:bg-gray-700 dark:border-darkborder accent-brandgreen  " />
                        <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                    </div>
                </td>
                  {columns.map((column, index) => (
                    <td key={column.key} className={`px-4 py-2 text-xs  sm:text-xs md:text-xs lg:text-sm xl:text-md dark:border-darkborder dark:border  ${index > 2 ? 'hidden lg:table-cell' : ''}`}>
                      {column.key === 'section_name'
                        ? item.section_id?.name || "Non défini"
                        : column.key === 'locations_name'
                          ? item.locations?.name || "Non défini"
                          :column.key === 'file'
                          ?<img src={`http://localhost:5000${item.file}`} className="w-4 md:w-8 max-w-full max-h-full" alt="marqueur"/>
                          :column.key === 'createdAt'
                          ?<span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          {item.createdAt 
                         ? format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr }) 
                          : 'Date non disponible'}
                           </span>
                          :column.key === "status" ? 
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadge(item.status)}`}>
                              {item.status}
                            </span>
                          :column.key === 'quantity'
                          ?<span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">{item.quantity}</span>
                          :column.key === 'users_name'
                          ? item.users?.name || "Non défini"
                          : column.key === 'products_name'
                            ? item.products?.name || "Non défini"
                            : column.key === 'type_movement'
                    ? <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${item.type_movement === 'entry' ? 'bg-green-50 text-green-700 ring-green-700/10' : 'bg-red-50 text-red-700 ring-red-700/10'}`}>
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
          </div>
           {/* Mobile Cards */}
            <div className="grid gap-4 md:hidden">
            {currentData.map((item, index) => (
              <div key={index} className="bg-white shadow rounded-lg p-4 border border-gray-100 dark:border-darkborder dark:bg-surface dark:text-darktext-primary">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{item.name || 'Détails du point'}</h3>
                  <div onClick={(e) => e.stopPropagation()}>
                    <ButtonAction
                      itemId={item.id}
                      onView={() => handleView(item._id)}
                      onEdit={() => handleEdit(item._id)}
                      onDelete={() => handleDelete(item._id)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  {columns.map((column) => (
                    <div key={column.key} className="flex justify-between">
                      <span className="font-semibold text-gray-600 dark:text-gray-400">{column.title}:</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {column.key === 'section_name'
                          ? item.section_id?.name || "Non défini"
                          : column.key === 'locations_name'
                            ? item.locations?.name || "Non défini"
                            :column.key === 'file'
                            ?<img src={`http://localhost:5000${item.file}`} className="w-8 max-w-full max-h-full" alt="marqueur"/>
                            :column.key === 'created_at'
                            ?<span className='inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'>{item.createdAt ?  format(parseISO(item.createdAt), 'dd/MM/yy HH:mm', { locale: fr }) : 'Date non disponible'}</span>
                            :column.key === 'quantity'
                            ?<span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">{item.quantity}</span>
                            :column.key === 'users_name'
                            ? item.users?.name || "Non défini"
                            : column.key === 'products_name'
                              ? item.products?.name || "Non défini"
                              : item[column.key]
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between  border-gray-200 bg-white px-4 py-3 sm:px-6  dark:bg-surface sm:dark:border-darkborder sm:dark:bg-darklayout sm:dark:mt-6">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-darkborder dark:bg-surface dark:text-darktext-primary"
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
                      <p className="text-sm text-gray-700 dark:text-darktext-primary">
                        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, data.length)}</span> of{' '}
                        <span className="font-medium">{data.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav aria-label="Pagination" className="isolate inline-flex -space-x-px">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative w-6 h-6 inline-flex items-center rounded-full mr-2 p-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer dark:hover:bg-brandgreen dark:hover:text-brandblue hover:transition-transform hover:scale-105 duration-500"
                        >
                          <FaChevronLeft aria-hidden="true" className="h-3 w-3" />
                        </button>
                        {[...Array(totalPages)].map((_, i) => {
  const page = i + 1;
  const isCurrent = currentPage === page;
  const shouldRender =
    page === 1 ||
    page === totalPages ||
    Math.abs(currentPage - page) <= 1 ||
    page === 2 && currentPage <= 4 ||
    page === totalPages - 1 && currentPage >= totalPages - 3;

  if (!shouldRender) {
    if (
      (page === 3 && currentPage > 4) ||
      (page === totalPages - 2 && currentPage < totalPages - 3)
    ) {
      return (
        <span key={page} className="p-2 text-sm text-gray-500 dark:text-darktext-primary">...</span>
      );
    }
    return null;
  }

 return (
  <button
    key={page}
    onClick={() => handlePageChange(page)}
    className={`relative inline-flex items-center p-2 text-sm rounded-full mr-1 font-semibold transition-transform duration-300 ease-out w-6 h-6
      ${isCurrent
        ? 'z-10 bg-brandgreen text-brandblue scale-105 shadow-lg  rounded-full focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-green-600'
        : 'text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 hover:scale-105 focus:z-20 focus:outline-offset-0 dark:text-darktext-primary text-[8px] justify-center'
      }`}
  >
    {page}
  </button>
);

})}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex w-6 h-6 items-center rounded-full p-2 ml-2 cursor-pointer text-gray-400 shadow-lg ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:hover:bg-brandgreen dark:hover:text-brandblue hover:transition-transform hover:scale-105 duration-500"
                        >
                          <span className="sr-only">Next</span>
                          <FaChevronRight aria-hidden="true" className="h-3 w-3" />
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
