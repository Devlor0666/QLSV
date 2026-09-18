function filterStudents(students, input, className, major, sort){
    const result = students.filter(student => {
        const checkInput = student.name.trim().toLowerCase().includes(input);
        const checkClassName = className === "all" || student.className === className;
        const checkMajor = major === "all" || student.major === major;

        return checkInput && checkClassName && checkMajor;
    })

    if(sort === "asc") result.sort((a, b) => a.gpa - b.gpa);
    if(sort === "desc") result.sort((a, b) => b.gpa - a.gpa);

    return result;
}

function deleteStudent(students, id){
    const index = students.findIndex(student => student.id === id)
    if(index !== -1) students.splice(index, 1);
}

const state = document.getElementById('state');
function deboune(callback, delay){
    let timer;
    return function(){
        clearTimeout(timer);
        state.textContent = "Đang tải...";
        timer = setTimeout(() => {
            state.textContent = "";
            callback()
        }, delay);
    }
} 

function paginateStudents(students, currentPage, limit) {
    const start = (currentPage - 1) * limit;
    return students.slice(start, start + limit);
}

export { filterStudents, deleteStudent, deboune, paginateStudents };