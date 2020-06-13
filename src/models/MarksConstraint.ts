import ID from './ID'

export default interface MarksConstraint {
  id: ID
  name: string
  minValue: number
  maxValue: number
  satisfactory: number
  good: number
  excellent: number
}
