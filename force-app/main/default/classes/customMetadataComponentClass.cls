public with sharing class customMetadataComponentClass {
    public customMetadataComponentClass() {

    }
    @AuraEnabled
    public static String getMetadataObjects(){
        Object_Data__mdt obj = [select ObjectName__c from Object_Data__mdt limit 1];
        String str = obj.ObjectName__c;
        return str;
    }
    @AuraEnabled
    public static List<User> getUsers1(){
        List<User> userList = [select Id,Name,Username from User];
        return userList;
    }
    @AuraEnabled
    public static List<User> getUsers( Id contentDocumentId ) {
        List<String> userUsernameList = new List<String>();
        if ( contentDocumentId != null ) {
            ContentVersion contentVersionObj = [ SELECT Id, VersionData FROM ContentVersion WHERE ContentDocumentId =:contentDocumentId ];
            List < String > records = contentVersionObj.VersionData.toString().split(',');
            //Removing the Header
            System.debug(records +' REcords');
            records.remove( 0 );
            for ( String record : records ) {
                if ( record != null ) {
                    String str = record.replace('"','');
                    String username = EncodingUtil.urlDecode(EncodingUtil.urlEncode(str, 'UTF-8').replaceAll('%0A', '').replaceAll('%0D', ''), 'UTF-8');
                    userUsernameList.add(username);
                }
            }
        }
        System.debug(userUsernameList + ' username list');
        List<User> userList = [select Id,Name,Username,UserRoleId,ProfileId from User Where Username IN : userUsernameList];
        return userList;
    }
    @AuraEnabled
    public static List<String> getObjects(Id userId , List<String> objArray){
        User userRecord = [select Id,Name,Username,UserRoleId,ProfileId from User Where Id = : userId limit 1];
        // List<PermissionSetAssignment> lstcurrentUserPerSet =    [   SELECT Id, PermissionSet.Name,AssigneeId
        //                                                         FROM PermissionSetAssignment
        //                                                         WHERE AssigneeId = :userRecord.Id ];
        // List<Id> perSetIds = new List<Id>();
        // for(PermissionSetAssignment per : lstcurrentUserPerSet){
        //     perSetIds.add(per.Id);
        // }
        List<ObjectPermissions> objPerToUser = [SELECT Id, SObjectType, PermissionsRead,PermissionsEdit, PermissionsCreate
        FROM ObjectPermissions
        WHERE parentid IN (select Id From permissionset WHERE
        PermissionSet.Profile.Id =: userRecord.ProfileId) AND PermissionsEdit = true];
        System.debug(objPerToUser + ' object permission to User');

        List<String> objectNameListFromPS = new List<String>();
        for(ObjectPermissions o : objPerToUser){
            if(!objectNameListFromPS.contains(o.SObjectType)){
                objectNameListFromPS.add(o.SObjectType);
            }
        } 
        System.debug(objectNameListFromPS + ' objectNameListFromPS');

        List<String> objToGet = new List<String>();
        for(String obj : objArray){
            if(objectNameListFromPS.contains(obj)){
                objToGet.add(obj);
            }
        }

        System.debug(userRecord);
        return objToGet;
    }
    @AuraEnabled
    public static Map<String,List<String>> getFields(String objName, String userId){
        System.debug(userId);
        System.debug(objName);
        User userRecord = [select Id,Name,Username,UserRoleId,ProfileId from User Where Id = : userId limit 1];

        List<String> fieldListToRetrieveRecords = new List<String>();
        Map<String , String> fieldListMap = new Map<String, String>();

        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Map<String, Schema.SObjectField> fieldMap = schemaMap.get(objName).getDescribe().fields.getMap();
        Map<String,List<String>> mapOfFields = new Map<String,List<String>>();
        for (String dField : fieldMap.keySet()) {
            fieldListToRetrieveRecords.add(objName + '.' + fieldMap.get(dField) + '');
            fieldListMap.put(objName + '.' + fieldMap.get(dField) + '' , fieldMap.get(dField) + '');
            //Schema.DescribeFieldResult dfield = fieldMap.get(dFields).getDescribe();
            //Schema.DescribeFieldResult dfield = fieldMap.get('Active__c').getDescribe();
            //fieldDetails.add(dfield);
            //listOfFields.add(new Map<String,List<String>>(){ dfield.getName(), new List<String>(){dfield.getType()+'', dfield.isCalculated()+'', dfield.getLength()+''} });
        }
        List<FieldPermissions> fpList = [SELECT SobjectType, Field, PermissionsRead, PermissionsEdit, Parent.ProfileId FROM FieldPermissions WHERE SobjectType = : objName and Field IN : fieldListToRetrieveRecords AND ParentId IN (SELECT Id FROM PermissionSet WHERE PermissionSet.Profile.Id= : userRecord.ProfileId)];
        System.debug(fpList);
        //List<FieldPermissions> fpList = [SELECT SobjectType, Field, PermissionsRead, PermissionsEdit, Parent.ProfileId FROM FieldPermissions WHERE SobjectType = : objName and Field='Account.Customer_Priority__c' AND Parent.ProfileId IN (SELECT Id FROM PermissionSet WHERE PermissionSet.Profile.Id = userRecord.ProfileId)];
        for(FieldPermissions fp : fpList){
            if(fieldListMap.keySet().contains(fp.Field)){
                if(fp.PermissionsRead){
                    Schema.DescribeFieldResult dfieldres = fieldMap.get(fieldListMap.get(fp.Field)).getDescribe();
                    mapOfFields.put( dfieldres.getName()+'' , new List<String>{  dfieldres.getType()+'', dfieldres.isCalculated()+'', dfieldres.getLength()+''} );
                }
            }
        }
        System.debug(mapOfFields);
        // List<ID> perSetAsIdList = new List<ID>();
        // List<PermissionSetAssignment> lstcurrentUserPerSet = [ SELECT Id, PermissionSet.Name,AssigneeId
        //                                                      FROM PermissionSetAssignment
        //                                                      WHERE AssigneeId = :userId ];
        // System.debug(perSetAsIdList + ' perSetAsIdList');
        // for(PermissionSetAssignment psa : lstcurrentUserPerSet){
        //     if(!perSetAsIdList.contains(psa.Id)){
        //         perSetAsIdList.add(psa.Id);
        //     }
        // }
        // List<String> fieldList = new List<String>();
        // Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        // Map<String, Schema.SObjectField> fieldMap = schemaMap.get(objName).getDescribe().fields.getMap();
        // Map<String,List<String>> mapOfFields = new Map<String,List<String>>();
        // for (String dField : fieldMap.keySet()) {
        //     fieldList.add(fieldMap.get(dField) + '');
        //     //Schema.DescribeFieldResult dfield = fieldMap.get(dFields).getDescribe();
        //     //Schema.DescribeFieldResult dfield = fieldMap.get('Active__c').getDescribe();
        //     //fieldDetails.add(dfield);
        //     //listOfFields.add(new Map<String,List<String>>(){ dfield.getName(), new List<String>(){dfield.getType()+'', dfield.isCalculated()+'', dfield.getLength()+''} });
        // }

        // List<FieldPermissions> fieldPerList = [SELECT Id, ParentId, SobjectType, Field,PermissionsEdit,PermissionsRead FROM FieldPermissions  WHERE ParentId IN : perSetAsIdList AND SobjectType = : objName AND Field IN : fieldList AND PermissionsRead = true];
        // System.debug(fieldPerList + ' fieldperlist');
        // List<String> fieldsFromPerSet = new List<String>();
        // for(FieldPermissions fp : fieldPerList){
        //     if(!fieldsFromPerSet.contains(fp.Field)){
        //         fieldsFromPerSet.add(fp.Field);
        //     }
        // }
        // System.debug(fieldsFromPerSet);
        // for (String dField : fieldMap.keySet()) {
        //     //fieldList.add(fieldMap.get(sFields) + '');
        //     if(fieldsFromPerSet.contains(dfield)){
        //         Schema.DescribeFieldResult dfieldres = fieldMap.get(dField).getDescribe();
        //         //fieldDetails.add(dfieldres);
        //         mapOfFields.put( dfieldres.getName()+'' , new List<String>{  dfieldres.getType()+'', dfieldres.isCalculated()+'', dfieldres.getLength()+''} );
        //     }
        // }
        //System.debug(mapOfFields);
        return mapOfFields;
    }
}
