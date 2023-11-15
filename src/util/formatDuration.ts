export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const formattedHours = hours > 0 ? `${hours} Saat` : "";
  const formattedMinutes = remainingMinutes > 0 ? `${remainingMinutes} Dk` : "";

  if (formattedHours && formattedMinutes) {
    return `${formattedHours} ${formattedMinutes}`;
  } else {
    return formattedHours || formattedMinutes || "0 Dk";
  }
};
