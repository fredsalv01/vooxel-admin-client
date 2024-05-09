import React, { useEffect, useState } from 'react'
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
    Tabs,
    Tab,
    Card,
    CardBody,
    Select,
    SelectItem,
    Tooltip
} from '@nextui-org/react'
import { PlusIcon } from '../../../components/icons/PlusIcon'
import { VerticalDotsIcon } from '../../../components/icons/VerticalDotsIcon'
import { SearchIcon } from '../../../components/icons/SearchIcon'
import { ChevronDownIcon } from '../../../components/icons/ChevronDownIcon'
import { headersTable } from '../utils/table-props'
import { capitalize } from '../../../lib/helpers/utils'
import { CreateUserModal, EditUserModal } from '../components'
import { useQuery } from '@tanstack/react-query';
import { EditIcon } from '../../../components/icons'

const INITIAL_VISIBLE_COLUMNS = [
    "username",
    "email",
    "firstName",
    "lastName",
    "actions"
]

export const UserList = () => {
    const [inputSearch, setInputSearch] = useState();
    const [listItems, setListItems] = useState([]);
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]))

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onOpenChange: onOpenChangeEdit } = useDisclosure();
    const [selectedItemId, setSelectedItemId] = useState(null);

    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS))

    const showHeadersTable = React.useMemo(() => {
        if (visibleColumns === 'all') return headersTable
        return headersTable.filter((column) => Array.from(visibleColumns).includes(column.uid))
    }, [visibleColumns])

    const [perPage, setPerPage] = useState(100);
    const [pages, setPages] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);


    const { data, isFetching, refetch, isSuccess } = useQuery({
        queryKey: ['users', perPage],
        queryFn: async () => {
            const { data } = await axios.get('users', {
                params: {
                    isActive: true,
                    page: currentPage,
                    limit: perPage,
                }
            })
            return data
        }
    });

    useEffect(() => {
        if (isSuccess) {
            const { items, meta } = data;
            setListItems(items);
            setPerPage(meta.perPage);
            setPages(meta.pages);
            setTotalPages(meta.totalPages);
            setCurrentPage(meta.currentPage);
        }
    }, [isSuccess, data])


    const handleEditUser = (id) => {
        console.log("🚀 ~ handleEditUser ~ id:", id)
        setSelectedItemId(id);
        onOpenEdit();
    };

    const handleDeleteUser = (id) => {
        console.log("🚀 ~ handleDeleteUser ~ id:", id)
    }


    const renderCell = React.useCallback((item, columnKey) => {
        const cellValue = item[columnKey]

        switch (columnKey) {
            case 'name':
                return (
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
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Editar">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEditUser(item.id)}>
                                <EditIcon />
                            </span>
                        </Tooltip>
                        {/* <Tooltip color="danger" content="Delete user">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDeleteUser(item.id)}>
                                <DeleteIcon />
                            </span>
                        </Tooltip> */}
                    </div>
                );
            default:
                return cellValue
        }
    }, [selectedItemId, handleEditUser, handleDeleteUser])

    let timer = null
    const onSearchChange = React.useCallback((value) => {
        setInputSearch(value)
        clearTimeout(timer)
        timer = setTimeout(() => {
            refetch()
        }, 1000)
    }, [inputSearch])

    const topContent = React.useMemo(() => {
        return (

            <div className="flex flex-wrap md:flex-nowrap gap-3">
                <Input
                    isClearable
                    placeholder="Buscar..."
                    startContent={<SearchIcon />}
                    value={inputSearch}
                    onClear={() => onClear()}
                    onValueChange={onSearchChange}
                    type="search"
                />
                <div className="flex gap-3 justify-end">
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
                            {headersTable.map((column) => (
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
        )
    }, [visibleColumns, listItems.length, onSearchChange])

    const bottomContent = React.useMemo(() => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="col-span-1 flex">
                    <Select
                        className='w-36'
                        labelPlacement={'outside-left'}
                        label="Nro por página"
                        defaultSelectedKeys={["5"]}
                        onChange={(selected) => {
                            setPerPage(selected.target.value);
                            refetch();
                        }}
                    >
                        {[5, 10, 15].map((item) => (
                            <SelectItem key={item} value={item}>
                                {item.toString()}
                            </SelectItem>
                        ))}
                    </Select>
                </div>

                <div className="col-span-1 flex items-center">
                    <Pagination color="primary" page={perPage} total={totalPages} onChange={setPerPage} />
                </div>
            </div>
        )
    }, [])

    return (
        <>
            {/* Modal para crear colaborador */}
            {isOpen && <CreateUserModal isOpen={isOpen} onOpenChange={onOpenChange} fetchData={refetch} />}
            {isOpenEdit && <EditUserModal isOpen={isOpenEdit} onOpenChange={onOpenChangeEdit} itemId={selectedItemId} fetchData={refetch} />}
            <Table
                aria-label="Example table with custom cells, pagination and sorting"
                isHeaderSticky
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: 'max-h-[382px]'
                }}
                selectedKeys={selectedKeys}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
            >
                <TableHeader columns={showHeadersTable}>
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
                <TableBody emptyContent={'No data'} items={listItems}>
                    {(item) => (
                        <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}
