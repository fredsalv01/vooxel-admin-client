import React, { useState } from 'react'
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

const headersTable = [
  { name: 'Nro', uid: 'nro' },
  {
    name: 'Nombre(s)',
    uid: 'name',
    isFilterd: true,
    filterType: 'array',
    keyOptions: 'names',
  },
  {
    name: 'Apellidos',
    uid: 'apPat',
    isFilterd: true,
    filterType: 'array',
    keyoptions: 'lastNames',
  },
  {
    name: 'Cargo',
    uid: 'charge',
    isFilterd: true,
    filterType: 'array',
    keyOptions: 'charges',
  },
  {
    name: 'Tipo de Documento',
    uid: 'documentType',
    isFilterd: true,
    filterType: 'array',
    keyOptions: 'documentTypes',
  },
  {
    name: 'Numero de Documento',
    uid: 'documentNumber',
    isFilterd: true,
    filterType: 'array',
    keyOptions: 'documentNumbers',
  },
  {
    name: 'Jefe Directo',
    uid: 'chiefOfficerName',
    isFilterd: true,
    filterType: 'array',
    keyOptions: 'chiefOfficers',
  },
  {
    name: 'Tipo de Contrato',
    uid: 'contractType',
    isFilterd: true,
    filterType: 'array',
    keyOptions: 'contractTypes',
  },
  {
    name: 'habilidades',
    uid: 'techSkills',
    isFilterd: true,
    filterType: 'array',
    keyOptions: 'techSkills',
  },
  { name: 'Acciones', uid: 'actions' },
]

const INITIAL_VISIBLE_COLUMNS = [
  'Nro',
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
  const getFilters = useFilters((state) => state.computed.getFilters)

  const {
    data,
    isFetching,
    refetch,
    paginationProps,
    updatingList,
    setQuerySearch,
  } = useQueryPromise({ url: 'workers', key: 'workers' })

  const exportExcel = () => {
    console.log('🚀 ~ exportExcel ~ filters:', filters)
  }

  const searchData = () => {
    let mutateFilters = {}
    getFilters.forEach((filter) => {
      if (filter.type === 'array' && filter.optionsSelected.length > 0) {
        mutateFilters[filter.key] = filter.optionsSelected
        console.log(
          '🚀 ~ getFilters.forEach ~ mutateFilters[filter.key]:',
          mutateFilters[filter.key],
        )
      } else if (
        filter.type === 'date' &&
        Object.keys(filter.optionsSelected || {}).length > 0
      ) {
        // validate if has dates property
        if (!mutateFilters['dates']) mutateFilters['dates'] = []
        mutateFilters['dates'].push({
          column: filter.key,
          start_date: toDateFromDatePicker(
            filter.optionsSelected.start,
          ).toString(),
          end_date: toDateFromDatePicker(filter.optionsSelected.end).toString(),
        })
      }
    })
    console.log('🚀 ~ searchData ~ mutateFilters:', mutateFilters)
    setCustomFilters(mutateFilters)
  }

  const clearFilters = () => {
    const properties = []
    for (const element of headersTable) {
      if (element.isFiltered) {
        let data = {
          name: element.name,
          value: null,
          key: element.keyOptions,
          type: element.filterType ?? 'text',
        }

        switch (element.filterType) {
          case 'array':
            data.options = unique_values[element.keyOptions] ?? []
            data.optionsSelected = []
            break

          case 'date':
            data.optionsSelected = null
            break

          default:
            break
        }

        properties.push(data)
      }
    }
    console.log('🚀 ~ clearFilters ~ properties:', properties)
    setFilters('workerFilters', properties)
    setCustomFilters({})
  }

  // const { data: unique_values } = useFetchData({ url: 'billing/unique_values' })

  // useEffect(() => {
  //   if (unique_values && Object.keys(unique_values).length > 0) {
  //     const properties = []
  //     for (const element of headersTable) {
  //       if (element.isFiltered) {
  //         let data = {
  //           name: element.name,
  //           value: null,
  //           key: element.keyOptions,
  //           type: element.filterType ?? 'text',
  //         }

  //         if (element.filterType === 'array') {
  //           const keyIndex = filters.findIndex(
  //             (item) => item.key === element.keyOptions,
  //           )

  //           if (keyIndex)
  //             data.optionsSelected =
  //               filters && (filters[keyIndex]?.optionsSelected ?? [])
  //           else data.optionsSelected = []

  //           data.options = unique_values[element.keyOptions] ?? []

  //           for (let i = 0; i < data.options.length; i++) {
  //             if (typeof data.options[i] === 'number') {
  //               data.options[i] = data.options[i].toString()
  //             } else {
  //               data.options[i] = capitalizeFirstLetter(data.options[i])
  //             }
  //           }
  //         }

  //         properties.push(data)
  //       }
  //     }
  //     setFilters('billingFilters', properties)
  //   }
  // }, [unique_values])

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
          <Button onClick={clearFilters} color="secondary">
            Limpiar
          </Button>
        </ButtonGroup>

        {filters &&
          filters.map((filter, index) => (
            <div key={index} className="mb-4">
              <RenderFilterInput filter={filter} />
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
