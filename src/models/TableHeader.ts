import MarksConstraint from './MarksConstraint'

export default interface TableHeader {
  text: string
  value: string
  sortable: boolean
  editable: boolean
  simple: boolean
  fixed?: boolean
  marks_constraint?: MarksConstraint
}
