const { verificarUsuario } = require("../modules/consultas");

const verificarUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    await verificarUsuario(email, password);
    next();
  } catch (error) {
    res.status(error.code || 500).send(error.message);
  }
};

export default verificarUser;
