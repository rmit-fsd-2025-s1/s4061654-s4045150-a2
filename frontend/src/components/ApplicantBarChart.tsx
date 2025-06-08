import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";

export type ApplicantBarData = {
  name: string;
  count: number;
};

export default function ApplicantBarChart({ data, title }: { data: ApplicantBarData[]; title?: string }) {
  return (
    // Chart container with fixed height
    <div style={{ width: "100%", height: 300, marginBottom: 24 }}>
      {title && <h3 style={{ textAlign: "center" }}>{title}</h3>}
      {/* Responsive container for the bar chart */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 16 }}>
          {/* Grid lines */}
          <CartesianGrid strokeDasharray="3 3" />
          {/* X axis with applicant names */}
          <XAxis dataKey="name" interval={0} angle={-20} textAnchor="end" height={60} />
          {/* Y axis with selection counts */}
          <YAxis allowDecimals={false} />
          {/* Tooltip on hover */}
          <Tooltip />
          {/* Bar for each applicant, filled blue */}
          <Bar dataKey="count" fill="#003366">
            {/* Show count value on top of each bar */}
            <LabelList dataKey="count" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
