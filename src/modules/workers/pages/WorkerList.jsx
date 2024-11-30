import React, { useEffect, useState } from 'react'
import { Button, useDisclosure, ButtonGroup } from '@nextui-org/react'
import {
  PlusIcon,
  EditIcon,
  DocumentDownloadIcon,
  VacationIcon,
} from '../../../components/icons'
import { CreateWorkerModal, GridHabilities } from '../components'
import { Link } from 'react-router-dom'
import Slot from '../../../components/Slot'
import { TableList, Sidebar } from '../../../components/base'
import { useQueryPromise } from '../../../hooks/useQueryPromise'

import { RenderFilterInput } from '../../../components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useFilters } from '../../../store/useFilters'
import { useSidebar } from '../../../hooks'
import { useFetchData } from '../../../hooks/useFetchData'
import { capitalizeFirstLetter, downloadXLSX } from '../../../lib/helpers/utils'
import axiosInstance from '../../../axios/axios'
import * as XLSX from 'xlsx'

const headersTable = [
  // { name: 'Nro', uid: 'nro' },
  {
    name: 'Nombre(s)',
    uid: 'name',
  },
  {
    name: 'Apellidos',
    uid: 'apPat',
  },
  {
    name: 'Cargo',
    uid: 'charge',
    isFiltered: true,
    filterType: 'array',
    keyOptions: 'charge',
  },
  {
    name: 'Tipo de Documento',
    uid: 'documentType',
    isFiltered: true,
    filterType: 'array',
    keyOptions: 'documentType',
  },
  {
    name: 'Numero de Documento',
    uid: 'documentNumber',
  },
  {
    name: 'Jefe Directo',
    uid: 'chiefOfficerName',
  },
  {
    name: 'Tipo de Contrato',
    uid: 'contractType',
  },
  {
    name: 'habilidades',
    uid: 'techSkills',
  },
  { name: 'Acciones', uid: 'actions' },
]

const arrayFilters = [
  { name: 'Cargo', key: 'charge', type: 'array' },
  { name: 'Tipo de Documento', key: 'documentType', type: 'array' },
  { name: 'Cliente', key: 'client', type: 'array' },
  { name: 'Nivel de ingles', key: 'englishLevel', type: 'array' },
  { name: 'Seniority', key: 'seniority', type: 'array' },
  { name: 'Departamento', key: 'department', type: 'array' },
  { name: 'Distrito', key: 'district', type: 'array' },
  { name: 'Provincia', key: 'provincia', type: 'array' },
]

const INITIAL_VISIBLE_COLUMNS = [
  // 'Nro',
  'name',
  'apPat',
  'charge',
  'documentType',
  'documentNumber',
  'chiefOfficerName',
  'contractType',
  'techSkills',
  'actions',
]

export const WorkerList = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const { isOpen: isOpenSidebar, toggleSidebar } = useSidebar()

  const setFilters = useFilters((state) => state.setFilters)
  const filters = useFilters((state) => state.filters.workerFilters)
  const clearFilters = useFilters((state) => state.clearFilters)
  const prepareFiltersToSend = useFilters((state) => state.prepareFiltersToSend)
  const getFilters = useFilters((state) => state.computed.getFilters)

  const [customFilters, setCustomFilters] = useState({})

  const {
    data,
    isFetching,
    refetch,
    paginationProps,
    updatingList,
    setQuerySearch,
  } = useQueryPromise({
    url: 'workers/find',
    key: 'workers',
    type: 'POST',
    filters: customFilters,
  })

  const exportExcel = async () => {
    try {
      const { data } = await axiosInstance.post('workers/find', {
        isActive: true,
        paginate: false,
        ...prepareFiltersToSend('workerFilters'),
      })

      const headersTableExcel = [
        {
          name: 'Tipo de Documento',
          uid: 'documentType',
        },
        {
          name: 'Nro de Documento',
          uid: 'documentNumber',
        },
        {
          name: 'Apellido Paterno',
          uid: 'apPat',
        },
        {
          name: 'Apellido Materno',
          uid: 'apPat',
        },
        {
          name: 'Nombres',
          uid: 'name',
        },
        {
          name: 'Nivel de inglés',
          uid: 'englishLevel',
        },
        {
          name: 'Cargo',
          uid: 'charge',
        },
        {
          name: 'Seniority',
          uid: 'seniority',
        },
        {
          name: 'Fecha de nacimiento',
          uid: 'birthdate',
        },
        {
          name: 'Fecha de inicio',
          uid: 'startDate',
        },
        {
          name: 'Nro teléfono',
          uid: 'phoneNumber',
        },
        {
          name: 'Email',
          uid: 'email',
        },
        {
          name: 'Dirección',
          uid: 'address',
        },
        {
          name: 'Distrito',
          uid: 'district',
        },
        {
          name: 'Provincia',
          uid: 'province',
        },
        {
          name: 'Departamento',
          uid: 'department',
        },
        {
          name: 'Asignación familiar',
          uid: 'familiarAssignment',
        },
        {
          name: 'Sueldo',
          uid: 'salary',
        },
        {
          name: 'Tipo de contrato',
          uid: 'contractType',
        },
        {
          name: 'Fecha inicio de contratación',
          uid: 'contractWorkers.hiringDate',
        },
        {
          name: 'Fecha fin de contratación',
          uid: 'contractWorkers.endDate',
        },
        {
          name: 'Cliente',
          uid: 'clientInfo.businessName',
        },
        {
          name: 'Ruc Cliente',
          uid: 'clientInfo.ruc',
        },
      ]

      downloadXLSX(data, 'Colaboradores', headersTableExcel)
    } catch (error) {
      console.error('🚀 ~ exportExcel ~ error:', error)
    }
  }

  const searchData = () => {
    setCustomFilters(prepareFiltersToSend('workerFilters'))
  }

  const clearLocalFilters = () => {
    clearFilters('workerFilters', arrayFilters, unique_values)
    setCustomFilters({})
  }

  const exportExcelVacations = async () => {
    try {
      const ids = data.items.map((item) => item.id)
      const resp = await axiosInstance.post('vacations/export-vacations', [
        ...ids,
      ])

      const headersTableExcel = [
        {
          name: 'Apellido Paterno',
          uid: 'worker.apPat',
        },
        {
          name: 'Apellido Materno',
          uid: 'worker.apMat',
        },
        {
          name: 'Nombres',
          uid: 'worker.name',
        },
        {
          name: 'Días acumulados',
          uid: accumulatedVacations,
        }, // dias ganados
        {
          name: 'Días tomados o gozados',
          uid: takenVacations,
        }, // dias gozados
        {
          name: 'Días pendientes',
          uid: remainingVacations,
        }, // dias pendientes
        {
          name: 'Días expirados',
          uid: expiredDays,
        }, // dias vencidos

        // worker{id: 26, name: 'Jose David', apPat: 'Morales', apMat: 'Salvatierra', email: 'josedav@gmail.com', …}
      ]
      downloadXLSX(resp, 'Vacaciones')
    } catch (error) {
      console.error(error)
    }
  }

  const { data: unique_values } = useFetchData({ url: 'workers/unique-values' })

  useEffect(() => {
    if (unique_values && Object.keys(unique_values).length > 0) {
      const properties = []
      for (const element of arrayFilters) {
        let data = {
          name: element.name,
          value: null,
          key: element.key,
          type: element.type ?? 'text',
        }

        if (element.type === 'array') {
          const keyIndex = filters.findIndex((item) => item.key === element.key)

          if (keyIndex)
            data.optionsSelected =
              filters && (filters[keyIndex]?.optionsSelected ?? [])
          else data.optionsSelected = []

          data.options = unique_values[element.key] ?? []

          // make unique values to string

          for (let i = 0; i < data.options.length; i++) {
            if (typeof data.options[i] === 'number') {
              data.options[i] = data.options[i].toString()
            }
            // else {
            //   data.options[i] = capitalizeFirstLetter(data.options[i])
            // }
          }

          data.options = [...new Set(data.options)]
        }
        properties.push(data)
      }
      setFilters('workerFilters', properties)
    }
  }, [unique_values])

  const switchRenderCell = (worker, columnKey) => {
    const cellValue = worker[columnKey]

    switch (columnKey) {
      case 'name':
        return <div>{worker.name}</div>
      case 'apPat':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-tiny capitalize">{worker.apPat}</p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {worker.apMat}
            </p>
          </div>
        )
      case 'charge':
        return <div>{worker.charge}</div>
      case 'contractType':
        return worker.contractType === 'No tiene contrato' ? (
          <div className="text-red-600">No tiene contrato</div>
        ) : (
          <div className="text-xs">{worker.contractType}</div>
        )
      case 'techSkills':
        return worker.techSkills && <GridHabilities items={worker.techSkills} />
      case 'actions':
        return (
          <div className="relative flex items-center justify-center gap-2">
            {/* <Dropdown key={worker.id}>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light" aria-label="More options">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem aria-label="Show" href={`/workers/${worker.id}/detail`}>Ver</DropdownItem>
                <DropdownItem aria-label="Desactive">Desactivar</DropdownItem>
              </DropdownMenu>
            </Dropdown> */}
            <Link
              to={`/workers/${worker.id}/detail`}
              className="cursor-pointer text-lg text-default-400 active:opacity-50"
            >
              <EditIcon />
            </Link>

            {worker.contractType !== 'No tiene contrato' && (
              <Link
                to={`/workers/${worker.id}/vacations`}
                className="cursor-pointer text-lg text-default-400 active:opacity-50"
              >
                <VacationIcon />
              </Link>
            )}
          </div>
        )
      default:
        return cellValue
    }
  }

  return (
    <>
      {isOpen && (
        <CreateWorkerModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          fetchData={refetch}
        />
      )}

      <Sidebar
        isOpen={isOpenSidebar}
        filters={filters}
        toggleSidebar={toggleSidebar}
      >
        <h3 className="mb-4 font-bold uppercase">Filtros</h3>

        <ButtonGroup isDisabled={false} className="mb-5">
          <Button
            onClick={searchData}
            endContent={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            color="primary"
          >
            Buscar
          </Button>
          <Button onClick={clearLocalFilters} color="secondary">
            Limpiar
          </Button>
        </ButtonGroup>

        {filters &&
          filters.map((filter, index) => (
            <div key={index} className="mb-4">
              <RenderFilterInput filter={filter} module="workerFilters" />
            </div>
          ))}

        <Button
          className="mt-5"
          color="success"
          endContent={<DocumentDownloadIcon />}
          onClick={exportExcel}
        >
          Exportar Excel
        </Button>

        <Button
          className="mt-5"
          color="success"
          endContent={<DocumentDownloadIcon />}
          onClick={exportExcelVacations}
        >
          Exportar Excel Vacaciones
        </Button>
      </Sidebar>

      <TableList
        title="Colaboradores"
        items={data?.items || []}
        headersTable={headersTable}
        switchFn={switchRenderCell}
        initialColumns={INITIAL_VISIBLE_COLUMNS}
        isLoading={isFetching}
        paginationProps={paginationProps}
        updatingList={updatingList}
        setQuerySearch={setQuerySearch}
      >
        <Slot slot="topContent">
          <Button
            color="primary"
            onClick={toggleSidebar}
            style={{ alignSelf: 'flex-end' }}
          >
            Filtros
          </Button>
          <Button
            onPress={onOpen}
            color="primary"
            endContent={<PlusIcon />}
            onClick={onOpen}
          >
            Agregar
          </Button>
        </Slot>
      </TableList>
    </>
  )
}
