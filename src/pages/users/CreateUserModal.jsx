import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import InputBase from '../../components/base/InputBase';
import axios from '../../axios/axios';

const CreateWorkerModal = ({ isOpen, onOpenChange }) => {
    const initialValues = {
        username: '',
        password: '',
        retypedPassword: '',
        firstName: '',
        lastName: '',
        email: '',
    };

    const validationSchema = Yup.object({
        username: Yup.string().max(15, 'Must be 15 characters or less').required(),
        password: Yup.string().required('Password is required'),
        retypedPassword: Yup.string().required().oneOf([Yup.ref('password'), null], 'Passwords must match'),
        firstName: Yup.string().required(),
        lastName: Yup.string().required(),
        email: Yup.string().required(),
    });

    const handleSubmit = async (values) => {
        console.log(JSON.stringify(values, null, 2));


        try {
            await axios.post('users', { ...values })
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <Modal size="5xl" placement="top-center" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        <Form style={{ overflowY: 'scroll', height: '720px' }}>
                            <ModalHeader className="flex flex-col gap-1 text-green-700">Agregar Nuevo Colaborador</ModalHeader>
                            <ModalBody>
                                <Card>
                                    <CardHeader className="text-sm font-semibold">Datos Personales y de contacto</CardHeader>
                                    <CardBody className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
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
                                    </CardBody>
                                </Card>
                                <Button color="primary" type="submit">
                                    Registrar Colaborador
                                </Button>
                            </ModalBody>
                        </Form>
                    </Formik>
                )}
            </ModalContent>
        </Modal>
    );
};

export default CreateWorkerModal;