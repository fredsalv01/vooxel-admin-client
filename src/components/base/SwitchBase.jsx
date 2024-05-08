// CustomSwitch.js

import { Switch } from '@nextui-org/react';

export const SwitchBase = ({ field, form, label, ...rest }) => {

    return (
        <Switch
            isSelected={field.value}
            onValueChange={(value) => {
                const event = {
                    target: {
                        name: field.name,
                        value: value
                    }
                };
                field.onChange(event);
            }}
            {...rest}
        >
            {label}
        </Switch>
    );
};
