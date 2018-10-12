import * as mongoose from 'mongoose';
import { IUser } from 'Interfaces';
import * as bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        firstName: {
          required: true,
          type: String,
          trim: true,
          index: true
        },
        lastName:{
          required: true,
          type: String,
          trim: true,
          index: true
        },
        userName: {
          required: true, 
          type: String,
          unique: true,
          trim: true,
          index: true
        },
        email: {
          required: true,
          type: String,
          unique: true,
          trim: true,
          index: true
        },
        password: {
          required: true,
          type: String
        },
        streaks: {
          type: Array,
          default: []
        },
        createdAt: {
          type: Date,
          required: false
        }, 
        modifiedAt: {
          type: Date,
          required: false
        }
    },
    {
      collection: 'Users'
    }   
    )
    UserSchema.index({firstName: 'text'});
    UserSchema.index({lastName: 'text'});
    UserSchema.index({email: 'text'});
    

export default mongoose.model('User', UserSchema)




