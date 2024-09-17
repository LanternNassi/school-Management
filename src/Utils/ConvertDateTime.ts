

export function toDDMMYYYY(isoDateString : string) : string {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
    return `${day}/${month}/${year}`;
  }


export function toISODate(dateString : string):string {
    const parts = dateString.split('/'); // Split by '/' delimiter
    const year = parseInt(parts[2], 10); // Parse year as integer
    const day = parseInt(parts[1], 10) - 1; // Subtract 1 for month (0-indexed)
    const month = parseInt(parts[0], 10);
    return new Date(year, month, day).toISOString();
  }