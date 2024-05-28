/* eslint-disable no-undef, no-unused-vars, import/no-cycle */
import { loadCSS } from '../../../../scripts/aem.js';
import { createElement } from '../../../../scripts/scripts.js';

const baseUrl = 'http://localhost:8080';
let selectedUserRole = [];
const roles = [
  { role: 'Approver', value: 4 },
  { role: 'Reviewer and Approver', value: 5 },
  { role: 'Author', value: 6 },
  { role: 'Moderator', value: 7 },
  { role: 'Read only', value: 1 },
];

function createRoleDropdown() {
  const select = document.createElement('select');
  select.classList = 'custom-select';
  select.id = 'role-selection';

  roles.forEach((role) => {
    const option = document.createElement('option');
    option.textContent = role.role;
    option.value = role.value;
    select.appendChild(option);
  });

  return select;
}

function createWorkflowParticipants() {
  const approvers = document.getElementById('approvers');

  while (approvers.rows.length > 1) {
    approvers.deleteRow(1);
  }

  selectedUserRole.forEach((userRole, index) => {
    const row = approvers.insertRow(index + 1);
    const name = row.insertCell(0);
    const role = row.insertCell(1);
    name.innerHTML = userRole.name;

    const roleDropdown = createRoleDropdown();
    roleDropdown.value = userRole.role;
    roleDropdown.disabled = false;

    roleDropdown.addEventListener('change', function () {
      userRole.role = this.value;
    });

    role.appendChild(roleDropdown);
  });
}

const add = (name, contactToken, role) => {
  document.getElementById('search').value = '';
  document.getElementById('hint').hidden = false;
  document.getElementById('hit-list').hidden = true;
  selectedUserRole.push({ name, contactToken, role });
  document.getElementById('btn-start-approval').disabled = false;

  createWorkflowParticipants();
};

function createUserHitList(userList) {
  const hitList = document.getElementById('hit-list');
  userList.forEach((user) => {
    const entry = document.createElement('div');
    entry.className = 'hallo';
    entry.textContent = `${user.name} (${user.email}) `;
    entry.addEventListener('click', () => add(user.name, user.id, 4), false);
    hitList.appendChild(entry);
  });
}

const fetchUsers = async (query) => {
  const response = await fetch(`${baseUrl}/api/approvers?value=${encodeURIComponent(query)}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data.contacts.map((user) => ({ name: user.name, email: user.email, id: user.token }));
};

const createDialog = () => {
  const dialog = createElement('div', { id: 'hlx-approval-dialog' }, [
    createElement('div', { class: 'hlx-a11y-mode-dialog-container' }, [
      createElement('h4', { class: 'hlx-a11y-mode-dialog-title' }, 'Start Approval Process'),
      createElement('p', {}, 'Search for approver and add a role'),
      createElement('div', { id: 'result' }, [
        createElement('table', { id: 'approvers' }, [
          createElement('tr', {}, [
            createElement('th', { class: 'col' }, 'Name or email address of the recipient'),
            createElement('th', { class: 'col' }, 'Role'),
          ]),
        ]),
      ]),
      createElement('input', { id: 'search', type: 'text', placeholder: 'Type the contacts name or email address to add a recipient' }),
      createElement('div', { id: 'hit-list', hidden: 'true' }),
      createElement('p', { id: 'hint' }, 'Type at least 3 characters'),
      createElement('div', { class: 'hlx-a11y-mode-dialog-actions' }, [
        createElement('button', { class: 'hlx-a11y-mode-dialog-button', id: 'btn-start-approval', disabled: 'true' }, 'Start Approval Process '),
      ]),
    ]),
  ]);

  const searchInput = dialog.querySelector('#search');
  searchInput.addEventListener('input', async () => {
    const { value } = searchInput;
    if (value.length >= 3) {
      document.getElementById('hit-list').innerHTML = '';
      document.getElementById('hit-list').hidden = false;
      document.getElementById('hint').hidden = true;
      const userList = await fetchUsers(value);
      createUserHitList(userList);
    } else {
      document.getElementById('hint').hidden = false;
      document.getElementById('hit-list').hidden = true;
    }
  });

  return dialog;
};

const initApprovalMode = async (sourceLocation, previewUrl) => {
  await loadCSS(`${window.hlx.codeBasePath}/tools/sidekick/plugins/approval-mode/approval.css`);

  const approvalStartDialog = createDialog();
  document.body.appendChild(approvalStartDialog);

  const button = approvalStartDialog.querySelector('.hlx-a11y-mode-dialog-button');

  button.addEventListener('click', () => {
    button.disabled = true;
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
};

export default initApprovalMode;
