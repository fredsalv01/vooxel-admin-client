import React from 'react';
import { toast } from 'react-toastify';

export default class ToastNotification {

    constructor(messages = []) {
        this.messages = messages;
    }

    showSuccess() {
        toast.success(<RenderMessage messages={this.messages} />, { autoClose: 5000 });
    }

    showError() {
        toast.error(<RenderMessage messages={this.messages} />, { autoClose: 5000 });
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