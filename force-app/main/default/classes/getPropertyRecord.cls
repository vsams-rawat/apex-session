public with sharing class getPropertyRecord {
    public getPropertyRecord() {

    }
    @AuraEnabled(cacheable=true)
    public static List<Property__c> getRecord() {
        return [select Name,Owner_Name__c ,Contact__c, ImageUrl__c,Price__c,Location__c ,SurfaceArea__c,Property_Image__c from Property__c ];
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getFields(){
        String obName = 'Property__c';
        List<String> reqFields = new List<String>();
        Schema.SObjectType gd = Schema.getGlobalDescribe().get(obName);
        Map<String, Schema.SObjectField> MapofField = gd.getDescribe().fields.getMap();
        for(Schema.SObjectField fieldName : MapofField.values()) {
	    reqFields.add(fieldName.getDescribe().getName());
        }
        System.debug(reqFields);
        return reqFields;
    }
    @AuraEnabled
    public static List<Contact> findContacts(String acId){
        return [Select id,LastName,Name from Contact WHERE Property__c = : acId];
    }
}
