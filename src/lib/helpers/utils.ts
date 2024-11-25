import * as XLSX from 'xlsx'
import { CalendarDate } from "@internationalized/date";

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getValueFromFieldFormik(arr: any, str: string): any {
  if (str.length === 0) {
    return;
  }
  const path = str.split('.');
  let result: any = arr;
  for (let i = 0; i < path.length; i++) {
    if (result && typeof result[path[i]] !== 'undefined') {
      result = result[path[i]] ?? '';
    } else {
      result = '';
      break;
    }
  }
  return result ?? '';
}

export function setPropsItem(editItem: Record<string, any>, arr: Record<string, any> = {}): Record<string, any> {
  for (const key in editItem) {
    if (Object.hasOwnProperty.call(editItem, key)) {
      const element = editItem[key];
      if (!!element) {
        if (key === 'bankAccount') {
          console.log(typeof element);
        }
        if (typeof element === 'object') {
          setPropsItem(element, arr);
        } else {
          arr[key] = element;
        }
      }
    }
  }
  return arr;
}

// Debounce function
export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

// Convert string to number with specified decimals
export function stringToNumber(str: string, decimals: number = 2): number {
  if (str === '') return 0;
  const number = parseFloat(str);
  return parseFloat(number.toFixed(decimals));
}

// format date string with calendarDate from react-datepicker
export function toDateFromDatePicker(date: any): CalendarDate | null {
  if (!date) return null
  const { year, month, day } = date
  const newDate = new CalendarDate(year, month, day)
  return newDate
}

export function capitalizeFirstLetter(word: string): string {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

interface Header {
  uid: string;
  name: string;
}

interface DataRow {
  [key: string]: any;
}

function formattedData(data: DataRow[], headersTable: Header[]): DataRow[] {
  return data.map((row) =>
    headersTable.reduce((acc, header) => {
      acc[header.name] = row[header.uid] || ''; // Use the header's name as key, map the uid to data, or fallback to an empty string
      return acc;
    }, {} as DataRow)
  );
}

export function downloadXLSX(data: any, fileName: string, headersTable: any[]): void {
  console.log("🚀 ~ downloadXLSX ~ data:", data)

  let transformedData = data;
  if (headersTable.length > 0) {
    // delete obj name actions from headerstable
    headersTable.pop();
    transformedData = formattedData(data, headersTable);
  }

  // Step 1: Create a worksheet from the JSON data
  const worksheet = XLSX.utils.json_to_sheet(transformedData);

  // Step 2: Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  // Step 3: Convert the workbook to a binary blob
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  })

  // Step 4: Create a Blob object and trigger a download
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName}-${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}.xlsx`
  link.click()

  // Clean up the URL object
  URL.revokeObjectURL(url)
}

export function addCurrency(currency: 'SOLES' | 'DOLARES', value: number): string {
  const language = {
    SOLES: ['PEN', 'es-PE'],
    DOLARES: ['USD', 'en-US'],
  }

  const [symbolMoney, lang] = language[currency]

  return new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: symbolMoney,
  }).format(value)
}