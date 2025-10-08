
import React from "react";
import { FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
const StatsWidget = React.memo(({
  title,
  value,
  icon: Icon,
  trend = "neutral",
  trendValue,
  className = "",
  variants,
  iconColorClass = "text-blue-600",   // couleur de l'icône
  iconBgClass = "bg-blue-50"          // couleur du cercle derrière l'icône
}) => {
  const trendIcon = trend === "active" ? FaArrowUp : trend === "down" ? FaArrowDown : FaMinus;
  const trendColor = trend === "archived" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-400";

  return (
    <motion.div className={`flex w-full flex-col rounded-xl bg-white py-2 px-3 dark:bg-slate-600 dark:text-slate-300 sm:flex-1  ${className} cursor-pointer`} variants={variants}>
      <div className="flex items-center justify-between">
        {Icon ? <Icon className={`${iconColorClass} rounded-full ${iconBgClass} p-2 w-10 h-10`} /> : null}
       <div className="flex start-left items-start">
        <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
        </div> 
      </div>
      <div className="flex items-center justify-center">
        <p className="text-xl md:text-3xl font-bold text-brandblue">{value}</p>
      </div>

      {trendValue && (
        <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
          {React.createElement(trendIcon, { className: "w-4 h-4" })}
          <span>{trendValue}</span>
        </div>
      )}
    </motion.div>
  );
});

export default StatsWidget;
