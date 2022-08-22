import { LightningElement, track, wire } from 'lwc';
import getObjects from '@salesforce/apex/customMetadataComponentClass.getObjects';
import getMetadataObjects from '@salesforce/apex/customMetadataComponentClass.getMetadataObjects';
import getUsers from '@salesforce/apex/customMetadataComponentClass.getUsers';
import getFields from '@salesforce/apex/customMetadataComponentClass.getFields';

export default class CustomMetadataComponent extends LightningElement {
    @track objArray = [];
    @track userObject;
    @track associateObjects = [];
    @track objFields;
    @track currentUserName;
    @track currentUserId;
    connectedCallback(){
        getMetadataObjects()
        .then( result=>{
            let arr = [];
            arr = result.split(',');
            console.log(arr);
            // for(var i = 0; i<result.length ; i++){
            //     arr.push( {label : result[i].ObjectName__c, value : result[i].ObjectName__c} );
            // }
            this.objArray = arr;
            console.log(this.objArray);
        })
    }
    handleUploadFinished(event){
        // getUsers()
        // .then( data =>{
        //     let arr = [];
        //     console.log(data);
        // })
        const uploadedFiles = event.detail.files;
        console.log(uploadedFiles);
        console.log(uploadedFiles[0].documentId);
        getUsers( { contentDocumentId : uploadedFiles[0].documentId } )
        .then( result => {
            console.log(result);
            this.userObject = result;
        })
    }
    handleUserClick(event){
        this.newData = [];
        console.log('Hiiii');
        console.log(event.target.innerText);
        this.currentUserName = event.target.innerText;
        this.currentUserId = event.target.dataset.id;
        console.log(event.target.dataset.id);
        var userId = event.target.dataset.id;
        getObjects({userId : userId , objArray : this.objArray})
        .then(data =>{
            console.log(data);
            if(data.length <= 0){
                this.associateObjects = null;
                this.associateObjects = ['No Object'];
            }
            else{
                this.associateObjects = data;
            }
        })
    }
    @track fieldKeySet;
    @track newData = [];
    handleObjectClick(event){
        console.log(event.target.dataset.name);
        var objName = event.target.dataset.name;
        var userId = this.currentUserId;
        console.log(userId);
        getFields({objName : objName , userId : userId})
        .then(data =>{
            this.newData = [];
            this.objFields = data;
            console.log(data , ' field data');
            Object.keys(data).forEach(item => {
                this.newData.push({'name': item, 'values': data[item]});
            })
            console.log(this.newData, '1')
        })
    }
}