export default (error, showNotification) => {
  console.log(error);
  const msg = error?.response?.data?.message;
  console.error(msg || "Прозошла ошибка");
  if (!showNotification) return;
  showNotification(msg || "Прозошла ошибка", true);
};
