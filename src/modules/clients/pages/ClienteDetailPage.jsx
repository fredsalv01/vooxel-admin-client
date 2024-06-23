import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useFetchData } from '../../../hooks/useFetchData';
import { Button, Chip, useDisclosure } from '@nextui-org/react';
import { EditClientModal, EditCreateContractClient } from '../components';
import { CardBase } from '../../../components/base';
import { GridDetailInfo } from '../../../components/GridDetailInfo';

export const ClienteDetailPage = () => {

    const { id } = useParams();

    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const { loading, data, fetchData } = useFetchData({ url: `/clients/${id}` });

    const detailClient = useMemo(() => {
        if (!!data) {
            return {
                'Nombre': data.fullName,
                'Razón social': data.businessName,
                'RUC': data.ruc,
                'Celular': data.phone,
                'Correo electrónico': data.email,
                'Estado':
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={data.isActive ? 'success' : 'danger'}
                        size="md"
                        variant="dot"
                    >

                        {data.isActive ? 'Activo' : 'Inactivo'}
                    </Chip>
            }
        }
    }, [data])

    return (
        <div className='container bg-blue-100'>
            {isOpen && <EditClientModal isOpen={isOpen} onOpenChange={onOpenChange} editItem={data} fetchData={fetchData} />}

            <div className='flex flex-wrap'>
                <h2 className='flex-1 text-2xl font-semibold'>Perfil del cliente</h2>

                <Button onPress={onOpen} color="warning" className='my-3'>
                    Editar
                </Button>
            </div>

            <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                <CardBase async={loading}>
                    <GridDetailInfo data={detailClient} />
                </CardBase>

                <EditCreateContractClient itemId={id} />
            </div>

        </div>
    )
}
