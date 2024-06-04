import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';

const mySwal = withReactContent(Swal);

export class Alerts {

    // Funcion para alerta basica
    static basicAlert(title, text, icon) {
        mySwal.fire(title, text, icon);
    }

    // Funcion para alerta de confirmacion
    static confirmAlert(
        title = "¿Está usted seguro?",
        text = "Acción irreversible",
        icon = "warning",
        confirmButtonText = "¡Si, bórralo!"
    ) {
        return mySwal.fire({
            title: title,
            text: text,
            icon: icon,
            showCancelButton: true,
            confirmButtonColor: "#344767",
            cancelButtonColor: "#d33",
            confirmButtonText: confirmButtonText,
            reverseButtons: true
        });
    }

    // Funcion para alerta basica
    static saveAlert(title, text, icon) {
        return mySwal.fire(title, text, icon); // uso return para luego usar un then al momento de llamarlo
    }

    // Funcion para loading
    static showLoading() {
        return mySwal.fire({
            title: "Cargando...",
            html: "Por favor espere...",
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
                mySwal.showLoading();
            }
        });
    }

    static close() {
        return mySwal.close();
    }
}
