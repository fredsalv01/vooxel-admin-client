// https://github.com/LoicMahieu/yup-locales/blob/master/src/locales/es.ts
import esJson from './es.json';

const getLocaleName = ({field, localeJson, property = 'path'}) => {
  if (property === 'resolved') {
    let resolved = [];
    for (const iterator of field[property]) {
      resolved.push(iterator);
    }
    return resolved.join(', ');
  }

  const attr = field[property] || null
  return localeJson[attr] || attr;
}

const yupLocaleMessages = {
    mixed: {
      required: (field) => `El campo ${getLocaleName({field, localeJson: esJson})} es requerido`,
      oneOf: (field) => `${getLocaleName({field, localeJson: esJson})} debe ser uno de los siguientes valores: ${getLocaleName({field, localeJson: esJson, property: 'resolved'})}`,
      email: 'El campo debe ser un email válido',
    }
};

import { es } from 'yup-locales';
import { setLocale } from 'yup';
setLocale({...es, ...yupLocaleMessages});