const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'Nombre', uid: 'name', sortable: true },
  { name: 'Apellido Paterno', uid: 'apPat', sortable: true },
  { name: 'Cargo', uid: 'charge', sortable: true },
  { name: 'Tipo de Documento', uid: 'documentType' },
  { name: 'Numero de Documento', uid: 'documentNumber' },
  { name: 'Jefe Directo', uid: 'chiefOfficerName' },
  { name: 'Tipo de Contrato', uid: 'contractType' },
  { name: 'habilidades', uid: 'techSkills' },
  // {name: "STATUS", uid: "status", sortable: true},
  { name: 'Acciones', uid: 'actions' }
]

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

export { columns, statusOptions, EnglishLevelData, DocumentTypeData, ContractTypeData }
