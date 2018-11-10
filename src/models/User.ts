import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
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
          index: true,
          select: false
        },
        password: {
          required: true,
          type: String,
          select: false, 
        },
        streaks: {
          type: Array,
          default: []
        },
        profilePicture: {
          type: String
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
    UserSchema.index({userName: 'text'})
    UserSchema.index({email: 'text'});
    

export default mongoose.model('User', UserSchema)




