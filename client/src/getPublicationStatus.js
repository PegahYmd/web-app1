import dayjs from "dayjs";

export default (publicationDate) => {
  console.log("publicationDate", publicationDate);
  const nowDateInNumbers = +new Date()
    .toISOString()
    .split("T")[0]
    .replaceAll("-", "");
  if (!publicationDate) return "Draft";
  else if (+publicationDate.replaceAll("-", "") <= nowDateInNumbers)
    return "Published";
  else return "Scheduled";
};
