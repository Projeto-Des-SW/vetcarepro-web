const now = new Date();
const day = now.getDate();
const month = now.getMonth() + 1;
const year = now.getFullYear();
const hours = now.getHours();
const minutes = now.getMinutes();
export const formattedDate = `${day}/${month}/${year}`;
export const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;
