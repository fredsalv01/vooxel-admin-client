import { Button, Input, table } from '@nextui-org/react'
import React from 'react'
import axiosInstance from '../../../axios/axios'

export const FilesWorkers = ({ itemId }) => {

    const handleFileChange = async (e) => {
        console.log(e.target.files)

        const file = e.target.files[0]

        try {
            const { data } = await axiosInstance.get('/files/presigned-url', {
                params: {
                    type: 'cv'
                }
            })

            const { fileName, filePath, url } = data;

            const config = {
                responseType: 'blob',
            };

            const resp = await axiosInstance.put(url, {
                file,
            }, config)

            console.log("🚀 ~ handleFileChange ~ resp:", resp)

            await axiosInstance.post('/files', {
                table_name: 'worker',
                table_id: itemId,
                tag: 'cv',
                keyFile: fileName,
                path: filePath
            })

            alert('Archivo subido correctamente')
        } catch (error) {
            console.log(error);
        }
    }

    const getFileInfo = (tag) => async () => {
        try {
            const { data } = await axiosInstance.get('/files', {
                params: {
                    tableName: 'worker',
                    tableId: itemId,
                    tag
                }
            })

            console.log("🚀 ~ getFileInfo ~ data", data)

            const { path } = data;

            const { data: file } = await axiosInstance.post('/files/download-url', {
                filePath: path
            })

            window.open(file);

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <h2 className='text-2xl'>Archivos del colaborador</h2>

            <Input
                type='file'
                label='CV'
                onChange={handleFileChange}
            />

            <Button onClick={getFileInfo('cv')}>
                Archivo CV
            </Button>

            {/* <p>CV: {item?.resumeUrl} </p>
            <p>contrato: {item?.contractUrl} </p>
            <p>Test psicológico: {item?.psychologicalTestUrl} </p>
            <p>Certificados: {item?.certifications} </p> */}
        </div>
    )
}
