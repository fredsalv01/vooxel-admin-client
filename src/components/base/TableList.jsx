import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
    Spinner
} from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDownIcon, PlusIcon, SearchIcon } from '../icons';
import { capitalize } from '../../lib/helpers/utils';
import axios from 'axios';
import { TableTopContent } from './TableTopContent';
import { isSlot } from '../Slot';

export const TableList = ({ items = [], headersTable, initialColumns, switchFn, isLoading, children }) => {
    const topContentSlot = React.Children.toArray(children).find(child => isSlot('topContent', child));

    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(new Set(initialColumns));

    const headerColumns = useMemo(() => {
        if (visibleColumns === 'all') return headersTable;
        return headersTable.filter((header) => Array.from(visibleColumns).includes(header.uid));
    }, [visibleColumns, headersTable]);

    // Handler to update visible columns
    const handleVisibleColumnsChange = (newVisibleColumns) => {
        setVisibleColumns(newVisibleColumns);
    };

    const renderCell = useCallback((item, columnKey) => switchFn(item, columnKey), []);

    return (
        <>
            <Table
                aria-label="Example table with custom cells, pagination and sorting"
                isHeaderSticky
                // bottomContent={bottomContent}
                // bottomContentPlacement="outside"
                classNames={{
                    wrapper: 'max-h-[382px]'
                }}
                selectedKeys={selectedKeys}
                // sortDescriptor={sortDescriptor}
                topContent={
                    <TableTopContent visibleColumns={visibleColumns} headersTable={headerColumns} onVisibleColumnsChange={handleVisibleColumnsChange} >
                        {topContentSlot && topContentSlot.props.children}
                    </TableTopContent>
                }
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
            // onSortChange={setSortDescriptor}
            >
                <TableHeader columns={headerColumns} >
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
                <TableBody emptyContent={'Ningun colaborador encontrado'} items={items}
                    isLoading={isLoading}
                    loadingContent={<Spinner label="Loading..." />}
                >
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell key={columnKey}>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
};
