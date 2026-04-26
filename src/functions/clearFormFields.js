function clearFormFields (formFields) {
    Object.values(formFields).forEach((field) => {
        field.value = null
    })
}

export default clearFormFields