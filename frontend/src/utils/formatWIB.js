// src/utils/formatWIB.js
import { utcToZonedTime, format } from 'date-fns-tz';

export function formatToWIB(utcStr) {
  const zonedDate = utcToZonedTime(utcStr, 'Asia/Jakarta');
  return format(zonedDate, 'HH:mm:ss'); // bisa diganti jadi 'yyyy-MM-dd HH:mm:ss'
}
