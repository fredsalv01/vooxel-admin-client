import React from 'react';
import { toast } from 'react-toastify';

export class ToastNotification {

    static showSuccess(messages) {
        toast.success(<RenderMessage messages={messages} />, { autoClose: 5000 });
    }

    static showWarning(messages) {
        toast.warning(<RenderMessage messages={messages} />, { autoClose: 5000 });
    }

    static showError(messages) {
        toast.error(<RenderMessage messages={messages} />, { autoClose: 5000 });
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