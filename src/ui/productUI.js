import { paginateStudents } from "../service/productService.js";

function render(students, table){
    table.innerHTML = "";
    if(students.length === 0){
        throw new Error("Không có sinh viên nào!");
    }

    const trHead = document.createElement('tr');
    const headers = [
        "MSV",
        "Họ và tên",
        "Tuổi",
        "Giới tính",
        "Lớp",
        "Ngành",
        "Email",
        "Số điện thoại",
        "Địa chỉ",
        "GPA",
        "Số tín chỉ",
        "Trạng thái"
    ];

    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        trHead.appendChild(th);
    })

    table.appendChild(trHead);
    students.forEach(student => {
        const trBody = document.createElement('tr');
        trBody.dataset.id = student.id;
        const values = [
            student.id,
            student.name,
            student.age,
            student.gender,
            student.className,
            student.major,
            student.email,
            student.phone,
            student.address,
            student.gpa,
            student.credits,
            student.status
        ]; 
        values.forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            if(value === student.status && student.gpa < 5){
                td.textContent = "Cảnh báo";
                td.style.color = "red";
            }
            if(value === student.id ||
                value === student.age ||
                value === student.gpa ||
                value === student.credits) td.classList.add('middle'); 
            trBody.appendChild(td);
        });

        const btnDel = document.createElement('button');
        const btnEdit = document.createElement('button');

        btnDel.textContent = "Xóa";
        btnEdit.textContent = "Sửa";

        btnDel.classList.add('btn-del');
        btnEdit.classList.add('btn-edit');

        trBody.appendChild(btnDel);
        trBody.appendChild(btnEdit);

        table.appendChild(trBody);
    });
}

function renderOption(students, optionFilter, property){
    const values = [...new Set(students.map(student => student[property]))];

    values.forEach(value => {
        const option = document.createElement('option');

        option.value = value;
        option.textContent = value;

        optionFilter.appendChild(option);
    })
}

function renderControlPages(totalItem, table, currPage, limit){
    const totalPage = Math.ceil(totalItem / limit);

    const page = document.getElementById('page');
    const btnNext = document.getElementById('next');
    const btnPrevious = document.getElementById('previous');

    page.textContent = currPage;
    btnNext.textContent = ">";
    btnPrevious.textContent = "<";
        
    if(currPage=== 1){
        btnPrevious.style.display = "none";
    }
    else{
        btnPrevious.textContent = "<";
        btnPrevious.style.display = "block";
    }

    if(currPage === totalPage){
        btnNext.style.display = "none";
    }
    else{
        btnNext.textContent = ">";
        btnNext.style.display = "block";
    }
}

function renderPages(table, students, currPage, limit){
    const result = paginateStudents(students, currPage, limit);
    render(result, table);
}

export { renderOption, renderControlPages, renderPages };