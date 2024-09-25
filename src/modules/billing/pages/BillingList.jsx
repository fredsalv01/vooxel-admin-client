import React, { useEffect, useState } from 'react'
import { Button, useDisclosure } from '@nextui-org/react'
import { Link } from 'react-router-dom'

import Slot from '../../../components/Slot'
import { TableList } from '../../../components/base'
import { useQueryPromise } from '../../../hooks/useQueryPromise'
import { EditIcon, PlusIcon } from '../../../components/icons'

const headersTable = [
  { name: 'Cliente', uid: 'clientName' },
  { name: 'Tipo de documento', uid: 'documentType' },
  { name: 'Nro. de documento', uid: 'documentNumber' },
  { name: 'Fecha de inicio', uid: 'startDate' },
  { name: 'Fecha de vencimiento', uid: 'paymentDeadline' },
  { name: 'Descripción', uid: 'description' },
  { name: 'Nro. de orden de compra', uid: 'purchaseOrderNumber' },
  { name: 'Moneda', uid: 'currency' },
  { name: 'Valor de la moneda', uid: 'currencyValue' },
  { name: 'Monto', uid: 'amount' },
  { name: '¿Tiene IGV?', uid: 'hasIGV' },
  { name: 'IGV', uid: 'igv' },
  { name: 'Total', uid: 'total' },
  { name: 'Estado de facturación', uid: 'billingState' },
  { name: 'Fecha de estado de facturación', uid: 'billingStateDate' },
  { name: 'Fecha de vencimiento', uid: 'expirationDate' },
  { name: 'Días acumulados', uid: 'accumulatedDays' },
  { name: 'Hashes', uid: 'hashes' },
  { name: 'HES', uid: 'hes' },
  { name: 'Monto de conversión de moneda', uid: 'currencyConversionAmount' },
  { name: 'IGV en dólares', uid: 'igvConversionDollars' },
  { name: 'Monto total en dólares', uid: 'totalAmountDollars' },
  { name: 'Mes de pago', uid: 'paymentMonth' },
  { name: 'Creado en', uid: 'createdAt' },
  { name: 'Actualizado en', uid: 'updatedAt' },
  { name: 'Servicio', uid: 'serviceName' },
  { name: 'Acciones', uid: 'actions' },
]

const INITIAL_VISIBLE_COLUMNS = [
  'clientName',
  'documentType',
  'documentNumber',
  'startDate',
  'paymentDeadline',
  'description',
  'purchaseOrderNumber',
  'currency',
  'currencyValue',
  'amount',
  'hasIGV',
  'igv',
  'total',
  'billingState',
  'billingStateDate',
  'expirationDate',
  'accumulatedDays',
  'hashes',
  'hes',
  'currencyConversionAmount',
  'igvConversionDollars',
  'totalAmountDollars',
  'paymentMonth',
  'createdAt',
  'updatedAt',
  'serviceName',
  'actions',
]

export const BillingList = () => {
  const {
    data,
    isFetching,
    refetch,
    isSuccess,
    paginationProps,
    updatingList,
    setQuerSearch,
  } = useQueryPromise({ url: 'billing', key: 'billing' })

  const switchRenderCell = (item, columnKey) => {
    const cellValue = item[columnKey]
    switch (columnKey) {
      case 'actions':
        return (
          <Link
            to={`/billing/${item.id}/detail`}
            className="cursor-pointer text-lg text-default-400 active:opacity-50"
          >
            <EditIcon />
          </Link>
        )
      default:
        return cellValue
    }
  }

  return (
    <>
      <TableList
        title="Facturación"
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
          {/* onPress={onOpen} */}
          <Button
            as={Link}
            to={`/billing/create`}
            color="primary"
            endContent={<PlusIcon />}
          >
            {/* onClick={onOpen} */}
            Agregar
          </Button>
        </Slot>
      </TableList>
    </>
  )
}
