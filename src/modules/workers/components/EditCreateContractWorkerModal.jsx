import React, { useEffect, useMemo, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, Button, ModalFooter, select, Select } from '@nextui-org/react';
import { Formik, Form, Field } from 'formik';

import { DatePickerBase, FileInputBase, InputBase, SelectBase } from '../../../components/base';
import { ToastNotification } from '../../../lib/helpers/toast-notification-temp';
import * as Yup from 'yup';

import axiosInstance from '../../../axios/axios';
import { useUploadFile } from '../../../hooks/useUploadFile';
import { TABLE_NAME_FILES, TAGS_FILES } from '../../../lib/consts/general';

export const EditCreateContractWorkerModal = ({ isOpen, onOpenChange, item = {}, items, parentId, fetchData }) => {
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

    const updateValidationSchema = Yup.object({
        // file: Yup.mixed().required(),
        hiringDate: Yup.string().required(),
        endDate: Yup.string().required(),
        contractType: Yup.string().required(),
    });

    const isEditItem = useMemo(() => Object.keys(item).length > 0, [item]);

    const { handleFileChange, handleFileUpload, handleFileUpdated } = useUploadFile({ tableName: TABLE_NAME_FILES.contractWorkers, goUpload: false });

    const handleSubmit = async (values, setSubmitting, onClose) => {
        // console.log(JSON.stringify(values, null, 2));
        let fileCreated;
        const { file, ...restValues } = values

        if (!isEditItem || (isEditItem && values.file)) {
            fileCreated = await handleFileUpload(file, TAGS_FILES.contract);
        }

        try {
            setSubmitting(true);
            let contractUpserted;

            if (isEditItem) {
                contractUpserted = await axiosInstance.patch(`contract-workers/contract/${item.id}`, {
                    ...restValues,
                    workerId: parentId
                });

                ToastNotification.showSuccess('Contrato actualizado correctamente');

            } else {
                contractUpserted = await axiosInstance.post(`contract-workers`, {
                    ...restValues,
                    workerId: parentId
                });
                ToastNotification.showSuccess('Contrato creado correctamente');
            }


            if (!isEditItem || (isEditItem && values.file)) {
                try {
                    await handleFileUpdated({ fileId: fileCreated.id, updateTableId: contractUpserted.data.id });
                } catch (error) {
                    console.log("Error updated File in contracts", error)
                }
            }

            fetchData();
            onClose();
        } catch (error) {
            console.log('Error upserting contract', error);
            if (error.response.status === 400) ToastNotification.showError(error.response.data.message);
            else ToastNotification.showError(`Error al ${isEditItem ? 'editar' : 'crear'} el Contrato`);
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        if (isEditItem) {
            setTitle('Editar');

            setInitialValues({
                hiringDate: item.hiringDate,
                endDate: item.endDate,
                contractType: item.contractType,
            })
        }
    }, []);

    return (
        <Modal size="2xl" placement="top-center" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='inside'>
            <ModalContent>
                {(onClose) => (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={isEditItem ? updateValidationSchema : validationSchema}
                        onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting, onClose)}
                        enableReinitialize
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <ModalHeader className="text-2xl">{title} contrato</ModalHeader>
                                <ModalBody>
                                    {/* <pre>{JSON.stringify(initialValues)}</pre> */}
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
                                        <div className="col-span-1">
                                            <Field
                                                name="hiringDate"
                                                label="Fecha inicio"
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
