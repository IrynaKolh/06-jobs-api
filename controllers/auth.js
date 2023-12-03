const register = async (req, res) => {
  res.send("User has been registrated");
};

const login = async (req, res) => {
  res.send("User has been logined");
};

module.exports = {
  register,
  login,
};
