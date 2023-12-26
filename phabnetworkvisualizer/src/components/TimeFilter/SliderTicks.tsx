interface SliderTicksProps {
  dataPoints: { [key: string]: number };
  barContainerWidth: number;
}

function SliderTicks({ dataPoints, barContainerWidth }: SliderTicksProps) {
  return (
    <div className="flex flex-row w-full h-1/5 justify-between">
      {Object.keys(dataPoints).map((key) => (
        <div
          key={key}
          className="h-full"
          style={{ width: `${barContainerWidth}%` }}
        >
          <div
            className="text-gray-500 text-xs whitespace-nowrap origin-bottom-left"
            style={{
              transform: `translateX(-25%) rotate(-45deg)`,
              transformOrigin: "top left",
              textAlign: "right",
            }}
          >
            {key}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SliderTicks;
