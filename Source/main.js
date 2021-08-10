
function c(...value) {
    console.log(...value)
}

const $ = document.querySelector.bind(document)
const pushData = $('.data__result')
const nameInput = $('input[name="name"]')
const addressInput = $('input[name="address"]')
const addBtn = $('.addBtn')
const editBtn = $('.editBtn')
const saveBtn = document.querySelector('.saveBtn')
var load = $('.modal__overlay')

const API = 'http://localhost:3000/information'

var html

//------GET-----

function getData(callback) {
    fetch(API)
        .then((respond) => respond.json())
        .then(callback)
}
function renderData(result) {
    html = result.map((value) => {
        return `
        <div id="box${value.id}">
            <label>Name: </label>
            <li>${value.name}</li> 
            <br>
            <label>Address: </label>
            <li>${value.address}</li> 
            <br>
            <div class="thaotac">
            <button class="deleteBtn" onclick="deleteData(${value.id})">Del</button>
            <button class="editTargetBtn" onclick="getEditData(${value.id})">Edit</button>
            </div>
         </div>
        `
    })
    pushData.innerHTML = html.join('')
    load.style.display = 'none';
    $('.data__result > :last-child').scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
}

getData(renderData)
//------POST----

function createData(data) {
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(API, options)
        //so we need to put it here after the data POST to the server
        .then(() => {
            getData(renderData) //so we need to put it here
        })
    //-------------------------------------
}

//------PUT-----
function editData(data, id) {
    let options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(API + '/' + id, options)
        .then(() => {
            getData(renderData) //the same to do to fix Async
        })
}

//--------DELETE--------
function deleteData(id) {
    flagEdit = flagAdd = false
    addBtn.classList.remove('active')
    editBtn.classList.remove('active')
    load.style.display = 'block';
    let options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    }
    fetch(API + '/' + id, options)
        .then(() => {
            getData(renderData) //the same to do to fix Async
        })
}

//------------------HANDLE ADD BTN-------------------------

var flagAdd = false
function handleCreateData() {
    if (flagAdd) {
        load.style.display = 'block';
        let formData = {
            name: nameInput.value,
            address: addressInput.value
        }
        createData(formData)    //---async
        addBtn.classList.remove('active')
        resetPlacehoulder()
        flagAdd = false
        // getData(renderData)  //--- render current data due to waitting async before

    }
}
// request two value to click ADD button
$('.controller').oninput = () => {
    if (!flagEdit) {
        if (nameInput.value != '' && addressInput.value != '') {
            flagAdd = true
            addBtn.classList.add('active')
        }
        else {
            addBtn.classList.remove('active')
        }
    }

}

addBtn.onclick = () => {
    handleCreateData()
}

//------------------HANDLE EDIT BTN-------------------------
function handleEditData(id) {
    if (flagEdit) {
        load.style.display = 'block';
        setTimeout(() => {
            let formData = {
                name: nameInput.value,
                address: addressInput.value
            }
            editData(formData, id)
            resetPlacehoulder()
        }, 2000)
        flagEdit = false
        editBtn.classList.remove('active')
        addBtn.classList.remove('active')
    }
}
var flagEdit = false
var idEdit
//-----Edit Selector to take value into two input below!-----
function getEditData(id) {
    // c( document.querySelector(`#box${id} li:nth-child(2)`))
    // c($(`#box${id} li:nth-child(5)`).innerText)
    idEdit = id // còn hàm bên ngoài nữa cần id
    c(idEdit)
    flagEdit = true
    flagAdd = false
    nameInput.focus()
    nameInput.placeholder = addressInput.placeholder = ''
    addBtn.classList.remove('active')
    editBtn.classList.add('active')
    nameInput.value = $(`#box${id} :nth-child(2)`).innerText
    addressInput.value = $(`#box${id} :nth-child(5)`).innerText
    nameInput.setSelectionRange(0, 100) // boi den
    $(`#box${id}`).scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
    // edit button after you click edit selector
    editBtn.onclick = () => {
        handleEditData(idEdit)
    }
}




// --------------reset value input--------------
function resetPlacehoulder() {
    nameInput.placeholder = 'input name value to add'
    addressInput.placeholder = 'input address value to add'
    nameInput.value = ''
    addressInput.value = ''
    nameInput.blur()
    addressInput.blur()
}
//---------handle to use ENTER Key
var handling = false
function noName() {
    return nameInput.placeholder = '*empty name value!'
}
function noAddress() {
    return addressInput.placeholder = '*empty address value!'
}
function noNameEdit() {
    return nameInput.placeholder = '*empty value to endit !'
}
function noAddressEdit() {
    return addressInput.placeholder = '*empty value to edit !'
}
$('.controller').onkeydown = (e) => {
    c(flagAdd, flagEdit)
    if (e.key == 'Enter') {
        if (flagEdit) {    // ---------Enter to add case
            if (!nameInput.value && !addressInput.value) {
                noNameEdit()
                noAddressEdit()
            } else if (!nameInput.value) {
                noNameEdit()
                nameInput.focus()
            }
            else if (!addressInput.value) {
                noAddressEdit()
                addressInput.focus()
            }

            if (nameInput.value && addressInput.value) {
                handleEditData(idEdit)
            }
        }
        else {
            c('vao')
            // ---------Enter to add case
            if (!nameInput.value && !addressInput.value) {
                noName()
                noAddress()
            } else if (!nameInput.value) {
                c('name')
                noName()
                nameInput.focus()
            }
            else if (!addressInput.value) {
                c('addre')
                noAddress()
                addressInput.focus()
            }

            if (nameInput.value && addressInput.value) {
                handleCreateData()
            }

        }

    }
}
document.onkeydown = (e) => {
    if (e.key == 'Enter' && !flagAdd && !flagEdit) {
        nameInput.focus()
        $('.data__result > :last-child').scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
    }
    else {
        c(flagAdd, flagEdit)
    }
}



$('.cancelBtn').onclick = () => {
    flagEdit = flagAdd = false
    addBtn.classList.remove('active')
    editBtn.classList.remove('active')
    resetPlacehoulder()
}

// text animation
const typedTextSpan = $('.typed-text')
const textArray = ["Địa Chỉ", "Họ Tên", "Số 1 Việt Nam!"]
const typingDelay = 200
const erasingDelay = 100
const newTextDelay = 500
let textArrayIndex = 0
let charIndex = 0

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    }
    else {
        setTimeout(erase, typingDelay);
    }
}
function erase() {
    if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--
        setTimeout(erase, erasingDelay)

    }
    else {
        textArrayIndex++
        if (textArrayIndex >= textArray.length) textArrayIndex = 0
        setTimeout(type, typingDelay + 1100)
    }
}
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(type, newTextDelay + 250)
})
c('nothing')