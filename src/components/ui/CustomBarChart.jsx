import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import TitleComponent from "./TitleComponent.jsx";
import Cardata from "./Cardata";
import { COLORShsl } from "../../utils/statusBage.js";

const IncidentsStackedBarChart = ({ incidents, variants }) => {
  const data = useMemo(() => {
    const grouped = {};

    incidents.forEach((incident) => {
      const date = format(new Date(incident.createdAt), "dd/MM/yyyy");
      const section = incident.section_id?.name || "Non défini";

      if (!grouped[date]) grouped[date] = {};
      grouped[date][section] = (grouped[date][section] || 0) + 1;
    });

    return Object.entries(grouped).map(([date, sections]) => ({
      date,
      ...sections,
    }));
  }, [incidents]);

  const sections = [
    ...new Set(incidents.map((i) => i.section_id?.name || "Non défini")),
  ];

  return (
    <motion.div variants={variants} className="w-full">
     <Cardata className="flex-1 p-2">
      <TitleComponent Children="Evolutions des Incidents par Section"/>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="date" />
        <YAxis wrapperStyle={{ fontSize: "12px" }} />
        <Tooltip />
        <Legend margin={{ top: 20, right: 30, left: 20, bottom: 20 }} wrapperStyle={{ fontSize: "12px" }} />
        {sections.map((section, idx) => (
          <Bar
            key={section + idx}
            dataKey={section }
            stackId={idx}
            fill={COLORShsl[idx % COLORShsl.length]}
            width={20}
            barSize={20}
            radius={[10, 10, 0, 0]}
            barGap={5}

          />
        ))}
      </BarChart>
    </ResponsiveContainer>
    </Cardata>
    </motion.div>
  );
};

export default IncidentsStackedBarChart;
