import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { TableBottomContent, TableTopContent } from '../../../components/base';

const INITIAL_VISIBLE_COLUMNS = [
    "username",
    "email",
    "firstName",
    "lastName",
    "actions"
]

const headersTable = [
    { name: 'Usuario', uid: 'username', sortable: true },
    { name: 'Correo', uid: 'email', sortable: true },
    { name: 'Nombre(s)', uid: 'firstName', sortable: true },
    { name: 'Apellidos', uid: 'lastName', sortable: true },
    { name: 'Acciones', uid: 'actions' }
]

export const ClientServiceList = () => {

    const [listItems, setListItems] = useState([]);

    const [selectedKeys, setSelectedKeys] = useState(new Set([]))

    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS))

    const showHeadersTable = React.useMemo(() => {
        if (visibleColumns === 'all') return headersTable
        return headersTable.filter((column) => Array.from(visibleColumns).includes(column.uid))
    }, [visibleColumns])

    return (
        <Table
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky
            bottomContent={<TableBottomContent />}
            bottomContentPlacement="outside"
            classNames={{
                wrapper: 'max-h-[382px]'
            }}
            selectedKeys={selectedKeys}
            topContent={<TableTopContent />}
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
    )
}
