import {
  format,
  fromUnixTime,
  millisecondsToSeconds
} from 'date-fns'

const BILL_SUBTYPES = {
  '1': 'Buy',
  '2': 'Sell',
  '114': 'Auto-Buy',
  '115': 'Auto-Sell',
}

export const transformBill = (bill) => {
  const timestamp = fromUnixTime(millisecondsToSeconds(bill.ts))
  const dayOfWeek = format(timestamp, 'EEEE')

  return {
    ...bill,
    subType: BILL_SUBTYPES[bill.subType],
    ts: timestamp,
    tsDayOfWeek: dayOfWeek,
  }
}
