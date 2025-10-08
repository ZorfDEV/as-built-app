import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import TitleComponent from "./TitleComponent.jsx";
import Cardata from "./Cardata";
import { COLORShsl } from "../../utils/statusBage.js";

const IncidentsDoughnutChart = ({ incidents, variants }) => {
  const data = useMemo(() => {
    const counts = {};

    incidents.forEach((incident) => {
      const section = incident.section_id?.name || "Non défini";
      counts[section] = (counts[section] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [incidents]);
  
  const COLORS = data.map(
    (_, idx) => COLORShsl[idx % COLORShsl.length]
  );

  return (
    <motion.div variants={variants} className="w-full">
     <Cardata className="flex-1 p-2">
      <TitleComponent Children="Evolutions des Incidents par Section"/>
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={70} // 👈 rend le centre creux
          outerRadius={120}
          paddingAngle={5}
          label
        >
          {data.map((_, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
      </PieChart>
    </ResponsiveContainer>
    </Cardata>
    </motion.div>
  );
};

export default IncidentsDoughnutChart;
