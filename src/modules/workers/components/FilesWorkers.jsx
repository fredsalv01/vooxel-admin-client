import { Button, Input } from '@nextui-org/react';
import React, { useState } from 'react';
import axiosInstance from '../../../axios/axios';

export const FilesWorkers = ({ itemId }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            alert('Por favor selecciona un archivo primero');
            return;
        }
        console.log('Archivo seleccionado:', file); // Debugging: Verificar si se seleccionó el archivo
        setSelectedFile(file);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            alert('No hay ningún archivo seleccionado para subir');
            return;
        }

        try {
            const { data } = await axiosInstance.get('/files/presigned-url', {
                params: {
                    type: 'cv'
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
                    tag: 'cv',
                    keyFile: fileName,
                    path: filePath
                });
                alert('Archivo subido correctamente');
            } else {
                const errorText = await resp.text(); // Leer el cuerpo de la respuesta para obtener detalles del error
                console.error('Fallo en la subida', resp.status, errorText); // Debugging: Registro detallado del error
                alert('Fallo al subir el archivo');
            }
        } catch (error) {
            console.error('Error en la subida', error); // Debugging: Capturar y registrar errores
            alert('Fallo al subir el archivo');
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
            alert('Fallo al obtener la información del archivo');
        }
    };

    return (
        <div>
            <h2 className='text-2xl'>Archivos del colaborador</h2>

            <input
                type='file'
                onChange={handleFileChange}
            />
            <Button onClick={handleFileUpload}>
                Subir CV
            </Button>

            <Button onClick={getFileInfo('cv')}>
                Descargar CV
            </Button>
        </div>
    );
};
