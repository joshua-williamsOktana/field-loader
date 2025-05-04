let profileTableBody = document.getElementById("profileTableBody");
let permissionSetTableBody = document.getElementById("permissionSetTableBody");
document.getElementById("permissionForm").onsubmit = (event) =>{
  const data = new FormData(event.target);
  let returnData = {};
  
  for (const [name,value] of data) {
    let permissionObj = {};
    let permissionInfo = value.split("_");
    if(!returnData.hasOwnProperty(permissionInfo[0])){
      returnData[permissionInfo[0]] = {};
    }
    returnData[permissionInfo[0]][permissionInfo[2]] = true;
    returnData[permissionInfo[0]]["profile"] = permissionInfo[1] === "profile";
    console.log(name, ":", value)
  }
  FIELD_LOADER.setFieldLevelSecurity(returnData);
  return false;
};

let testArray = ["System Administrator", "Sales", "Marketing"];

FIELD_LOADER.getProfiles().then((response)=>{
    console.log(response);
    response.records.forEach((element, index) =>{
        profileTableBody.innerHTML += `
        <tr class="slds-hint-parent">
            <td data-label="Field-Level Security for Profile">
              <div class="slds-truncate" title="${element.Name}">${element.Name}</div>
            </td>
            <td data-label="Visible">
              <div class="slds-form-element">
                <div class="slds-form-element__control">
                  <div class="slds-checkbox">
                    <input type="checkbox" name="options" id="${element.Id + '_profile_visible'}" value="${element.Id + '_profile_visible'}" data-testid="${element.Id + '_profile_visible'}" />
                    <label class="slds-checkbox__label" for="${element.Id + '_profile_visible'}">
                      <span class="slds-checkbox_faux"></span>
                      <span class="slds-form-element__label"></span>
                    </label>
                  </div>
                </div>
              </div>
            </td>
            <td data-label="Read-Only">
              <div class="slds-form-element">
                <div class="slds-form-element__control">
                  <div class="slds-checkbox">
                    <input type="checkbox" name="options" id="${element.Id + '_profile_readOnly'}" value="${element.Id + '_profile_readOnly'}"  data-testid="${element.Id + '_profile_readOnly'}"/>
                    <label class="slds-checkbox__label" for="${element.Id + '_profile_readOnly'}">
                      <span class="slds-checkbox_faux"></span>
                      <span class="slds-form-element__label"></span>
                    </label>
                  </div>
                </div>
            </div>
            </td>
            </tr>`;
    });    
});
FIELD_LOADER.getPermissionSets().then((response)=>{
    console.log(response);
    response.records.forEach((element, index) =>{
        permissionSetTableBody.innerHTML += `
        <tr class="slds-hint-parent">
            <td data-label="Field-Level Security for Profile">
              <div class="slds-truncate" title="${element.Name}">${element.Name}</div>
            </td>
            <td data-label="Visible">
              <div class="slds-form-element">
                <div class="slds-form-element__control">
                  <div class="slds-checkbox">
                    <input type="checkbox" name="options" id="${element.Id + '_permissionSet_visible'}" value="${element.Id + '_permissionSet_visible'}" data-testid="${element.Id + '_permissionSet_visible'}"/>
                    <label class="slds-checkbox__label" for="${element.Id + '_permissionSet_visible'}">
                      <span class="slds-checkbox_faux"></span>
                      <span class="slds-form-element__label"></span>
                    </label>
                  </div>
                </div>
              </div>
            </td>
            <td data-label="Read-Only">
              <div class="slds-form-element">
                <div class="slds-form-element__control">
                  <div class="slds-checkbox">
                    <input type="checkbox" name="options" id="${element.Id + '_permissionSet_readOnly'}" value="${element.Id + '_permissionSet_readOnly'}" data-testid="${element.Id + '_permissionSet_readOnly'}"/>
                    <label class="slds-checkbox__label" for="${element.Id + '_permissionSet_readOnly'}">
                      <span class="slds-checkbox_faux"></span>
                      <span class="slds-form-element__label"></span>
                    </label>
                  </div>
                </div>
            </div>
            </td>
            </tr>`;
    });    
});

