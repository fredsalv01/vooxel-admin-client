
const statusOptions = [
  { name: 'Active', uid: 'active' },
  { name: 'Paused', uid: 'paused' },
  { name: 'Vacation', uid: 'vacation' }
]

const DocumentTypeData = [
  {
    label: 'Dni',
    value: 'Dni'
  },
  {
    label: 'Carnet de Extranjería',
    value: 'Carnet Extranjeria'
  },
  {
    label: 'Pasaporte',
    value: 'Pasaporte'
  }
]

const EnglishLevelData = [
  {
    label: 'Básico',
    value: 'Basico'
  },
  {
    label: 'Intermedio',
    value: 'Intermedio'
  },
  {
    label: 'Avanzado',
    value: 'Avanzado'
  },
  {
    label: 'Nativo',
    value: 'Nativo'
  }
]

// TODO: se va
const ContractTypeData = [
  {
    label: 'Recibo por Honorarios',
    value: 'RECIBOS POR HONORARIOS'
  },
  {
    label: 'Contrato por planilla',
    value: 'CONTRATO POR PLANILLA'
  },
  {
    label: 'Contrato por obras',
    value: 'CONTRATO POR OBRAS'
  }
]

export { statusOptions, EnglishLevelData, DocumentTypeData, ContractTypeData }
