import { useState } from "react";

interface DatepickerCompProps {
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
  whichDate: "start" | "end";
}

function DatepickerComp({
  dateRange,
  setDateRange,
  whichDate,
}: DatepickerCompProps) {
  const [show, setShow] = useState<boolean>(false);
  const handleClose = (state: boolean) => {
    setShow(state);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange((prevState) => {
      return {
        ...prevState,
        [whichDate]: event.target.value,
      };
    });
  };

  return (
    <div className="relative">
      <input
        type="date"
        value={dateRange[whichDate]}
        onChange={handleChange}
        className="p-2 border rounded-lg "
      />
    </div>
  );
}

export default DatepickerComp;
