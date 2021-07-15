const UsersRepository = require('../../Infrastructure/PostgreSQL/Repository/UsersRepository.js');
const AuthenticatedUserDto = require('../DTOs/AuthenticatedUserDto.js');
const RegisteredUserDto = require('../DTOs/RegisteredUserDto.js');
const JwtPayloadDto = require('../DTOs/JwtPayloadDto.js');

const ServerError = require ('../../WebApp/Models/ServerError.js');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'proiectPWinitemail@gmail.com',
      pass: 'proiectPWinitemail111'
    }
});

const {
    hashPassword,
    comparePlainTextToHashedPassword
} = require('../Security/Password/index.js')

const {
    generateTokenAsync,
    verifyAndDecodeDataAsync
} = require('../Security/Jwt/index.js')

const authenticateAsync = async (username, hashedPassword) => {

    console.info(`Authenticates user with username ${username}`);
    console.log(username)
    const user = await UsersRepository.getByUsername(username);
    console.log(user)
    
    if (!user) {
        throw new ServerError(`Utilizatorul cu username ${username} nu exista in sistem!`, 404);
    }

    if (user.activated == 0) {
        throw new ServerError("Activeaza emailu bobitza!", 400);
    }
    console.log(user.password)
    console.log(hashedPassword)
    const compare = await comparePlainTextToHashedPassword(user.password, hashedPassword)
    console.log(compare)

    if (compare)
    {
        const pay = new JwtPayloadDto(user.id, user.role_id)
        const accessToken = await generateTokenAsync(pay)
        return new AuthenticatedUserDto(accessToken, username, user.role_id)
    }
    else 
        throw new ServerError("Eroare la decriptarea parolei!", 400);
};

const registerAsync = async (username, email, plainTextPassword, role) => {
    console.log(role)
    const hashedPassword = await hashPassword(plainTextPassword)
    console.log("test")
    const user = await UsersRepository.addAsync(username, hashedPassword, email, role)


    const pay = new JwtPayloadDto(username, role)
    const accessToken = await generateTokenAsync(pay)

    var mailOptions = {
        from: 'proiectPWinitemail@gmail.com',
        to: email,
        subject: 'Sending Email using Node.js',
        text: `http://localhost:3000/api/v1/users/activare/${accessToken}`
    };


    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });

    return new RegisteredUserDto(user.id, user.username, user.role_id);
};

module.exports = {
    authenticateAsync,
    registerAsync
}