// components/RangeSlider.tsx
import React from "react";
import ReactSlider from "react-slider";

interface RangeSliderProps {
  dataPoints: { [key: string]: number };
  range: {
    start: number;
    end: number;
  };
  setRange: React.Dispatch<
    React.SetStateAction<{
      start: number;
      end: number;
    }>
  >;
}

function RangeSlider({ dataPoints, range, setRange }: RangeSliderProps) {
  const numBars = Object.keys(dataPoints).length;
  const min = 0;
  const max = numBars - 1;

  const padding_right = 100 / numBars - 2;

  return (
    <div
      className="flex-shrink-0 w-full h-1/5"
      style={{ transform: "translateX(1rem)" }}
    >
      <div className="w-full" style={{ paddingRight: `${padding_right}%` }}>
        <ReactSlider
          defaultValue={[range.start, range.end]}
          min={min}
          max={max}
          minDistance={1}
          step={1}
          className="h-2"
          renderThumb={(props, state) => {
            const thumbClass =
              state.index === 0
                ? `bg-blue-500 h-6 w-6 rounded-full focus:outline-none focus:ring mt-[-0.5rem] -ml-[0.5rem]`
                : `bg-blue-500 h-6 w-6 rounded-full focus:outline-none focus:ring mt-[-0.5rem]`;

            return <div {...props} className={thumbClass} />;
          }}
          renderTrack={(props, state) => (
            <div
              {...props}
              className={`${
                state.index === 1 ? "bg-blue-500" : "bg-gray-300"
              } h-2 rounded-full`}
            />
          )}
          onChange={([lower, upper]) => {
            setRange({ start: lower, end: upper });
          }}
        />
      </div>
    </div>
  );
}
export default RangeSlider;
