import React, { useEffect, useState } from 'react'
import { Button, Chip, useDisclosure } from '@nextui-org/react'
import { Link } from 'react-router-dom'

import Slot from '../../../components/Slot'
import { TableList } from '../../../components/base'
import { useQueryPromise } from '../../../hooks/useQueryPromise'
import { EditIcon, PlusIcon } from '../../../components/icons'

// orden de las columnas
// AÑO - MES - T/D - NRO DOC - FECHA DE EMISION - PLAZO DE PAGO -
// CLIENTE - RUC - TIPO DE SERVICIO - DESCRIPCION - OC - MONEDA
// T/C - MONTO NETO S/ - IGV S/ - MONTO TOTAL S/ - MONTO NETO US$ - IGV US$ - MONTO TOTAL US$
// ESTADO - MES DEPOSITO - FECHA DEL DEPOSITO
// FECHA DE VENCIMIENTO
// DIAS ACUMULADOS

// agregar un tooltip para mostrar
const headersTable = [
  { name: 'Año', uid: 'year' },
  { name: 'Mes', uid: 'month' },
  { name: 'T/D', uid: 'documentType' },
  { name: 'Nro. de documento', uid: 'documentNumber' },
  { name: 'Fecha de emisión', uid: 'startDate' },
  { name: 'Plazo de pago', uid: 'paymentDeadline' },
  { name: 'Cliente', uid: 'client' },
  { name: 'RUC', uid: 'clientRuc' },
  { name: 'Tipo de servicio', uid: 'serviceName' },
  { name: 'Descripción', uid: 'description' },
  { name: 'Nro. OC', uid: 'purchaseOrderNumber' },
  { name: 'Moneda', uid: 'currency' },
  { name: 'T/C', uid: 'conversionRate' },
  { name: 'Monto Neto', uid: 'amount' },
  { name: 'IGV', uid: 'igv' },
  { name: 'Monto Total', uid: 'total' },
  { name: 'Monto Neto US$', uid: 'currencyConversionAmount' },
  { name: 'IGV US$', uid: 'igvConversionAmount' },
  { name: 'Monto Total US$', uid: 'totalConversionAmount' },
  { name: 'Estado', uid: 'billingState' },
  { name: 'Mes depósito', uid: 'depositMonth' },
  { name: 'Fecha depósito', uid: 'depositDate' },
  { name: 'Fecha de vencimiento', uid: 'expirationDate' },
  { name: 'Días acumulados', uid: 'accumulatedDays' },
  { name: 'Acciones', uid: 'actions' },
]

const INITIAL_VISIBLE_COLUMNS = [
  'year',
  'month',
  'documentType',
  'documentNumber',
  'startDate',
  'paymentDeadline',
  'client',
  'clientRuc',
  'serviceName',
  'description',
  'purchaseOrderNumber',
  'currency',
  'conversionRate',
  'amount',
  'igv',
  'total',
  'currencyConversionAmount',
  'igvConversionDollars',
  'totalConversionAmount',
  'billingState',
  'depositMonth',
  'depositDate',
  'expirationDate',
  'accumulatedDays',
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

  const addCurrency = (currency, cellValue) => {
    const language = {
      SOLES: ['PEN', 'es-PE'],
      DOLARES: ['USD', 'en-US'],
    }

    const [symbolMoney, lang] = language[currency]

    return new Intl.NumberFormat(lang, {
      style: 'currency',
      currency: symbolMoney,
    }).format(cellValue)
  }

  const getDayMora = (expirationDate) => {
    const date = new Date(expirationDate)
    const today = new Date()
    const diffTime = date - today
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    // show years, months, days
    const diffYears = Math.abs(Math.floor(diffDays / 365))
    const diffMonths = Math.abs(Math.floor((diffDays % 365) / 30))
    diffDays = Math.abs(Math.floor((diffDays % 365) % 30))

    // concat if not 0
    if (diffYears === 0 && diffMonths === 0) return `${diffDays} días`
    if (diffYears === 0) return `${diffMonths} meses, ${diffDays} días`
    return `${diffYears} años, ${diffMonths} meses, ${diffDays} días`
  }

  const switchRenderCell = (item, columnKey) => {
    const cellValue = item[columnKey]
    switch (columnKey) {
      case 'paymentDeadline':
        return `${cellValue} días`
      case 'amount':
      case 'igv':
      case 'total':
        return addCurrency(item.currency, cellValue)
      case 'currencyConversionAmount':
      case 'igvConversionDollars':
      case 'totalConversionAmount':
        return addCurrency(
          item.currency === 'DOLARES' ? 'SOLES' : 'DOLARES',
          cellValue,
        )
      case 'billingState':
        const colors = {
          CANCELADO: 'success',
          PENDIENTE: 'warning',
          ANULADO: 'danger',
          FACTORING: 'info',
        }
        return (
          <Chip
            className="gap-1 border-none capitalize text-default-600"
            color={colors[cellValue]}
            size="md"
            variant="dot"
          >
            {cellValue}
          </Chip>
        )
      case 'accumulatedDays':
        return getDayMora(item.expirationDate)
      case 'actions':
        return (
          <Link
            to={`/billing/${item.id}/edit`}
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
