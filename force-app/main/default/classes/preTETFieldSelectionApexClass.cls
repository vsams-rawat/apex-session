public with sharing class preTETFieldSelectionApexClass {
    public preTETFieldSelectionApexClass() {

    }
    @AuraEnabled
    public static List<String> getObjects(){
        List<String> sObjList = new List<String>();
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        for (String s : schemaMap.keySet()) {
            sObjList.add(schemaMap.get(s) + '');
        }
        return sObjList;
    }
    @AuraEnabled(cacheable = true)
    public static List<String> getFields(String objName){
        List<String> fieldList = new List<String>();
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Map<String, Schema.SObjectField> fieldMap = schemaMap.get(objName).getDescribe().fields.getMap();
        for (String sFields : fieldMap.keySet()) {
            fieldList.add(fieldMap.get(sFields) + '');
        }
        return fieldList;
    }

    //GetRecords
    @AuraEnabled(cacheable = true)
    public static List<sObject> getRecords(String query){
        List<sObject> recordList = Database.query(query);
        return recordList;
    }
    @AuraEnabled(cacheable = true)
    public static List<Map<String,String>> fieldWithType(String objName){
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Schema.SObjectType leadSchema = schemaMap.get(objName);
        Map<String, Schema.SObjectField> fieldMap = leadSchema.getDescribe().fields.getMap();
        List<Map<String,String>> fieldTypeObject = new List<Map<String,String>>();
        for (String fieldName: fieldMap.keySet()) {
            //It	 provides to get the object fields label.
            String fieldLabel = fieldMap.get(fieldName).getDescribe().getLabel();
            //It provides to get the object fields data type.

            Schema.DisplayType fielddataType = fieldMap.get(fieldName).getDescribe().getType();
            fieldTypeObject.add(new Map<String,String>{fieldMap.get(fieldName)+''=>fielddataType+''});
        }
        return fieldTypeObject; 
    }
    

}
