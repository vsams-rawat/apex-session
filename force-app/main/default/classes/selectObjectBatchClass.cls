public class selectObjectBatchClass implements Database.Batchable<Object>, Database.Stateful {
    private List<Object> objectMap = new List<Object>();
    private String finalStr = ''; 
    private List<Object> cols = new List<Object>();
    private String objectName;
    private Integer totalRecord;
    public selectObjectBatchClass( List<Object> objs, List<Object> head, String oName){
        objectMap = objs;
        cols = head;
        objectName = oName;
    }

    public List<Object> start(Database.BatchableContext bc) {
        // collect the batches of records or objects to be passed to execute
        Integer counter = 0;
        for(Object col : cols) {
            finalStr += '"';
            finalStr += (String)col;
            finalStr += '",';
        }
        finalStr += '\n';
        totalRecord = objectMap.size();
        return objectMap;
    }
    public void execute(Database.BatchableContext bc, List<Object> objs) {
        // process each batch of records
        for (Object data : objectMap) {
            Map<String,Object> tempMap = (Map<String,Object>)data;
            for (Object field : cols) {
                String f = (String)field;
                finalStr += '"';
                finalStr += (String)tempMap.get(f);
                finalStr += '",';
            }
            finalStr += '\n';
        }
        System.debug(finalStr);
    }

    public void finish(Database.BatchableContext bc) {
        // execute any post-processing operations

        Messaging.EmailFileAttachment efa = new Messaging.EmailFileAttachment();
        efa.setFileName('Data.csv');
        efa.contentType = 'text/csv';
        efa.setBody(Blob.valueOf(finalStr));

        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        String[] toAddresses = new String[] {'vikasrawat949@gmail.com'};
        mail.setToAddresses(toAddresses);
        mail.setSenderDisplayName('Vikas Rawat');
        mail.setSubject('CSV file of '+objectName+' Object');
        mail.setPlainTextBody(objectName+' Object \nTotal Records : '+totalRecord);
        //mail.setHtmlBody('<img src="'+urlMsg+'">');
        mail.setFileAttachments(new Messaging.EmailFileAttachment[] {efa});
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
  }
}