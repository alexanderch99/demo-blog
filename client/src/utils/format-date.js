export default function formatDateTime(isoString) {
  const date = new Date(isoString);

  const datePart = date.toLocaleDateString("ru-RU");
  const timePart = date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${datePart} ${timePart}`;
}

export function formatDateTimeSimple(isoString) {
  const date = new Date(isoString);

  const datePart = date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
  });

  return datePart;
}
