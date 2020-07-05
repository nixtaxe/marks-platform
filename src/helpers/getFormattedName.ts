import { NameFormat } from '@/state-machines/MarksTableMachine'
import User from '@/models/User'

export default function getFormattedName (
  user: User,
  nameFormat = NameFormat.FamilyName,
) {
  let result = ''
  if (nameFormat === NameFormat.FamilyName) result = user.familyName
  else if (nameFormat === NameFormat.FamilyNameAndName)
    result = user.familyName + ' ' + user.name
  else if (nameFormat === NameFormat.FullName)
    result = user.familyName + ' ' + user.name + ' ' + user.patronymic
  return result
}
