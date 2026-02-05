const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        username: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["admin", "doctor", "receptionist"],
            default: "receptionist"
        },

        isActive: {
            type: Boolean,
            default: true
        },

        lastLogin: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre('save', async function () {
    const user = this;
    
        if (!this.isModified("password")) {
            return;
        }
        try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        user.password = hashedPassword;
    } catch (error) {
        throw error;
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};


const User = mongoose.model("User", userSchema);

module.exports = User;