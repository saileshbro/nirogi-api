module.exports.isNameValid = (name) => {
    let regName = /^[a-zA-Z][a-zA-Z\s]*$/;
    return regName.test(name);
};