import React from "react";
import { format } from "date-fns";

export const Date: React.FC<{ date: Date }> = ({ date }) => {
  return (
    <time dateTime={date.toISOString()}>{format(date, "LLLL d, yyyy")}</time>
  );
};
