export default function (formRef: Ref<HTMLFormElement | null>) {
    if (!formRef.value) throw new Error('Form reference is null');
    const formData = new FormData(formRef.value);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
        if (typeof value === 'string') {
            data[key] = value;
        } else {
            throw new Error(`Unexpected file input for key: ${key}`);
        }
    });
    return data;
}
