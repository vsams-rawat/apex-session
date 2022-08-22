public with sharing class selectObject {
    public selectObject() {

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
    @AuraEnabled
    public static void callBatch(String dataList, String fieldList, String objName){
        List<Object> objMap = ( List<Object>)Json.deserializeUntyped(dataList);
        System.debug(objMap);

        List<Object> head = ( List<Object>)Json.deserializeUntyped(fieldList);
        System.debug(head);

        Database.executeBatch(new selectObjectBatchClass(objMap,head,objName), 200);
    }
}
