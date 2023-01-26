const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key')
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());

app.use(cookieParser());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!~~안녕')
})

app.post('/api/users/register', (req, res) => {

    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {
    //요청한 이메일을 데이터베이스에서 찾는다
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "wrong email"
            })
        }
        //이메일이 있다면 비밀번호가 맞는지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)
                return res.json({ loginSuccess: false, message : "wrong pw"})

            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id })

            })
        })
    })
})
//auth: middleware
app.get('/api/users/auth', auth, (req, res) => {
    //여기 까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말

    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role == 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {

    User.findOneAndUpdate({ _id: req.user._id }, 
        { token: "" }
        , (err, user) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true
            })
        })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

