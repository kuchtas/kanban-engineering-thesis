import React from "react";
import Chart from "react-google-charts";
import "./FlowChartContainer.css";
import Loading from "./Loading";

const columns = [
  { type: "string", id: "Term" },
  { type: "string", id: "Name" },
  { type: "string", role: "tooltip" },
  { type: "date", id: "Start" },
  { type: "date", id: "End" },
];

const FlowChartContainer = ({ rows }) => {
  return (
    <div className="flow-chart-container">
      {rows.length === 0 ? (
        <div>Add some tasks to see them on the graph</div>
      ) : (
        <Chart
          width={"100%"}
          height={"100%"}
          columns={columns}
          rows={rows}
          chartType="Timeline"
          loader={<Loading />}
          options={{
            timeline: { showRowLabels: false },
            tooltip: { isHtml: true },
          }}
        />
      )}
    </div>
  );
};

export default FlowChartContainer;