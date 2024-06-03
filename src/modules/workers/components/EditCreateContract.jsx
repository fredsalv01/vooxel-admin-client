import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types';

import { CardBase } from '../../../components/base'
import { Button, ButtonGroup, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from '@nextui-org/react'
import { DownloadCloud, EditIcon, PlusIcon } from '../../../components/icons';
import Slot from '../../../components/Slot';
import InternationalizationDate from '../../../lib/helpers/internationalization-date';

import { useFetchData } from '../../../hooks/useFetchData';
import { EditCreateContractModal } from './EditCreateContractModal';
import { useUploadFile } from '../../../hooks/useUploadFile';

export const EditCreateContract = ({ itemId }) => {

    const { data, isLoading, fetchData } = useFetchData({ url: `/contract-workers/${itemId}` });
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [editItem, setEditItem] = useState({});

    const [rows, setRows] = useState([]);

    const { getFileInfo, isLoading: isLoadingFile } = useUploadFile({ tableName: 'contractWorkers' });

    useEffect(() => {
        if (!!data) {
            const newRows = data.map((item, index) => {
                return {
                    ...item,
                }
            });
            setRows(newRows);
        }
    }, [data]);

    const columns = [
        {
            key: "hiringDate",
            label: "Fecha inicio",
        },
        {
            key: "endDate",
            label: "Fecha fin",
        },
        {
            key: "contractType",
            label: "Tipo de contrato",
        },
        {
            key: "actions",
            label: "Acciones",
        },
    ];

    const renderCell = useCallback((item, columnKey) => {
        const cellValue = item[columnKey]

        switch (columnKey) {
            case 'hiringDate':
            case 'endDate':
                return InternationalizationDate().formatDate(new Date(cellValue));

            case 'contractType':
                return (<div className='text-xs'>
                    {cellValue}
                </div>);
            case 'actions':
                return (
                    <div className='flex gap-2 justify-center'>
                        <ButtonGroup>
                            <Button isIconOnly color='white' className='p-0'>
                                <EditIcon />
                            </Button>
                            <Button isIconOnly color='white' onClick={getFileInfo({ tag: 'contract', rowTableId: item.id })} isLoading={isLoadingFile}>
                                <DownloadCloud />
                            </Button>
                        </ButtonGroup>
                    </div>
                )
            default:
                return cellValue;
        }
    });

    const classNames = useMemo(
        () => ({
            wrapper: ["shadow-none", "p-0"],
            th: ["text-center"]
        }),
        [],
    );

    return (
        <>
            {isOpen && <EditCreateContractModal isOpen={isOpen} onOpenChange={onOpenChange} item={editItem} items={rows} parentId={itemId} fetchData={fetchData} />}
            <CardBase title='Contractos' async={isLoading} skeletonlines={5}>
                <Slot slot="header">
                    <Button onPress={() => {
                        setEditItem({});
                        onOpen();
                    }} color="primary" endContent={<PlusIcon />}>Agregar</Button>
                </Slot>
                <Slot slot="body">
                    <Table aria-label="Example table with dynamic content" isStriped classNames={classNames}>
                        <TableHeader columns={columns}>
                            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                        </TableHeader>
                        <TableBody items={rows}>
                            {(item) => (
                                <TableRow key={item.key}>
                                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Slot>
            </CardBase>
        </>
    )
}

EditCreateContract.propTypes = {
    itemId: PropTypes.string.isRequired
}