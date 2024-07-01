import React, { useEffect, useState } from 'react'
import {
    Button,
    useDisclosure,
} from '@nextui-org/react'
import { PlusIcon } from '../../../components/icons/PlusIcon'
import { CreateClientModal } from '../components'
import { TableList } from '../../../components/base'
import { useQueryPromise } from '../../../hooks/useQueryPromise'
import Slot from '../../../components/Slot'
import { EditIcon } from '../../../components/icons'
import { useFetchData } from '../../../hooks/useFetchData'
import { Link } from 'react-router-dom'



const headersTable = [
    { name: 'Nombre', uid: 'fullName' },
    { name: 'Razon social', uid: 'businessName' },
    { name: 'Ruc', uid: 'ruc' },
    { name: 'Celular', uid: 'phone' },
    { name: 'Correo', uid: 'email' },
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
    const { data, isFetching, refetch, isSuccess, paginationProps, updatingList, setQuerSearch } = useQueryPromise({ url: 'clients', key: 'clients' });

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const switchRenderCell = (item, columnKey) => {
        const cellValue = item[columnKey];
        switch (columnKey) {
            case 'fullName':
                return (
                    <div>{item.fullName}</div>
                )
            case 'actions':
                return (
                    <Link to={`/clients/${item.id}/detail`} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <EditIcon />
                    </Link>
                )
            default:
                return cellValue;
        }
    }

    return (
        <>
            {/* Modal para crear cliente */}
            {isOpen && <CreateClientModal isOpen={isOpen} onOpenChange={onOpenChange} fetchData={refetch} />}

            <TableList items={data?.items || []} headersTable={headersTable} switchFn={switchRenderCell} initialColumns={INITIAL_VISIBLE_COLUMNS} isLoading={isFetching} paginationProps={paginationProps}
                updatingList={updatingList} setQuerSearch={setQuerSearch}
            >
                <Slot slot="topContent">
                    <Button onPress={onOpen} color="primary" endContent={<PlusIcon />} onClick={onOpen}>
                        Agregar
                    </Button>
                </Slot>
            </TableList>
        </>
    )
}
