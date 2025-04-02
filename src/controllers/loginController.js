// const User = require("../models/user");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");

// //Login
// exports.login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//     const user = await User.findOne({ email }).select("+password");
    
//       // Verifica se o usuário existe
//     if (!user) {
//         return res.status(401).json({ message: "Credenciais inválidas" });
//     }

//       // // Verifica se a conta está bloqueada
//     if (user.isLocked()) {
//         const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
//         return res.status(403).json({
//         message: `Conta bloqueada. Tente novamente em ${remainingTime} minutos.`,
//         });
//     }

//       // Verifica a senha
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//         await user.incrementLoginAttempts();
//         return res.status(401).json({ message: "Credenciais inválidas" });
//     }

//       // Reseta tentativas após login bem-sucedido
//     await user.resetLoginAttempts();

//       // Gera token JWT
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRE,
//     });

//     res.json({ token });
//     } catch (error) {
//     res.status(500).json({ message: error.message });
//     }
// };