import React, { useEffect, useMemo, useState } from 'react';
import { Select, SelectItem } from '@nextui-org/react';
import { useUniqueID } from '../../hooks/useUniqueID';
import { getValueFromFieldFormik } from '../../lib/helpers/utils';
import { FieldProps } from 'formik';

interface Option {
  id?: string | number;
  value: string | number;
  label: string;
}

interface SelectBaseProps extends FieldProps {
  label: string;
  options: Option[];
  rest?: React.ComponentProps<typeof Select>;
}

export const SelectBase: React.FC<SelectBaseProps> = ({ label, options, field, form, ...rest }) => {
  const uuid = useUniqueID().getID().toString();

  const [selected, setSelected] = useState<string | number | undefined>(field.value || undefined);

  useEffect(() => {
    // form.setFieldTouched(field.name, true);
    if (!!field.value)
      setSelected(field.value);
    
  }, [field.value, field.name]);

  const hasError =
    getValueFromFieldFormik(form.errors, field.name) &&
    getValueFromFieldFormik(form.touched, field.name);
  const [touched, setTouched] = useState<boolean>(hasError);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    form.handleChange(event);
    setSelected(value);
    setTouched(false);
  };

  const fielValue = useMemo(() => {
    if (!!field.value) {
      return field.value;
    }
    return null;
  }, [field.value]);

  return (
    <Select
      {...rest}
      items={options}
      id={uuid}
      name={field.name}
      value={selected}
      label={label}
      labelPlacement={'inside'}
      onChange={handleSelect}
      errorMessage={
        field.value || !touched
          ? ''
          : getValueFromFieldFormik(form.errors, field.name)
      }
      isInvalid={field.value || !touched ? false : true}
      selectedKeys={fielValue ? [fielValue] : []}
      onClose={() => setTouched(true)}
    >
      {(option) => (
        <SelectItem key={option.id ?? option.value} value={option.value}>
          {option.label}
        </SelectItem>
      )}
    </Select>
  );
};