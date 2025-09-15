export default function (data) {
  for (let [key, value] of Object.entries(data)) {
    if (value == "none") {
      data[key] = "";
    }
  }
}
