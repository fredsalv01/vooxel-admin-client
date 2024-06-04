import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardFooter, CardHeader, useDisclosure } from '@nextui-org/react';

import { useNavigate, useParams } from 'react-router-dom';
import { EditIcon } from '../../../components/icons';
import { EditWorkerModal, EditCreateEmergencyContact, FilesWorkers, EditCreateBankAccount } from '../components';
import axios from '../../../axios/axios';
import { EditCreateContract } from '../components/EditCreateContract';
import { EditCreateCertification } from '../components/EditCreateCertification';

export const DetailWorkerPage = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const navigate = useNavigate();

    const { id } = useParams();

    const [item, setItem] = useState(null);

    useEffect(() => {
        const getItemToEdit = async () => {
            const { data } = await axios.get(`/workers/${id}`);
            setItem(data);
        }
        getItemToEdit();
    }, []);

    return (
        <div className='container bg-slate-100 ml-auto mr-auto'>
            {isOpen && <EditWorkerModal isOpen={isOpen} onOpenChange={onOpenChange} editItem={item} fetchData={() => { }} />}

            <Button onPress={onOpen} color="warning" className='mb-3'>
                Editar
            </Button>
            <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                {/* <p>Nombre: {item?.name}</p>
                    <p>Apellidos: {`${item?.apPat} ${item?.apMat}`}</p>
                    <p>Cumpleaños: {item?.birthdate} </p>
                    <p>Tipo de documento": {item?.documentType}</p>
                    <p>Nro de documento": "72557613",</p>
                    <p>Cargo: {item?.charge} </p>
                    <p>Nivel de Inglés: {item?.englishLevel} </p>
                    <p>Tipode contrato: {item?.contractType} </p>
                    <p>Fecha de contratación: {item?.hiringDate} </p>
                    <p>Fecha de partida: {item?.leaveDate} </p>
                    <p>Celular: {item?.phoneNumber} </p>
                    <p>Dirección: {item?.address} </p>
                    <p>Distrito: {item?.district} </p>
                    <p>Provincia: {item?.province} </p>
                    <p>Departamento: {item?.department} </p>
                    <p>Asignación familiar: {item?.familiarAssignment} </p>
                    <p>Habilidades blandas: {item?.techSkills} </p>
                    <p> Estado: {item?.isActive ? 'Activo' : 'Inactivo'} </p> */}

                {/* Se debe asignar despues */}
                {/* <p>Cuenta bancaria: {item?.bankAccount?.bankName} </p>
                    <p>Supervisor: {item?.chiefOfficer}</p>
                    <p>Clientes: {item?.client} </p> */}

                <EditCreateContract itemId={id} />
                <EditCreateBankAccount itemId={id} />
                <FilesWorkers itemId={id} />
                <EditCreateCertification itemId={id} />
                <EditCreateEmergencyContact itemId={id} />
            </div>
        </div>
    );
}
