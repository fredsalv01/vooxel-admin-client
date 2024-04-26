const ValidationRegister = (values) => {
    let errors = {}

    if(!values.email){
        errors.email = "El Email es necesario"
    }else if(values.email.length < 5){
        errors.email = "El Email tiene que tener mas de 5 caracteres"
    }

    if(!values.password){
        errors.password = "La contraseña es necesario"
    }else if(values.password.length < 8){
        errors.password = "La contraseña tiene que tener mas de 8 caracteres"
    }

    if(!values.retypedPassword){
        errors.retypedPassword = "La contraseña es necesaria"
    }else if(values.retypedPassword === values.password){
        errors.retypedPassword = "La contraseña tiene que coincidir"
    }

    if(!values.username){
        errors.username = "El nombre de usuario es necesario"
    }else if(values.username.length < 8){
        errors.username = "El nombre de usuario tiene que tener mas de 8 caracteres"
    }

    if(!values.firstName){
        errors.firstName = "El nombre es necesario"
    }else if(values.firstName.length < 8){
        errors.firstName = "El nombre tiene que tener mas de 8 caracteres"
    }

    if(!values.lastName){
        errors.lastName = "El apellido es necesario"
    }else if(values.lastName.length < 8){
        errors.lastName = "El apellido tiene que tener mas de 8 caracteres"
    }

    return errors;
}

export default ValidationRegister;