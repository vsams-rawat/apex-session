import { LightningElement,track,wire } from 'lwc';
import getObjects from '@salesforce/apex/selectObject.getObjects';
import getFields from '@salesforce/apex/selectObject.getFields';
import getRecords from '@salesforce/apex/selectObject.getRecords';
import callBatch from '@salesforce/apex/selectObject.callBatch';

export default class SelectObjectComponent extends LightningElement {
    @track objName = '';
    @track selectedFields = [];
    @track optionsArray = [];
    @track optionsFields = [];
    @track arrOfFields = [];
    @track query = 'Select ';
    @track columns = [];
    // @track recordQuery = 'Select'
    @track queryEnd = ' From ';
    @track finalQuery = '';

    @track first = true;
    @track second = false;
    @track third = false;
    results;

    secondPage(){
        this.second = true;
        this.first = false;
    }
    get options() {
        return this.optionsArray;
    }

    connectedCallback(){
        getObjects()
        .then( result=>{
            let arr = [];
            for(var i = 0; i<result.length ; i++){
                arr.push( {label : result[i], value : result[i]} );
            }
            this.optionsArray = arr;
        })
    }
    handleChanges(event){
        this.objName = event.detail.value;
        this.queryEnd += this.objName;
    }
    @wire(getFields , { objName: '$objName' })
    wiredFieldsMethod({ error, data }) {
        if (data) {
            this.data  = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data  = undefined;
        }
        if(this.data != undefined){
            this.arrOfFields = [];      
            for(let i = 0; i<this.data.length ; i++){
                this.arrOfFields.push( {label : 'okay '+this.data[i], value : this.data[i] , editable : true } );
            }
            this.optionsFields = this.arrOfFields;
        }
    }

    get fieldOptions(){
        return this.optionsFields;
    }
    @track queryStart = '';
    handleChange(event){
        // var temp  = event.target.value;
        // console.log(JSON.stringify(temp));
        // let gg = JSON.parse(JSON.stringify(temp));

        // this.optionsFields.forEach(element => {
        //     if(gg.includes(element.value)){
        //         console.log(element.label,'hellllll');
        //     }
        //     //   console.log(this.optionsFields.indexOf(element.value));
        //     // JSON.parse(JSON.stringify(temp)).forEach(element2=>{
        //     //     if(element.value==element2)
        //     //     {
                    
        //     //     }
        //     // });
            
        // });
        this.selectedFields = event.detail.value;

        //showQuery();
    }
    get showQuery(){
        this.finalQuery = '';
        this.finalQuery = 'Select ';
        this.finalQuery += this.selectedFields;
        this.finalQuery += this.queryEnd;
        return this.finalQuery;
    }
    @wire(getRecords , { query: '$query' })
    results;   

    thirdPage(){
        this.third = true;
        this.second = false;
        this.viewRecords();
    }

    viewRecords(){
        for(let i = 0 ; i< this.selectedFields.length ; i++){
            if(i<this.selectedFields.length-1){
                this.query += this.selectedFields[i] + ', ';
            }
            else{
                this.query += this.selectedFields[i]+' From '+ this.objName;
            }
        }
        for(let i = 0; i<this.selectedFields.length ; i++){
            this.columns.push( {label : this.selectedFields[i], fieldName : this.selectedFields[i], type: 'text' , editable : true, initialWidth: 240} );
        }
        console.log(JSON.parse(JSON.stringify(this.columns)));
    }
    exportToEXCEL(){
        // Prepare a html table
        let doc = '<table>';
        // Add styles for the table
        doc += '<style>';
        doc += 'table, th, td {';
        doc += '    border: 1px solid black;';
        doc += '    border-collapse: collapse;';
        doc += '}';
        doc += '</style>';
        // Add all the Table Headers
        doc += '<tr>';
        this.selectedFields.forEach(element => {
            doc += '<th>'+ element +'</th>'
        });
        doc += '</tr>';
        for(let i = 0; i<this.results.data.length ; i++){
            var record = this.results.data[i];
            doc += '<tr>';
            for(let j = 0; j< this.selectedFields.length; j++){
                let field = this.selectedFields[j];
                doc += '<td>'+record[field]+'</td>';
            }
            doc += '</tr>';
        }
        doc += '</table>';
        var element = 'data:application/vnd.ms-excel,' + encodeURIComponent(doc);
        let downloadElement = document.createElement('a');
        downloadElement.href = element;
        downloadElement.target = '_self';
        // use .csv as extension on below line if you want to export data as csv
        downloadElement.download = ''+this.objName+' data.xls';
        document.body.appendChild(downloadElement);
        downloadElement.click();
    }
    sendCSV(){
        var dataList = JSON.stringify(this.results.data);
        var fieldList = JSON.stringify(this.selectedFields);
        var objName = this.objName;
        console.log(dataList+' data');
        console.log(fieldList+' fields');

        callBatch ({dataList:dataList, fieldList:fieldList, objName : objName})
    }
    exportToCSV(){
        var StringCSV = '';
        for(let j = 0; j< this.selectedFields.length; j++){
            let field = this.selectedFields[j];
            StringCSV += '"';
            StringCSV += field+'"';
            StringCSV += ',';
        }
        StringCSV += '\n';
        for(let i = 0; i<this.results.data.length ; i++){
            var record = this.results.data[i];
            for(let j = 0; j< this.selectedFields.length; j++){
                let field = this.selectedFields[j];
                StringCSV += '"';
                StringCSV += record[field]+'",';
            }
            StringCSV += '\n';
            var element = 'data:text/csv;charset=utf-8,%EF%BB%BF,' + encodeURIComponent(StringCSV);
            let downloadElement = document.createElement('a');
            downloadElement.href = element;
            downloadElement.target = '_self';
            // use .csv as extension on below line if you want to export data as csv
            downloadElement.download = ''+this.objName+' data.csv';
            document.body.appendChild(downloadElement);
            downloadElement.click();
        }
    }
}