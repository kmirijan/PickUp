const User = require('../User');

module.exports = (app) => {
  app.post('/api/account/signup',(req, res, next)=>{
    const { body } = req;
    const {
      firstName,
      lastName,
      email,
      password
    } = body;
    let{
      email
    } = body;
    if(!firstName){
      return res.end({
        success: false,
        message: 'Error: First name cannot be blank.'
      });
    }
    if(!lastName){
      return res.end({
        success: false,
        message: 'Error: Last name cannot be blank.'
      });
    }
    if(!email){
      return res.end({
        success: false,
        message: 'Error: email name cannot be blank.'
      });
    }
    if(!password){
      return res.end({
        success: false,
        message: 'Error: password name cannot be blank.'
      });
    }

    email = email.toLowerCase();

    User.find({
      email: email
    }, (err,previousUsers) =>{
      if(err){
        return res.end({
          success: false,
          message: 'Error: Server error'
        });
      }else if (previousUsers.length >0){
        return res.end({
          success: false,
          message: 'Error: Account already exists.'
        });
      }


      //Save the user
      const newUser = new User();

      newUser.email = email;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.password = newUser.generateHash(password);
      newUser.save((err,user)=>{
        if(err){
          return res.end({
            success: false,
            message: 'Error: Server error'
          });
        }
        return res.end({
          success: true,
          message: 'Signed up'
        });
      });
    });

  });
};