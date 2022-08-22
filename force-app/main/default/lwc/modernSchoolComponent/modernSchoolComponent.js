import { LightningElement , wire, track} from 'lwc';
import modernMethod from '@salesforce/apex/modernClass.modernMethod';
import getClassRecords from '@salesforce/apex/modernClass.getClassRecords';

export default class ModernSchoolComponent extends LightningElement {
    @track studentRecords;
    @track columns;
    @track studentData = [];
    @track currentName;
    @track curentScore = 0;
    @track sortBy;
    @track sortDirection = 'asc';

    @track tableFlag = false;
    @track graphFlag = false;

    @wire(modernMethod)
    studentRecords;

    connectedCallback(){
        const columns = [
            { label: 'S.No', fieldName: 'SNo' },
            { label: 'Roll No', fieldName: 'Roll_No__c',sortable: "true"},
            { label: 'Name', fieldName: 'Student_Name__c',sortable: "true"},
            {
                type: 'button-icon',
                typeAttributes:
                {
                    iconName: 'utility:add',
                    name: 'add'
                }
            },
            {
                type: 'button-icon',
                typeAttributes:
                {
                    iconName: 'utility:delete',
                    name: 'delete',
                    iconClass: 'slds-icon-text-error'
                }
            }
        ];
        this.columns = columns;
    }
    classHandler(event){
        console.log(event.target.value);
        console.log(this.studentRecords,' out');
        var cls = event.target.value;
        getClassRecords({className : cls})
        .then( data =>{
            //this.studentData = data;
            var arr = [];
            for(let i = 0; i < data.length ; i++){
                //{Id: 'a0C5j000000FPsUEAW', Roll_No__c: 2, Student_Name__c: 'Rohan'}
                arr.push({'SNo': i+1 ,'Id': data[i].Id, 'Roll_No__c': data[i].Roll_No__c, 'Student_Name__c': data[i].Student_Name__c});
            }
            console.log(arr,' in');
            this.studentData = arr;
        })
    }
    doSorting(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldname, direction) {
        console.log('okay');
        let parseData = JSON.parse(JSON.stringify(this.studentData));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1: -1;
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        this.studentData = parseData;
    }    
    tabularHandler(event){
        this.tableFlag = event.target.checked;
    }
    graphicalHandler(event){
        this.graphFlag = event.target.checked;
    }
    deleteHandler(row){
        console.log('delete');
        console.log(row.Student_Name__c);
        this.currentName = row.Student_Name__c;
        if(this.currentName != ''){
            var allSeats = this.template.querySelectorAll('.seats');
            console.log(allSeats);
            for(let i = 0; i < allSeats.length ; i++){
                var name = allSeats[i].innerText;
                console.log(name);
                if(name == this.currentName){
                    allSeats[i].innerText = '';
                    allSeats[i].style.backgroundColor ='white';
                }
            }
        }
        this.currentName = '';
    }
    addHandler(row){
        console.log('add');
        console.log(JSON.stringify(row));
        console.log(row.Student_Name__c);
        this.currentName = row.Student_Name__c;
        for(let i = 0 ; i < this.studentRecords.data.length ; i++){
            if(this.studentRecords.data[i].Student_Name__c == this.currentName && this.studentRecords.data[i].Roll_No__c == row.Roll_No__c){
                this.curentScore = this.studentRecords.data[i].Score__c;
            }
        }
        console.log(this.curentScore);
    }
    getDivBox(event){
        console.log('Hiieeeee');
        if(this.currentName != '' && event.target.innerText == '' ){
            event.target.innerText = this.currentName;
            this.currentName = '';
            if(this.curentScore < 70){
                event.target.style.backgroundColor ='red';
            }
            else if(this.curentScore >= 70){
                event.target.style.backgroundColor ='green';
            }
        }
    }

    handleRowAction(event) {
        if (event.detail.action.name === 'delete') {
            // console.log(event.detail.row.Id);
            // console.log(event.detail.row.Student_Name__c);
            this.deleteHandler(event.detail.row);
        } else if (event.detail.action.name === 'add') {
            this.addHandler(event.detail.row);
        }
    }
}