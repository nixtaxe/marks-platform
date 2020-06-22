import moment from 'moment'

export default function getSemesterTimeAndYear (date: string) {
  let result = moment(date).locale('ru').format('YYYY')
  let semesterTime = moment(date).month() < 6 ? 'Весна' : 'Осень'
  result = semesterTime + ' ' + result
  return result
}
