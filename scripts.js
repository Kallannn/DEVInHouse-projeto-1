//Pega os arrays do localstorage e a área onde as listas serão escritas no DOM
const arrReminders = JSON.parse(localStorage.getItem('Reminders'))||[]; 
const remindersSection = document.querySelector('.remindersSection')

drawReminders(arrReminders);

//Escreve os reminders no DOM
function drawReminders(arrReminders){

    let remindersStructure = '';
    
    for(let r = 0; r < arrReminders.length; r++){
        
        let reminder = arrReminders[r];

        let itemStructure = '';
        for(let i = 0; i < reminder.items.length; i++){
            let item = reminder.items[i];
            itemStructure = itemStructure + writeReminderItemModel(r,i, item);
        }

        remindersStructure = remindersStructure + writeReminderModel(r,reminder,itemStructure);
    }
    
    remindersSection.innerHTML = remindersStructure + `<div class="adddiv"><button class="addReminderButton" onclick="createNEWreminder()">+</button></div>`;

    if(arrReminders.length == 0){
        remindersSection.innerHTML =`<div class="emptyDiv"><p>Such empty...</p></div>` + remindersSection.innerHTML;
    }
}

//Cria e salva um novo Reminder(lista) e depois reescreve a tela
function createNEWreminder(){
    let newReminder = {};
    newReminder.Title = 'New Reminder';
    newReminder.items = [];
    newReminder.BoxClassExtra = '';
    newReminder.TitleClassExtra = '';
    newReminder.DivisorClassExtra = '';
    newReminder.ListBoxClassExtra = '';

    arrReminders.push(newReminder);
    saveArrReminders();
    drawReminders(arrReminders);
}

//Salva as listas no localstorage
function saveArrReminders(){
    localStorage.setItem('Reminders', JSON.stringify(arrReminders));
}

//Cria um novo item dentro de um reminder, salva o item no localstorage e redesenha a tela.
function createNewReminderItem(id){
    let newItem = {}
    newItem.reminderId = id;
    newItem.content = 'New item';
    newItem.itemClassExtra = '';
    newItem.marcado = false;

    arrReminders[id].items.push(newItem);
    saveArrReminders();
    drawReminders(arrReminders);
}

//Deleta o item passado por parâmetro
function deleteItem(reminderId, ItemId){
    arrReminders[reminderId].items.splice(ItemId,1);
    saveArrReminders();
    drawReminders(arrReminders);
}

//Deleta o reminder passado por parametro
function deleteReminder(reminderId){
    arrReminders.splice(reminderId,1);
    saveArrReminders();
    drawReminders(arrReminders);
}

//Função acionada quando a checkbox de um item muda.
//A função risca ou 'desrisca' o texto do item e salva o status do item.
function itemCheckChanged(marcado, reminderId, itemId){
    arrReminders[reminderId].items[itemId].marcado = marcado;

    if(marcado){
        document.querySelector(`#${"ItemLabel"+reminderId+"x"+itemId}`).classList.add("itemMarcado");
    }else{
        document.querySelector(`#${"ItemLabel"+reminderId+"x"+itemId}`).classList.remove("itemMarcado");
    }

    saveArrReminders();
}

//Função chamada quando o usuário clica no texto do item.
//A função alterna entre a visualização do edição do item e do painel de visualização do item.
//A função também salva o novo valor do texto do item antes de alternar de volta para o modo de visualização.
function ToggleEditItemMode(reminderId, ItemId){
    let viewBox = document.querySelector(`#${"ItemViewBox"+ reminderId +"x"+ItemId}`)
    let editBox = document.querySelector(`#${"ItemEditBox"+ reminderId +"x"+ItemId}`)
    let textInput = document.querySelector(`#${"itemTxt"+ reminderId +"x"+ItemId}`)

    if(viewBox.classList.contains("ItemVisible")){
        viewBox.classList.remove("ItemVisible")
        viewBox.classList.add("ItemInvisible")

        editBox.classList.remove("ItemInvisible")
        editBox.classList.add("ItemVisible")

        textInput.value = document.querySelector(`#${"ItemLabel"+reminderId+"x"+ItemId}`).innerHTML;
        textInput.focus();
        textInput.select();
    }else{
        viewBox.classList.remove("ItemInvisible")
        viewBox.classList.add("ItemVisible")

        editBox.classList.remove("ItemInvisible")
        editBox.classList.add("ItemVisible")

        editItemContent(textInput.value, reminderId, ItemId);
    }
}

//Mesma coisa que a ToggleEditItemMode porém para o título do Reminder
function ToggleEditReminderMode(reminderId){
    let viewBox = document.querySelector(`#${"reminderViewBox"+ reminderId}`)
    let editBox = document.querySelector(`#${"reminderEditBox"+ reminderId}`)
    let textInput = document.querySelector(`#${"reminderTxt"+ reminderId}`)

    if(viewBox.classList.contains("ReminderVisible")){
        viewBox.classList.remove("ReminderVisible")
        viewBox.classList.add("ReminderInvisible")

        editBox.classList.remove("ReminderInvisible")
        editBox.classList.add("ReminderVisible")

        textInput.value = document.querySelector(`#${"reminderTitle"+ reminderId}`).innerHTML;
        textInput.focus();
        textInput.select();
    }else{
        viewBox.classList.remove("ReminderInvisible")
        viewBox.classList.add("ReminderVisible")

        editBox.classList.remove("ReminderVisible")
        editBox.classList.add("ReminderInvisible")

        editRemindTitle(textInput.value, reminderId);
    }
}

//Função responsável por atualizar o texto de um item.
function editItemContent(content, reminderId, itemId){
    if(content.length > 0){
        arrReminders[reminderId].items[itemId].content = content;
        saveArrReminders();
        drawReminders(arrReminders);
    }
}

//Função responsável por atualizar o texto de um Reminder.
function editRemindTitle(title, reminderId){
    if(title.length > 0){
        arrReminders[reminderId].Title = title;
        saveArrReminders();
        drawReminders(arrReminders);
    }
}

//Função responsável por escrever o HTML do reminder preenchendo-o com os valores específicos de cada reminder
function writeReminderModel(id ,reminder,itemStructure){
    itemStructure = itemStructure + `<button onclick="createNewReminderItem(${id})">Add Item</button>`;
    return(`
        <div class="reminderBody ${reminder.BoxClassExtra}">

            <div id="${"reminderViewBox"+id}" class="reminderViewBox reminderBox ReminderVisible">
                <h3 id="reminderTitle${id}" class="reminderTitle" onclick="ToggleEditReminderMode(${id})">${reminder.Title}</h3>
                <img src="imgs/Fechar.png" id="${"ReminderDel"+id}" class="ReminderDel" onclick="deleteReminder(${id})">
            </div>

            <div id="${"reminderEditBox"+id}" class="reminderEditBox reminderBox ReminderInvisible">
                <input id="${"reminderTxt"+id}" type="text" class="reminderTxt" onblur="ToggleEditReminderMode(${id})">
            </div>

            <hr class="reminderDivisor ${reminder.DivisorClassExtra}">
            <ul class="reminderListBox ${reminder.ListBoxClassExtra}">
                ${itemStructure}
            </ul>

        </div>
    `)
}

//Função responsável por escrever o HTML dos items dos reminders preenchendo-os com os valores especificados
function writeReminderItemModel(reminderId, itemid, item){
    let marcadoChecked = ""
    let marcadoLineThr = ""
    if(item.marcado){
        marcadoChecked = "checked"
        marcadoLineThr = "itemMarcado"
    }
    return (`
        <li>
            <div id="${"ItemViewBox"+reminderId+"x"+itemid}" class="ItemBox ItemVisible">
                    <div class="itemDiv">
                        <input id="${"ItemChk"+reminderId+"x"+itemid}" type="checkbox" class="ItemChk" onchange="itemCheckChanged(this.checked,${reminderId},${itemid})" ${marcadoChecked}>
                    </div>
                    <div class="itemLabelDiv">
                        <p id="${"ItemLabel"+reminderId+"x"+itemid}" for="${"reminderItem"+reminderId+"x"+itemid}" class="ItemLabel ${marcadoLineThr}" onclick="ToggleEditItemMode(${reminderId},${itemid})">${item.content}</p>
                    </div>
                    <div class="itemDiv">
                        <img src="imgs/Fechar.png" id="${"ItemDel"+reminderId+"x"+itemid}" class="ItemDel" onclick="deleteItem(${reminderId},${itemid})">
                    </div>
            </div>


            <div id="${"ItemEditBox"+reminderId+"x"+itemid}" class="ItemBox ItemInvisible">
                <input id="${"itemTxt"+reminderId+"x"+itemid}" type="text" class="itemTxt" onblur="ToggleEditItemMode(${reminderId},${itemid})">
            </div>  
        </li>
    `)
}

