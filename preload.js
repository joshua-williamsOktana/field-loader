const {ipcRenderer, contextBridge} = require('electron');
console.log("preload");
contextBridge.exposeInMainWorld('FIELD_LOADER', {
  openDialog: () => ipcRenderer.invoke('open-csv-dialogue'),
  setHeaderCheckbox : (hasHeader) => {
    ipcRenderer.invoke('set-header-checkbox',hasHeader);
  },
  openAuthWindow : ()=>{
    ipcRenderer.invoke('open-login-window');
  },
  createFields : ()=>{
    ipcRenderer.invoke('create-fields');
  },
  getProfiles : ()=>ipcRenderer.invoke('get-profiles'),
  getPermissionSets : ()=>ipcRenderer.invoke('get-permissionsets'),
  onAuthorizedOrg: (callback) => ipcRenderer.on('authorize-org', (_event, value) => callback(value)),
  setFieldLevelSecurity : (flsObj) => {
    ipcRenderer.invoke('set-field-level-security',flsObj);
  },
  getConfirmationInfo: () => ipcRenderer.invoke('get-confirmation-info'),
  createFieldsInSalesforce: () => ipcRenderer.invoke('create-fields-in-salesforce')
});
