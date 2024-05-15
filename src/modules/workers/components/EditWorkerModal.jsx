import React, { useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button, ModalFooter, DatePicker, Autocomplete, AutocompleteSection, AutocompleteItem } from '@nextui-org/react';
import { Formik, Form, Field } from 'formik';
import { DatePickerBase, InputBase, SelectBase, InputTagBase } from '../../../components/base';
import { useAsyncList } from "@react-stately/data";
import axios from '../../../axios/axios';
import ToastNotification from '../../../lib/helpers/toast-notification';
import * as Yup from 'yup';

export const EditWorkerModal = ({ isOpen, onOpenChange, fetchData }) => {

    const initialValues = {
        name: '',
        apPat: '',
        apMat: '',
        documentType: '',
        documentNumber: '',
        englishLevel: '',
        charge: '',
        birthdate: '',
        contractType: '',
        hiringDate: '',
        phoneNumber: '',
        address: '',
        district: '',
        province: '',
        department: '',
        familiarAssignment: '',
        techSkills: [],
        // despues emercy contact despues
        emergencyContacts: [],
        clientId: '',
        bank
    };

    const validationSchema = Yup.object({
        name: Yup.string().required(),
        apPat: Yup.string().required(),
        apMat: Yup.string().required(),
        documentType: Yup.string().required(),
        documentNumber: Yup.string()
            .when('documentType', {
                is: 'DNI',
                then: (schema) => schema.length(8),
            })
            .when('documentType', {
                is: 'PASAPORTE',
                then: (schema) => schema.length(9),
            })
            .when('documentType', {
                is: 'PASAPORTE',
                then: (schema) => schema.max(20),
            }).required()
        ,
        englishLevel: Yup.string().required(),
        charge: Yup.string().required(),
        birthdate: Yup.string().max(new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()), 'debe tener al menos 18 años').required(), // Assuming birthdate is a string, adjust if it's a date
        contractType: Yup.string().required(),
        hiringDate: Yup.string().max(new Date(), 'No puede ser mayor al día de hoy').required(), // Assuming hiringDate is a string, adjust if it's a date
        phoneNumber: Yup.string().length(9).matches(/^[0-9]+$/).required(),
        address: Yup.string().required(),
        district: Yup.string().required(),
        province: Yup.string().required(),
        department: Yup.string().required(),
        familiarAssignment: Yup.string().required(),
        clientId: Yup.string().required(),
        techSkills: Yup.array().of(
            Yup.string().required() // Example: require each element to be a string
        ).min(1).required(),
        emergencyContacts: Yup.array().min(1).required(), // Validate that emergencyContacts array is not empty
    });

    const handleSubmit = async (values, setSubmitting, onClose) => {
        console.log(JSON.stringify(values, null, 2));
        try {
            setSubmitting(true);
            await axios.post('workers', { ...values });
            (new ToastNotification('Colaborador creado correctamente')).showSuccess();
            fetchData();
            onClose();
        } catch (error) {
            if (error.response.status === 400) (new ToastNotification(error.response.data.message)).showError();
            else (new ToastNotification('Error al crear el colaborador')).showError();
            console.log('Error', error);
        } finally {
            setSubmitting(false);
        }
    };

    const [selectedOption, setSelectedOption] = React.useState(null);

    // const getClients = async (query) => {
    //     const data = await axios.get('clients', { params: { input: query, isActive: true } });
    //     return (data.items.map((item) => ({ id: item.id, label: item.fullName })));
    // };

    let list = useAsyncList({
        async load({ signal, filterText }) {
            const data = await axios.get('clients', { params: { input: filterText, isActive: true } });
            return {
                items: data.data.items.map((item) => ({ id: item.id, label: item.businessName })) || [],
            };
        },
    });

    return (
        <Modal size="2xl" placement="top-center" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
            <ModalContent>
                {(onClose) => (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) =>
                            handleSubmit(values, setSubmitting, onClose)
                        }
                        enableReinitialize
                    >
                        {/* props Formik */}
                        {({ isSubmitting, errors, handleChange, values, setFieldValue }) => (
                            <Form className='grid overflow-y-auto' autoComplete='off'>
                                <ModalHeader className='text-2xl'>
                                    Editar Colaborador
                                </ModalHeader>
                                <ModalBody>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="col-span-1 md:col-span-2">
                                            <Field
                                                name="name"
                                                label="Nombre(s)"
                                                component={InputBase}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Field
                                                name="apPat"
                                                label="Apellido Paterno"
                                                component={InputBase}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Field
                                                name="apMat"
                                                label="Apellido Materno"
                                                component={InputBase}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Field
                                                name="documentType"
                                                label="Tipo de documento"
                                                component={SelectBase}
                                                options={[
                                                    { value: 'DNI', label: 'DNI' },
                                                    { value: 'PASAPORTE', label: 'PASAPORTE' },
                                                    { value: 'CARNET EXTRANJERÍA', label: 'CARNET EXTRANJERÍA' },
                                                ]}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Field
                                                name="documentNumber"
                                                label="Nro. de documento"
                                                component={InputBase}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Field
                                                name="englishLevel"
                                                label="Tipo de contrato"
                                                component={SelectBase}
                                                options={[
                                                    {
                                                        label: 'Básico',
                                                        value: 'Basico'
                                                    },
                                                    {
                                                        label: 'Intermedio',
                                                        value: 'Intermedio'
                                                    },
                                                    {
                                                        label: 'Avanzado',
                                                        value: 'Avanzado'
                                                    },
                                                    {
                                                        label: 'Nativo',
                                                        value: 'Nativo'
                                                    }
                                                ]}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Field
                                                name="charge"
                                                label="Cargo"
                                                component={InputBase}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Field
                                                name="birthdate"
                                                label="Fecha de nacimiento"
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
                                        <div className="col-span-1">
                                            <Field
                                                name="hiringDate"
                                                label="Fecha de contratación"
                                                component={DatePickerBase}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Field
                                                name="phoneNumber"
                                                label="Nro. de celular"
                                                component={InputBase}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Field
                                                name="address"
                                                label="Dirección"
                                                component={InputBase}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Field
                                                name="department"
                                                label="Departamento"
                                                component={InputBase}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Field
                                                name="district"
                                                label="Distrito"
                                                component={InputBase}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Field
                                                name="province"
                                                label="Provincia"
                                                component={InputBase}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Field
                                                name="familiarAssignment"
                                                label="Asignación familiar"
                                                component={InputBase}
                                            />
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                            <Field
                                                name="techSkills"
                                                label="Habilidades blandas"
                                                component={InputTagBase}
                                            />
                                        </div>

                                        <div className="col-span-1 md:col-span-2">
                                            <Autocomplete
                                                className="max-w-xs"
                                                inputValue={list.filterText}
                                                isLoading={list.isLoading}
                                                items={list.items}
                                                label="Select a character"
                                                placeholder="Type to search..."
                                                variant="bordered"
                                                name="clientId"
                                                onInputChange={(event) => {
                                                    list.setFilterText(event)
                                                }}
                                                onSelectionChange={(key) => setFieldValue('clientId', key)}
                                            >
                                                {(item) => (
                                                    <AutocompleteItem key={item.id} className="capitalize">
                                                        {item.label}
                                                    </AutocompleteItem>
                                                )}
                                            </Autocomplete>
                                        </div>
                                    </div>

                                </ModalBody>
                                <ModalFooter className='flex justify-end'>
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
}
