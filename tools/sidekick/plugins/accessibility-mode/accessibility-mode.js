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

const initAccessibilityMode = async () => {
  await loadCSS(`${window.hlx.codeBasePath}/tools/sidekick/plugins/accessibility-mode/accessibility-mode.css`);

  const helpDialog = createDialog();
  document.body.appendChild(helpDialog);

  const button = helpDialog.querySelector('.hlx-a11y-mode-dialog-button');

  button.addEventListener('click', () => {
    localStorage.setItem('hlx-a11y-mode-help', 'Disabled');
    helpDialog.remove();
  });
};

export default initAccessibilityMode;
