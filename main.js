const { app, protocol, BrowserWindow, dialog, ipcMain, net, session } = require('electron')
const path = require('path');
const fs = require('fs');
const csv = require('fast-csv');
const url = require('url');
const SalesforceAPIWrapper = require('./salesforceAPIWrapper');
let salesforceObject;
let profileResponse;
let hasHeader = false;
let csvObjectArray = [];
let permissionMap;
let wizardWindow;
let connectedAppId='3MVG9dAEux2v1sLtPvxG8RIB7vcXzABAtg0Uep7Ae2_Jp3VpCNRJWvxiURfg9gTdHji15g40DAQE6FBfsb_8l';
let win;

let createFieldsInSalesforce = () => {
    csvObjectArray.forEach( async (element,index) =>{
        if(hasHeader && index == 0){
            return;
        }
        //process picklist
        let picklistValues = {valueSetDefinition: {value: []}};
        element[8].split('|').forEach( (picklistVal) =>{
            picklistValues.valueSetDefinition.value.push({valueName: picklistVal, label: picklistVal})
        });
        SalesforceAPIWrapper.insertField(salesforceObject,element[0],element[1],element[2],element[3],(element[4].toLowerCase() === "true"),(element[5].toLowerCase() === "true"),(element[6].toLowerCase() === "true"),(element[7].toLowerCase() === "true"),picklistValues);
        Object.keys(permissionMap).forEach((permissionId) =>{
            if(permissionMap[permissionId].profile == true){
                SalesforceAPIWrapper.insertFieldPermissionsProfile(permissionId,salesforceObject + "." + element[0],salesforceObject,(permissionMap[permissionId].visible === true),(permissionMap[permissionId].readOnly !== true) );
            }else{
                SalesforceAPIWrapper.insertFieldPermissionsPermissionSet(permissionId,salesforceObject + "." + element[0],salesforceObject,(permissionMap[permissionId].visible === true),(permissionMap[permissionId].readOnly !== true) );
            }
            
        });
    });
}
const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 300,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        }
    });
    win.loadFile('index.html');
    ipcMain.handle('open-csv-dialogue', async () => {
        let obj = await dialog.showOpenDialog({properties: ['openFile']});
        if(obj.canceled != true){
            salesforceObject = path.parse(obj.filePaths[0]).name;
            csvObjectArray = [];
            fs.createReadStream(obj.filePaths[0]).pipe(csv.parse({ headers: false }))
            .on('error', error => console.error(error))
            .on('data', row => {csvObjectArray.push(row)})
            .on('end', rowCount => console.log(csvObjectArray));    
            return path.basename(obj.filePaths[0]);
        }else{
            return null
        }
    });
    ipcMain.handle('set-header-checkbox', (_event, header) => {
        hasHeader = header;
    });
    ipcMain.handle('set-field-level-security', (_event, flsObj) => {
        permissionMap = flsObj;
        wizardWindow.loadFile('createFieldsWizardStep2.html');
        
    });
    ipcMain.handle('create-fields-in-salesforce', (_event, flsObj) => {
        createFieldsInSalesforce();
    });
    
    ipcMain.handle('open-login-window', async () => {
        var authWindow = new BrowserWindow({
            width: 800, 
            height: 600, 
            show: false, 
            'node-integration': false,
            'web-security': false
        });
        var authUrl = "https://login.salesforce.com/services/oauth2/authorize?response_type=token&client_id="+connectedAppId+"&redirect_uri=http%3A%2F%2Flocalhost";
        authWindow.loadURL(authUrl);
        authWindow.show();
        authWindow.webContents.on('did-start-navigation', function (event, newUrl) {
            if(newUrl.includes("localhost")){
                let url = new URL(newUrl);
                let queryParams = new URLSearchParams(url.hash.substring(1));
                SalesforceAPIWrapper.init(queryParams.get('access_token'),queryParams.get('instance_url'));
                console.log(queryParams.get('access_token'));
                win.webContents.send('authorize-org', SalesforceAPIWrapper.baseSalesforceURL);
                console.log(SalesforceAPIWrapper.baseSalesforceURL);
                authWindow.close();
            }
        });
        authWindow.on('closed', function() {
            authWindow = null;
        });
    });
    ipcMain.handle('create-fields', () => {
        wizardWindow = new BrowserWindow({
            width: 800,
            height: 800,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: true
            }
        });
        //wizardWindow.webContents.send("profiles", profileResponse);
        wizardWindow.loadFile('createFieldsWizardStep1.html');
    });
    ipcMain.handle('get-profiles', async (event) => {
        return await SalesforceAPIWrapper.retrieveProfiles();
    });
    ipcMain.handle('get-confirmation-info', async (event) => {
        let numberOfProfiles = 0;
        let numberOfPermissionSets = 0;
        Object.keys(permissionMap).forEach((profileId)=>{if(permissionMap[profileId].profile === true){numberOfProfiles++}});
        Object.keys(permissionMap).forEach((profileId)=>{if(permissionMap[profileId].profile === false){numberOfPermissionSets++}});
        return {totalRows: csvObjectArray.length - (hasHeader ? 1 : 0), salesforceObject: salesforceObject, numberOfProfiles: Object.keys(permissionMap).length,  numberOfProfiles: numberOfProfiles, numberOfPermissionSets: numberOfPermissionSets, baseSalesforceURL: SalesforceAPIWrapper.baseSalesforceURL}
    });
    ipcMain.handle('get-permissionsets', async (event) => {
        return await SalesforceAPIWrapper.retrievePermissionSets();
    });
}
app.whenReady().then(() => {
    createWindow();
})