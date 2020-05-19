import GroupMarks from '@/models/GroupMarks'

interface TableHeader {
  text: string
  value: string
  sortable: boolean
}

interface TableItem {
  id: number
  name: string
}

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
  // @ts-ignore
  studentMarks.forEach((x, i) => {
    items.push({ name: x.student.name })
    x.marks.forEach((y) => (items[i][y.date] = y.value))
  })

  return { groupName, headers, items }
}
