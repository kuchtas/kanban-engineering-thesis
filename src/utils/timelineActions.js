export const prepareTimelineData = (tasks) => {
  let data = [];
  tasks.forEach((task, index) => {
    data[index] = [
      task.title,
      task.title,
      `<p style="font-size: 25px; font-weight: bold; margin: 0px; padding: 10px; padding-bottom: 0px; text-align: center;">${
        task.title
      }<br>${
        task.tag.length !== 0
          ? `
              <p style="font-size: 15px; margin: 0px; text-align: center; padding-bottom: 0px;">
                ${task.tag}
              </p>`
          : `
              <p style="font-size: 15px; margin: 0px; text-align: center; padding-bottom: 0px;">
              </p>`
      }</p><hr style="margin-left: 5px; margin-right: 5px; margin-top: 0px; margin-bottom: 0px;" />
          <p style="font-size: 20px; margin: 0px; padding: 10px; padding-top: 0px; padding-bottom: 0px; text-align: center;">Users:${
            task.users.length !== 0
              ? task.users.map((user) => `<br>${user}`)
              : " No one is assigned to this task"
          }</p>
          <hr style="margin-left: 5px; margin-right: 5px; " />
          <p style="font-size: 20px; margin: 0px; padding: 10px; padding-top: 0px; text-align: center;">${
            task.startDate
          } - ${task.endDate} <br>Duration: ${
        (new Date(task.endDate).getTime() -
          new Date(task.startDate).getTime() +
          86400000) /
        86400000
      } day/s</p>`,
      new Date(task.startDate),
      new Date(task.endDate),
    ];
  });
  return data;
};
