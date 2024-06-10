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
import { CreateClientModal } from '../components'
import { TableList } from '../../../components/base'
import { useQueryPromise } from '../../../hooks/useQueryPromise'
import Slot from '../../../components/Slot'
import { EditIcon } from '../../../components/icons'



const headersTable = [
    { name: 'Nombre', uid: 'fullName' },
    { name: 'Razon social', uid: 'businessName' },
    { name: 'Ruc', uid: 'ruc' },
    { name: 'Celular', uid: 'phone' },
    { name: 'Correo', uid: 'email' },
    // { name: 'Fecha inicio', uid: 'contractStartDate' },
    // { name: 'Fecha fin', uid: 'contractEndDate' },
    { name: 'Acciones', uid: 'actions' }
]

const INITIAL_VISIBLE_COLUMNS = [
    'Nro',
    'fullName',
    'businessName',
    'ruc',
    'phone',
    'email',
    'actions'
]

export const ClientList = () => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { data, isFetching, refetch, isSuccess } = useQueryPromise({ url: 'clients', key: 'clients' });
    const switchRenderCell = (item, columnKey) => {
        const cellValue = item[columnKey];
        switch (columnKey) {
            case 'fullName':
                return (
                    <div>{item.fullName}</div>
                )
            case 'actions':
                return (
                    <a href={`/clients/${item.id}/detail`} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <EditIcon />
                    </a>
                )
            default:
                return cellValue;
        }
    }

    return (
        <>
            {/* Modal para crear cliente */}
            {isOpen && <CreateClientModal isOpen={isOpen} onOpenChange={onOpenChange} fetchData={refetch} />}

            <TableList items={data?.items || []} headersTable={headersTable} switchFn={switchRenderCell} initialColumns={INITIAL_VISIBLE_COLUMNS} isLoading={isFetching} >
                <Slot slot="topContent">
                    <Button onPress={onOpen} color="primary" endContent={<PlusIcon />} onClick={onOpen}>
                        Agregar
                    </Button>
                </Slot>
            </TableList>
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
                <TableHeader headersTable={showHeadersTable}>
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
