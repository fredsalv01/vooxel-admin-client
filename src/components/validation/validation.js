const Validation = (values) => {
    let errors = {
        email: '',
        password: ''
    }

    if (!values.email) {
        errors.email = 'El Email es necesario'
    } else if (values.email.length < 5) {
        errors.email = 'El Email tiene que tener mas de 5 caracteres'
    }

    if (!values.password) {
        errors.password = 'La Contraseña es necesario'
    } else if (values.password.length < 8) {
        errors.password = 'La Contraseña tiene que tener mas de 8 caracteres'
    }

    return errors
}

export default Validation
