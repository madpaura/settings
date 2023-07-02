const { remote } = require('electron');
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

let jsonData = [];

// Helper function to render the current settings tab
function renderTab(tab) {
  const app = document.getElementById('tabcontent');
  app.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'settings-container';
  const title = document.createElement('h2');
  title.textContent = tab;
  container.appendChild(title);

  jsonData[tab].forEach((item) => {
    const element = createUIElement(item);
    container.appendChild(element);
  });

  app.appendChild(container)
}
function createUIElement(item) {
  const wrapper = document.createElement('div');
  wrapper.className = 'row mb-1';

  const element = document.createElement('div');
  element.className = 'setting-row';

  const label = document.createElement('label');
  label.textContent = item.label;

  let inputElement;

  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'input-group';
  inputWrapper.appendChild(label);

  switch (item.type) {
    case 'input':
      inputElement = document.createElement('input');
      inputElement.type = 'text';
      inputElement.id = item.id;
      inputElement.className = 'form-control';
      inputWrapper.appendChild(inputElement);
      break;

    case 'checkbox':
      inputElement = document.createElement('input');
      inputElement.type = 'checkbox';
      inputElement.id = item.id;
      inputElement.className = 'form-check-input';
      inputWrapper.appendChild(inputElement);
      break;

    case 'list':
      inputElement = document.createElement('select');
      inputElement.id = item.id;
      inputElement.className = 'form-select';
      item.options.forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.textContent = option;
        inputElement.appendChild(optionElement);
      });
      inputWrapper.appendChild(inputElement);
      break;

    case 'boolean':
      inputElement = document.createElement('input');
      inputElement.type = 'checkbox';
      inputElement.id = item.id;
      inputElement.className = 'form-check-input';
      inputWrapper.appendChild(inputElement);
      break;

    default:
      break;
  }

  element.appendChild(inputWrapper);
  wrapper.appendChild(element);

  return wrapper;
}

function getValueFromInputElement(type, inputElement) {
  switch (type) {
    case 'input':
      return inputElement.value;

    case 'checkbox':
    case 'boolean':
      return inputElement.checked;

    case 'list':
      return inputElement.value;

    default:
      return null;
  }
}

function updateJSONData(id, value) {
  const jsonDataPath = path.join(__dirname, 'data.json');
  jsonData.forEach((item) => {
    if (item.id === id) {
      item.value = value;
    }
  });

  // Save updated JSON data to file
  // fs.writeFile(jsonDataPath, JSON.stringify(jsonData), 'utf8', (err) => {
  //   if (err) {
  //     console.error('Error saving JSON data:', err);
  //   } else {
  //     console.log('JSON data saved successfully!');
  //   }
  // });
}



// Handle navigation events from the main process
ipcRenderer.on('navigate-tab', (event, tab) => {
  renderTab(tab);
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  const tabs = ['fw', 'guestos'];
  const tabContainer = document.createElement('div');
  tabContainer.className = 'tab-container';

  tabs.forEach((tab) => {
    console.log(tab)
    const tabButton = document.createElement('button');
    tabButton.textContent = tab;
    tabButton.addEventListener('click', () => {
      ipcRenderer.send('navigate-tab', tab);
    });
    tabContainer.appendChild(tabButton);
  });

  const tabView = document.createElement('div');
  tabView.className = 'tab-view'
  tabView.id = 'tabcontent'
  const app = document.getElementById('app');
  app.appendChild(tabContainer);
  app.appendChild(tabView)

  const jsonDataPath = path.join(__dirname, 'data.json');

  // Load JSON data from file
  fs.readFile(jsonDataPath, 'utf8', (err, data) => {
    if (!err) {
      jsonData = JSON.parse(data);
      renderTab(tabs[0]);
    }
  });

});
