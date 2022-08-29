const Sequelize = require('sequelize')
const db = require("./db")

const Task = db.define('tasks',{
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull : false,
    primaryKey: true
  },
  taskName: {
    type: Sequelize.STRING,
    allowNull: false,
    validade:{
      notEmpty: {
        msg: "A tarefa deve ter um nome"
      },
      len:{
        args:[3, 20],
        msg: "Nome deve ser maior que 3 e menor que 20 carcteres"
      }
    }
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false,
    
  },
  owner:{
    type: Sequelize.STRING,
    allowNull: false,
  }
  
})

Task.sync()

module.exports = Task