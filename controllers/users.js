const User = require('../models/user');

module.exports.registerNew = (req, res) => {
    res.render('users/register')
}

module.exports.registerCreate = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            req.flash('success', "Welcome To YelpCamp!!");
            res.redirect('/');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.login = (req, res) => {
    res.render('users/login');
}

module.exports.loginAuth = async (req, res) => {
    req.flash('success', 'Welcome Back!!');
    const url = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(url);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Successfully Logged Out!!');
    res.redirect('/');
}