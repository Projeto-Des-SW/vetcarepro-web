const now = new Date();
const day = now.getDate();
const month = now.getMonth() + 1;
const year = now.getFullYear();
const hours = now.getHours();
const minutes = now.getMinutes();
export const formattedDate = `${day}/${month}/${year}`;
export const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;

export const splitIntoGroups = (array: any[], size: number) => {
  const result = [];

  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    result.push(chunk);
  }

  return result;
};

export const INTERVAL_TIME = 10000;
export const PROGRESS_INCREMENT = 100 / (INTERVAL_TIME / 100);

export function capitalizeFirstLetter(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
