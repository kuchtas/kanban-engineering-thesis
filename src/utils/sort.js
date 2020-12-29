export const deadlineSort = (a, b) => {
  return a.timeLeftGroup < b.timeLeftGroup
    ? 1
    : a.timeLeftGroup > b.timeLeftGroup
    ? -1
    : 0;
};
export const deadlineSortDone = (a, b) => {
  return a.points[0] < b.points[0] ? 1 : a.points[0] > b.points[0] ? -1 : 0;
};

export const tagSort = (a, b) => {
  return a.tag.toLowerCase() < b.tag.toLowerCase()
    ? -1
    : a.tag.toLowerCase() > b.tag.toLowerCase()
    ? 1
    : 0 || a.timeLeftGroup < b.timeLeftGroup
    ? 1
    : a.timeLeftGroup > b.timeLeftGroup
    ? -1
    : 0;
};
export const tagSortDone = (a, b) => {
  return a.tag.toLowerCase() < b.tag.toLowerCase()
    ? -1
    : a.tag.toLowerCase() > b.tag.toLowerCase()
    ? 1
    : 0 || a.points[0] < b.points[0]
    ? 1
    : a.points[0] > b.points[0]
    ? -1
    : 0;
};
