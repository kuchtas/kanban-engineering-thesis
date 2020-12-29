import React from "react";
import Chart from "react-google-charts";
import "../styles/TimelineChartContainer.css";
import Loading from "./Loading";

const columns = [
  { type: "string", id: "Term" },
  { type: "string", id: "Name" },
  { type: "string", role: "tooltip" },
  { type: "date", id: "Start" },
  { type: "date", id: "End" },
];

const TimelineChartContainer = ({ rows }) => {
  return (
    <div className="timeline-chart-container">
      {rows.length === 0 ? (
        <div
          style={{
            fontSize: "40px",
            textAlign: "center",
            wordWrap: "break-word",
          }}
        >
          Add some tasks to see them on the graph
        </div>
      ) : (
        <Chart
          width={"100%"}
          height={50 * rows.length < 900 ? 100 + 50 * rows.length : "100%"}
          columns={columns}
          rows={rows}
          chartType="Timeline"
          loader={<Loading />}
          options={{
            tooltip: { isHtml: true },
            timeline: { showRowLabels: false },
            chartArea: { width: "100%", height: "100%" },
          }}
          className="timeline-chart enter-todo"
        />
      )}
    </div>
  );
};

export default TimelineChartContainer;
