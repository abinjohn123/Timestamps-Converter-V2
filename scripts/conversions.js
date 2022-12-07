export function timeToSeconds(timeString) {
  const [HH, MM, SS] = timeString.split(':').reduce(
    (acc, cur, i) => {
      acc[i] = Number(cur);
      return acc;
    },
    [0, 0, 0]
  );

  console.log(HH, MM, SS);
  // return 0 if timestamp is invalid
  if (HH > 23 || MM > 59 || SS > 59) return false;

  // return time in seconds
  return HH * 3600 + MM * 60 + SS;
}

export function secondsToTime(sec) {
  let hours = Math.floor(sec / 3600); // get hours
  let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
  let seconds = sec - hours * 3600 - minutes * 60; //  get seconds

  [hours, minutes, seconds] = [hours, minutes, seconds].map(
    (time) => (time < 10 ? '0' + time : '' + time) //Add 0 at the start if time is less than 10
  );

  return hours === '00'
    ? //Return MM:SS if HH is 00
      minutes + ':' + seconds
    : // Return in HH:MM:SS
      hours + ':' + minutes + ':' + seconds;
}
