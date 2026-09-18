function isValidation(name, age, email, phone){
    if(name.trim().toLowerCase() === ""){
        throw new Error("Tên không được để trống!");
    }
    return true;
}

export { isValidation };