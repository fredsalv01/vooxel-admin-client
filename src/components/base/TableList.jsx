
import React from 'react'

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
    useDisclosure
} from '@nextui-org/react'

export default function TableList({ url }) {

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get('items', {
                    params: queryParams
                })
                const formatData = data.data.map((item) => {
                    return {
                        ...item,
                        chiefOfficerName: item.chiefOfficer !== null ? item.chiefOfficer.name : 'Ninguno'
                    }
                })
                setItem(formatData)
            } catch (error) {
                console.log('Error:', error)
            } finally {
                setLoading(false) // Update loading state in case of error
            }
        }

        fetchData()
    }, [])

    const [filterValue, setFilterValue] = React.useState('')
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]))
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS))
    const [statusFilter, setStatusFilter] = React.useState('all')
    const [rowsPerPage, setRowsPerPage] = React.useState(3)
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: 'id',
        direction: 'descending'
    })
    const [page, setPage] = React.useState(1)

    const hasSearchFilter = Boolean(filterValue)

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === 'all') return columns

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid))
    }, [visibleColumns])

    const filteredItems = React.useMemo(() => {
        if (!Array.isArray(items)) return [] // Ensure items is an array before filtering

        let filteredItem = [...items]

        if (loading) return [] // Return empty array if still loading

        if (hasSearchFilter) {
            filteredItem = filteredItem.filter((item) => {
                if (item.name.toLowerCase().includes(filterValue.toLowerCase())) {
                    return items
                } else if (item.apPat.toLowerCase().includes(filterValue.toLowerCase())) {
                    return items
                } else if (item.documentType.toLowerCase().includes(filterValue.toLowerCase())) {
                    return items
                } else if (item.charge.toLowerCase().includes(filterValue.toLowerCase())) {
                    return items
                } else if (item.documentNumber.toLowerCase().includes(filterValue.toLowerCase())) {
                    return items
                }
            })
        }
        if (statusFilter !== 'all' && Array.from(statusFilter).length !== statusOptions.length) {
            filteredItem = filteredItem.filter((item) => Array.from(statusFilter).includes(item.status))
        }

        return filteredItem
    }, [items, filterValue, statusFilter, loading])

    const pages = Math.ceil(filteredItems.length / rowsPerPage)

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage
        const end = start + rowsPerPage

        return filteredItems.slice(start, end)
    }, [page, filteredItems, rowsPerPage])

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column]
            const second = b[sortDescriptor.column]
            const cmp = first < second ? -1 : first > second ? 1 : 0

            return sortDescriptor.direction === 'descending' ? -cmp : cmp
        })
    }, [sortDescriptor, items])

    const renderCell = React.useCallback((item, columnKey) => {
        const cellValue = item[columnKey]

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
                    <div>{item.name}</div>
                )
            case 'apPat':
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{cellValue}</p>
                        <p className="text-bold text-tiny capitalize text-default-400">{item.apPat}</p>
                    </div>
                )
            case 'charge':
                return (
                    <div>{item.charge}</div>
                    // <Chip className="capitalize" color={statusColorMap[item.status]} size="sm" variant="flat">
                    //   {cellValue}
                    // </Chip>
                )
            case 'actions':
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem>Mostrar</DropdownItem>
                                <DropdownItem>Editar</DropdownItem>
                                <DropdownItem>Desactivar</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                )
            default:
                return cellValue
        }
    }, [])

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1)
        }
    }, [page, pages])

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1)
        }
    }, [page])

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value))
        setPage(1)
    }, [])

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value)
            setPage(1)
        } else {
            setFilterValue('')
        }
    }, [])

    const onClear = React.useCallback(() => {
        setFilterValue('')
        setPage(1)
    }, [])

    const topContent = React.useMemo(() => {
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
                        onValueChange={onSearchChange}
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
                                onSelectionChange={setVisibleColumns}
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
                    <span className="text-default-400 text-small">Total de Colaboradores: {items.length}</span>
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
    }, [filterValue, statusFilter, visibleColumns, onRowsPerPageChange, items.length, onSearchChange, hasSearchFilter])

    const bottomContent = React.useMemo(() => {
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
                {(column,) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === 'actions' ? 'center' : 'start'}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={'Ningun colaborador encontrado'} items={sortedItems}>
                {(item) => (
                    <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
                )}
            </TableBody>
        </Table>
    )
}
