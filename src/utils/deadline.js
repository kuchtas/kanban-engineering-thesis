export const setClassByDeadlineCloseness = (startDate, endDate) => {
  const endDateLate = new Date(endDate).setHours(23, 59, 59, 59);
  const startDateEarly = new Date(startDate).setHours(0, 0, 0, 0);
  const currentDate = new Date();

  if (currentDate - startDateEarly < 0) return "deadline-term-0";
  if (endDateLate - currentDate < 0) return "deadline-term-5";
  if (endDateLate - startDateEarly > 604800000) {
    //seven days
    let deadlineCloseness = Math.round(
      ((currentDate - startDateEarly) / (endDateLate - startDateEarly)) * 100
    );
    if (deadlineCloseness >= 0 && deadlineCloseness <= 25)
      return "deadline-term-1";
    if (deadlineCloseness > 25 && deadlineCloseness <= 50)
      return "deadline-term-2";
    if (deadlineCloseness > 50 && deadlineCloseness <= 75)
      return "deadline-term-3";
    if (deadlineCloseness > 75 && deadlineCloseness <= 100)
      return "deadline-term-4";
  }
  if (endDateLate - currentDate > 518400000)
    // 6 days
    return "deadline-term-1";
  if (endDateLate - currentDate > 345600000)
    // 4 days
    return "deadline-term-2";
  if (endDateLate - currentDate > 172800000)
    // 2 days
    return "deadline-term-3";
  if (endDateLate - currentDate > 0) return "deadline-term-4";
};
