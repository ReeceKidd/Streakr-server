import moment from 'moment-timezone';

const getTaskCompleteTimeForYesterday = ({ timezone }: { timezone: string }): moment.Moment => {
    return moment()
        .tz(timezone)
        .subtract(1, 'days');
};

const getTaskCompleteDay = ({ taskCompleteTime }: { taskCompleteTime: moment.Moment }): string => {
    return taskCompleteTime.format('YYYY-MM-DD');
};

export const MomentHelpers = {
    getTaskCompleteTimeForYesterday,
    getTaskCompleteDay,
};
