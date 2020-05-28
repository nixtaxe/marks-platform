import GroupMarks from '@/models/GroupMarks'
import TableHeader from '@/models/TableHeader'
import TableItem from '@/models/TableItem'

export default function getMarksDataForTable (groupMarks: GroupMarks) {
  const { groupName, studentMarks } = groupMarks
  const headers: TableHeader[] = [
    { text: 'Студент', value: 'name', sortable: false },
  ].concat(
    studentMarks[0].marks.map((x) => {
      return { text: x.date, value: x.date, sortable: false }
    }),
  )
  let items: TableItem[] = []
  studentMarks.forEach((x, i) => {
    items.push({ id: x.id, name: x.student.name })
    // @ts-ignore
    x.marks.forEach((y) => (items[i][y.date] = y.value))
  })

  return { groupName, headers, items }
}
