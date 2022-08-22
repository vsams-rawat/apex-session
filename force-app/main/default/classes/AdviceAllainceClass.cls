public with sharing class AdviceAllainceClass {
    public AdviceAllainceClass() {

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
        //System.debug(fieldMap.keySet().size());
        return fieldList;
    }
    @AuraEnabled(cacheable = true)
    public static Integer totalFields(String objName){
        List<String> fieldList = new List<String>();
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Map<String, Schema.SObjectField> fieldMap = schemaMap.get(objName).getDescribe().fields.getMap();
        for (String sFields : fieldMap.keySet()) {
            fieldList.add(fieldMap.get(sFields) + '');
        }
        return fieldList.size();
    }
    @AuraEnabled(cacheable = true)
    public static List<Map<String,String>> getOrgLimit(){   
        Map<String,System.OrgLimit> limitsMap = OrgLimits.getMap();
        List<String> allLimit = new List<String>();
        for(String key : limitsMap.keySet()){
            allLimit.add(key);
        }
        List<Map<String,String>> limitList = new List<Map<String,String>>();
        System.debug(allLimit);
        for(String k : limitsMap.keySet()){
            System.OrgLimit a = limitsMap.get(k);
            String limitName = (String)a.getName();
            String useLimit = ''+a.getValue();
            String maxLimit = ''+a.getLimit();
            LimitList.add(new Map<String,String>{'limitName' => limitName, 'max' =>  maxLimit , 'use' =>  useLimit});
        }
        return limitList;
    }
}
