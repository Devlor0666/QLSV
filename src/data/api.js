async function getData() {
    try{
        const response = await fetch("./src/public/students.json");

        if(!response.ok){
            throw new Error("Không lấy được dữ liệu");
        }
        let students = await response.json();
        return students;
    }catch(error){
        console.log(error.message);
        throw error;
    }
}

export { getData };