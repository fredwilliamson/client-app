import { parse, format } from "date-fns";

// FORMATTING

export function toPriceString(nmbr: number) {
  return nmbr.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Converts a value to string
 * - strings remain strings
 * - booleans are converted to "Yes/No" (see `toFormattedBoolean`)
 * - Lookups are converted to "[Code] Description" ("[Code]" only shows if there is a code value)
 * - Other values are converted to string using the `String` constructor
 *
 * @param value The value to convert
 */
export function genericToString(value: any): string {
  if (!value && value !== 0) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "boolean") {
    return toFormattedBoolean(value);
  }

  if (value) {
    const code = value["code"];
    const description = value["description"];

    if (code && description) {
      return `[${code}] ${description}`;
    } else if (description) {
      return description;
    }
  }

  return String(value);
}

export function toFormattedBoolean(b: boolean) {
  return toCustomFormattedBoolean(b, "Yes", "No");
}

export function toCustomFormattedBoolean(
  b: boolean,
  trueValue: string,
  falseValue: string
) {
  return b ? trueValue : falseValue;
}

// DATES

export const dateFormat = "dd/MM/yyyy";
export const dateMonthFormat = "dd MMMM yyyy";
export const dateDashFormat = "dd-MM-yy";

/**
 * Server expects dates in local time, this formats without converting to UTC first,
 * or by adding time zone info that causes issue in backend
 */
export const dateTimeLocalIsoFormat = "YYYY-MM-DDTHH:mm:ss";

export function momentOrUndefined(str: string | undefined | null) {
  if (str) {
    console.log(str);
    console.log(parse(str, dateFormat, new Date()));
    return parse(str, dateFormat, new Date());
  }
  return new Date();
}

export function formatDateMonth(date: Date | null) {
  return formatDate(date, dateMonthFormat);
}

export function formatDate(date: Date | null, dateFormat: string) {
  return date == null
    ? format(new Date(), dateFormat)
    : format(new Date(date), dateFormat);
}
