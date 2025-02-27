const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


//Registro
exports.register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
      // Verifica se o e-mail já existe
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
          return res.status(400).json({ message: "E-mail já cadastrado" });
      }

      // Verifica se o nome já existe (convertido para minúsculas)
      if (name) {
          const existingUser = await User.findOne({ name: name.toLowerCase() });
          if (existingUser) { 
              return res.status(400).json({ message: "Nome de usuário já cadastrado" });
          }
      }

      // Cria o usuário
      const user = await User.create({ email, password, name });
      
      // Gera token JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
      });

      res.status(201).json({ token });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
//Login
exports.login = async (req, res) => {
    const { identifier, password } = req.body;

    try {
      console.log(req.body);
      // Busca o usuário e garante que o campo "password" seja retornado
      const user = await User.findOne({
        $or: [
            { email: identifier.toLowerCase() },
            { name: identifier.toLowerCase() }
        ]
    }).select('+password');
      // Verifica se o usuário existe e a senha está correta
      const validasenha = bcrypt.compare(password, user.password);
      if (!user) {
        return res.status(401).json({ message: "Usuario não existente" });
      }
      if (!validasenha) {
        return res.status(401).json({ message: "Senha invalida" });
      }
      console.log(user)
      // Verifica se a conta está bloqueada (método definido no schema)
      if (user.isLocked && user.isLocked()) {
        const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
        return res.status(403).json({
          message: `Conta bloqueada. Tente novamente em ${remainingTime} minutos.`,
        });
      }
  
      // Compara a senha fornecida com a senha armazenada (criptografada)
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Senha invalida" });
      }
  
      // Gera um token JWT se as credenciais estiverem corretas
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET, // Certifique-se de ter essa variável no .env
        { expiresIn: '1h' }
      );
  
      return res.status(200).json({
        message: "Login realizado com sucesso",
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
          // Adicione mais campos se necessário
        },
      });
  
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  };

//Esqueceu a senha
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

      // Gera token de reset com expiração
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "10m",
    });

      // Salva token no banco
    user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutos
    await user.save();

      // Envia e-mail com o link de reset
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendEmail({
        to: user.email,
        subject: "Recuperação de Senha",
        html: `Clique <a href="${resetUrl}">aqui</a> para redefinir sua senha.`,
    });

    res.json({ message: "E-mail de recuperação enviado!" });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};
//Reset de senha
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
      // Verifica o token e a expiração
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
        _id: decoded.id,
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({ message: "Token inválido ou expirado" });
    }

      // Atualiza a senha
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Senha redefinida com sucesso!" });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};