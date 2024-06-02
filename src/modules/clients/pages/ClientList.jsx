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
// import { headersTable } from '../utils/table-props'
import { capitalize } from '../../../lib/helpers/utils'
// import { CreateUserModal, EditUserModal } from '../components'
import { useQuery } from '@tanstack/react-query';
import { EditIcon } from '../../../components/icons'
import { TableList } from '../../../components/base'
import { useQueryPromise } from '../../../hooks/useQueryPromise'

const columns = [
    { name: 'Nombre', uid: 'fullName' },
    { name: 'Razon social', uid: 'businessName' },
    { name: 'Ruc', uid: 'ruc' },
    { name: 'Celular', uid: 'phone' },
    { name: 'Correo', uid: 'email' },
    { name: 'Fecha inicio', uid: 'contractStartDate' },
    { name: 'Fecha fin', uid: 'contractEndDate' },
    { name: 'Acciones', uid: 'actions' }
]

const INITIAL_VISIBLE_COLUMNS = [
    'Nro',
    'fullName',
    'businessName',
    'ruc',
    'phone',
    'email',
    'contractStartDate',
    'contractEndDate',
    'actions'
]

export const ClientList = () => {

    const { data, isFetching, refetch, isSuccess } = useQueryPromise({ url: 'clients', key: 'clients' });


    const switchRenderCell = (item, columnKey) => {
        const cellValue = item[columnKey];
        switch (columnKey) {
            case 'fullName':
                return (
                    <div>{item.fullName}</div>
                )
            default:
                return cellValue;
        }
    }

    return (
        <>
            {/* Modal para crear colaborador */}
            {/* {isOpen && <CreateUserModal isOpen={isOpen} onOpenChange={onOpenChange} fetchData={refetch} />}
            {isOpenEdit && <EditUserModal isOpen={isOpenEdit} onOpenChange={onOpenChangeEdit} itemId={selectedItemId} fetchData={refetch} />} */}

            <TableList items={data?.items || []} columns={columns} switchFn={switchRenderCell} initialColumns={INITIAL_VISIBLE_COLUMNS} isLoading={isFetching} />
            {/* <Table
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
            </Table> */}
        </>
    )
}
