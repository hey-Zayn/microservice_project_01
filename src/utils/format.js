const formatValidationErrors = (errors) => {
    if (!errors || !errors.errors) return "Validation failed";
    if (Array.isArray(errors.errors)) {
        return errors.errors.map(i => i.message).join(", ");
    }
    return JSON.stringify(errors.errors || errors);
}

module.exports = {
    formatValidationErrors
}