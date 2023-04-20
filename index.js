let inputSurname = document.getElementById('surname');
let inputName = document.getElementById('name');
let inputPatronymic = document.getElementById('patronymic');
let inputDateBorn = document.getElementById('date-born');
let buttonSaveData = document.getElementById('btn-save-card');
let buttonOpenModal = document.getElementById('btn-open-modal');
let listCards = document.getElementById('list-cards');
let cards = document.querySelectorAll('card-member');

let buttonClear = document.getElementById('clear');
let selectIdParent = document.getElementById('select-id-parent');
let formSelectParent = document.getElementById('form-select-parent');

const editTaskModalElement = document.getElementById('editCardModal');
const editTaskModal = new bootstrap.Modal(editTaskModalElement);
const modalBody = document.getElementById('modal-body');
const modalTitle = document.querySelector('.modal-title');


let dataCardsFamily = [];


renderCardsFamily();

// Когда модальное окно закрыто стирается содержимое инпутов и ...
editTaskModalElement.addEventListener('hidden.bs.modal', (event) => {
    inputName.value = '';
    inputSurname.value = '';
    inputPatronymic.value = '';
    inputDateBorn.value = '';
    modalBody.classList.remove('hidden');
    modalTitle.innerHTML = '';
});

// Закрытие модального окна после ...
function closeEditModal() {
    const editTaskModalInstance = bootstrap.Modal.getInstance(editTaskModalElement);
    editTaskModalInstance.hide();
}

buttonOpenModal.addEventListener('click', (event) => {
    event.stopImmediatePropagation();
    inputSurname.innerHTML = '';
    inputName.innerHTML = '';
    inputPatronymic.innerHTML = '';
    editTaskModal.toggle();

    let listener = function (event) {
        
        let newMember = {
            surname: inputSurname.value,
            name: inputName.value,
            patronymic: inputPatronymic.value,
            dateBorn: inputDateBorn.value,
            parentId: selectIdParent.value
        }
    
        const options = {
             method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(newMember)
        }
    
        if(inputSurname !== '' && inputName !== '' && inputPatronymic !== '') {
            fetch('http://localhost/treefamily/create', options)
                    .then(response => response.json())
                    .then((data) => {
                        closeEditModal();
                        dataCardsFamily.push(data);
                        let html = document.createElement('div');
                        html.className = 'card-member';
                        html.id = `card-${data.id}`;
                        html.innerHTML = templateWithoutDiv(data);
                        listCards.append(html);
                        addListenertsToCard(html);
                        
                        buttonSaveData.removeEventListener('click', listener);
                    })
                    .catch(error => console.error(error));
    
        }
    }

   buttonSaveData.addEventListener('click', listener);
})

const template = (item) => {
    return `<div class='card-member mt-2' data-card='${item.parent_id}' id='card-${item.id}'>${templateWithoutDiv(item)}</div>`;
}

const templateWithoutDiv = (item) => {
    return `<div class="card d-flex me-4" style="width: 18rem;">
    <div class="card-body d-flex justify-content-between">
        <div class"info">
            <h7 class="surname-info">${item.surname}</h7>
            <h7 class="name-info">${item.name}</h7>
            <h7 class="patronymic-info">${item.patronymic}</h7>
            <p class="date-born-info mb-0">${item.date}</p>
        </div>
        <div class="btn-delete" id="delete">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#888888" d="M18 19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4V4h4.5l1-1h4l1 1H19v3h-1v12M6 7v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V7H6m12-1V5h-4l-1-1h-3L9 5H5v1h13M8 9h1v10H8V9m6 0h1v10h-1V9Z"/></svg>
      </div>
    </div>
  </div> 
    `
}

function renderCardsFamily() {
   fetch('http://localhost/treefamily')
   .then(response => response.json())
   .then(result => {
        dataCardsFamily = result;
        console.log(result);

        renderHtml();
        addEventListeners();
   })
}

// sortparentChild();

// function sortparentChild() {

//     let sortArr = Object.keys


// }

function renderHtml() {
    dataCardsFamily.forEach(item => {
        //console.log(item.id);
        let newOption = new Option(item.surname + ' ' + item.name + ' ' + item.patronymic, item.id);
        selectIdParent.append(newOption);
        
        listCards.innerHTML += template(item);
    })
    
}

//Слушатели на все карточки
function addEventListeners() {
    let cards = document.querySelectorAll('.card-member');
    
    // let dataCard = cards.getAttribute('data-card');
    // console.log(dataCard);

    for( i = 0; i < cards.length; i++) {
        addListenertsToCard(cards[i]);
    }
}

// task-{id} => id Функция удаления префикса task из task-id
const formattedCardId = (stringId) => {
    return stringId.replace('card-', '');
}

//Слушатель на одну карточку
function addListenertsToCard(cardElement) {
    const item = cardElement;
    const divId = item.getAttribute('id');
    const btnDeleteCard = item.querySelector('.btn-delete');

    btnDeleteCard.addEventListener('click', event => {
        
        event.stopImmediatePropagation();
        const cardId = formattedCardId(divId);
        
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
        fetch(`http://localhost/treefamily/${cardId}`, options)
            .then(response => response.json())
            .then((data) => {
                item.remove();
            })
    })

    // let dataCard = item.getAttribute('data-card');
    // console.log(dataCard);



};

// Очистка 
buttonClear.addEventListener('click', (event) => {

    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
    }

    fetch('http://localhost/treefamily', options)
        .then(response => response.json())
        .then(result => {
            dataCardsFamily = [];
        })
});

// selectIdParent.addEventListener('click', event => {
//     event.stopImmediatePropagation();
//     fetch('http://localhost/treefamily/id-parent')
//     .then(response => response.json()) 
//     .then(result => {
        
        
//     })
// })

