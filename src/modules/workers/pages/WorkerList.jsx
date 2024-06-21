import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import axios from '../../../axios/axios'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  useDisclosure,
  Spinner,
  Tooltip
} from '@nextui-org/react'
import { ChevronDownIcon, PlusIcon, SearchIcon, EditIcon } from '../../../components/icons'
import { statusOptions } from '../../../utils/data-types/data'
import { capitalize } from '../../../lib/helpers/utils'
import { CreateWorkerModal } from '../components'
import debounce from 'lodash.debounce';

const columns = [
  { name: 'Nro', uid: 'nro' },
  { name: 'Nombre(s)', uid: 'name' },
  { name: 'Apellidos', uid: 'apPat' },
  { name: 'Cargo', uid: 'charge' },
  { name: 'Tipo de Documento', uid: 'documentType' },
  { name: 'Numero de Documento', uid: 'documentNumber' },
  { name: 'Jefe Directo', uid: 'chiefOfficerName' },
  { name: 'Tipo de Contrato', uid: 'contractType' },
  { name: 'habilidades', uid: 'techSkills' },
  { name: 'Acciones', uid: 'actions' }
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
  'actions'
]

export const WorkerList = () => {
  const [loading, setLoading] = useState(true)
  const [workers, setWorkers] = useState([])
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const searchRef = useRef(true);

  const queryParams = {
    isActive: true,
    limit: 0, // Número máximo de resultados por página
    page: 1, // Número de página
    input: ''
  }

  const [filterValue, setFilterValue] = useState('')
  const [selectedKeys, setSelectedKeys] = useState(new Set([]))
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS))
  const [statusFilter, setStatusFilter] = useState('all')
  const [rowsPerPage, setRowsPerPage] = useState(3)
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'id',
    direction: 'descending'
  })
  const [page, setPage] = useState(1)

  async function fetchData(searchQuery) {
    try {
      setLoading(true)
      const { data } = await axios.get('workers', {
        params: { ...queryParams, input: searchQuery || '' }
      })
      const { items, meta } = data;
      const formatData = items.map((worker) => {
        return {
          ...worker,
          chiefOfficerName: worker.chiefOfficer !== null ? worker.chiefOfficer.name : 'Ninguno',
        }
      })
      setWorkers(formatData)
    } catch (error) {
      console.log('Error:', error)
    } finally {
      setLoading(false) // Update loading state in case of error
    }
  }

  const debouncedFetchResults = useCallback(
    debounce((searchQuery) => fetchData(searchQuery), 200),
    []
  );


  useEffect(() => {
    if (filterValue) {
      console.log("🚀 ~ useEffect ~ filterValue:", filterValue)
      debouncedFetchResults(filterValue);
    } else {
      fetchData();
    }
  }, [filterValue, debouncedFetchResults])

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid))
  }, [visibleColumns])

  const filteredItems = useMemo(() => {
    if (!Array.isArray(workers)) return [] // Ensure workers is an array before filtering

    let filteredWorkers = [...workers]

    if (loading) return [] // Return empty array if still loading

    if (hasSearchFilter) {
      filteredWorkers = filteredWorkers.filter((worker) => {
        if (worker.name.toLowerCase().includes(filterValue.toLowerCase())) {
          return workers
        } else if (worker.apPat.toLowerCase().includes(filterValue.toLowerCase())) {
          return workers
        } else if (worker.documentType.toLowerCase().includes(filterValue.toLowerCase())) {
          return workers
        } else if (worker.charge.toLowerCase().includes(filterValue.toLowerCase())) {
          return workers
        } else if (worker.documentNumber.toLowerCase().includes(filterValue.toLowerCase())) {
          return workers
        }
      })
    }
    if (statusFilter !== 'all' && Array.from(statusFilter).length !== statusOptions.length) {
      filteredWorkers = filteredWorkers.filter((worker) => Array.from(statusFilter).includes(worker.status))
    }

    return filteredWorkers
  }, [workers, filterValue, statusFilter, loading])

  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  // const sortedItems = useMemo(() => {
  //   return [...items].sort((a, b) => {
  //     const first = a[sortDescriptor.column]
  //     const second = b[sortDescriptor.column]
  //     const cmp = first < second ? -1 : first > second ? 1 : 0

  //     return sortDescriptor.direction === 'descending' ? -cmp : cmp
  //   })
  // }, [sortDescriptor, items])


  const renderCell = useCallback((worker, columnKey) => {
    const cellValue = worker[columnKey]

    switch (columnKey) {
      case 'name':
        return (
          // <User
          //   avatarProps={{radius: "lg", src: user.avatar}}
          //   description={user.email}
          //   name={cellValue}
          // >
          //   {user.email}
          // </User>
          <div>{worker.name}</div>
        )
      case 'apPat':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-tiny capitalize">{worker.apPat}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{worker.apMat}</p>
          </div>
        )
      case 'charge':
        return (
          <div>{worker.charge}</div>
          // <Chip className="capitalize" color={statusColorMap[worker.status]} size="sm" variant="flat">
          //   {cellValue}
          // </Chip>
        )
      case 'contractType':
        return (
          (worker.contractType === 'No tiene contrato') ? (<div className="text-red-600">No tiene contrato</div>) :
            (<div className="text-xs">{worker.contractType}</div>)
        )
      case 'actions':
        return (
          <div className="relative flex justify-center items-center gap-2">
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


            <a href={`/workers/${worker.id}/detail`} className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon />
            </a>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1)
    }
  }, [page, pages])

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1)
    }
  }, [page])

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value))
    setPage(1)
  }, [])

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value)
      setPage(1)
    } else {
      setFilterValue('')
    }
  }, [])

  const onClear = useCallback(() => {
    setFilterValue('')
    setPage(1)
  }, [])

  const handleChange = (e) => {
    console.log("🚀 ~ handleChange ~ e:", e)
    setFilterValue(e);
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por campo..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={handleChange}
          />
          <div className="flex gap-3">
            {/* <Dropdown>
                <DropdownTrigger className="hidden sm:flex">
                  <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                    Cargo
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Table Columns"
                  closeOnSelect={false}
                  selectedKeys={statusFilter}
                  selectionMode="multiple"
                  onSelectionChange={setStatusFilter}
                >
                  {statusOptions.map((status) => (
                    <DropdownItem key={status.uid} className="capitalize">
                      {capitalize(status.name)}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown> */}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columnas
                </Button>
              </DropdownTrigger>

              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={
                  setVisibleColumns
                }
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button onPress={onOpen} color="primary" endContent={<PlusIcon />}>
              Agregar
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total de Colaboradores: {workers.length}</span>
          <label className="flex items-center text-default-400 text-small">
            Filas por pagina:
            <select className="bg-transparent outline-none text-default-400 text-small" onChange={onRowsPerPageChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </label>
        </div>
      </div>
    )
  }, [filterValue, statusFilter, visibleColumns, onRowsPerPageChange, workers.length, onSearchChange, hasSearchFilter])

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === 'all'
            ? 'Todos los items seleccionados'
            : `${selectedKeys.size} de ${filteredItems.length} Seleccionados`}
        </span>
        <Pagination isCompact showControls showShadow color="primary" page={page} total={pages} onChange={setPage} />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Anterior
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Siguiente
          </Button>
        </div>
      </div>
    )
  }, [selectedKeys, items.length, page, pages, hasSearchFilter])

  return (
    <>
      {/* Modal para crear colaborador */}
      {isOpen && <CreateWorkerModal isOpen={isOpen} onOpenChange={onOpenChange} fetchData={fetchData} />}
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: 'max-h-[382px]'
        }}
        selectedKeys={selectedKeys}
        // selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={'Ningun colaborador encontrado'} items={workers}
          isLoading={loading}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(item) => (
            <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
