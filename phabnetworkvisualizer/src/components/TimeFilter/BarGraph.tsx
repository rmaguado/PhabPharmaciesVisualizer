// components/TimeFilter/BarGraph.tsx
interface BarGraphProps {
  values: number[];
  maxValue: number;
  range: {
    start: number;
    end: number;
  };
  barContainerWidth: number;
}

function BarGraph({
  values,
  maxValue,
  range,
  barContainerWidth,
}: BarGraphProps) {
  return (
    <div className="flex flex-row w-full h-3/5 justify-between pb-8 pt-4">
      {values.map((value, index) => {
        const height = maxValue === 0 ? 0 : (value / maxValue) * 100;
        return (
          <div
            className="flex flex-col justify-end h-full w-12"
            style={{ width: `${barContainerWidth}%` }}
            key={index + "_bar"}
          >
            <div
              className={`w-full h-full ${
                index >= range.start && index <= range.end
                  ? "bg-blue-500"
                  : "bg-gray-300"
              }`}
              style={{ height: `${height}%` }}
            ></div>
          </div>
        );
      })}
    </div>
  );
}

export default BarGraph;
