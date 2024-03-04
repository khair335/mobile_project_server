// userController.js

const UserModel = require("../models/userModel");

exports.saveUserInfo = async (req, res) => {
    try {
        const { uid, displayName, email } = req.body;
        console.log("uid",uid);
        console.log("displayName",displayName);
        console.log("email",email);
        // console.log(uid);
        const existingUser = await UserModel.findOne({ email });

        if (!existingUser) {
            const newUser = new UserModel({
                uid,
                displayName,
                email,
            });

            await newUser.save();

            res.status(201).json({ message: 'User information saved successfully.' });
        } else {
            res.status(409).json({ message: 'User already exists in the database.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
