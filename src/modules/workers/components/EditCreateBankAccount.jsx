import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types';

import Slot from '../../../components/Slot';
import { Button, useDisclosure } from '@nextui-org/react';
import { CardBase } from '../../../components/base';
import { EditCreateBankAccountModal } from './EditCreateBankAccountModal';
import { PlusIcon } from '../../../components/icons';

import axiosInstance from '../../../axios/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ToastNotification from '../../../lib/helpers/toast-notification';

export const EditCreateBankAccount = ({ itemId }) => {

    const [bankAccounts, setBankAccounts] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [editItem, setEditItem] = useState({});

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get(`/bank-accounts/worker/${itemId}`);
            setBankAccounts(data);
        } catch (error) {
            console.log('Error', error);
        } finally {
            setLoading(false);
        }
    }

    const sortItems = useMemo(() => (
        bankAccounts.sort((a, b) => {
            if (a.isMain && a.isActive) return -1;
            if (b.isMain && b.isActive) return 1;
            if (!a.isActive) return 1;
            if (!b.isActive) return -1;
            return 0;
        })
    ), [bankAccounts]);

    useEffect(() => {
        fetchData();
    }, []);


    const handlePatchAccount = async (property, item) => {
        if (item.isMain && property === 'isActive' && item.isActive) {
            (new ToastNotification('Debe cambiar la cuenta por otra principal')).showError();
            return;
        }

        try {
            let newValue = {
                bankName: item.bankName,
                cci: item.cci,
                bankAccountNumber: item.bankAccountNumber,
                AccountType: item.AccountType,
                isActive: item.isActive,
                isMain: item.isMain,
                workerId: itemId,
                [property]: !item[property]
            }

            await axiosInstance.patch(`/bank-accounts/bank/${item.id}`, newValue);

            (new ToastNotification('Cuenta principal actualizada')).showSuccess();
            fetchData();
        } catch (error) {
            console.log('Error', error);
            if (error.response.status === 400) (new ToastNotification(error.response.data.message)).showError();
            else (new ToastNotification('Error al crear la cuenta')).showError();
        }
    }

    const handleEditAccount = (item) => {
        setEditItem(item);
        onOpen();
    }

    return (
        <>
            {isOpen && <EditCreateBankAccountModal isOpen={isOpen} onOpenChange={onOpenChange} item={editItem} items={bankAccounts} parentId={itemId} fetchData={fetchData} />}

            <CardBase title='Cuentas bancarias' async={isLoading} skeletonlines={4}
            >
                <Slot slot="header">
                    <Button onPress={() => {
                        setEditItem({});
                        onOpen();
                    }} color="primary" endContent={<PlusIcon />}>Agregar</Button>
                </Slot>
                <Slot slot="body">
                    <div className='grid gap-4 overflow-y-auto max-h-[500px]'>
                        {sortItems.map((bankAccount, index) => (
                            <div key={index} className={'relative rounded-md px-4 bg-blue-400 grid gap-3 py-3'}>
                                <div className='flex justify-between'>
                                    <h3 className='text-lg font-bold'>{bankAccount.AccountType} - {bankAccount.bankName}</h3>
                                    <div className='flex bg-white rounded-md gap-1 px-1'>
                                        {bankAccount?.isActive &&
                                            <>
                                                <span className="text-lg text-blue-800 cursor-pointer active:opacity-50" onClick={() => handlePatchAccount('isMain', bankAccount)}>
                                                    {bankAccount.isMain ? <FontAwesomeIcon icon="fa-solid fa-star" /> : <FontAwesomeIcon icon="fa-regular fa-star" />}
                                                </span>
                                                <span className="text-lg text-blue-800 cursor-pointer active:opacity-50" onClick={() => handleEditAccount(bankAccount)}>
                                                    <FontAwesomeIcon icon="fa-regular fa-edit" />
                                                </span>
                                            </>
                                        }

                                        <span className="text-lg text-blue-800 cursor-pointer active:opacity-50" onClick={() => handlePatchAccount('isActive', bankAccount)}>
                                            {bankAccount.isActive ? <FontAwesomeIcon icon="fa-solid fa-trash" /> : <FontAwesomeIcon icon="fa-solid fa-trash-can-arrow-up" />}
                                        </span>
                                    </div>
                                </div>

                                <div className='grid md:grid-cols-2 grid-cols-1'>
                                    <p className='font-semibold'>Nro de cuenta </p><p>{bankAccount.bankAccountNumber}</p>
                                </div>
                                <div className='grid md:grid-cols-2 grid-cols-1'>
                                    <p className='font-semibold'>CCI </p><p>{bankAccount.cci}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Slot>
            </CardBase>
        </>
    )
}

EditCreateBankAccount.propTypes = {
    itemId: PropTypes.string.isRequired
}
