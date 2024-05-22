/* eslint-disable no-undef, no-unused-vars, import/no-cycle */
import { loadCSS } from '../../../../scripts/aem.js';
import { createElement } from '../../../../scripts/scripts.js';

const baseUrl = 'https://95ed-2003-f9-872f-f800-4584-666c-3a37-38ef.ngrok-free.app';
const selectedUser = '';
const selectedUserId = '';
let selectedRole = 'Approver';
let selectedRoleId = 4;
let selectedUserRole = [];
const roles = [
  { role: 'Approver', value: 4 },
  { role: 'Reviewer and Approver', value: 5 },
  { role: 'Author', value: 6 },
  { role: 'Moderator', value: 7 },
  { role: 'Read only', value: 1 },
];

function getRoleNameById(roleId) {
  const role = roles.find((r) => r.value === roleId);
  if (role) {
    return role.role;
  }
  return 'Role not found';
}

const add2 = (name, contactToken, role) => {
  selectedUserRole.push({ contactToken, role });

  const div = document.createElement('div');
  div.id = 'result-list';

  const divName = document.createElement('div');
  divName.innerText = `Name: ${name}`;

  const divRole = document.createElement('div');
  divRole.id = 'result-role';
  divRole.innerText = getRoleNameById(role);

  div.append(divName);
  div.append(divRole);
  document.getElementById('result').appendChild(div);
};

function createUserHitList(userList) {
  const hitList = document.getElementById('hit-list');
  userList.forEach((user) => {
    const entry = document.createElement('div');
    entry.textContent = `${user.name} - ${user.email} `;
    entry.addEventListener('click', () => add2(user.name, user.id, 4), false);
    hitList.appendChild(entry);
  });
}

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
  await fetch('http://localhost:8080/api/approvers?value=Pat', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.contacts.map((user) => userList.push({ name: user.name, id: user.token }));
    });
  return userList;
};

const fetchUsers2 = async (query) => {
  const response = await fetch(`${baseUrl}/api/approvers?value=${encodeURIComponent(query)}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data.contacts.map((user) => ({ name: user.name, email: user.email, id: user.token }));
};

function createRoleDropdown() {
  const select = document.createElement('select');
  select.classList = 'custom-select';
  select.id = 'role-selection';
  select.disabled = true;

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

const createDialog = () => {
  const dialog = createElement('div', { id: 'hlx-a11y-mode-dialog' }, [
    createElement('div', { class: 'hlx-a11y-mode-dialog-container' }, [
      createElement('h4', { class: 'hlx-a11y-mode-dialog-title' }, 'Start Approval Process'),
      createElement('p', {}, 'Please select the approver and role'),
      createElement('input', { id: 'search', type: 'text', placeholder: 'Search for approvers' }),
      createElement('div', { id: 'hit-list' }),
      createElement('div', { id: 'selection' }, [
        // createElement('button', { id: 'btn-add', disabled: true }, '+'),
      ]),
      createElement('div', { id: 'result' }),
      createElement('div', { class: 'hlx-a11y-mode-dialog-actions' }, [
        createElement('button', { class: 'hlx-a11y-mode-dialog-button' }, 'Start Approval Process '),
      ]),
    ]),
  ]);

  const searchInput = dialog.querySelector('#search');
  searchInput.addEventListener('input', async () => {
    const { value } = searchInput;
    if (value.length >= 3) {
      document.getElementById('hit-list').innerHTML = '';
      const userList = await fetchUsers2(value);
      createUserHitList(userList);
    }
  });

  return dialog;
};

// async function createUserDropdown() {
//   const userList = await fetchUsers();

//   const select = document.createElement('select');
//   select.classList = 'custom-select';

//   userList.forEach((user) => {
//     const option = document.createElement('option');
//     option.textContent = user.name;
//     option.value = user.id;
//     select.appendChild(option);
//   });

//   select.addEventListener('change', function () {
//     const name = this.options[this.selectedIndex].textContent;
//     selectedUser = name;
//     selectedUserId = this.value;
//     document.getElementById('role-selection').disabled = false;
//   });

//   return select;
// }

const initApprovalMode = async (sourceLocation, previewUrl) => {
  await loadCSS(`${window.hlx.codeBasePath}/tools/sidekick/plugins/approval-mode/accessibility-mode.css`);

  const approvalStartDialog = createDialog();
  document.body.appendChild(approvalStartDialog);
  // const userDropDown = await createUserDropdown();

  // document.getElementById('selection').prepend(createRoleDropdown());
  // document.getElementById('selection').prepend(userDropDown);

  const button = approvalStartDialog.querySelector('.hlx-a11y-mode-dialog-button');

  button.addEventListener('click', () => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const body = JSON.stringify(selectedUserRole);

    const requestOptions = {
      method: 'POST',
      headers,
      body,
      redirect: 'follow',
    };

    fetch(`${baseUrl}/api/approvals?pageUrl=${previewUrl}&source=${sourceLocation}`, requestOptions)
      .then((response) => response.text())
      .then(() => approvalStartDialog.remove());

    selectedUserRole = [];
  });

  const addButton = document.getElementById('btn-add');
  addButton.addEventListener('click', add, false);
};

export default initApprovalMode;
