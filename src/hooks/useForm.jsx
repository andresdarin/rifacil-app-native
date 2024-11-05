// src/hooks/useForm.js
import { useState } from 'react';

export const useForm = (initialObj = {}) => {
    const [form, setForm] = useState(initialObj);

    const changed = (name, value) => {
        setForm({
            ...form,
            [name]: value,
        });
    };

    return {
        form,
        changed,
    };
};
