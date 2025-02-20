import { ObjectId } from "mongodb";


interface RatingTypes {
    _id?: ObjectId;
    points: number;
    user_name: string;
    index:number; 
    
  }

  export class Rating {
    _id?: ObjectId;
    points: number;
    index:number; 
    user_name: string;

    constructor(data: RatingTypes) {
        this.user_name = data.user_name;
        this._id = data._id;
        this.points = data.points;
        this.index = data.index;
    }
  }