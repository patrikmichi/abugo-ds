import { DatePicker } from './DatePicker';
import { RangePicker } from './RangePicker';

// Attach RangePicker as static property for <DatePicker.RangePicker /> usage
(DatePicker as any).RangePicker = RangePicker;

export { DatePicker, RangePicker };
export type {
  DatePickerProps,
  RangePickerProps,
  DatePickerValue,
  DatePickerRangeValue,
  DatePickerPicker,
  DatePickerShowTime,
  DatePickerPreset,
} from './types';

// Legacy export for backwards compatibility
export { DatePicker as Datepicker };
export type { DatePickerProps as DatepickerProps } from './types';
