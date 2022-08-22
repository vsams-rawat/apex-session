import { LightningElement,track,wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import getRecord from '@salesforce/apex/getPropertyRecord.getRecord';
import getFields from '@salesforce/apex/getPropertyRecord.getFields';
import findContacts from '@salesforce/apex/getPropertyRecord.findContacts';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';

export default class realEstate extends NavigationMixin(LightningElement)
{
    columns = [];
    recordArray = [];
    result;
    proUrl;
    navigateToNewContact(){
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Property__c',
                actionName: 'new',
            },
            state : {
                count: '1',
                nooverride: '1',
                useRecordTypeCheck : '1',
                navigationLocation: 'RELATED_LIST'
            }
        });
    }
    @wire(getRecord)
    resultData({data}){
        this.result = data;
        if(data){
            var arr = [];
            var tempUrl;
            console.log(data.length);
            for (let index = 0; index < data.length; index++) {
                let str = data[index].Property_Image__c;
                this.proUrl = '';
                if(str != undefined){
                    //console.log(str +" before replace");
                    tempUrl = str.replaceAll('amp;','');
                    let url = tempUrl.split('"');
                    this.proUrl = url[1];
                    arr.push({'Name' : data[index].Name, 'Property_Image__c': this.proUrl, 'Owner_Name__c':data[index].Owner_Name__c, 'Price__c':data[index].Price__c, 'SurfaceArea__c':data[index].SurfaceArea__c });
                }
                else{
                    arr.push({'Name' : data[index].Name, 'Property_Image__c': this.proUrl, 'Owner_Name__c':data[index].Owner_Name__c, 'Price__c':data[index].Price__c, 'SurfaceArea__c':data[index].SurfaceArea__c });
                }
            }
            this.recordArray = arr;
        }
    }

    @wire(getFields)
    fields({error, data}){
        if(data){
            var col = [];
            console.log(data);
            col.push({label :'PropertyNumber' , fieldName : 'Name'},
                    {
                        label: 'Property_Image__c',
                        type: 'customPictureType',
                        typeAttributes: {
                            pictureUrl: { fieldName: 'Property_Image__c' }
                        },
                        cellAttributes: { alignment: 'center' }
                    },
                    {label : 'Owner_Name__c', fieldName : 'Owner_Name__c'},
                    {label : 'Price__c', fieldName : 'Price__c'},
                    {label : 'SurfaceArea__c', fieldName : 'SurfaceArea__c'}
                    );
            this.columns = col;
        }
    }
    handleRefresh(){
        console.log('hiii');
        refreshApex(this.result);
    }
    handle(){

    }
    //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
    @track isModalOpen = false;
    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
        this.handleRows();
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.template.querySelector('c-custom-data-types').selectedRows=[];
        this.isModalOpen = false;
    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
    }

    @track accId
    contacts = [];
    handleRows(){
        this.accId = '';
        var selectedRecords =  this.template.querySelector("c-custom-data-types").getSelectedRows();
        selectedRecords.forEach(element => {
            console.log(element.Id + ' Id  ');
            this.accId = selectedRecords[0].Id;
        });
        if(this.accId != ''){
            findContacts({ acId: this.accId })
            .then((result) => {
                this.contacts = result;
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
                this.contacts = undefined;
            });
        }
        else{
            this.contacts = [];
        }
    }
    navigateToNewContactWithDefaults(){
        const defaultValues = encodeDefaultFieldValues({
            Property__c : this.accId
        });
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Contact',
                actionName: 'new',
            },
            state : {
                count: '1',
                nooverride: '1',
                useRecordTypeCheck : '1',
                navigationLocation: 'RELATED_LIST',
                defaultFieldValues: defaultValues
            }
        });
    }
}
