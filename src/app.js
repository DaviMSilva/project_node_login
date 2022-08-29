const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
var path = require('path')
const app = express()

//models banco de dados
const User = require('./models/User')
const Task = require('./models/Task')

// definindo a engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: 'asdpfjasofapjf' }))

async function verifyIfUsernameExists(req, res, next) {
  const { username } = req.body

  const usernameExists = await User.findOne({
    where: {
      username: username
    }
  })
  if (usernameExists === null) {
    return res.status(400).json({
      message: 'username not found'
    })
  }

  req.username = username

  return next()
}

//login routes
app.get('/', async (req, res) => {
  res.redirect('/login')
})

app.get('/login', async (req, res) => {
  if (req.session.login) {
    res.redirect('/home')
  } else {
    res.render('index')
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  await User.findOne({
    where: {
      username: username
    }
  })
    .then(user => {
      if (user.password === password) {
        req.session.login = username
        res.redirect('/home')
      }
    })
    .catch(() => {
      res.render('index')
    })
})

//home route
app.get('/home', async (req, res) => {
  const username = req.session.login
  if (req.session.login) {
    const tasklist = await Task.findAll({
      where: {
        owner: username
      }
    })
    const {taskName, content} = tasklist
    res.render('home', { username, task: tasklist})
  } else {
    res.redirect('/login')
  }
})

// rotas para tasks

app.post('/home/newtask', async (req, res) => {
  const {taskName, content, owner} = req.body
  const username = req.session.login
  const task = await Task.create({
    taskName: taskName,
    content: content,
    owner: owner 
  }).then((task) => {
    if (task) {
      return res.status(200).json({
        message: 'Tarefa criada com sucesso'
      })
    } else {
      return res.status(400).json({
        message: 'Tarefa não criada'
      })
    }
  })
})  

app.post('/cadastrar', async (req, res) => {
  const { email } = req.body
  const userAlreadyExists = await User.findOne({
    where: {
      email: email
    }
  })
  if (userAlreadyExists === null) {
    const createdUser = await User.create(req.body)
      .then(() => {
        return res.json({
          erro: false,
          message: 'Usuario cadastrado com sucesso'
        })
      })
      .catch(() => {
        return res.status(400).json({
          erro: true,
          message: 'Usuario não cadastrado com sucesso'
        })
      })
  } else {
    return res.status(400).json({
      erro: true,
      message: 'Email já cadastrado'
    })
  }
})

app.put('/user/atualiza', verifyIfUsernameExists, async (req, res) => {
  const { name, username } = req.body

  const update = await User.update(
    { name: name },
    {
      where: {
        username: username
      }
    }
  ).then(() => {
    console.log('Atualizado com sucesso')
    return res.status(200).json({
      message: 'Atualizado com sucesso'
    })
  })
})

app.delete('/user/deletar', verifyIfUsernameExists, async (req, res) => {
  const { username } = req.body
  const deletar = await User.destroy({
    where: {
      username: username
    }
  }).then(() => {
    console.log('deletado')
    return res.status(200).json({
      message: 'deletado com sucesso'
    })
  })
})

app.get('/user/listagem', async (req, res) => {
  await User.findAll({
    attributes: ['username']
  })
    .then(users => {
      if (users === []) {
        return res.status(400)
      }
      return res.status(200).json(users)
    })
    .catch(() => {
      return res.status(400).json({
        message: 'Nenhum dado retornado'
      })
    })
})

app.listen(3333)
