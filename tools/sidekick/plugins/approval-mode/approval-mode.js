/* eslint-disable no-undef, no-unused-vars */
import { loadCSS } from '../../../../scripts/aem.js';
import { createElement } from '../../../../scripts/scripts.js'; // eslint-disable-line import/no-cycle;

let selectedUser = '';
let selectedRole = 'Approver';
const selectedUserRole = [{ name: '', id: '', role: '' }];

const createDialog = () => {
  const dialog = createElement('div', { id: 'hlx-a11y-mode-dialog' }, [
    createElement('div', { class: 'hlx-a11y-mode-dialog-container' }, [
      createElement('h4', { class: 'hlx-a11y-mode-dialog-title' }, 'Start Approval Process'),
      createElement('p', {}, 'Please select the role and approver'),
      createElement('div', { id: 'selection' }, [
        createElement('button', { id: 'btn-add', disabled: true }, '+')
      ]),
      createElement('div', { id: 'result' }),
      createElement('div', { class: 'hlx-a11y-mode-dialog-actions' }, [
        createElement('button', { class: 'hlx-a11y-mode-dialog-button' }, 'Start Approval Process '),
      ]),

    ]),
  ]);
  return dialog;
};

const add = () => {
  selectedUserRole.push({ name: selectedUser, selectedRole: selectedRole });
  const div = document.createElement('div');
  div.id = 'result-list';
  const divName = document.createElement('div');
  divName.innerText = `Name: ${selectedUser}`;
  const divRole = document.createElement('div');
  divRole.id = 'result-role';
  divRole.innerText = selectedRole;
  div.append(divName);
  div.append(divRole);
  document.getElementById('result').appendChild(div);

  selectedRole = 'Approver';
  document.getElementById('btn-add').disabled = true;
  document.getElementById('role-selection').disabled = true;
}

const fetchUsers = async () => {
  let userList = [];
  await fetch('https://rest.proofhq.eu/api/v1/contacts', {
    headers: {
      'Content-Type': 'application/json',
      'Sessionid': '03E1NDY5YmM4MjkzYmE5M2FiMWY0M2YzMDgxYTkr',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.map(user => userList.push({ name: user.firstName + ' ' + user.lastName, id: user.accountToken }));
    })
  return userList;
}

function createRoleDropdown() {
  const select = document.createElement('select');
  select.classList = 'custom-select';
  select.id = 'role-selection';
  select.disabled = true;

  const options = ['Approver', 'Reviewer and Approver', 'Author', 'Moderator', 'Read only'];
  options.forEach((optionText) => {
    const option = document.createElement('option');
    option.textContent = optionText;
    option.value = optionText;
    select.appendChild(option);
  });

  select.addEventListener('change', function () {
    selectedRole = this.value;
    document.getElementById('btn-add').disabled = false;
  });

  return select;
}

async function createUserDropdown() {
  const userList = await fetchUsers();

  const select = document.createElement('select');
  select.classList = 'custom-select';


  userList.forEach((user) => {
    const option = document.createElement('option');
    option.textContent = user.name;
    option.value = user.name;
    select.appendChild(option);
  });

  select.addEventListener('change', function () {
    selectedUser = this.value;
    document.getElementById('role-selection').disabled = false;
  });

  return select;
}

const initAccessibilityMode = async () => {
  await loadCSS(`${window.hlx.codeBasePath}/tools/sidekick/plugins/approval-mode/accessibility-mode.css`);

  const approvalStartDialog = createDialog();
  document.body.appendChild(approvalStartDialog);
  const userDropDown = await createUserDropdown();
  document.getElementById('selection').prepend(createRoleDropdown());
  document.getElementById('selection').prepend(userDropDown);

  const button = approvalStartDialog.querySelector('.hlx-a11y-mode-dialog-button');

  button.addEventListener('click', () => {
    const page = window.location.href;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const raw = JSON.stringify([
      {
        'contactToken': 'dec79531pe5877710e79336b9ueb6f9c71d',
        'role': -1
      },
      {
        'contactToken': 'c6adba50p99980248ee0369eaudf702c102',
        'role': 4
      }
    ]);

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: raw,
      redirect: 'follow'
    };

    fetch(`http://localhost:8080/api/approvals?pageUrl=${page}`, requestOptions)
      .then((response) => response.text())
      .then(() => {        
        approvalStartDialog.remove();
      });
  });

  const addButton = document.getElementById('btn-add');
  addButton.addEventListener('click', add, false);
};

export default initAccessibilityMode;
