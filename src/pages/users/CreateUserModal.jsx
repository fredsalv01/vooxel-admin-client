import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Card, CardBody, CardHeader, ModalFooter } from '@nextui-org/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import InputBase from '../../components/base/InputBase';
import axios from '../../axios/axios';
import ToastNotification from '../../helpers/toast-notification';

const CreateWorkerModal = ({ isOpen, onOpenChange, fetchData }) => {

    const initialValues = {
        username: '',
        password: '',
        retypedPassword: '',
        firstName: '',
        lastName: '',
        email: '',
    };

    const validationSchema = Yup.object({
        username: Yup.string().required(),
        password: Yup.string().required(),
        retypedPassword: Yup.string().required().oneOf([Yup.ref('password')]),
        firstName: Yup.string().required(),
        lastName: Yup.string().required(),
        email: Yup.string().required().email(),
    });

    const handleSubmit = async (values, setSubmitting, onClose) => {
        console.log(JSON.stringify(values, null, 2));
        try {
            setSubmitting(true);
            await axios.post('users', { ...values });
            (new ToastNotification('usuario creado correctamente')).showSuccess();
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
        <Modal size="5xl" placement="top-center" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='inside'>
            <ModalContent>
                {(onClose) => (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting, onClose)}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <ModalHeader className="text-2xl">Agregar nuevo usuario</ModalHeader>
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
                                                name="password"
                                                label="Contraseña"
                                                type="password"
                                                component={InputBase}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Field
                                                name="retypedPassword"
                                                label="Repetir contraseña"
                                                type="password"
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
                                        <div className="col-span-1">
                                            <Field
                                                name="email"
                                                label="Correo"
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

export default CreateWorkerModal;