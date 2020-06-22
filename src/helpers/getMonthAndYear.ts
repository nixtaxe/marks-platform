import moment from 'moment'

export default function getMonthAndYear (date: string) {
  let result = moment(date).locale('ru').format('MMMM YYYY')
  result = result[0].toUpperCase() + result.slice(1)
  return result
}
