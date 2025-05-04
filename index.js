let badgeContainer = document.getElementById("badgeContainer");
let hasOrg = false;
let hasCSV = false;
document.getElementById("loginButton").addEventListener("click",()=>{
    FIELD_LOADER.openAuthWindow();
});
document.getElementById("loadCSV").addEventListener("click", ()=>{
    FIELD_LOADER.openDialog().then((fileName)=>{
        if(fileName != null){
            let csvBadge = document.getElementById("csvLoaded");
            hasCSV = true;
            checkCreateFieldsButton();
            if(csvBadge != null){
                csvBadge.innerHTML = `Loaded ${fileName}`;
            }else{
                badgeContainer.innerHTML += `<span class="slds-badge slds-badge_inverse" id="csvLoaded">Loaded ${fileName}</span>`;
            }
        }
    });
});
document.getElementById("headerCheckbox").addEventListener('change', (event)=>{
    FIELD_LOADER.setHeaderCheckbox(event.target.checked);
});
document.getElementById("createFields").addEventListener("click",()=>{
    FIELD_LOADER.createFields();
});
window.FIELD_LOADER.onAuthorizedOrg((orgName) => {
    let orgBadge = document.getElementById("orgBadge");
    hasOrg = true;
    checkCreateFieldsButton();
    if(orgBadge != null){
        orgBadge.innerHTML = `Loaded ${fileName}`;
    }else{
        badgeContainer.innerHTML += `<span class="slds-badge slds-badge_inverse" id="orgBadge">Authorized ${orgName}</span>`;
    }
});
let checkCreateFieldsButton = ()=>{
    if(hasCSV && hasOrg){
        console.log('TRIGGERED');
        document.getElementById("createFields").disabled = false;
    }
}