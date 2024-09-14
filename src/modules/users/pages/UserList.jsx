import React, { useState } from 'react'
import { Button, useDisclosure, Tooltip } from '@nextui-org/react'
import { PlusIcon } from '../../../components/icons/PlusIcon'
import { headersTable } from '../utils/table-props'
import { CreateUserModal, EditUserModal } from '../components'
import { EditIcon } from '../../../components/icons'
import { TableList } from '../../../components/base'
import Slot from '../../../components/Slot'
import { useQueryPromise } from '../../../hooks/useQueryPromise'

const INITIAL_VISIBLE_COLUMNS = [
  'username',
  'email',
  'firstName',
  'lastName',
  'actions',
]

export const UserList = () => {
  const [selectedItemId, setSelectedItemId] = useState(null)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onOpenChange: onOpenChangeEdit,
  } = useDisclosure()

  const {
    data,
    isFetching,
    refetch,
    paginationProps,
    updatingList,
    setQuerSearch,
  } = useQueryPromise({ url: 'users', key: 'users' })

  const handleEditUser = (id) => {
    setSelectedItemId(id)
    onOpenEdit()
  }

  const switchRenderCell = (item, columnKey) => {
    const cellValue = item[columnKey]

    switch (columnKey) {
      case 'name':
        return <div>{item.name}</div>
      case 'apPat':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {item.apPat}
            </p>
          </div>
        )
      case 'charge':
        return <div>{item.charge}</div>
      case 'actions':
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Editar">
              <span
                className="cursor-pointer text-lg text-default-400 active:opacity-50"
                onClick={() => handleEditUser(item.id)}
              >
                <EditIcon />
              </span>
            </Tooltip>
          </div>
        )
      default:
        return cellValue
    }
  }

  return (
    <>
      {isOpen && (
        <CreateUserModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          fetchData={refetch}
        />
      )}
      {isOpenEdit && (
        <EditUserModal
          isOpen={isOpenEdit}
          onOpenChange={onOpenChangeEdit}
          itemId={selectedItemId}
          fetchData={refetch}
        />
      )}
      <TableList
        title="Usuarios"
        items={data?.items || []}
        headersTable={headersTable}
        switchFn={switchRenderCell}
        initialColumns={INITIAL_VISIBLE_COLUMNS}
        isLoading={isFetching}
        paginationProps={paginationProps}
        updatingList={updatingList}
        setQuerSearch={setQuerSearch}
      >
        <Slot slot="topContent">
          <Button
            onPress={onOpen}
            color="primary"
            onClick={onOpen}
            endContent={<PlusIcon />}
          >
            Agregar
          </Button>
        </Slot>
      </TableList>
    </>
  )
}
