import { LightningElement,track,wire } from 'lwc';
import getObjects from '@salesforce/apex/AdviceAllainceClass.getObjects';
import getFields from '@salesforce/apex/AdviceAllainceClass.getFields';
import totalFields from '@salesforce/apex/AdviceAllainceClass.totalFields';
import getOrgLimit from '@salesforce/apex/AdviceAllainceClass.getOrgLimit';


export default class AdviceAllainceComponent extends LightningElement {
    @track objName = '';
    @track selectedFields = [];
    @track optionsArray = [];
    @track optionsFields = [];
    @track arrOfFields = [];
    @track query = 'Select ';
    @track columns = [];
    @track totalUsedFields = 0;
    @track totalAvailableFields = 0;

    @track FormulaFieldShow = false;
    @track RollUpShow = false;
    @track LookupShow = false;
    @track MasterDetailShow = false;
    tempData ;
    recordArray = [];
    FormulaHandler(){
        this.FormulaFieldShow = !this.FormulaFieldShow;
    }
    RollupHandler(){
        this.RollUpShow = !this.RollUpShow;
    }
    LookupHandler(){
        this.LookupShow = !this.LookupShow;
    }
    MasterDetailHandler(){
        this.MasterDetailShow = !this.MasterDetailShow;
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
        totalFields({ objName : this.objName})
        .then( fieldCount=>{
            console.log(fieldCount);
            this.totalUsedFields = fieldCount;
            this.totalAvailableFields = 500 - this.totalUsedFields;
        })
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
    @track orgLimits = [];
    @wire(getOrgLimit)
    orgLmitMethod({data}){
        console.log(data);
        this.orgLimits = data;
        console.log(this.orgLimits,'hoooo');
    }

    get fieldOptions(){
        return this.optionsFields;
    }
    handleChange(event){
        this.selectedFields = event.detail.value;
    }
}