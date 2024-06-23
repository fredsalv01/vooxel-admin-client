import React, { useEffect, useState } from 'react';

import { Button } from '@nextui-org/react';
import { CardBase, FileInput } from '../../../components/base';
import { DownloadCloud } from '../../../components/icons';
import { useUploadFile } from '../../../hooks/useUploadFile';
import { TAGS_FILES } from '../../../lib/consts/general';

const typeFiles = [
    { label: 'CV', tag: TAGS_FILES.cv },
    { label: 'Test Psicológico', tag: TAGS_FILES.psychological_test },
    { label: 'Profile Foto', tag: TAGS_FILES.profile_photo },
]

export const FilesWorkers = ({ itemId, filesCount, fetchData }) => {

    const [hasFiles, setHasFiles] = useState(null);

    useEffect(() => {
        if (Object.keys(filesCount).length > 0) {
            const newHasFiles = {};
            typeFiles.forEach(({ tag }) => {
                newHasFiles[tag] = filesCount[tag] > 0 ?? false;
            });
            setHasFiles(newHasFiles);
        }

    }, [filesCount]);

    const { handleFileChange, getFileInfo, isLoading } = useUploadFile({ tableName: 'worker', tableId: itemId, reFetchData: fetchData });

    return (
        <CardBase title='Archivos del colaborador'>
            {typeFiles.map(({ label, tag }) => (
                <div key={tag} className='grid grid-cols-1 md:grid-cols-8 gap-4 my-2'>

                    <div className='col-span-1 md:col-span-7 grid md:grid-cols-4 items-center'>
                        <label className='font-semibold col-span-1'> {label} </label>
                        <FileInput onChangeFile={(file) => handleFileChange(file, tag)} className="col-span-3" />
                    </div>

                    <div className="text-center">
                        {/* <pre>{JSON.stringify(hasFiles[tag])}</pre> */}
                        <Button isIconOnly color='white'
                            isDisabled={hasFiles && !hasFiles[tag]}
                            onClick={getFileInfo({ tag })} isLoading={isLoading}>
                            <DownloadCloud
                                currentColor={hasFiles && hasFiles[tag] ? '#00abfb' : '#d1d5db'}
                            />
                        </Button>
                    </div>
                </div>
            ))}
        </CardBase>
    );
};
