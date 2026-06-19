"use client";

import { DateRange, Range, RangeKeyDict } from "react-date-range";
import { vi } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const customVi: any = {
  ...vi,
  options: {
    ...vi.options,
    weekStartsOn: 1,
  },
  localize: {
    ...vi.localize,
    day: (n: number) => {
      const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
      return days[n];
    },
  },
};

interface CalendarProps {
  value: Range;
  onChange: (value: RangeKeyDict) => void;
  disabledDates?: Date[];
}

const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  disabledDates,
}) => {
  return (
    <DateRange
      locale={customVi}
      rangeColors={["#262626"]}
      ranges={[value]}
      date={new Date()}
      onChange={onChange}
      direction="vertical"
      showDateDisplay={false}
      minDate={new Date()}
      disabledDates={disabledDates}
      weekStartsOn={1}
    />
  );
};

export default Calendar;