import mongoose from 'mongoose';
import friend from './friend.schema.js';

export default class FriendRepository{

    static sendo(userId,to)
    {
        const fr = new friend({sender: new mongoose.Types.ObjectId(userId),
                                to: new mongoose.Types.ObjectId(to)});

        return fr.save().then(function(result){
            return fr;
        }).catch(function(error){
            console.error('There is error in repository: ',error);
            throw error;
        });
    }

    static pender(userId) {
        return friend.find({ to: new mongoose.Types.ObjectId(userId) })
            .then(function (requests) {
                return requests;
            })
            .catch(function (error) {
                console.error('Error fetching pending requests:', error);
                throw error;
            });
    }

    static decider(userId, friendId, decision) {
        return friend.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(friendId), to: new mongoose.Types.ObjectId(userId) },
            { status: decision },
            { new: true } // Return the updated document
        )
        .then(function (updatedRequest) {
            if (!updatedRequest) {
                throw new Error('Friend request not found or unauthorized access');
            }
            return updatedRequest;
        })
        .catch(function (error) {
            console.error('Error updating friend request status:', error);
            throw error;
        });
    }

    static getFriends(userId) {
        return friend.find({
            $or: [
                { sender: new mongoose.Types.ObjectId(userId), status: 'Accept' },
                { to: new mongoose.Types.ObjectId(userId), status: 'Accept' }
            ]
        })
        .select('sender to') // Select only the sender and to fields
        .then(function (friends) {
            // Transform the result to return the friend user IDs
            const friendIds = friends.map(function (friend) {
                return friend.sender.toString() === userId 
                    ? friend.to.toString() // If the user is the sender, return the "to" field
                    : friend.sender.toString(); // Otherwise, return the "sender" field
            });
            return friendIds;
        })
        .catch(function (error) {
            console.error('Error fetching friends:', error);
            throw error;
        });
    }
    
    
    
    
}