/* eslint-disable no-undef, no-unused-vars */
import { loadCSS } from '../../../../scripts/aem.js';
import { createElement } from '../../../../scripts/scripts.js'; // eslint-disable-line import/no-cycle

const createDialog = () => {
  const dialog = createElement('div', { id: 'hlx-a11y-mode-dialog' }, [
    createElement('div', { class: 'hlx-a11y-mode-dialog-container' }, [
      createElement('h4', { class: 'hlx-a11y-mode-dialog-title' }, 'Start Approval Process'),
      createElement('p', {}, 'Please select the role and approver'),
      createElement('div', { class: 'hlx-a11y-mode-dialog-actions' }, [
        createElement('button', { class: 'hlx-a11y-mode-dialog-button' }, 'Start Approval Process '),
      ]),
    ]),
  ]);
  return dialog;
};

function createDropdown() {
  // Erstellen des 'select'-Elements
  const select = document.createElement('select');

  // Optionen für das Dropdown hinzufügen
  const options = ["Option 1", "Option 2", "Option 3"];
  options.forEach(optionText => {
    const option = document.createElement('option');
    option.textContent = optionText;
    option.value = optionText;
    select.appendChild(option);
  });

  // Optionales Hinzufügen eines Event Listeners für das 'change' Ereignis
  select.addEventListener('change', function () {
    console.log('Ausgewählte Option:', this.value);
  });

  return select;
}

const initAccessibilityMode = async () => {
  await loadCSS(`${window.hlx.codeBasePath}/tools/sidekick/plugins/accessibility-mode/accessibility-mode.css`);

  const approvalStartDialog = createDialog();
  approvalStartDialog.appendChild(createDropdown());
  document.body.appendChild(approvalStartDialog);

  const button = helpDialog.querySelector('.hlx-a11y-mode-dialog-button');

  button.addEventListener('click', () => {
    approvalStartDialog.remove();
  });
};

export default initAccessibilityMode;
