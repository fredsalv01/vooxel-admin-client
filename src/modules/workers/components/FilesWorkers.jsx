import { Button, Input } from '@nextui-org/react';
import React, { useState } from 'react';
import axiosInstance from '../../../axios/axios';
import { FileInputBase } from '../../../components/base';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DownloadCloud } from '../../../components/icons';
import ToastNotification from '../../../lib/helpers/toast-notification';

// cv, certification, psychological_test, profile_photo

const typeFiles = [
    { label: 'CV', tag: 'cv' },
    { label: 'Test Psicológico', tag: 'psychological_test' },
    { label: 'Profile Foto', tag: 'profile_photo' },
    { label: 'Contrato', tag: 'contract' },
]

export const FilesWorkers = ({ itemId }) => {

    const handleFileChange = (file, tag) => {
        if (!file) {
            alert('Por favor selecciona un archivo primero');
            return;
        }
        console.log('Archivo seleccionado:', file); // Debugging: Verificar si se seleccionó el archivo
        handleFileUpload(file, tag)
    };

    const handleFileUpload = async (selectedFile, tag) => {
        if (!selectedFile) {
            (new ToastNotification('No hay ningún archivo seleccionado para subir')).showError();
            return;
        }

        try {
            const { data } = await axiosInstance.get('/files/presigned-url', {
                params: {
                    type: tag
                }
            });

            console.log('Datos de URL prefirmada:', data); // Debugging: Verificar los datos de la URL prefirmada

            const { fileName, filePath, url } = data;

            const resp = await fetch(url, {
                method: 'PUT',
                body: selectedFile,
                headers: {
                    'Content-Type': selectedFile.type, // Asegúrate de que el tipo MIME es correcto
                },
            });

            if (resp.ok) {
                console.log('Respuesta de la subida del archivo:', resp); // Debugging: Verificar la respuesta de la subida

                await axiosInstance.post('/files', {
                    table_name: 'worker',
                    tableId: itemId,
                    tag: tag,
                    keyFile: fileName,
                    path: filePath
                });

                (new ToastNotification('Archivo subido correctamente')).showSuccess();
            } else {
                const errorText = await resp.text(); // Leer el cuerpo de la respuesta para obtener detalles del error
                console.error('Fallo en la subida', resp.status, errorText); // Debugging: Registro detallado del error
                (new ToastNotification('Fallo al subir el archivo')).showError();
            }
        } catch (error) {
            console.error('Error en la subida', error); // Debugging: Capturar y registrar errores
            (new ToastNotification('Fallo al subir el archivo')).showError();
        }
    };

    const getFileInfo = (tag) => async () => {
        try {
            const { data } = await axiosInstance.get('/files', {
                params: {
                    tableName: 'worker',
                    tableId: itemId,
                    tag
                }
            });

            console.log('Datos de la información del archivo:', data); // Debugging: Verificar los datos de la información del archivo

            const { path } = data;

            const { data: file } = await axiosInstance.post('/files/download-url', {
                filePath: path
            });

            window.open(file);

        } catch (error) {
            console.error('Error al obtener la información del archivo', error); // Debugging: Capturar y registrar errores
            (new ToastNotification('Fallo al obtener la información del archivo')).showError();
        }
    };

    return (
        <div>
            <h2 className='text-2xl'>Archivos del colaborador</h2>
            <div className='bg-white p-4 my-4 rounded-md'>
                {typeFiles.map(({ label, tag }) => (
                    <div key={tag} className='flex gap-4 items-center mb-4'>
                        <label className='font-semibold w-20'> {label} </label>
                        <FileInputBase onChangeFile={(file) => handleFileChange(file, tag)} className='flex-1' />
                        <Button color='primary' onClick={getFileInfo(tag)}>
                            <DownloadCloud />
                        </Button>
                    </div>
                ))}
                {/* <div className='flex gap-4 items-center'>
                    <FileInputBase label='CV' onChangeFile={handleFileChange} className='flex-1' />
                    <Button color='primary' onClick={getFileInfo('cv')}>
                        <DownloadCloud />
                    </Button>
                </div> */}
            </div>
        </div>
    );
};
