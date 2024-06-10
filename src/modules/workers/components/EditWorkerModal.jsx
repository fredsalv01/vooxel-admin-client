import React, { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button, ModalFooter, DatePicker, Autocomplete, AutocompleteSection, AutocompleteItem } from '@nextui-org/react';
import { Formik, Form, Field } from 'formik';
import { DatePickerBase, InputBase, SelectBase, InputTagBase, AutocompleteBase } from '../../../components/base';
import { useAsyncList } from "@react-stately/data";
import axios from '../../../axios/axios';
import { ToastNotification } from '../../../lib/helpers/toast-notification-temp';
import * as Yup from 'yup';
import { BANKS_BACKEND, DOCUMENT_TYPES_BACKEND, ENGLISH_LEVEL_BACKEND } from '../../../lib/consts/general';

export const EditWorkerModal = ({ isOpen, onOpenChange, editItem, fetchData }) => {

    const [initialValues, setInitialValues] = useState({
        name: '',
        apPat: '',
        apMat: '',
        documentType: '',
        documentNumber: '',
        englishLevel: '',
        charge: '',
        birthdate: '',
        phoneNumber: '',
        address: '',
        district: '',
        province: '',
        department: '',
        familiarAssignment: '',
        techSkills: [],
        clientId: '',
    });

    useEffect(() => {
        if (editItem) {
            console.log("🚀 ~ useEffect ~ editItem:", editItem)
            setInitialValues({
                ...initialValues,
                name: editItem?.name,
                apPat: editItem?.apPat,
                apMat: editItem?.apMat,
                documentType: editItem?.documentType,
                documentNumber: editItem?.documentNumber,
                englishLevel: editItem?.englishLevel,
                charge: editItem?.charge,
                birthdate: editItem?.birthdate || '',
                phoneNumber: editItem?.phoneNumber,
                address: editItem?.address,
                district: editItem?.district,
                province: editItem?.province,
                department: editItem?.department,
                familiarAssignment: editItem?.familiarAssignment,
                techSkills: editItem?.techSkills,
                clientId: editItem?.clientInfo?.id.toString() || '',
            })
        }
    }, []);

    const validationSchema = Yup.object({
        name: Yup.string().required(),
        apPat: Yup.string().required(),
        apMat: Yup.string().required(),
        documentType: Yup.string().required(),
        documentNumber: Yup.string()
            .when('documentType', {
                is: 'Dni',
                then: (schema) => schema.length(8),
            })
            .when('documentType', {
                is: 'Pasaporte',
                then: (schema) => schema.length(9),
            })
            .when('documentType', {
                is: 'Carnet Extranjeria',
                then: (schema) => schema.max(20),
            }).required()
        ,
        englishLevel: Yup.string().required(),
        charge: Yup.string().required(),
        birthdate: Yup.string().max(new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()), 'debe tener al menos 18 años').required(), // Assuming birthdate is a string, adjust if it's a date
        phoneNumber: Yup.string().length(9).matches(/^[0-9]+$/).required(),
        address: Yup.string().required(),
        district: Yup.string().required(),
        province: Yup.string().required(),
        department: Yup.string().required(),
        familiarAssignment: Yup.string().required(),
        techSkills: Yup.array().of(
            Yup.string().required()
        ).min(1).required(),
        clientId: Yup.string().required(),
    });

    const handleSubmit = async (values, setSubmitting, onClose) => {
        delete values.id;
        delete values.isActive;
        try {
            setSubmitting(true);
            await axios.patch(`workers/${editItem.id}`, { ...values });
            ToastNotification.showSuccess('Colaborador actualizado correctamente');
            fetchData();
            onClose();
        } catch (error) {
            if (error.response.status === 400) ToastNotification.showError(error.response.data.message);
            else ToastNotification.showError('Error al crear el colaborador');
            console.log('Error', error);
        } finally {
            setSubmitting(false);
        }
    };

    // autocomplete
    let list = useAsyncList({
        async load({ signal, filterText }) {
            // console.log("🚀 ~ load ~ signal:", signal)
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
                                                options={DOCUMENT_TYPES_BACKEND}
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
                                                label="Nivel de inglés"
                                                component={SelectBase}
                                                options={ENGLISH_LEVEL_BACKEND}
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
                                                inputValue={list.filterText}
                                                isLoading={list.isLoading}
                                                items={list.items}
                                                label="Seleccionar cliente"
                                                placeholder="buscar cliente..."
                                                variant="bordered"
                                                name="clientId"
                                                onInputChange={(event) => {
                                                    list.setFilterText(event)
                                                }}
                                                onSelectionChange={(event) => {
                                                    // if (!!event) handleChange(event)
                                                    setFieldValue('clientId', event)
                                                }}
                                                isRequired
                                            >
                                                {(item) =>
                                                    <AutocompleteItem key={item.id} className="capitalize">
                                                        {item.label}
                                                    </AutocompleteItem>
                                                }
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
