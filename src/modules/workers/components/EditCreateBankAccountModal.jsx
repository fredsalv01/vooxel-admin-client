import React, { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, Button, ModalFooter, select, Select } from '@nextui-org/react';
import { Formik, Form, Field } from 'formik';

import { InputBase, SelectBase } from '../../../components/base';
import ToastNotification from '../../../lib/helpers/toast-notification';
import { ACCOUNT_TYPES_BACKEND, BANKS_BACKEND } from '../../../lib/consts/general';
import * as Yup from 'yup';

import axiosInstance from '../../../axios/axios';

export const EditCreateBankAccountModal = ({ isOpen, onOpenChange, item = {}, items, parentId, fetchData }) => {
    const [title, setTitle] = useState('Agregar');

    const [initialValues, setInitialValues] = useState({
        bankName: '',
        AccountType: '',
        bankAccountNumber: '',
        cci: '',
    });

    const validationSchema = Yup.object({
        bankName: Yup.string().required(),
        AccountType: Yup.string().required(),
        bankAccountNumber: Yup.string().required(),
        cci: Yup.string().required(),
    });

    const handleSubmit = async (values, setSubmitting, onClose) => {
        console.log(JSON.stringify(values, null, 2));
        let isMain = false;

        // validate if item is empty, then create a new item by AccountType
        if (Object.keys(item).length === 0) {
            const itemExists = items.find((item) => item.AccountType === values.AccountType);
            if (!itemExists) isMain = true;


            const newValue = { ...values, workerId: parentId, isMain };

            try {
                setSubmitting(true);
                await axiosInstance.post('bank-accounts', newValue);
                (new ToastNotification('Cuenta creada correctamente')).showSuccess();
                fetchData();
                onClose();
            } catch (error) {
                if (error.response.status === 400) (new ToastNotification(error.response.data.message)).showError();
                else (new ToastNotification('Error al crear la cuenta')).showError();
                console.log('Error', error);
            } finally {
                setSubmitting(false);
            }

        } else {

            const itemExists = items.find((otherItem) => (otherItem.AccountType === values.AccountType));

            if (itemExists.id == item.id) {
                isMain = true
            }

            const newValue = { ...values, workerId: parentId };
            console.log("🚀 ~ handleSubmit ~ newValue:", newValue)

            try {
                setSubmitting(true);
                await axiosInstance.patch(`/bank-accounts/bank/${item.id}`, newValue);
                (new ToastNotification('Cuenta actualizada correctamente')).showSuccess();
                fetchData();
                onClose();
            } catch (error) {
                console.log('Error', error);
                if (error.response.status === 400) (new ToastNotification(error.response.data.message)).showError();
                else (new ToastNotification('Error al crear la cuenta')).showError();
            } finally {
                setSubmitting(false);

            }
        };
    }

    useEffect(() => {
        if (Object.keys(item).length > 0) {
            setTitle('Editar');

            setInitialValues({
                bankName: item.bankName,
                AccountType: item.AccountType,
                bankAccountNumber: item.bankAccountNumber,
                cci: item.cci
            })
        }
    }, []);

    return (
        <Modal size="xl" placement="top-center" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='inside'>
            <ModalContent>
                {(onClose) => (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting, onClose)}
                        enableReinitialize
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <ModalHeader className="text-2xl">{title} cuenta bancaria</ModalHeader>
                                <ModalBody>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="col-span-1">
                                            <Field
                                                name="bankName"
                                                label="Nombre del banco"
                                                component={SelectBase}
                                                options={BANKS_BACKEND}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Field
                                                name="AccountType"
                                                label="Tipo de cuenta"
                                                component={SelectBase}
                                                options={ACCOUNT_TYPES_BACKEND}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Field
                                                name="bankAccountNumber"
                                                label="Nro. de cuenta"
                                                component={InputBase}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Field
                                                name="cci"
                                                label="Nro. de cuenta interbancaria (cci)"
                                                type="text"
                                                component={InputBase}
                                            />
                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" type='submit' isLoading={isSubmitting} size="lg">
                                        Guardar
                                    </Button>
                                </ModalFooter>
                            </Form>
                        )}
                    </Formik>
                )}
            </ModalContent>
        </Modal>
    )
}