export const BANKS_BACKEND = [
    { label: 'Interbank' ,value:"INTERBANK"},
    { label: 'Banco de crédito' ,value:"BANCO DE CREDITO"},
    { label: 'Banco continental' ,value:"BANCO CONTINENTAL"},
    { label: 'Scotiabank' ,value:"SCOTIABANK"},
    { label: 'Mi banco' ,value:"MI BANCO"},
    { label: 'Banbif' ,value:"BANBIF"},
    { label: 'Banco de la nación' ,value:"BANCO DE LA NACION"}
]

export const SENIORITY_BACKEND = [
    { label: 'Junior', value: 'Junior'},
    { label: 'Semi Senior', value: 'Semi Senior'},
    { label: 'Senior', value: 'Senior'},
]

export const ACCOUNT_TYPES_BACKEND = [
    { label: 'Cta. sueldo', value:'CTA SUELDO'},
    { label: 'Cta. CTS', value:'CTA CTS'},
    { label: 'Cta. sueldo', value:'CTA AHORROS'}
]

export const DOCUMENT_TYPES_BACKEND = [
    { value: 'Dni', label: 'DNI' },
    { value: 'Carnet Extranjeria', label: 'Carnet extranjería' },
    { value: 'Pasaporte', label: 'Pasaporte' },
]

export const ENGLISH_LEVEL_BACKEND = [
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

export const RECEIPTS_TYPES_BACKEND = [
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
];


export const TABLE_NAME_FILES = {
    contractWorkers: 'contractWorkers',
    contractClients: 'contractClients',
    certifications: 'certifications',
}

export const TAGS_FILES = {
    worker: 'worker',
    contract: 'contract',
    certification: 'certification',
    cv: 'cv',
    psychological_test: 'psychological_test',
    profile_photo: 'profile_photo',
}

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export const NO_HAS_FILES = 'No se ha subido contrato';