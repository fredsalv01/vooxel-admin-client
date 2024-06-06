import React, { useEffect, useMemo, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, Button, ModalFooter, select, Select } from '@nextui-org/react';
import { Formik, Form, Field } from 'formik';

import { FileInputBase, InputBase } from '../../../components/base';
import { ToastNotification } from '../../../lib/helpers/toast-notification-temp';
import * as Yup from 'yup';

import axiosInstance from '../../../axios/axios';
import { useUploadFile } from '../../../hooks/useUploadFile';
import { TABLE_NAME_FILES, TAGS_FILES } from '../../../lib/consts/general';

export const EditCreateCertificationModal = ({ isOpen, onOpenChange, item = {}, items, parentId, fetchData }) => {
    const [title, setTitle] = useState('Agregar');

    const [initialValues, setInitialValues] = useState({
        file: '',
        certificationName: '',
    });

    const validationSchema = Yup.object({
        file: Yup.mixed().required(),
        certificationName: Yup.string().required(),
    });

    const updateValidationSchema = Yup.object({
        // file: Yup.mixed().required(),
        certificationName: Yup.string().required(),
    });

    const isEditItem = useMemo(() => Object.keys(item).length > 0, [item]);


    const { handleFileChange, handleFileUpload, handleFileUpdated } = useUploadFile({ tableName: TABLE_NAME_FILES.certifications, goUpload: false });

    const handleSubmit = async (values, setSubmitting, onClose) => {
        // console.log(JSON.stringify(values, null, 2));
        let fileCreated;
        const { file, ...restValues } = values

        if (!isEditItem || (isEditItem && values.file)) {
            fileCreated = await handleFileUpload(file, TAGS_FILES.contract);
        }

        try {
            setSubmitting(true);

            let certificationUpserted;
            if (isEditItem) {
                certificationUpserted = await axiosInstance.patch(`certifications/${item.id}`, {
                    ...restValues,
                    workerId: parentId
                });

                ToastNotification.showSuccess('Certificado actualizado correctamente');
            } else {
                certificationUpserted = await axiosInstance.post(`certifications`, {
                    ...restValues,
                    workerId: parentId
                });
                ToastNotification.showSuccess('Certificado creado correctamente');
            }
            console.log("🚀 ~ handleSubmit ~ certificationUpserted:", certificationUpserted)


            if (!isEditItem || (isEditItem && values.file)) {
                try {
                    await handleFileUpdated({ fileId: fileCreated.id, updateTableId: certificationUpserted.data.id });
                } catch (error) {
                    console.log("Error updated File in contracts", error)
                }
            }

            fetchData();
            onClose();
        } catch (error) {
            console.log('Error creating contract', error);
            if (error.response.status === 400) ToastNotification.showError(error.response.data.message);
            else ToastNotification.showError(`Error al ${isEditItem ? 'editar' : 'crear'} el Certificado`);
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        if (isEditItem) {
            setTitle('Editar');

            setInitialValues({
                certificationName: item.certificationName,
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
                        validationSchema={isEditItem ? updateValidationSchema : validationSchema}
                        onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting, onClose)}
                        enableReinitialize
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <ModalHeader className="text-2xl">{title} Certificado</ModalHeader>
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
                                                name="certificationName"
                                                label="Nombre"
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
