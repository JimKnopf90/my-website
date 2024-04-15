/* eslint-disable no-undef, no-unused-vars */
import { loadCSS } from '../../../../scripts/aem.js';
import { createElement } from '../../../../scripts/scripts.js'; // eslint-disable-line import/no-cycle
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';

const sa11yElements = [
  'sa11y-control-panel',
  'sa11y-tooltips',
  'sa11y-dismiss-tooltip',
  '#sa11y-colour-filters',
  'sa11y-heading-label',
  'sa11y-heading-anchor',
];

function createCustomElements() {
  // Erstellen des 'sp-theme'-Elements
  const theme = document.createElement('sp-theme');
  theme.setAttribute('theme', 'spectrum');
  theme.setAttribute('color', 'light');
  theme.setAttribute('scale', 'medium');
  theme.style.backgroundColor = 'var(--spectrum-gray-100)';

  // Erstellen des 'sp-button'-Elements
  const button = document.createElement('sp-button');
  button.textContent = 'Click me!';
  button.onclick = function () {
    spAlert(this, 'Themed <sp-button> clicked!');
  };

  // Hinzufügen des Buttons zum Theme-Element
  theme.appendChild(button);

  // Hinzufügen des Theme-Elements zum Body des Dokuments
  document.body.appendChild(theme);
}

const createDialog = () => {
  const dialog = createElement('div', { id: 'hlx-a11y-mode-dialog' }, [
    createElement('div', { class: 'hlx-a11y-mode-dialog-container' }, [
      createElement('h4', { class: 'hlx-a11y-mode-dialog-title' }, 'Welcome to Accessibility Mode!'),
      createElement('p', {}, 'Accessibility Mode is a tool that helps you to identify accessibility issues on your page. It scans the page from a content perspective and reports on things like missing alt text, missing headings, etc.'),
      createElement('p', {}, 'Accessibility Mode is not a replacement for a full accessibility audit and does not guarantee compliance with a certain accessibility standard. It is a tool that helps you to identify and fix issues that can be fixed by content authoring.'),
      createElement('p', {}, 'The page outline provides a hierarchical view of the page content. It is a great way to understand the structure of the page and to identify any issues with the page structure.'),
      createElement('p', {}, 'The readability score provides an indication of how easy it is to read the content on the pag, and it is based on the Flesch Reading Ease test.'),
      createElement('p', {}, 'Custom checks for EDS blocks can be added on a per project basis.'),
      createElement('sup', {}, 'Note: This tool is extended from the open source project <a href="https://sa11y.netlify.app/overview/" target="_blank">Sa11y</a>.'),
      createElement('div', { class: 'hlx-a11y-mode-dialog-actions' }, [
        createElement('button', { class: 'hlx-a11y-mode-dialog-button' }, 'Don’t Show Again'),
        createElement('sp-button', { class: 'test' }, 'Peter'),
      ]),
    ]),
  ]);

  return dialog;
};

const initAccessibilityMode = async (shouldActivateA11yMode) => {
  const html = document.querySelector('html');

  if (shouldActivateA11yMode) {
    await loadCSS(`${window.hlx.codeBasePath}/tools/sidekick/plugins/accessibility-mode/accessibility-mode.css`);

    if (localStorage.getItem('hlx-a11y-mode-help') !== 'Disabled') {
      const helpDialog = createDialog();
      document.body.appendChild(helpDialog);

      createCustomElements();

      const button = helpDialog.querySelector('.hlx-a11y-mode-dialog-button');

      button.addEventListener('click', () => {
        localStorage.setItem('hlx-a11y-mode-help', 'Disabled');
        helpDialog.remove();
      });
    }
  } else {
    html.removeAttribute('data-sa11y-theme');
    html.removeAttribute('data-sa11y-active');

    [...sa11yElements].forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      [...elements].forEach((element) => {
        element.style.display = 'none';
      });
    });

    const helpDialog = document.querySelector('#hlx-a11y-mode-dialog');
    const isDialogDisabled = localStorage.getItem('hlx-a11y-mode-help') !== 'Disabled';
    const shouldHideDialog = helpDialog && isDialogDisabled;

    if (shouldHideDialog) {
      helpDialog.remove();
    }

    sa11y.resetAll(false);
  }
};

export default initAccessibilityMode;
