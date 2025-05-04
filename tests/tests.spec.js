
const { test, expect, _electron: electron } = require('@playwright/test');
const { log } = require('electron-builder');
const path = require('path');


let loadCSV = async (electronApp,window,csvName) =>{
  electronApp.evaluate(
    async({ dialog }, filePaths) => {
      dialog.showOpenDialog = () => Promise.resolve({ canceled: false, filePaths });
    },
    [path.join(__dirname, csvName)]
  );
  await window.getByText('Load Field CSV').click();
  return 
}
let authorizeMockOrg = async (electronApp,window) =>{
  let windowPromise = electronApp.waitForEvent('window');
  await window.getByText('Authorize Org').click();
  let loginWindow = await windowPromise;
  expect(loginWindow.url().includes("login.salesforce.com"));
  loginWindow.goto("http://localhost/#access_token=mocktoken&instance_url=https%3A%2F%2Fmockurl.develop.my.salesforce.com").catch(()=>{});
}
let openFLSWindow = async (electronApp,window) =>{
  
  let windowPromise = electronApp.waitForEvent('window');

  await window.getByText('Create Fields').click();
  const FLSwindow = await windowPromise;
  
  return FLSwindow;
}

test('Authorize org successfully authorizes', async () => {
  const electronApp = await electron.launch({ args: ['.'] });
  const window = await electronApp.firstWindow();
  await authorizeMockOrg(electronApp,window);
  expect(window.getByText('Authorized https://mockurl.develop.my.salesforce.com') != null);
  await electronApp.close()
});

test('Confirm csv is read', async () => {
  const electronApp = await electron.launch({ args: ['.'] });
  const window = await electronApp.firstWindow();
  await loadCSV(electronApp,window,'Account.csv');
  expect(window.getByText('Loaded Account.csv') != null);
  // close app
  await electronApp.close()
});


test('Field Creation Mock', async () => {
  const electronApp = await electron.launch({ env: {MOCK_API: true, ...process.env},args: ['main.js'] });
  const window = await electronApp.firstWindow();
  await loadCSV(electronApp,window,'Account.csv');
  await authorizeMockOrg(electronApp,window);
  let FLSwindow = await openFLSWindow(electronApp,window);
  await FLSwindow.getByTestId('00egL0000012dXlQAI_profile_visible').setChecked();
  await FLSwindow.getByText('Next').click();
  await FLSwindow.getByText("Confirm and Create Fields").click();
  await electronApp.close();
});