import ID from './ID'

export default interface IntegrationType {
  id: ID
  name: string
  code: number
}

export enum IntegrationCodes {
  NoIntegration,
  CatsIntegration,
  GoogleSpreadsheetsIntegraion,
}
