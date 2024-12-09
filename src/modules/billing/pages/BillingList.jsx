import React, { useEffect, useState } from 'react'
import { Button, Chip, ButtonGroup } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import * as XLSX from 'xlsx'

import Slot from '../../../components/Slot'
import { TableList, Sidebar } from '../../../components/base'
import { useQueryPromise } from '../../../hooks/useQueryPromise'
import {
  DocumentDownloadIcon,
  EditIcon,
  PlusIcon,
} from '../../../components/icons'
import { Alerts } from '../../../lib/helpers/alerts'
import { useSidebar } from '../../../hooks'
import { useFetchData } from '../../../hooks/useFetchData'
import { useFilters } from '../../../store/useFilters'
import { RenderFilterInput } from '../../../components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { downloadXLSX, addCurrency } from '../../../lib/helpers/utils'
import axiosInstance from '../../../axios/axios'

// orden de las columnas
// AÑO - MES - T/D - NRO DOC - FECHA DE EMISION - PLAZO DE PAGO -
// CLIENTE - RUC - TIPO DE SERVICIO - DESCRIPCION - OC - MONEDA
// T/C - MONTO NETO S/ - IGV S/ - MONTO TOTAL S/ - MONTO NETO US$ - IGV US$ - MONTO TOTAL US$
// ESTADO - MES DEPOSITO - FECHA DEL DEPOSITO
// FECHA DE VENCIMIENTO
// DIAS ACUMULADOS

// agregar un tooltip para mostrar
const headersTable = [
  {
    name: 'Año',
    uid: 'year',
  },
  {
    name: 'Mes',
    uid: 'month',
  },
  { name: 'T/D', uid: 'documentType' },
  { name: 'Nro. de documento', uid: 'documentNumber' },
  {
    name: 'Fecha de emisión',
    uid: 'startDate',
  },
  { name: 'Plazo de pago', uid: 'paymentDeadline' },
  {
    name: 'Cliente',
    uid: 'client',
  },
  { name: 'RUC', uid: 'clientRuc' },
  {
    name: 'Tipo de servicio',
    uid: 'serviceName',
  },
  { name: 'Descripción', uid: 'description' },
  { name: 'Nro. OC', uid: 'purchaseOrderNumber' },
  {
    name: 'Moneda',
    uid: 'currency',
  },
  { name: 'T/C', uid: 'conversionRate' },
  { name: 'Monto Neto', uid: 'amount' },
  { name: 'IGV', uid: 'igv' },
  { name: 'Monto Total', uid: 'total' },
  { name: 'Monto Neto US$', uid: 'currencyConversionAmount' },
  { name: 'IGV US$', uid: 'igvConversionAmount' },
  { name: 'Monto Total US$', uid: 'totalConversionAmount' },
  {
    name: 'Estado',
    uid: 'billingState',
  },
  { name: 'Mes depósito', uid: 'depositMonth' },
  { name: 'Fecha depósito', uid: 'depositDate' },
  {
    name: 'Fecha de vencimiento',
    uid: 'expirationDate',
  },
  { name: 'Días acumulados', uid: 'accumulatedDays' },
  { name: 'Acciones', uid: 'actions' },
]

const arrayFilters = [
  { name: 'Año', key: 'year', type: 'array' },
  { name: 'Mes', key: 'month', type: 'array' },
  { name: 'Fecha de emisión', key: 'startDate', type: 'date' },
  { name: 'Fecha de vencimiento', key: 'expirationDate', type: 'date' },
  { name: 'Cliente', key: '', type: 'array' },
  { name: 'Tipo de servicio', key: 'serviceName', type: 'array' },
  { name: 'Moneda', key: 'currency', type: 'array' },
  { name: 'Estado', key: 'status', type: 'array' },
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
  'igvConversionAmount',
  'totalConversionAmount',
  'billingState',
  'depositMonth',
  'depositDate',
  'expirationDate',
  'accumulatedDays',
  'actions',
]

export const BillingList = () => {
  const { isOpen, toggleSidebar } = useSidebar()

  const setFilters = useFilters((state) => state.setFilters)
  const filters = useFilters((state) => state.filters.billingFilters)
  const clearFilters = useFilters((state) => state.clearFilters)
  const prepareFiltersToSend = useFilters((state) => state.prepareFiltersToSend)
  const [customFilters, setCustomFilters] = useState({})

  const exportExcel = async () => {
    try {
      const { data } = await axiosInstance.post('billing/find', {
        paginate: false,
        ...prepareFiltersToSend('billingFilters'),
      })
      headersTable.pop()
      downloadXLSX(data, 'Factutación', headersTable)
    } catch (error) {
      console.log('🚀 ~ exportExcel ~ error:', error)
    }
  }

  const searchData = () => {
    setCustomFilters(prepareFiltersToSend('billingFilters'))
  }

  const clearLocalFilters = () => {
    clearFilters('billingFilters', arrayFilters, unique_values)
    setCustomFilters({})
  }

  const { data: unique_values } = useFetchData({ url: 'billing/unique_values' })

  useEffect(() => {
    if (unique_values && Object.keys(unique_values).length > 0) {
      const properties = []
      for (const element of arrayFilters) {
        let data = {
          name: element.name,
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

          for (let i = 0; i < data.options.length; i++) {
            if (typeof data.options[i] === 'number') {
              data.options[i] = data.options[i].toString()
            }
          }
        }

        properties.push(data)
      }
      setFilters('billingFilters', properties)
    }
  }, [unique_values])

  const { data, isFetching, paginationProps, updatingList, setQuerySearch } =
    useQueryPromise({
      url: 'billing/find',
      key: 'billing',
      type: 'POST',
      filters: customFilters,
    })

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
      case 'igvConversionAmount':
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
        return item.billingState === 'CANCELADO'
          ? '---'
          : getDayMora(item.expirationDate)
      case 'description':
        return (
          <Button
            color="primary"
            type="buttom"
            onClick={() =>
              Alerts.basicAlert({
                title: 'Descripción',
                text: cellValue,
              })
            }
            size="sm"
          >
            Ver
          </Button>
        )
      case 'depositMonth':
      case 'depositDate':
        return item.billingState !== 'CANCELADO' ? '---' : cellValue
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
      <Sidebar isOpen={isOpen} filters={filters} toggleSidebar={toggleSidebar}>
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
              <RenderFilterInput filter={filter} module="billingFilters" />
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
        title="Facturación"
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
            as={Link}
            to={`/billing/create`}
            color="primary"
            endContent={<PlusIcon />}
          >
            Agregar
          </Button>
        </Slot>
      </TableList>
    </>
  )
}
