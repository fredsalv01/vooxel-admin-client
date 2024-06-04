import React, { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, Button, ModalFooter, select, Select } from '@nextui-org/react';
import { Formik, Form, Field } from 'formik';

import { DatePickerBase, FileInputBase, InputBase, SelectBase } from '../../../components/base';
import ToastNotification from '../../../lib/helpers/toast-notification';
import { ACCOUNT_TYPES_BACKEND, BANKS_BACKEND } from '../../../lib/consts/general';
import * as Yup from 'yup';

import axiosInstance from '../../../axios/axios';
import { useUploadFile } from '../../../hooks/useUploadFile';

export const EditCreateContractModal = ({ isOpen, onOpenChange, item = {}, items, parentId, fetchData }) => {
    const [title, setTitle] = useState('Agregar');

    const [initialValues, setInitialValues] = useState({
        file: '',
        hiringDate: '',
        endDate: '',
        contractType: '',
    });

    const validationSchema = Yup.object({
        file: Yup.mixed().required(),
        hiringDate: Yup.string().required(),
        endDate: Yup.string().required(),
        contractType: Yup.string().required(),
    });


    const { handleFileChange, handleFileUpload, handleFileUpdated } = useUploadFile({ tableName: 'contractWorkers', goUpload: false });

    const handleSubmit = async (values, setSubmitting, onClose) => {
        // console.log(JSON.stringify(values, null, 2));

        const { file, ...restValues } = values
        const fileCreated = await handleFileUpload(file, 'contract');

        try {
            setSubmitting(true);
            const contractCreated = await axiosInstance.post(`contract-workers`, {
                ...restValues,
                workerId: parentId
            });

            (new ToastNotification('Contrato creado correctamente')).showSuccess();

            try {
                await handleFileUpdated({ fileId: fileCreated.id, updateTableId: contractCreated.data.id });
                fetchData();
                onClose();
            } catch (error) {
                console.log("Error updated File in contracts", error)
            }

        } catch (error) {
            console.log('Error creating contract', error);
            if (error.response.status === 400) (new ToastNotification(error.response.data.message)).showError();
            else (new ToastNotification('Error al crear el Contrato')).showError();
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        if (Object.keys(item).length > 0) {
            setTitle('Editar');

            setInitialValues({
                hiringDate: item.hiringDate,
                endDate: item.endDate,
                contractType: item.contractType,
            })
            console.log(initialValues)
        }
    }, []);

    return (
        <Modal size="2xl" placement="top-center" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='inside'>
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
                                <ModalHeader className="text-2xl">{title} contrato</ModalHeader>
                                <ModalBody>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="col-span-1">
                                            <Field
                                                name="file"
                                                label="Subir archivo"
                                                component={FileInputBase}
                                                onChangeFile={(file) => {
                                                    handleFileChange(file);
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Field
                                                name="hiringDate"
                                                label="Nombre del banco"
                                                component={DatePickerBase}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Field
                                                name="endDate"
                                                label="Fecha fin"
                                                component={DatePickerBase}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Field
                                                name="contractType"
                                                label="Tipo de contrato"
                                                component={SelectBase}
                                                options={[
                                                    {
                                                        label: 'Recibo por Honorarios',
                                                        value: 'RECIBOS POR HONORARIOS'
                                                    },
                                                    {
                                                        label: 'Contrato por planilla',
                                                        value: 'CONTRATO POR PLANILLA'
                                                    },
                                                    {
                                                        label: 'Contrato por obras',
                                                        value: 'CONTRATO POR OBRAS'
                                                    }
                                                ]}
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
