import React, { useState } from 'react'
import { Button, useDisclosure } from '@nextui-org/react'
import { PlusIcon, EditIcon, VacationIcon } from '../../../components/icons'
import { CreateWorkerModal, GridHabilities } from '../components'
import { Link } from 'react-router-dom'
import { useQueryPromise } from '../../../hooks/useQueryPromise'
import { TableList } from '../../../components/base'
import Slot from '../../../components/Slot'

const headersTable = [
  { name: 'Nro', uid: 'nro' },
  { name: 'Nombre(s)', uid: 'name' },
  { name: 'Apellidos', uid: 'apPat' },
  { name: 'Cargo', uid: 'charge' },
  { name: 'Tipo de Documento', uid: 'documentType' },
  { name: 'Numero de Documento', uid: 'documentNumber' },
  { name: 'Jefe Directo', uid: 'chiefOfficerName' },
  { name: 'Tipo de Contrato', uid: 'contractType' },
  { name: 'habilidades', uid: 'techSkills' },
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

  const {
    data,
    isFetching,
    refetch,
    paginationProps,
    updatingList,
    setQuerySearch,
  } = useQueryPromise({ url: 'workers', key: 'workers' })

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
