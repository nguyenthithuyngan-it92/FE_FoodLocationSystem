export const isValidTime = (data = {}) => {
  const { start_time = "", end_time = "" } = data;
  const currentTime = new Date().getTime();

  const newStartTime = start_time.split(":");
  const startTime = new Date();
  startTime.setHours(newStartTime[0]);
  startTime.setMinutes(newStartTime[1]);
  startTime.setMilliseconds(newStartTime[2]);

  const newEndTime = end_time.split(":");
  const endTime = new Date();
  endTime.setHours(newEndTime[0]);
  endTime.setMinutes(newEndTime[1]);
  endTime.setMilliseconds(newEndTime[2]);

  return currentTime <= endTime.getTime() && currentTime >= startTime.getTime();
};
