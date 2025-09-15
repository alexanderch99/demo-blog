export default function toMilliseconds({
  minutes = 0,
  hours = 0,
  days = 0,
  months = 0,
  years = 0,
}) {
  return (
    minutes * 60 * 1000 +
    hours * 60 * 60 * 1000 +
    days * 24 * 60 * 60 * 1000 +
    months * 30 * 24 * 60 * 60 * 1000 +
    years * 365 * 24 * 60 * 60 * 1000
  );
}
