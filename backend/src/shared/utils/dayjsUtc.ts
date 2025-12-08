import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const dayjsUtc = dayjs.utc();

export { dayjsUtc };
