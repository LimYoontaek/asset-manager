export const getDate = (date: string) => {
  const newDate = new Date(date);
  if (isNaN(newDate.getTime())) return "";
  return new Intl.DateTimeFormat("ko-kr", {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).format(newDate);
};
