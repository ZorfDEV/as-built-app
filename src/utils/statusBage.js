// utils/statusBadge.js
export const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-red-50 text-red-700 ring-red-600/20";
    case "inactive":
      return "bg-gray-50 text-gray-700 ring-gray-500/20";
    case "pending":
      return "bg-yellow-50 text-yellow-700 ring-yellow-600/20";
    case "archived":
      return "bg-green-50 text-green-700 ring-green-600/20";
    default:
      return "bg-slate-50 text-slate-700 ring-slate-500/20";
  }
};

export const COLORShsl = [ '#FFBB28', '#FF8042', '#201E5B', '#00EDA6', '#154194', '#00AED1', '#5BC5F1','#BFBFBF', '#00C49F','#0088FE'];

