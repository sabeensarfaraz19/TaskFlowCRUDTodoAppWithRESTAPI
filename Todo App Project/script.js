
// Variables 
let addBtn = document.querySelector(".addBtn");
let todoContainer = document.querySelector(".todo-container");
let emptyState = document.querySelector(".empty-state");
let userInput = document.querySelector("#userInput");

let API = "https://6ace2b0ff338359cf1c33893.mockapi.io/todo/V1/todos";
addBtn.addEventListener("click", function () {
    postData(userInput.value)
});


// To get data from server
async function fetchData() {
    let response = await fetch(API);
    let updatedResponse = await response.json();
    todoContainer.innerHTML = "";
    emptyState.style.display =
        updatedResponse.length === 0 ? "block" : "none";
    updatedResponse.forEach(data => {

        let div = document.createElement("div");
        div.className = "task-item";
        div.innerHTML = ` <p class="task-title"> ${data.task} </p>
                            <input class="edit-input" type="text">
                         <div class="task-actions">
                         <button type="button" class="delete-btn">
                         <i class="fa-solid fa-trash-can"></i>
                         Delete
                         </button>
                         <button type="button" class="edit-btn">
                             <i class="fa-solid fa-pen"></i>
                             Edit
                         </button>
                             <button type="button" style="display: none;"  class="save-btn">
                                Save
                             </button>
                        </div>`

        let deleteBtn = div.querySelector(".delete-btn");
        let editBtn = div.querySelector(".edit-btn");
        let saveBtn = div.querySelector(".save-btn");
        let editInput = div.querySelector(".edit-input");
        let taskTitle = div.querySelector(".task-title");

        editBtn.addEventListener("click", function () {
            taskTitle.style.display = "none";
            editInput.style.display = "block";
            editInput.value = data.task;
            editBtn.style.display = "none";
            saveBtn.style.display = "inline-flex";
            editInput.focus();
            editInput.setSelectionRange(
                editInput.value.length,
                editInput.value.length
            );
        });
        saveBtn.addEventListener("click", function () {
            taskTitle.style.display = "block";
            editInput.style.display = "none";
            saveBtn.style.display = "none";
            editBtn.style.display = "inline-flex";
            updateData(data.id, editInput.value);
        });
        deleteBtn.addEventListener("click", function () {
            deleteData(data.id)
        })
        todoContainer.append(div);
    });
}


// For posting a data on Server 
async function postData(value) {
    if (value.length !== 0) {
        let data = {
            task: value.trim(),
        }
        let response = await fetch(API, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (response.status === 201) {
            fetchData();
        }
        userInput.value = ""
    }
}
fetchData();


// For Deleting Data On server
async function deleteData(id) {

    let response = await fetch(`${API}/${id}`, {
        method: "DELETE",
    });
    if (response.status === 200) {
        fetchData();
    }
}


// For Updating Data On Server
async function updateData(id, task) {
    let data = {
        task: task.trim(),
    }
    let response = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (response.status === 200) {
        fetchData();
    }
} 