import { DateFormatter } from '@internationalized/date'

export default function InternationalizationDate() {

    const formatDate = (date) => {

        const formatter = new DateFormatter('es-PE', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        });

        return formatter.format(date);

    }

    return { formatDate }
}
