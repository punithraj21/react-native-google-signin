const formattedDate = (createdAt: any) => {
  const date = new Date(createdAt.seconds * 1000 + createdAt.nanoseconds / 1e6);
  const now = new Date();
  const yesterday = new Date(now.setDate(now.getDate() - 1));
  now.setDate(now.getDate() + 1); // Reset 'now' to the current date

  // Check if the date is today
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
  // Check if the date is yesterday
  else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  // For older dates
  else {
    return date.toLocaleDateString("en-US", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    });
  }
};

export default formattedDate;
