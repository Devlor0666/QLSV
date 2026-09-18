import { getData } from "./data/api.js"
import { renderOption, renderControlPages, renderPages } from "./ui/productUI.js"
import { filterStudents, deleteStudent, deboune, paginateStudents } from "./service/productService.js"
import { isValidation } from "./validation/studentValidation.js";

const table = document.getElementById('table');
const state = document.getElementById('state');
const input = document.getElementById('input'); 
const optionFilterWithClass = document.getElementById('filter-with-class');
const optionFilterWithMajor = document.getElementById('filter-with-major');
const optionSort = document.getElementById('sort');
const btnAdd = document.getElementById('btn-add');
const studentForm = document.getElementById('student-form');
const btnCancel = document.getElementById('btn-cancel');
const conFirmBox = document.getElementById('confirm-box');
const conFirm = document.getElementById('confirm');
const overlay = document.getElementById('overlay');
const cancel = document.getElementById('cancel');
const formAdd = document.getElementById('info');
const inputClass = document.getElementById('input-class');
const inputMajor = document.getElementById('input-major');
const btnReset = document.getElementById('reset');
const btnNext = document.getElementById('next');
const btnPrevious = document.getElementById('previous');
const page = document.getElementById('page');

let students = [];
let studentsFilter = [];
let currPage = 1;
let pageStudents = [];
let pageStudentsFilter = [];
const limit = 6;


function getTotalPage(){
    return Math.ceil(students.length / limit);
}

function getPageStudents(){
    return paginateStudents(students, currPage, limit);
}

function handleFilter(){
    state.textContent = "";
    const keywork = input.value.trim().toLowerCase();
    const className = optionFilterWithClass.value;
    const major = optionFilterWithMajor.value;
    const sort = optionSort.value;
    try{
        const result = filterStudents(students, keywork, className, major, sort);
        return result;
    }catch(error){
        state.textContent = error.message;
        return [];
    }
}

async function loadData() {
    try{
        state.textContent = "Đang lấy dữ kiệu...";
        students = await getData();
        renderOption(students, optionFilterWithMajor, "major");
        renderOption(students, optionFilterWithClass, "className");
        renderOption(students, inputClass, "className");
        renderOption(students, inputMajor, "major");

        renderPages(table, handleFilter(), currPage, limit);
    }catch(error){
        state.textContent = error.message;
        return;
    }

    state.textContent = "";
}
function resetPage(){
    currPage = 1;
    main();
}
   

function main(){
    pageStudentsFilter = handleFilter();

    if(pageStudentsFilter.length === 0) {
        state.textContent = "Không có sinh viên nào!";
        table.innerHTML = "";
        return;
    }
    state.textContent = "";
    renderPages(table, pageStudentsFilter, currPage, limit);
    renderControlPages(pageStudentsFilter.length, table, currPage, limit);
}
function applyFilter() {
    currPage = 1;
    main();
}

let studentIdDelete;
let editingStudentId = null;


//sửa, xóa
table.addEventListener('click', (event) => {
    if(event.target.classList.contains('btn-del')){
        conFirmBox.classList.add('active');
        overlay.classList.add('active');
        const id = Number(event.target.parentElement.dataset.id);
        studentIdDelete = id;
    }
    if(event.target.classList.contains('btn-edit')){
        const tr = event.target.closest('tr');
        const id = Number(tr.dataset.id);
        editingStudentId = id;
        const student = students.find(student => student.id === id);

        studentForm.classList.add('active');
        overlay.classList.add('active');

        studentForm.children[0].textContent = "---Sửa sinh viên---";
        
        document.getElementById('input-name').value = student.name;
        document.getElementById('input-age').value = student.age;
        document.getElementById('input-gender').value = student.gender;
        document.getElementById('input-class').value = student.className;
        document.getElementById('input-major').value = student.major;
        document.getElementById('input-email').value = student.email;
        document.getElementById('input-phone').value = student.phone;
        document.getElementById('input-address').value = student.address;
        document.getElementById('input-gpa').value = student.gpa;
        document.getElementById('input-credits').value = student.credits;
        document.getElementById('input-status').value = student.status;
    }
})

//hủy xóa
cancel.addEventListener('click', () => {
    overlay.classList.remove('active');
    conFirmBox.classList.remove('active');
})

//comfirm xóa
conFirm.addEventListener('click', () => {
    deleteStudent(students, studentIdDelete);
    pageStudents = getPageStudents();
    if(pageStudents.length === 0 || pageStudentsFilter.length === 0){
        currPage--;
        page.textContent = currPage;
    }

    main();
    overlay.classList.remove('active');
    conFirmBox.classList.remove('active');
})


//lọc
const handleInput = deboune(applyFilter, 1000);

input.addEventListener('input', handleInput);
optionFilterWithClass.addEventListener('change', applyFilter);
optionSort.addEventListener('change', applyFilter);
optionFilterWithMajor.addEventListener('change', applyFilter);

function resetForm() {
    formAdd.reset();
    editingStudentId = null;
}

//thêm
btnAdd.addEventListener('click', () => {
    resetForm();
    studentForm.classList.add('active');
    overlay.classList.add('active');
})


btnCancel.addEventListener('click', () => {
    studentForm.classList.remove('active');
    overlay.classList.remove('active');
})


btnReset.addEventListener('click', () => {
    optionFilterWithClass.value = "all";
    optionFilterWithMajor.value = "all";
    sort.value = "default";

    input.value = "";
    input.textContent = "";
    state.textContent = "";

    resetPage();
})

btnNext.addEventListener('click', () => {
    currPage++;
    main();
})
btnPrevious.addEventListener('click', () => {
    currPage--;
    main();
})

//thêm, sửa
formAdd.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('input-name').value;
    const age = document.getElementById('input-age').value;
    const gender = document.getElementById('input-gender').value;
    const className = document.getElementById('input-class').value;
    const major = document.getElementById('input-major').value;
    const email = document.getElementById('input-email').value;
    const phone = document.getElementById('input-phone').value;
    const address = document.getElementById('input-address').value;
    const gpa = document.getElementById('input-gpa').value;
    const credits = document.getElementById('input-credits').value;
    const status = document.getElementById('input-status').value;

    if(editingStudentId === null){
        try{
            isValidation(name);
        }catch(error){
            alert(error.message);
            return;
        }
        const newStudent = {
            id: students.length > 0
            ? Math.max(...students.map(student => student.id)) + 1
            : 1,
            name,
            age,
            gender,
            className,
            major,
            email,
            phone,
            address,
            gpa,
            credits,
            status
        }
        students.push(newStudent);
        alert("Thêm thành công!");

        currPage = getTotalPage();
        renderControlPages(students.length, table, currPage, limit);
        main();
    }
    else{
        const index = students.findIndex(student => student.id === editingStudentId);

        students[index] = {
            id: editingStudentId,
            name,
            age,
            gender,
            className,
            major,
            email,
            phone,
            address,
            gpa,
            credits,
            status
        }
        alert("Sửa thành công!");
    }

    main();
    overlay.classList.remove('active');
    studentForm.classList.remove('active');
})

loadData(students);
renderControlPages(students.length, table, currPage, limit);

