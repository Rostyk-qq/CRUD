document.addEventListener('DOMContentLoaded', async function (e) {
    
    let listOfUsers = document.querySelector('#users_list');
    const roleGet = {1: "Admin", 2: "User"};

    // main form
    const formParams = {
        form: document.querySelector('#form'),
        formSubmitBtn: document.querySelector('#footer_button-add')
    }

    // checkbox main and child
    const checkBox = {
        mainCheckBox: document.querySelector('#main_check-box'),
        getAllChildCheckBox: listOfUsers.querySelectorAll('#users_list .checkbox .table_checkbox-child')
    }
    
    // add modal select 
    const roles = [
        { value: "", label: "--Select Please--" },
        { value: "1", label: "Admin" },
        { value: "2", label: "User" }
    ];
    function createRoleOption(role) {
        return `<option value="${role.value}">${role.label}</option>`;
    }
    document.getElementById('form-select').innerHTML = roles.map(createRoleOption).join('');
  

    // dropdowns constants warning modal
    const containerBtnAdd = `<button type="button" class="btn btn-primary shadow-none custom-font content__button-add">Add</button>`;
    const containerBtnOk = `<button type="button" class="btn btn-primary shadow-none custom-font button_ok">Ok</button>`;

    document.getElementById('container_header').insertAdjacentHTML('afterbegin', containerBtnAdd);
    document.getElementById('container_header').insertAdjacentHTML('beforeend', containerBtnOk);

    document.getElementById('container_footer').insertAdjacentHTML('afterbegin', containerBtnAdd);
    document.getElementById('container_footer').insertAdjacentHTML('beforeend', containerBtnOk);

    const dropdown1 = new bootstrap.Dropdown(document.getElementById('dropdown_header'));
    const dropdown2 = new bootstrap.Dropdown(document.getElementById('dropdown_footer'));

    
    const dropDownLinks = {
        dropdown1: dropdown1,
        dropdown2: dropdown2,
        allDropDownElements1: dropdown1._element.querySelectorAll('ul li:not(:first-child) button'),
        allDropDownElements2: dropdown2._element.querySelectorAll('ul li:not(:first-child) button'),
        firstChild1: dropdown1._element.querySelector('ul li:first-child button'),
        firstChild2: dropdown2._element.querySelector('ul li:first-child button'), 
        mainButton1: dropdown1._element.querySelector('.button_text-show'),
        mainButton2: dropdown2._element.querySelector('.button_text-show')
    };

    const actionChoseError = new bootstrap.Modal(document.getElementById('modalWarningUserNotChose'));
    const warningTitle = document.querySelector('#warning_title');

    const buttonOk = {
        buttonsOk1: document.querySelector('#container_header .button_ok'),
        buttonsOk2: document.querySelector('#container_footer .button_ok')
    }

    setupDropdown(dropDownLinks.allDropDownElements1, dropDownLinks.mainButton1, buttonOk.buttonsOk1);
    setupDropdown(dropDownLinks.allDropDownElements2, dropDownLinks.mainButton2, buttonOk.buttonsOk2);

    checkUserSelection(dropDownLinks.dropdown1, dropDownLinks.firstChild1);
    checkUserSelection(dropDownLinks.dropdown2, dropDownLinks.firstChild2);


    // checkbox
    let sendUserForChange = [];
    
    function StatusChange(status){
        for (const user of sendUserForChange) {
            user.status = status;
        }
        return sendUserForChange;
    }
    checkBox.mainCheckBox.onchange = (e) => {
        if(e.target.checked){
            checkAll(true);
        }
        else{
            checkAll(false);
        }
    }
    checkBox.getAllChildCheckBox.forEach(checkBox => {
        checkChildUser(checkBox);
    })
    function checkAll(bool){
        if(!bool){
            checkBox.mainCheckBox.checked = false;
        }
        sendUserForChange = [];
        checkBox.getAllChildCheckBox.forEach(ch => {
            ch.checked = bool;
            getUserFromCheckBox(ch);
        })
    }
    function getUserFromCheckBox(check) {
        const val = parseInt(check.value);
        if (check.checked) {
            sendUserForChange.push({ id: val, status: 1 });
        } else {
            sendUserForChange = sendUserForChange.filter(el => el.id !== val);
        }

        if(sendUserForChange.length === Array.from(checkBox.getAllChildCheckBox).length){
            checkBox.mainCheckBox.checked = true;
        }
    }
 
    
    // dropdown create and submit 
    function getCheckedUsers(){
        const checkedUsers = Array.from(checkBox.getAllChildCheckBox).filter(checked => checked.checked).length; 
        return checkedUsers;
    }

    function checkUserSelection(dropdown, firstElement) {
        dropdown._element.addEventListener('shown.bs.dropdown', function (e) {
            const checkUsers = getCheckedUsers();
            
            const existingBElement = firstElement.querySelector('b');
    
            if (checkUsers && !existingBElement) {
                const createAccept = document.createElement('b');
                createAccept.innerHTML = '&#10004;&ensp;';
                firstElement.insertBefore(createAccept, firstElement.firstChild);
            } else if (!checkUsers && existingBElement) {
                existingBElement.remove();
            }
        });
    }
    

    function modalWarningShow(checkUsers, btn){
        if(checkUsers === 0){
            warningTitle.textContent = 'You don`t chose user!';
        }
        if(!btn.getAttribute('chose')){
            warningTitle.textContent = 'You don`t chose action!';
        }
        if(checkUsers === 0 && !btn.getAttribute('chose')){
            warningTitle.textContent = 'You don`t chose action and user!'; 
        }
        actionChoseError.show();
    }

    async function usingData(data, btn, mainButton){
        const checkNull = await sendChanges(data);
        if(checkNull){
            changeHtml(data);
            checkAll(false);
        }

        mainButton.textContent = '--Select Please--';
        btn.classList.remove('bg-primary');
        btn.removeAttribute('chose'); 
    }

    function setupDropdown(allDropDownElements, mainButton, buttonOk) {  
        allDropDownElements.forEach(btn => {
            btn.onclick = (e) => {
                allDropDownElements.forEach(otherBtn => {
                    otherBtn.removeAttribute('chose'); 
                    otherBtn.classList.remove('bg-primary');
                });

                btn.classList.add('bg-primary'); 
                mainButton.textContent = btn.textContent;
                btn.setAttribute('chose', 'true'); 
                checkSelectedAction(btn, btn.value, mainButton, buttonOk);
            } 
            buttonOk.onclick = () => {
                const checkUsers = getCheckedUsers();
                modalWarningShow(checkUsers, btn);
            }  
        })
    }
    function checkSelectedAction(btn, action, mainButton, buttonOk){
            buttonOk.onclick = async () => {
                const checkUsers = getCheckedUsers();
                if(checkUsers !== 0 && btn.getAttribute('chose')){
                    let data;
                    if(action === 'active'){
                        data = {users: [...StatusChange(1)], action: 'changeUsers'};
                        await usingData(data, btn, mainButton);
                    }
                    else if(action === 'non-active'){
                        data = {users: [...StatusChange(0)], action: 'changeUsers'};
                        await usingData(data, btn, mainButton);
                    }
                    else if(action === 'delete'){
                        if(checkUsers === 1){
                            userFullName.innerHTML = "Are you sure you want to delete this user?"
                        }
                        else if(checkUsers > 1){
                            userFullName.innerHTML = "Are you sure you want to delete this users?"
                        }
                        new bootstrap.Modal(document.getElementById('modalConfirm')).show();
                        document.getElementById('formConfirm').addEventListener('submit', async (e) => {
                            e.preventDefault();
                            data = {users: [...sendUserForChange], action: 'deleteUsers'};
                            await usingData(data, btn, mainButton);
                            document.querySelector('#close_modal-confirm').click();
                        })
                    }
                }
                else{
                    modalWarningShow(checkUsers, btn);
                }
            }
    }


    // form add update and delete form
    document.querySelectorAll('#page__table-container .content__button-add').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
    
            document.querySelector('.modal-header .modal-title').innerText = 'Add User';
            formParams.formSubmitBtn.innerText = 'Add';

            formParams.form.elements['id'].value = '';
    
            formParams.form.reset();
            new bootstrap.Modal(document.getElementById('staticBackdrop')).show();
        };
    })
    document.querySelectorAll('#users_list .table__btn-edit').forEach(btnEdit => {
        e.preventDefault();
        bindEvent(btnEdit);
    });

    document.querySelectorAll('#users_list .table__btn-remove').forEach(rmBtn => {
        e.preventDefault();
        removeUser(rmBtn);
    });


    // clear errors
    function ErrorsToNull(){
        document.querySelector('#not-chose').textContent = '';
        document.querySelector('#not-fill-f').textContent = '';
        document.querySelector('#not-fill-s').textContent = '';
    }
    formParams.form.querySelector('#footer_button-close').onclick = (e) => {
        ErrorsToNull();
    }
    document.querySelector('#header_button-close').onclick = (e) => {
        ErrorsToNull();
    }

    // getNameFor error
    function getFieldIdByErrorCode(code){
        switch(code){
            case 1: 
                return 'not-fill-f';
            case 2: 
                return 'not-fill-s';
            case 3: 
                return 'not-chose';
        }
    }

    // submit - add update delete and change after select
    formParams.form.addEventListener('submit', async (e) => {
        e.preventDefault();

        formParams.formSubmitBtn.disabled = true;

        const formData = new FormData(formParams.form);
        formData.set('status', formParams.form.elements['status'].checked ? 1 : 0);

        const user = {};
        
        formData.forEach((value, key) => {
            user[key] = value;
        });

        const response = await sendToBack('POST', user).then(response => response.json()); 
        ErrorsToNull();
        try{
            if (response.errors && response.status === false) {
                for (const value of response.errors) {
                    let path = getFieldIdByErrorCode(value.code);
                    document.querySelector(`#${path}`).textContent = value.message;
                }
            }
            else{
                if(!formParams.form.elements['id'].value){
                    appendUser(response.user);
                    getRmId(response.user.id);
                    getEditId(response.user.id);
                    getCheckBoxId(response.user.id);
                }
                else{
                    changeUser(response.user);
                }
                formParams.form.elements['id'].value = '';
                formParams.form.reset();
                formParams.form.querySelector('#footer_button-close').click();
                checkAll(false);
            }
        }
        catch(e){
            console.error('Error', e);
        }
        finally{
            formParams.formSubmitBtn.disabled = false;
        }
    });

    // submit delete
    function confirmDelete(idForDel){
        document.getElementById('formConfirm').addEventListener('submit', async function (e) {
            e.preventDefault();

            const data = {id: parseInt(idForDel), action: 'deleteUser'}

            try {
                const response = await sendToBack('POST', data).then(response => response.json());
                if(response.error && response.status === false){
                    console.log(response.error.message);
                }
                else{
                    deleteOneUser(idForDel);
                    document.querySelector('#close_modal-confirm').click();
                    checkAll(false);
                }
            } 
            catch (e) {
                console.error('Error', e);
            }
        });
    }

    // change users
    async function sendChanges(changeObj){
            const response = await sendToBack('POST', changeObj).then(response => response.json());
            if(response.error){
                if (response.error.code === 200) {
                    warningTitle.textContent = response.error.message; 
                    actionChoseError.show();
                }
                else{
                    console.log(response.error.message);
                }
                checkAll(false);
            }
            else{
                return true;
            }
    };


    // method Get Post
    async function sendToBack(method, data = null) {
        const handler = {
            method: method, 
            headers: {
                'Content-Type': 'application/json'
            }
        }
        data ? handler.body = JSON.stringify(data) : handler.body ? delete handler.body : void 0;
        const response = await fetch('http://localhost/backSideTask3/main.php', handler);
        return response;
    }


    // delete one user
    function deleteOneUser(id){
        let elem = document.querySelector(`#users_list tr[data-user-id="${id}"]`);
        if(elem){
            const checkbox = elem.querySelector('.checkbox input');
            if (checkbox) {
                checkbox.remove();
            }
            elem.remove();
        }
    }

    // change html after select
    async function changeHtml(data){
        for (const value of data.users) {
            const user = document.querySelector(`#users_list tr[data-user-id="${parseInt(value.id)}"]`);
            if(user){
                const checkBox = user.querySelector('.status_circle');
                if(data.action === 'changeUsers'){
                    parseInt(value.status) === 1 ? checkBox.classList.add('active') : checkBox.classList.remove('active');
                }
                if(data.action === 'deleteUsers'){
                    user.remove();
                }
            }
        }
    }

    // append html & update html 
    function appendUser(data) {    
        const userHtml = listOfUsers.querySelector(`tr[data-user-id='${data.id}']`);

        if(!userHtml){
            const user = `
            <tr data-user-id='${data.id}'>
                <td class='checkbox'>
                    <input class='form-check-input shadow-none fs-6 table_checkbox-child' type='checkbox' value='${data.id}'>
                </td>
                <td><span class='firstname' >${data.firstname}</span>  <span class='secondname' >${data.secondname}</span></td>
                <td class='role' value='${data.role}' >${roleGet[parseInt(data.role)]}</td>
                <td class='position-relative p-0'>
                    <span class='status_circle ${parseInt(data.status) === 1 ? 'active' : ''}'></span>
                </td>
                <td class='position-relative p-0 border-start-0'>
                    <div class='position-absolute d-flex top-50 start-50 translate-middle'>
                        <button data-btn-id='${data.id}' class='px-1 rounded-start
                        border-end-0 border-1 border bg-white border-black-50 fw-bolder text-black-50 p-0 table__btn-edit' id='table__btn-edit' >
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button data-rmBtn-id='${data.id}' class='px-1 rounded-end border-1 border border-black-50 bg-white text-black-50 p-0 
                        table__btn-remove' type='button' class='btn btn-primary'>
                            <i class='fa fa-trash'></i>
                        </button>
                    </div>
                </td>
            </tr>`;
            listOfUsers.insertAdjacentHTML('beforeend', user);
        }
    }

    // change user
    function changeUser(data) {
        if(data){
            const row = document.querySelector(`#users_list tr[data-user-id="${parseInt(data.id)}"]`);
            if(row){
                row.querySelector('.firstname').textContent = data.firstname;
                row.querySelector('.secondname').textContent = data.secondname;
    
                row.querySelector('.role').setAttribute('value', parseInt(data.role));
                row.querySelector('.role').textContent = roleGet[parseInt(data.role)];
    
                const checkBox = row.querySelector('.status_circle');
                parseInt(data.status) === 1 ? checkBox.classList.add('active') : checkBox.classList.remove('active');
            }
        }
    }

    // bind Events after method its for last user in table 
    function getEditId(btnId){
        const btnEdit = document.querySelector(`#users_list tr button[data-btn-id="${btnId}"]`);
        bindEvent(btnEdit);
    }

    function bindEvent(btnEdit){
        if(btnEdit){
            btnEdit.addEventListener('click', async function(e){
                const btnId = parseInt(btnEdit.getAttribute('data-btn-id'));

                const userExist = await checkUserExist({id: parseInt(btnId), action: 'checkUser'});

                if(userExist){
                    document.querySelector('.modal-header .modal-title').innerText = 'Edit User';
                    formParams.formSubmitBtn.innerText = 'Edit';
                
                    const row = document.querySelector(`#users_list tr[data-user-id="${parseInt(btnId)}"]`);
                    
                    formParams.form.elements['id'].value = btnId;
                    formParams.form.elements['firstname'].value = row.querySelector('.firstname').textContent;
                    formParams.form.elements['secondname'].value = row.querySelector('.secondname').textContent;
                    formParams.form.elements['role'].value = row.querySelector('.role').getAttribute('value');
                    const checkBox = row.querySelector('.status_circle');
                    formParams.form.elements['status'].checked = checkBox.classList.contains('active');
        
                    new bootstrap.Modal(document.getElementById('staticBackdrop')).show(); 
                }
            })
        }
    }

    function getRmId(btnRmId){
        const btnRem = document.querySelector(`#users_list tr button[data-rmBtn-id="${btnRmId}"]`);
        removeUser(btnRem);
    }
    function removeUser(delBtn){
        if(delBtn){
            delBtn.addEventListener('click', function(e){

                const btnDelId = parseInt(delBtn.getAttribute('data-rmBtn-id'));
                const deleteList = document.querySelector(`#users_list tr[data-user-id="${btnDelId}"]`);

                const userFullName = document.querySelector('#userFullName');
                userFullName.innerHTML = "Are you sure you want to delete <b id='confirm__firstname'></b> <b id='confirm__secondname'></b>?"
    
                userFullName.querySelector('#confirm__firstname').textContent = deleteList.querySelector('.firstname').textContent;
                userFullName.querySelector('#confirm__secondname').textContent = deleteList.querySelector('.secondname').textContent;
                new bootstrap.Modal(document.getElementById('modalConfirm')).show();
                
                confirmDelete(btnDelId);
            })
        }
    }

    function getCheckBoxId(checkId){
        const btnChecked = document.querySelector(`#users_list tr input[value="${parseInt(checkId)}"]`);
        checkBox.getAllChildCheckBox = Array.from(checkBox.getAllChildCheckBox).concat([btnChecked]);
        checkChildUser(btnChecked);
    }
    function checkChildUser(check){
        if(check){
            check.onchange = () => {
                if(!check.checked){
                    checkBox.mainCheckBox.checked = false;
                    getUserFromCheckBox(check);
                }
                getUserFromCheckBox(check)
            }
        }
    } 

    async function checkUserExist(data){
        const response = await sendToBack('POST', data).then(response => response.json()); 
        if(response.error){
            if(response.error.code === 200){
                warningTitle.textContent = response.error.message; 
                actionChoseError.show();
            }
            else{
                console.log(response.error.message);
            }
            checkAll(false);
        }
        else{
            return true;
        }
    }
});
 