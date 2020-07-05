import User from '@/models/User'
import SemesterDiscipline from '@/models/SemesterDiscipline'

const UserRoles = { Teacher: 'Преподаватель', Student: 'Студент' }

function groupBy (list: any, keyGetter: Function) {
  const map = new Map()
  list.forEach((item: any) => {
    const key = keyGetter(item)
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}

const getGroupsList = (map: any) =>
  Array.from(map.entries()).map((value: any) => ({
    title: value[0],
    items: value[1].map((x: SemesterDiscipline) => ({
      // ...x,
      value: x.id,
      title: x.teacher_discipline_student_group.academic_discipline.name,
      teacherId: x.teacher_discipline_student_group.teacher.id,
    })),
  }))

const getDisciplinesList = (sds: SemesterDiscipline[]) =>
  sds.map((x: SemesterDiscipline) => ({
    value: x.id,
    title: x.teacher_discipline_student_group.academic_discipline.name,
    teacherId: x.teacher_discipline_student_group.teacher.id,
  }))

export default function getRelevantSemesterDisciplines (
  user: User,
  semesterDisciplines: SemesterDiscipline[],
) {
  let result
  if (user.role.name === UserRoles.Teacher) {
    const rawResult = groupBy(
      semesterDisciplines,
      (sd: SemesterDiscipline) =>
        sd.teacher_discipline_student_group.student_group.name,
    )
    result = getGroupsList(rawResult)
  } else {
    result = getDisciplinesList(semesterDisciplines)
  }
  // console.log(result)
  return result
}
