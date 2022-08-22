import { LightningElement } from 'lwc';

export default class CardGame extends LightningElement {
    array = ["first", "second" , "third", "fourth"];
    array2 = ["first", "second" , "third", "fourth"];
    changeHandler(){
        console.log('Hello');
        // this.array = [];
        this.array.length=0;
        for (let index = 0; index < this.array2.length; index++) {
            // console.log('pop');
            this.array2.pop();

        }
        // alert(this.array);
        // alert(this.array2);
        console.log(this.array);
        console.log(this.array.length);
        console.log(this.array2);
    }
}