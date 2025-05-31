import FriendRepository from "./friend.repository.js";
import mongoose from 'mongoose';

export default class FriendController{

    sending(req,res)
    {
        console.log('Hello');
        const to = req.params.to;
        const userId = req.user.userId;

        return FriendRepository.sendo(userId,to).then(function(result){
            res.status(201).send(result);
        }).catch(function(error){
            console.error('Error while sending the friend request in controller:', error);
            res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
        });
    }

    pending(req, res) {
        const userId = req.user.userId;
    
        return FriendRepository.pender(userId)
            .then(function (requests) {
                res.status(200).json(requests);
            })
            .catch(function (error) {
                console.error('Error while fetching pending requests in controller:', error);
                res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
            });
    }

    reser(req, res) {
        const userId = req.user.userId;
        const friendId = req.params.friendId;
        const decision = req.body.decision; // Expecting 'Accept' or 'Reject'
    
        if (!['Accept', 'Reject'].includes(decision)) {
            return res.status(400).json({ error: 'Invalid decision value' });
        }
    
        return FriendRepository.decider(userId, friendId, decision)
            .then(function (result) {
                res.status(200).json({ message: `Friend request ${decision.toLowerCase()}ed successfully`, data: result });
            })
            .catch(function (error) {
                console.error('Error while deciding on the friend request:', error);
                res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
            });
    }

    getFriends(req, res) {
        const userId = req.params.userId;
    
        return FriendRepository.getFriends(userId)
            .then(function (friends) {
                res.status(200).json(friends);
            })
            .catch(function (error) {
                console.error('Error while fetching friends in controller:', error);
                res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
            });
    }
    
    
    
}