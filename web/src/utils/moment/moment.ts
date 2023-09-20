import moment from 'moment';

export const formatTimestamp = (timestamp: string) => {
  const formattedDate = moment(timestamp).format('YYYY-MM-DD');

  if (moment(formattedDate, 'YYYY-MM-DD', true).isValid()) {
    return formattedDate;
  } else {
    return '日期有誤';
  }
};

export const formatTimestampWithTime = (timestamp: string) => {
  const formattedDateTime = moment(timestamp).format('YYYY-MM-DD HH:mm');

  if (moment(formattedDateTime, 'YYYY-MM-DD HH:mm', true).isValid()) {
    return formattedDateTime;
  } else {
    return '日期有誤';
  }
};
