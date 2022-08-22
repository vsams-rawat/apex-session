import { LightningElement,track,wire } from 'lwc';
import getObjects from '@salesforce/apex/preTETFieldSelectionApexClass.getObjects';
import getFields from '@salesforce/apex/preTETFieldSelectionApexClass.getFields';
import getRecords from '@salesforce/apex/preTETFieldSelectionApexClass.getRecords';
import fieldWithType from '@salesforce/apex/preTETFieldSelectionApexClass.fieldWithType';

export default class PreTETFieldSelection extends LightningElement {
    @track objName = '';
    @track selectedFields = [];
    @track optionsArray = [];
    @track optionsFields = [];
    @track arrOfFields = [];
    @track query = 'Select ';
    @track columns = [];

    @track first = true;
    @track second = false;
    @track third = false;
    @track formView = false;
    tempData ;
    recordArray = [];
    showForm(){
        this.formView = true;
    }
    hideForm(){
        this.formView = false;
    }
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
        fieldWithType({objName :  this.objName})
        .then( data=>{
            console.log(data);
        })
    }
    handleSubmit(e) {
        // e.stopPropogation();
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
        this.third = true;
        e.preventDefault();
        this.tempData = JSON.parse(JSON.stringify(e.detail.fields));
        console.log(this.tempData);
        this.recordArray.push(this.tempData);
        this.recordArray=this.recordArray;
        console.log(this.recordArray);
        // for(let i = 0; i < this.tempData.length; i++){
        //     this.recordArray.push([...this.tempData]);
        // }
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
                this.arrOfFields.push( {label : this.data[i], value : this.data[i] , editable : true } );
            }
            this.optionsFields = this.arrOfFields;
        }
    }

    get fieldOptions(){
        return this.optionsFields;
    }
    handleChange(event){
        this.selectedFields = event.detail.value;
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
    rowsHandler(e){

    }

    importRows(){

    }

}