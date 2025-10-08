import React, { useEffect, useState } from "react";
import axios from "axios";
import WidgetItems from "./WidgetItems";
import {  FaCheckCircle } from "react-icons/fa";
import { PiClockCountdownFill } from "react-icons/pi";
import { RiScissorsCutLine } from "react-icons/ri";
//import { IoMdInformationCircle } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
const StatsWidgetContainerIncidents = ({ endpoint, headers, refreshInterval = 0 }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(endpoint, { headers });
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération des incidents");
    } finally {
      setLoading(false);
    }
  }, [endpoint, headers]);

  useEffect(() => {
    fetchData();
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [endpoint, refreshInterval, fetchData]);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-md animate-pulse">
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-4" />
        <div className="h-8 w-1/2 bg-gray-300 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-md text-red-500 text-sm">
        {error}
      </div>
    );
  }

  if (!data) return null;

  let icon = FaInfoCircle;
  let colorClass = "text-gray-600";
  let title = "Coupures FO BNG";
  let iconBgClass = "bg-blue-50";
   let iconColorClass = "text-blue-600";

  if (data.status === "pending") {
    icon = PiClockCountdownFill;
    colorClass = "text-yellow-500";
    title = "Incidents en traitement";
    iconColorClass = "text-yellow-600";
    iconBgClass = "bg-yellow-50";
  }  
  
  if (data.status === "archived") {
    icon = FaCheckCircle;
    colorClass = "text-green-600";
    title = "Incidents archivés";
    iconColorClass = "text-green-600";
    iconBgClass = "bg-green-50";
  } 
  
  else if (data.status === "active") {
   icon = RiScissorsCutLine;
    colorClass = "text-red-600";
    title = "Incidents actifs";
    iconColorClass = "text-red-600";
    iconBgClass = "bg-red-50";
  }

  const ColoredIcon = ({...props}) => <icon {...props} className={`${colorClass} ${props.className}`} />;

   const containerVariants ={
    hidden:{opacity: 0},
    show: {
      opacity:1,
      transition:{
        staggerChildren:0.3,
      },
    }
  }
  const itemVariants ={
 hidden:{opacity: 0, y:20},
    show: {
      opacity:1,
      y:0,
      transition:{
        duration:0.4,
        ease:"easeOut",
      }
    }
  }

  return (
    <motion.div className='transition-all duration-300 w-full'
      variants={containerVariants}
      initial="hidden"
      animate="show">
    <WidgetItems
      title={title}
      value={data.total}
      icon={icon}
        trend={data.trend}
        trendValue={data.trendValue}
        iconColorClass={iconColorClass}
        iconBgClass={iconBgClass}
        variants={itemVariants}
      className="w-full"
    />
    </motion.div>
  );
};

export default StatsWidgetContainerIncidents;
