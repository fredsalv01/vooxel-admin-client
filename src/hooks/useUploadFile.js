import { useState } from "react";
import axiosInstance from "../axios/axios";
import {ToastNotification} from "../lib/helpers/toast-notification-temp";

/**
 * 
 * @param {Object} params - The parameters for the function.
 * @param {string} params.tableName - The name of the table.
 * @param {number} params.tableId - The ID of the table.
 * @param {reFetchData} params.reFetchData - The function to refetch the data.
 * @returns
 */
export const useUploadFile = ({ tableName, tableId = 0, goUpload = true, reFetchData = () => void 0 }) => {

    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (file, tag) => {
        if (!file) {
            alert('Por favor selecciona un archivo primero');
            return;
        }
        console.log('Archivo seleccionado:', file); // Debugging: Verificar si se seleccionó el archivo
        if (goUpload)
        handleFileUpload(file, tag)
    };

    const handleFileUpload = async (selectedFile, tag) => {
        if (!selectedFile) {
            ToastNotification.showError('No hay ningún archivo seleccionado para subir');
            return;
        }

        try {
            setIsLoading(true);
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

                let body =  {
                    table_name: tableName,
                    tag: tag,
                    keyFile: fileName,
                    path: filePath
                }

                if (tableId) body.tableId = tableId 
                const response = await axiosInstance.post('/files', body);
                ToastNotification.showSuccess('Archivo subido correctamente');
                fetchData();
                return response.data;
            } else {
                const errorText = await resp.text(); // Leer el cuerpo de la respuesta para obtener detalles del error
                console.error('Fallo en la subida', resp.status, errorText); // Debugging: Registro detallado del error
                ToastNotification.showError('Fallo al subir el archivo');
            }
        } catch (error) {
            console.error('Error en la subida', error); // Debugging: Capturar y registrar errores
            ToastNotification.showError('Fallo al subir el archivo');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFileUpdated = async ({fileId, updateTableId}) => { 
        
        try {
            setIsLoading(true);
            await axiosInstance.patch(`/files/${fileId}`, { tableId: updateTableId });
            ToastNotification.showSuccess('Archivo actualizado correctamente');
            fetchData();
        } catch (error) {
            console.error('Error en la subida', error); // Debugging: Capturar y registrar errores
            ToastNotification.showError('Fallo al subir el archivo');
        }  finally {
            setIsLoading(false);
        }
    }

    const getFileInfo = ({tag, rowTableId = 0 }) => async () => {
        try {
            setIsLoading(true);

            let body = {
                tableName,
                tag
            }

            body.tableId = tableId ? tableId : rowTableId

            const { data } = await axiosInstance.get('/files', {
                params: {
                    ...body
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
            ToastNotification('Fallo al obtener la información del archivo').showError();
        } finally {
            setIsLoading(false);
        }
    };

    const fetchData = async () => {
        if (reFetchData) {
            await reFetchData();
        }
    }


    return {
        handleFileChange,
        handleFileUpload,
        handleFileUpdated,
        getFileInfo,
        isLoading
    }
}