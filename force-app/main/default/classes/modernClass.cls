public with sharing class modernClass {
    public modernClass() {

    }
    @AuraEnabled(Cacheable = true)
    public static List<Student__c> modernMethod(){
        List<Student__c> stuList = [Select Id,Roll_No__c,Student_Name__c,Class__c,Score__c FROM Student__c];
        return stuList;
    }
    @AuraEnabled()
    public static List<Student__c> getClassRecords(String className){
        Class__c cls = [Select Id,Name from Class__c where Name = : className LIMIT 1];
        List<Student__c> stuList = [Select Id,Roll_No__c,Student_Name__c,Class__c,Score__c FROM Student__c where Class__c = : cls.id];
        return stuList;
    }
}
