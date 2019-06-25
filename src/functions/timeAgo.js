const timeago = (seconds) => {




    const min = Math.round(seconds / 60);


    const hrs = Math.round(seconds / 3600);


    const days = Math.round(seconds / 86400);


    const weeks = Math.round(seconds / 604800);


    const mnths = Math.round(seconds / 2600640);


    const yrs = Math.round(seconds / 31207680);


    if (seconds <= 60) {
        return `${seconds} seconds ago`;
    }

    // Check for minutes 
    else if (min <= 60) {
        if (min == 1) {
            return `one minute ago`;
        } else {
            return `${min} minutes ago`;
        }
    }

    // Check for hours 
    else if (hrs <= 24) {
        if (hrs == 1) {
            return `an hour ago`;
        } else {
            return `${hrs} hours ago`;
        }
    }

    // Check for days 
    else if (days <= 7) {
        if (days == 1) {
            return `Yesterday`;
        } else {
            return `${days} days ago`;
        }
    }

    // Check for weeks 
    else if (weeks <= 4.3) {
        if (weeks == 1) {
            return `a week ago`;
        } else {
            return `${weeks} weeks ago`;
        }
    }

    // Check for months 
    else if (mnths <= 12) {
        if (mnths == 1) {
            return `a month ago`;
        } else {
            return `${mnths} months ago`;
        }
    }

    // Check for years 
    else {
        if (yrs == 1) {
            return `one year ago`;
        } else {
            return `${yrs} years ago`;
        }
    }
};
module.exports = timeago;