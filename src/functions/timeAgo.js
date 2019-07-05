const timeago = seconds => {
  const min = Math.round(seconds / 60);

  const hrs = Math.round(seconds / (60 * 60));

  const days = Math.round(seconds / (60 * 60 * 24));

  const weeks = Math.round(seconds / (60 * 60 * 24 * 7));

  const mnths = Math.round(seconds / (60 * 60 * 24 * 30));

  const yrs = Math.round(seconds / (60 * 60 * 24 * 365));

  if (seconds <= 60) {
    return `${seconds} seconds ago`;
  } else if (min <= 60) {
    if (min == 1) {
      return `one minute ago`;
    } else {
      return `${min} minutes ago`;
    }
  } else if (hrs <= 24) {
    if (hrs == 1) {
      return `an hour ago`;
    } else {
      return `${hrs} hours ago`;
    }
  } else if (days <= 7) {
    if (days == 1) {
      return `Yesterday`;
    } else {
      return `${days} days ago`;
    }
  } else if (days <= 30) {
    if (weeks == 1) {
      return `a week ago`;
    } else {
      return `${weeks} weeks ago`;
    }
  } else if (days <= 365) {
    if (mnths == 1) {
      return `a month ago`;
    } else {
      return `${mnths} months ago`;
    }
  } else {
    if (yrs == 1) {
      return `one year ago`;
    } else {
      return `${yrs} years ago`;
    }
  }
};
module.exports = timeago;
