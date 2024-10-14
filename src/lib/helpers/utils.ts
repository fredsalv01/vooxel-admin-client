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