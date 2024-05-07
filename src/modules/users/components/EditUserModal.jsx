import React, { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Card, CardBody, CardHeader, ModalFooter } from '@nextui-org/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import InputBase from '../../../components/base/InputBase';
import axios from '../../../axios/axios';
import ToastNotification from '../../../helpers/toast-notification';

export const EditUserModal = ({ isOpen, onOpenChange, itemId, fetchData }) => {

    const [item, setItem] = useState(null);


    const [initialValues, setInitialValues] = useState({
        username: '',
        // password: '',
        // retypedPassword: '',
        firstName: '',
        lastName: '',
        // email: '',
    });

    useEffect(() => {
        const getItem = async () => {
            try {
                const { data } = await axios.get(`users/${itemId}`);
                console.log("🚀 ~ getItem ~ data:", data)
                setInitialValues({
                    username: data.username,
                    firstName: data.firstName,
                    lastName: data.lastName,
                });
                console.log({ initialValues });

            } catch (error) {
                console.log('Error', error);
            }
        }
        // if (isOpen)
        getItem();

    }, [isOpen, itemId]);

    const validationSchema = Yup.object({
        username: Yup.string().required(),
        // password: Yup.string().required(),
        // retypedPassword: Yup.string().required().oneOf([Yup.ref('password')]),
        firstName: Yup.string().required(),
        lastName: Yup.string().required(),
        // email: Yup.string().required().email(),
    });

    const handleSubmit = async (values, setSubmitting, onClose) => {
        try {
            setSubmitting(true);
            await axios.put(`users/${itemId}`, { ...values });
            (new ToastNotification('usuario actualizado correctamente')).showSuccess();
            fetchData();
            onClose();
        } catch (error) {
            if (error.response.status === 400) (new ToastNotification(error.response.data.message)).showError();
            else (new ToastNotification('Error al crear el usuario')).showError();
        } finally {
            setSubmitting(false);
        }
    };

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
                        {
                            ({ isSubmitting }) =>

                            (
                                <Form>
                                    <ModalHeader className="text-2xl">Editar usuario</ModalHeader>
                                    <ModalBody>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="col-span-1 md:col-span-2">
                                                <Field
                                                    name="username"
                                                    label="Nombre de usuario"
                                                    component={InputBase}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <Field
                                                    name="firstName"
                                                    label="Nombre(s)"
                                                    type="text"
                                                    component={InputBase}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <Field
                                                    name="lastName"
                                                    label="Apellidos"
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
    );
};