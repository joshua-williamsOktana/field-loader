window.FIELD_LOADER.getConfirmationInfo().then((obj) => {
  document.getElementById("rowCount").innerHTML = `${obj.totalRows} field${obj.totalRows > 1 ? "s" : ""} will be created on the ${obj.salesforceObject} object.`;
  document.getElementById("profileCount").innerHTML = `${obj.numberOfProfiles} profile${obj.numberOfProfiles > 1 ? "s" : ""} will be given read/edit permissions to these fields.`;
  document.getElementById("permissionSetCount").innerHTML = `${obj.numberOfPermissionSets} permission set${obj.numberOfPermissionSets > 1 ? "s" : ""} will be given read/edit permissions to these fields.`;
  document.getElementById("org").innerHTML = `Salesforce URL: ${obj.baseSalesforceURL}`;
});
document.getElementById("createFieldsConfirm").addEventListener("click", ()=>{
  FIELD_LOADER.createFieldsInSalesforce();
  confirm("Fields Created");
  window.close();
});