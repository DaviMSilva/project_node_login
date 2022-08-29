const Sequelize = require('sequelize')
const db = require('./db')


const User = db.define('users', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty:{
        msg: "Esse campo não pode ser vazio"
      }
    }
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
      msg: "Nome de usário deve ser diferente de um existente"
    },
    validate:{
      notEmpty: {
        msg:"Nome de Usuario não pode ser vazio"
      }
    }
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail:{
        msg: "Esse campo deve conter um email"
      }
    }
  },
  password:{
    type: Sequelize.STRING,
    allowNull: false,
    validate:{
      isAlphanumeric: true,
      notEmpty: true
    }
  }
})

//Cria a tabela caso nao exista
User.sync()

module.exports = User
