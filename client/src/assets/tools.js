function Time(utcTimestamp) {
    if (typeof utcTimestamp !== 'string') {
        throw new Error('Invalid argument: timestamp should be a UTC string.');
    }

    const timestamp = Math.floor(new Date(utcTimestamp).getTime() / 1000); // Convert UTC string to seconds
    const now = Math.floor(Date.now() / 1000);
    const difference = now - timestamp;

    const formatTime = (hours, minutes) => {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    if (difference < 60) {
        return `${difference}秒前`;
    } else if (difference < 60 * 60) {
        const minutes = Math.floor(difference / 60);
        return `${minutes}分钟前`;
    } else if (difference < 24 * 60 * 60) {
        const hours = Math.floor(difference / (60 * 60));
        return `${hours}小时前`;
    } else if (difference < 7 * 24 * 60 * 60) {
        const days = Math.floor(difference / (24 * 60 * 60));
        return `${days}天前`;
    } else if (difference < 4 * 7 * 24 * 60 * 60) {
        const days = Math.floor(difference / (24 * 60 * 60));
        const weeks = Math.floor(days / 7);
        const remainingDays = days % 7;
        if (remainingDays > 0) {
            return `${weeks}周${remainingDays}天前`;
        } else {
            return `${weeks}周前`;
        }
    } else {
        const date = new Date(timestamp * 1000);
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0');
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();

        if (year === new Date().getUTCFullYear()) {
            return `${month}月${day}日 ${formatTime(hours, minutes)}`;
        } else {
            return `${year}年${month}月${day}日 ${formatTime(hours, minutes)}`;
        }
    }
}

export default {Time}
