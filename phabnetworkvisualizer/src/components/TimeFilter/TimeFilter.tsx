// components/TimeFilter/TimeFilter.tsx
import RangeSlider from "./RangeSlider";
import SliderTicks from "./SliderTicks";
import BarGraph from "./BarGraph";

import React, { useState, useEffect } from "react";
import Datepicker from "react-tailwindcss-datepicker";

interface DateRangeData {
  startDate: Date | string | null;
  endDate: Date | string | null;
}

interface TimeFilterProps {
  dataPoints: { [key: string]: number };
  timeRange: {
    start: number;
    end: number;
  };
  setTimeRange: React.Dispatch<
    React.SetStateAction<{
      start: number;
      end: number;
    }>
  >;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  setDateRange: React.Dispatch<
    React.SetStateAction<{
      startDate: string;
      endDate: string;
    }>
  >;
  staged_item_name: string | null;
}

function TimeFilter({
  dataPoints,
  timeRange,
  setTimeRange,
  dateRange,
  setDateRange,
  staged_item_name,
}: TimeFilterProps) {
  const values = Object.values(dataPoints);
  const numBars = values.length;

  const handleValueChange = (newValue: DateRangeData | null) => {
    const startDate = newValue?.startDate ? newValue.startDate : "";
    const endDate = newValue?.endDate ? newValue.endDate : "";
    setDateRange({
      startDate:
        startDate instanceof Date ? startDate.toISOString() : startDate,
      endDate: endDate instanceof Date ? endDate.toISOString() : endDate,
    });
  };

  if (numBars > 1) {
    const maxValue = Math.max(...Object.values(dataPoints));
    const barContainerWidth = 100 / numBars;

    const displayText =
      staged_item_name && staged_item_name.trim() !== ""
        ? `Displaying data for ${staged_item_name}`
        : "Displaying data for all selected items";

    return (
      <div className="flex flex-col w-full h-full bg-gray-100 px-8">
        <div className="flex flex-row justify-between items-center py-4">
          <div className="text-left text-sm font-medium mb-4 text-slate-500">
            {displayText}
          </div>
          <div className="w-64 py-2">
            <Datepicker value={dateRange} onChange={handleValueChange} />
          </div>
        </div>

        <BarGraph
          values={values}
          maxValue={maxValue}
          range={timeRange}
          barContainerWidth={barContainerWidth}
        />

        <RangeSlider
          dataPoints={dataPoints}
          range={timeRange}
          setRange={setTimeRange}
        />

        <SliderTicks
          dataPoints={dataPoints}
          barContainerWidth={barContainerWidth}
        />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col w-full h-full bg-gray-100 px-8 justify-center items-center">
        <span className="text-gray-500 text-xl font-medium">
          Data unavailable
        </span>
      </div>
    );
  }
}

export default TimeFilter;
