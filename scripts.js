const contacts = [];

const contactListEl = document.getElementById('contact-list');
const searchEl = document.getElementById('search');
const addContactBtn = document.getElementById('add-contact');
const addModal = document.getElementById('add-modal');
const closeModalBtn = document.getElementById('close-modal');
const addContactForm = document.getElementById('add-contact-form');

function renderContacts() {
    contactListEl.innerHTML = '';
    const query = searchEl.value.toLowerCase();

    const sortedContacts = [...contacts]
        .filter(contact => contact.name.toLowerCase().includes(query))
        .sort((a, b) => (b.isFavorite - a.isFavorite) || a.name.localeCompare(b.name));

    sortedContacts.forEach(contact => {
        const card = document.createElement('div');
        card.className = 'contact-card';

        const contactInfo = document.createElement('div');
        contactInfo.className = 'contact-info';
        contactInfo.innerHTML = `
            <img src="https://via.placeholder.com/50" alt="${contact.name}">
            <div>
                <div>${contact.name}</div>
                <div>${contact.phone}</div>
            </div>
        `;

        const actions = document.createElement('div');
        actions.className = 'actions';

        const favoriteBtn = document.createElement('button');
        favoriteBtn.textContent = contact.isFavorite ? '★' : '☆';
        favoriteBtn.title = contact.isFavorite ? 'Удалить из избранного' : 'Добавить в избранное';
        favoriteBtn.addEventListener('click', () => {
            contact.isFavorite = !contact.isFavorite;
            renderContacts();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑';
        deleteBtn.title = 'Удалить контакт';
        deleteBtn.addEventListener('click', () => {
            const index = contacts.indexOf(contact);
            contacts.splice(index, 1);
            renderContacts();
        });

        actions.appendChild(favoriteBtn);
        actions.appendChild(deleteBtn);
        card.appendChild(contactInfo);
        card.appendChild(actions);
        contactListEl.appendChild(card);
    });
}

addContactForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const isFavorite = document.getElementById('is-favorite').checked;

    if (!name || !phone || !/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone)) {
        alert('Введите корректные данные. Телефон должен быть в формате +7 (XXX) XXX-XX-XX');
        return;
    }

    contacts.push({ name, phone, isFavorite });
    addModal.classList.remove('active');
    renderContacts();
    addContactForm.reset();
});

addContactBtn.addEventListener('click', () => addModal.classList.add('active'));
closeModalBtn.addEventListener('click', () => addModal.classList.remove('active'));

searchEl.addEventListener('input', renderContacts);

let addedPlusSeven = false;

document.getElementById('phone').addEventListener('input', e => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) {
        value = value.substring(0, 11);
    }

    if (value.length > 0 && !value.startsWith('+7') && !addedPlusSeven) {
        value = '+7' + value;
        addedPlusSeven = true;
    } else if (value.length === 0) {
      addedPlusSeven = false;
    } else if (value.length < 3 && value.startsWith('+7')){
        value = value.substring(2);
        addedPlusSeven = false;
    }


    let formattedValue = '';
    if (value.length > 0) {
        formattedValue = value.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+7 ($2) $3-$4-$5');
    }

    e.target.value = formattedValue;
});

renderContacts();
