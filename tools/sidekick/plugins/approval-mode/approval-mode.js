/* eslint-disable no-undef, no-unused-vars, import/no-cycle */
import { loadCSS } from '../../../../scripts/aem.js';
import { createElement } from '../../../../scripts/scripts.js';

let selectedUser = '';
let selectedUserId = '';
let selectedRole = 'Approver';
let selectedRoleId = 4;
let selectedUserRole = [];

const createDialog = () => {
  const dialog = createElement('div', { id: 'hlx-a11y-mode-dialog' }, [
    createElement('div', { class: 'hlx-a11y-mode-dialog-container' }, [
      createElement('h4', { class: 'hlx-a11y-mode-dialog-title' }, 'Start Approval Process'),
      createElement('p', {}, 'Please select the role and approver'),
      createElement('div', { id: 'selection' }, [
        createElement('button', { id: 'btn-add', disabled: true }, '+'),
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
  selectedUserRole.push({ contactToken: selectedUserId, role: selectedRoleId });
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
};

const fetchUsers = async () => {
  const userList = [];
  await fetch('https://rest.proofhq.eu/api/v1/contacts', {
    headers: {
      'Content-Type': 'application/json',
      Sessionid: '03E1NDY5YmM4MjkzYmE5M2FiMWY0M2YzMDgxYTkr',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.map((user) => userList.push({ name: `${user.firstName} ${user.lastName}`, id: user.token }));
    });
  return userList;
};

function createRoleDropdown() {
  const select = document.createElement('select');
  select.classList = 'custom-select';
  select.id = 'role-selection';
  select.disabled = true;

  const roles = [
    { role: 'Approver', value: 4 },
    { role: 'Reviewer and Approver', value: 5 },
    { role: 'Author', value: 6 },
    { role: 'Moderator', value: 7 },
    { role: 'Read only', value: 1 },
  ];
  roles.forEach((role) => {
    const option = document.createElement('option');
    option.textContent = role.role;
    option.value = role.value;
    select.appendChild(option);
  });

  select.addEventListener('change', function () {
    const roleName = this.options[this.selectedIndex].textContent;
    selectedRole = roleName;
    selectedRoleId = this.value;
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
    option.value = user.id;
    select.appendChild(option);
  });

  select.addEventListener('change', function () {
    const name = this.options[this.selectedIndex].textContent;
    selectedUser = name;
    selectedUserId = this.value;
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
    const body = JSON.stringify(selectedUserRole);

    const requestOptions = {
      method: 'POST',
      headers,
      body,
      redirect: 'follow',
    };

    fetch(`http://localhost:8080/api/approvals?pageUrl=${page}`, requestOptions)
      .then((response) => response.text())
      .then(() => approvalStartDialog.remove());

    selectedUserRole = [];
  });

  const addButton = document.getElementById('btn-add');
  addButton.addEventListener('click', add, false);
};

export default initAccessibilityMode;
