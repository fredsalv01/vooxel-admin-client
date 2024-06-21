import React from 'react';
import { toast } from 'react-toastify';

export class ToastNotification {

    static data = [];

    static showSuccess(messages) {
        const toastId = toast.success(<RenderMessage messages={messages} />, { autoClose: 5000 });
        this.data.push(toastId);
    }

    static showWarning(messages) {
        const toastId = toast.warning(<RenderMessage messages={messages} />, { autoClose: 5000 });
        this.data.push(toastId);
    }

    static showError(messages) {
        const toastId = toast.error(<RenderMessage messages={messages} />, { autoClose: 5000 });
        this.data.push(toastId);
    }

    static remove() {
        this.data.forEach(element => {
            toast.dismiss(element);
        });
        this.data = [];
    }

}

const RenderMessage = ({ messages }) => {
    const isString = typeof messages === 'string';

    return (
        !isString ? (
            <ul className="list-disc list-inside ml-3">
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        ) : (
            <p>{messages}</p>
        )
    );
};