export const setClassByDeadlineCloseness = (startDate, endDate) => {
  if(new Date() - new Date(startDate) < 0 ) return "deadline-term-0"
  else{
    if (new Date(endDate).setHours(23, 59, 59, 59) -
        new Date(startDate).setHours(0, 0, 0, 0) > 604800000) { //seven days
      let deadlineCloseness = Math.round(
        ((new Date() - new Date(startDate).setHours(0, 0, 0, 0)) /
          (new Date(endDate).setHours(23, 59, 59, 59) -
            new Date(startDate).setHours(0, 0, 0, 0))) *  100);
          if (deadlineCloseness >= 0 && deadlineCloseness <= 25)
            return "deadline-term-1";
          else if (deadlineCloseness > 25 && deadlineCloseness <= 50)
            return "deadline-term-2";
          else if (deadlineCloseness > 50 && deadlineCloseness <= 75)
            return "deadline-term-3";
          else if (deadlineCloseness > 75 && deadlineCloseness <= 100)
            return "deadline-term-4";
          else if (deadlineCloseness > 100) 
            return "deadline-term-5";
    }   
    
    else if (new Date(endDate).setHours(23, 59, 59, 59) - // less 7 days left - 1
             new Date() < 0)
              return "deadline-term-5";
    else if (new Date(startDate).setHours(0, 0, 0, 0) -
              new Date() > 0)
               return "deadline-term-0";
    else if (new Date(endDate).setHours(23, 59, 59, 59) -
              new Date() > 518400000) // less 6 days left - 2
              return "deadline-term-1";
    else if (new Date(endDate).setHours(23, 59, 59, 59) -
              new Date() > 345600000) // less 4 days left - 3
              return "deadline-term-2";
    else if (new Date(endDate).setHours(23, 59, 59, 59) -
              new Date() > 172800000) // less 2 days left - 4
              return "deadline-term-3";
    else if (new Date(endDate).setHours(23, 59, 59, 59) -
              new Date() > 0)
              return "deadline-term-4";
  }
  };