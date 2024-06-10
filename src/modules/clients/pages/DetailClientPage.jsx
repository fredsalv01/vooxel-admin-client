import React from 'react'
import { useParams } from 'react-router-dom'
import { useFetchData } from '../../../hooks/useFetchData';
import { Button, useDisclosure } from '@nextui-org/react';
import { EditClientModal } from '../components';

export const DetailClientPage = () => {

    const { id } = useParams();

    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const { loading, error, data, fetchData } = useFetchData({ url: `/clients/${id}` });

    return (
        <div className='flex flex-col'>
            {isOpen && <EditClientModal isOpen={isOpen} onOpenChange={onOpenChange} editItem={data} fetchData={fetchData} />}
            <div>DetailClientPage</div>

            <Button onPress={onOpen} color="warning" className='my-3'>
                Editar
            </Button>

            {loading && <div>Cargando...</div>}
            {error && <div>Error: {error}</div>}
            {data && <div>{JSON.stringify(data, null, 2)}</div>}
        </div>
    )
}
