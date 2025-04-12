export default function (formRef: Ref<HTMLFormElement | null>) {
    if (!formRef.value) throw new Error('Form reference is null');
    const formData = new FormData(formRef.value);
    return Object.fromEntries(formData.entries());
}
