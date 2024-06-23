import React, { useEffect, useMemo, useState } from 'react'
import { Button, Chip, useDisclosure } from '@nextui-org/react';

import { Link, useNavigate, useParams } from 'react-router-dom';
import { EditWorkerModal, EditCreateEmergencyContact, FilesWorkers, EditCreateBankAccount } from '../components';
import { EditCreateContractWorker } from '../components/EditCreateContractWorker';
import { EditCreateCertification } from '../components/EditCreateCertification';
import { useFetchData } from '../../../hooks/useFetchData';
import { CardBase } from '../../../components/base';
import { GridDetailInfo } from '../../../components/GridDetailInfo';

export const WorkerDetailPage = () => {

    const navigate = useNavigate();

    const { id } = useParams();
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { loading, data, fetchData } = useFetchData({ url: `/workers/${id}` });

    const detailWorker = useMemo(() => {
        if (!!data) {
            return {
                'Nombre': data.name,
                'Apellido Pat': data.apPat,
                'Apellido Mat': data.apMat,
                'Cumpleaños': data.birthdate,
                'Tipo de documento': data.documentType,
                'Nro documento': data.documentNumber,
                'Cargo': data.charge,
                'Seniority': data.seniority,
                'Nivel de Ingles': data.englishLevel,
                'Celular': data.phoneNumber,
                'Correo': data.email,
                'Dirección': data.address,
                'Distrito': data.district,
                'Provincia': data.province,
                'Departamento': data.department,
                'Asignación': data.familiarAssignment,
                'Habilidades':
                    data.techSkills.map((item, index) => (
                        <div
                            key={index}
                            className="w-auto h-8 flex items-center justify-center text-white bg-blue-500
                                text-sm list-none rounded-lg py-2 px-1"
                        >
                            <span className="my-2 uppercase">{item}</span>
                        </div>
                    ))
                ,
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
        <div className='container bg-slate-100 ml-auto mr-auto'>
            {isOpen && <EditWorkerModal isOpen={isOpen} onOpenChange={onOpenChange} editItem={data} fetchData={() => { }} />}

            <div className='flex justify-between'>
                <Button onPress={onOpen} color="warning" className='mb-3' isDisabled={loading}>
                    Editar
                </Button>
                <Link to={`/workers`} >
                    Regresar
                </Link>
            </div>
            <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                <CardBase async={loading}>
                    <GridDetailInfo data={detailWorker} />
                </CardBase>

                <EditCreateContractWorker itemId={id} />
                <EditCreateBankAccount itemId={id} />
                {data && <FilesWorkers itemId={id} filesCount={data.filesCount || {}} fetchData={fetchData} />}
                <EditCreateCertification itemId={id} />
                <EditCreateEmergencyContact itemId={id} />
            </div>
        </div>
    );
}
