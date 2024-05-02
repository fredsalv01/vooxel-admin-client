
import esJson from './es.json';

const getLocaleName = (field, localeJson) => {
  return localeJson[field.path] || field.path;
}

const yupLocaleMessages = {
    mixed: {
      required: (field) => `El campo ${getLocaleName(field, esJson)} es requerido`,
    }
};

import { es } from 'yup-locales';
import { setLocale } from 'yup';
setLocale({...es, ...yupLocaleMessages});