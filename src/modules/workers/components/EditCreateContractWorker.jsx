import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types';

import { CardBase } from '../../../components/base'
import { Button, ButtonGroup, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@nextui-org/react'
import { DownloadCloud, EditIcon, PlusIcon } from '../../../components/icons';
import Slot from '../../../components/Slot';
import InternationalizationDate from '../../../lib/helpers/internationalization-date';

import { useFetchData } from '../../../hooks/useFetchData';
import { EditCreateContractWorkerModal } from './EditCreateContractWorkerModal';
import { useUploadFile } from '../../../hooks/useUploadFile';
import { NO_HAS_FILES, TABLE_NAME_FILES, TAGS_FILES } from '../../../lib/consts/general';

export const EditCreateContractWorker = ({ itemId }) => {

    const { data, isLoading, fetchData } = useFetchData({ url: `/contract-workers/${itemId}` });
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [editItem, setEditItem] = useState({});

    const [rows, setRows] = useState([]);

    const { getFileInfo, isLoading: isLoadingFile } = useUploadFile({ tableName: TABLE_NAME_FILES.contractWorkers });

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
            key: "isActive",
            label: "Estado",
        },
        {
            key: "actions",
            label: "Acciones",
        },
    ];


    const handleEditContract = (item) => {
        setEditItem(item);
        onOpen();
    }

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
            case 'isActive':
                return (<Chip
                    className="capitalize border-none gap-1 text-default-600"
                    color={cellValue ? 'success' : 'danger'}
                    size="sm"
                    variant="dot"
                >

                    {cellValue ? 'Activo' : 'Inactivo'}
                </Chip>)
            case 'actions':
                return (
                    <div className='flex justify-center'>
                        <ButtonGroup>
                            {item.isActive && <Button isIconOnly color='white' className='p-0' onClick={() => handleEditContract(item)}>
                                <EditIcon />
                            </Button>}
                            <Button isIconOnly color='white' onClick={getFileInfo({ tag: TAGS_FILES.contract, rowTableId: item.id })} isLoading={isLoadingFile}
                                isDisabled={![NO_HAS_FILES].includes(item.file)}
                            >
                                <DownloadCloud currentColor={[NO_HAS_FILES].includes(item.file) ? '#00abfb' : '#d1d5db'} />
                            </Button>
                        </ButtonGroup>
                    </div>
                )
            default:
                return cellValue;
        }
    }, [rows]);

    const classNames = useMemo(
        () => ({
            wrapper: ["shadow-none", "p-0"],
            th: ["text-center"]
        }),
        [],
    );

    return (
        <>
            {isOpen && <EditCreateContractWorkerModal isOpen={isOpen} onOpenChange={onOpenChange} item={editItem} items={rows} parentId={itemId} fetchData={fetchData} />}
            <CardBase title='Contratos' async={isLoading} skeletonlines={5}>
                <Slot slot="header">
                    <Button size='sm' onPress={() => {
                        setEditItem({});
                        onOpen();
                    }} color="primary" endContent={<PlusIcon />}>Agregar</Button>
                </Slot>
                <Slot slot="body">
                    <Table aria-label="Table worker's contracts" isStriped classNames={classNames}>
                        <TableHeader columns={columns}>
                            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                        </TableHeader>
                        <TableBody items={rows}>
                            {(item) => (
                                <TableRow key={item.id}>
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

EditCreateContractWorker.propTypes = {
    itemId: PropTypes.string.isRequired
}