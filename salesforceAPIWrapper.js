const axios = require('axios');

class SalesforceAPIWrapper {
    static bearerToken = '';
    static baseSalesforceURL = '';
    static privateconfig;
    static http;
    static apiVersion = 'v63.0';
    static init(bearerToken,baseSalesforceURL){
        this.bearerToken = bearerToken;
        this.baseSalesforceURL = baseSalesforceURL;
        this.config = {
            headers: { 'Authorization': `Bearer ${this.bearerToken}` }
        };
        this.http = axios.create({
            baseURL: this.baseSalesforceURL
        });
    }
    static async retrieveProfiles(){
        if(process.env.MOCK_API){
            return {
                size: 43,
                totalSize: 43,
                done: true,
                queryLocator: null,
                entityTypeName: "Profile",
                records: [
                    {
                        attributes: {
                            type: "Profile",
                            url: "/services/data/v63.0/tooling/sobjects/Profile/00egL0000012dXlQAI"
                        },
                        Id: "00egL0000012dXlQAI",
                        Name: "System Administrator"
                    }
                ]
              };
        }else{
            let response = await this.http.get('/services/data/'+this.apiVersion+'/tooling/query?q=SELECT%20Id%2CName%20FROM%20Profile',this.config);
            return response.data;
        }
        
    }
    static async retrievePermissionSets(){
        if(process.env.MOCK_API){
            return {
      
                size: 43,
                totalSize: 43,
                done: true,
                queryLocator: null,
                entityTypeName: "Profile",
                records: [
                    {
                        attributes: {
                            type: "Profile",
                            url: "/services/data/v63.0/tooling/sobjects/Profile/00egL0000012dXlQAI"
                        },
                        Id: "00egL0000012dXlQAI",
                        Name: "System Administrator"
                    },
                    
                ]
              };
        }else{
            let response = await this.http.get('/services/data/'+this.apiVersion+'/tooling/query?q=SELECT%20Id%2CName%20FROM%20PermissionSet%20WHERE%20Type%3D%27Regular%27',this.config);
            return response.data;
        }
    }
    static async insertField(sobjectType,fieldName,label,type,inlineHelpText,required,unique,caseSensitive,externalId,valueSet,referenceTo,relationshipName){
        let fieldMetadata = {
            FullName : sobjectType + "." + fieldName,
            Metadata :  {label: label,type: type, inlineHelpText: inlineHelpText,required: required, unique: unique,caseSensitive: caseSensitive, externalId: externalId, valueSet: valueSet, referenceTo: referenceTo, relationshipName: relationshipName}
        }
        await this.http.post('/services/data/'+this.apiVersion+'/tooling/sobjects/CustomField',fieldMetadata,this.config).catch((error) => (console.log(error.response.data)));
    }
    static insertFieldPermissionsPermissionSet(permissionSetId,field,sobjectType,permissionsRead,permissionsEdit){
         let permissionMetadata = {
            ParentId: permissionSetId,
            Field : field,
            SobjectType : sobjectType,
            PermissionsRead : permissionsRead,
            PermissionsEdit : permissionsEdit
        }
        this.http.post('/services/data/'+this.apiVersion+'/sobjects/FieldPermissions',permissionMetadata,this.config).catch((error) => (console.log(error.response.data)));
    }
    static insertFieldPermissionsProfile(profileId,field,sobjectType,permissionsRead,permissionsEdit){
        this.http.get(`/services/data/${this.apiVersion}/tooling/query?q=SELECT%20Id%2CName%20FROM%20PermissionSet%20WHERE%20ProfileId%20%3D%20%27${profileId}%27`,this.config).then((permissionSetIdResponse)=>{
        let permissionMetadata = {
            ParentId: permissionSetIdResponse.data.records[0].Id,
            Field : field,
            SobjectType : sobjectType,
            PermissionsRead : permissionsRead,
            PermissionsEdit : permissionsEdit
        }
        this.http.post('/services/data/'+this.apiVersion+'/sobjects/FieldPermissions',permissionMetadata,this.config).catch((error) => (console.log(error.response.data)));
    });
    }
    
}
module.exports = SalesforceAPIWrapper;