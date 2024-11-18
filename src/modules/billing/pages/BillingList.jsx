import React, { useEffect, useState } from 'react'
import { Button, Chip, ButtonGroup } from '@nextui-org/react'
import { Link } from 'react-router-dom'

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
import {
  capitalizeFirstLetter,
  toDateFromDatePicker,
} from '../../../lib/helpers/utils'

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
    isFiltered: true,
    filterType: 'array',
    keyOptions: 'years',
  },
  {
    name: 'Mes',
    uid: 'month',
    isFiltered: true,
    filterType: 'array',
    keyOptions: 'months',
  },
  { name: 'T/D', uid: 'documentType' },
  { name: 'Nro. de documento', uid: 'documentNumber' },
  {
    name: 'Fecha de emisión',
    uid: 'startDate',
    isFiltered: true,
    filterType: 'date',
  },
  { name: 'Plazo de pago', uid: 'paymentDeadline' },
  {
    name: 'Cliente',
    uid: 'client',
    isFiltered: true,
    filterType: 'array',
    keyOptions: 'clientBusinessNames',
  },
  { name: 'RUC', uid: 'clientRuc' },
  {
    name: 'Tipo de servicio',
    uid: 'serviceName',
    isFiltered: true,
    filterType: 'array',
    keyOptions: 'service',
  },
  { name: 'Descripción', uid: 'description' },
  { name: 'Nro. OC', uid: 'purchaseOrderNumber' },
  {
    name: 'Moneda',
    uid: 'currency',
    isFiltered: true,
    filterType: 'array',
    keyOptions: 'currencies',
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
    isFiltered: true,
    filterType: 'array',
    keyOptions: 'billingStates',
  },
  { name: 'Mes depósito', uid: 'depositMonth' },
  { name: 'Fecha depósito', uid: 'depositDate' },
  {
    name: 'Fecha de vencimiento',
    uid: 'expirationDate',
    isFiltered: true,
    filterType: 'date',
  },
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
  const getFilters = useFilters((state) => state.computed.getFilters)
  const [customFilters, setCustomFilters] = useState({})

  const exportExcel = () => {
    console.log('🚀 ~ exportExcel ~ filters:', filters)
  }

  const searchData = () => {
    let mutateFilters = {}
    const billingFilters = getFilters('billingFilters')
    console.log('🚀 ~ searchData ~ billingFilters:', billingFilters)
    billingFilters.forEach((filter) => {
      console.log('🚀 ~ billingFilters.forEach ~ filter:', filter)
      if (filter.type === 'array' && filter.optionsSelected.length > 0) {
        mutateFilters[filter.key] = filter.optionsSelected
      } else if (
        filter.type === 'date' &&
        Object.keys(filter.optionsSelected || {}).length > 0
      ) {
        // validate if has dates property
        console.log(
          '🚀 ~ billingFilters.forEach ~ mutateFilters:',
          mutateFilters,
        )
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
    setFilters('billingFilters', properties)
    setCustomFilters({})
  }

  const { data: unique_values } = useFetchData({ url: 'billing/unique_values' })

  useEffect(() => {
    if (unique_values && Object.keys(unique_values).length > 0) {
      const properties = []
      for (const element of headersTable) {
        if (element.isFiltered) {
          let data = {
            name: element.name,
            value: null,
            key: element.keyOptions,
            type: element.filterType ?? 'text',
          }

          if (element.filterType === 'array') {
            const keyIndex = filters.findIndex(
              (item) => item.key === element.keyOptions,
            )

            if (keyIndex)
              data.optionsSelected =
                filters && (filters[keyIndex]?.optionsSelected ?? [])
            else data.optionsSelected = []

            data.options = unique_values[element.keyOptions] ?? []

            for (let i = 0; i < data.options.length; i++) {
              if (typeof data.options[i] === 'number') {
                data.options[i] = data.options[i].toString()
              } else {
                data.options[i] = capitalizeFirstLetter(data.options[i])
              }
            }
          }

          properties.push(data)
        }
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
          <Button onClick={clearFilters} color="secondary">
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
