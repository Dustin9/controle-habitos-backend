const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
},
name:{
    type: String,
    required: true, 
    lowercase: true,
    unique: true,
    sparse: true, // Permite valores nulos
}, 
password: {
    type: String,
    required: true,
    select: false, // Não retorna a senha em consultas
},
loginAttempts: {
    type: Number,
    default: 0,
},
lockUntil: {
    type: Date,
},

resetPasswordToken: String,
resetPasswordExpire: Date,
}, 
{ timestamps: true });

// Hash da senha antes de salvar
userSchema.pre("save", async function (next) {
if (!this.isModified("password")) return next();
this.password = await bcrypt.hash(this.password, 10);
next();
});

// Verifica se a conta está bloqueada
userSchema.methods.isLocked = function () {
return this.lockUntil && this.lockUntil > Date.now();
};

// Incrementa tentativas de login e bloqueia após 5 falhas
userSchema.methods.incrementLoginAttempts = function () {
if (this.loginAttempts >= 4) {
    this.lockUntil = Date.now() + 30 * 60 * 1000; // Bloqueia por 30 minutos
}
this.loginAttempts += 1;
return this.save();
};

// Reseta tentativas após login bem-sucedido
userSchema.methods.resetLoginAttempts = function () {
this.loginAttempts = 0;
this.lockUntil = undefined;

return this.save();
};


module.exports = mongoose.model("users", userSchema);
