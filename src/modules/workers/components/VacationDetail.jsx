import { Button, Divider, Input } from '@nextui-org/react';
import React, { useMemo, useState, useEffect } from 'react';
import { ToastNotification } from '../../../lib/helpers/toast-notification-temp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const VacationDetail = ({ row, indexRow, onChangeForm, onDeleteRow, form }) => {
    const [item, setItem] = useState(row);
    const [settingDays, setSettingDays] = useState(false);
    const [manualDays, setManualDays] = useState(item.days || 0);

    useEffect(() => {
        if (!settingDays) {
            setManualDays(calculateDays());
        }
    }, [item.startDate, item.endDate]);

    const handleChange = ({ target }) => {
        const { name, value } = target;

        if (name === 'days') {
            setSettingDays(true);
            setManualDays(value);
        } else {
            setSettingDays(false);
        }

        const newItem = {
            ...item,
            [name]: name == 'days' ? parseInt(value || 0) : value,
        };

        setItem(newItem);
        onChangeForm(newItem);
    };

    const checkDates = () => {
        const { startDate, endDate } = item;
        if (!startDate || !endDate) return false;

        const start = new Date(startDate);
        const end = new Date(endDate);
        return start <= end;
    }

    const calculateDays = () => {
        if (!checkDates()) return 0;
        if (item.startDate && item.endDate) {
            const startDate = new Date(item.startDate);
            const endDate = new Date(item.endDate);
            return Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        }
        return 0;
    };

    const deleteRow = () => {
        if (form.length > 1)
            onDeleteRow(indexRow);
        else
            ToastNotification.showError('No se puede eliminar la única fila');
    }

    const days = useMemo(() => {
        if (settingDays) {
            return manualDays;
        }
        return calculateDays();
    }, [item.startDate, item.endDate, settingDays, manualDays]);

    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Input
                    label='Fecha de inicio'
                    type='date'
                    name='startDate'
                    value={item.startDate}
                    onChange={(e) => handleChange(e)}
                    error
                />
                <Input
                    label='Fecha de Fin'
                    type='date'
                    name='endDate'
                    value={item.endDate}
                    onChange={(e) => handleChange(e)}
                />


                <div className='grid grid-cols-2 md:grid-cols-12 gap-4'>
                    <div className='md:col-span-8'>
                        <Input
                            label='Cant. de días'
                            type='number'
                            name='days'
                            value={days}
                            onChange={(e) => handleChange(e)}
                        />
                    </div>

                    <div className='md:col-span-4 flex items-center justify-center'>
                        <Button type='button' onClick={deleteRow} isIconOnly className='bg-white'>
                            <span className='text-danger'>
                                <FontAwesomeIcon icon="fa-solid fa-trash" />
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
            <Divider></Divider>
        </>
    );
};
