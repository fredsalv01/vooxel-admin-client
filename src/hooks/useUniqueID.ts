
let UUID = 0;

export const useUniqueID = () => { 

    const getID = () => { 
        UUID++;
        return UUID;
    }

    return {
        getID
    };
}