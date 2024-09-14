import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import { CardBase } from '../../../components/base'
import {
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@nextui-org/react'
import { EditIcon, DeleteIcon, PlusIcon } from '../../../components/icons'
import Slot from '../../../components/Slot'

import axiosInstance from '../../../axios/axios'
import { useFetchData } from '../../../hooks/useFetchData'
import { EditCreateContactClientModal } from './'
import { Alerts } from '../../../lib/helpers/alerts'
import { ToastNotification } from '../../../lib/helpers/toast-notification-temp'

export const EditCreateContactClient = ({ itemId }) => {
  const { data, isLoading, fetchData } = useFetchData({
    url: `/contact/client/${itemId}`,
  })
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [editItem, setEditItem] = useState({})

  const [rows, setRows] = useState([])

  useEffect(() => {
    if (!!data) {
      const newRows = data.map((item, index) => {
        return {
          ...item,
        }
      })
      setRows(newRows)
    }
  }, [data])

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
    },
    {
      key: 'phone',
      label: 'Celular',
    },
    {
      key: 'email',
      label: 'Correo electrónico',
    },
    {
      key: 'designed_area',
      label: 'Área',
    },
    {
      key: 'actions',
      label: 'Acciones',
    },
  ]

  const handleEditContact = (item) => {
    setEditItem(item)
    onOpen()
  }

  const handleDeleteContact = async (item) => {
    const { isConfirmed } = await Alerts.confirmAlert()
    if (!isConfirmed) return

    try {
      Alerts.showLoading()
      await axiosInstance.delete(`contact/${item.id}`)
      ToastNotification.showSuccess('Contacto eliminado correctamente')
      fetchData()
    } catch (error) {
      if (error.response.status === 400)
        ToastNotification.showError(error.response.data.message)
      else ToastNotification.showError('Error al eliminar el contacto')
    } finally {
      Alerts.close()
    }
  }

  const renderCell = useCallback(
    (item, columnKey) => {
      const cellValue = item[columnKey]

      switch (columnKey) {
        case 'actions':
          return (
            <div className="flex justify-center">
              <ButtonGroup>
                <Button
                  isIconOnly
                  color="white"
                  className="p-0"
                  onClick={() => handleEditContact(item)}
                >
                  <EditIcon />
                </Button>
                <Button
                  isIconOnly
                  color="white"
                  className="p-0 text-danger"
                  onClick={() => handleDeleteContact(item)}
                >
                  <DeleteIcon />
                </Button>
              </ButtonGroup>
            </div>
          )
        default:
          return cellValue
      }
    },
    [rows],
  )

  const classNames = useMemo(
    () => ({
      wrapper: ['shadow-none', 'p-0'],
      th: ['text-center'],
    }),
    [],
  )

  return (
    <>
      {isOpen && (
        <EditCreateContactClientModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          item={editItem}
          items={rows}
          parentId={itemId}
          fetchData={fetchData}
        />
      )}
      <CardBase title="Contactos" async={isLoading} skeletonlines={5}>
        <Slot slot="header">
          <Button
            size="sm"
            onPress={() => {
              setEditItem({})
              onOpen()
            }}
            color="primary"
            endContent={<PlusIcon />}
          >
            Agregar
          </Button>
        </Slot>
        <Slot slot="body">
          <Table
            aria-label="Table contact's clients"
            isStriped
            classNames={classNames}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={rows}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Slot>
      </CardBase>
    </>
  )
}

EditCreateContactClient.propTypes = {
  itemId: PropTypes.string.isRequired,
}
