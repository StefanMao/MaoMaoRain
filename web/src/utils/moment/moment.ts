import moment from 'moment';

export const formatTimestamp = (timestamp: string) => {
  const formattedDate = moment(timestamp).format('YYYY-MM-DD');

  if (moment(formattedDate, 'YYYY-MM-DD', true).isValid()) {
    return formattedDate;
  } else {
    return '日期有誤';
  }
};
