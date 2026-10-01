const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const auth = require('http-auth');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const Registration = mongoose.model('Registration');

const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd'),
});

// Home page
router.get('/', (req, res) => {
  res.render('index', { title: 'Simple Kitchen' });
});

// Registration form
router.get('/register', (req, res) => {
  res.render('form', { title: 'Registration Form' });
});

// Registrations listing
router.get('/registrations', basic.check((req, res) => {
  Registration.find()
    .then((registrations) => {
      res.render('registrants', {
        title: 'Listing registrations',
        registrations
      });
    })
    .catch(() => {
      res.send('Sorry! Something went wrong.');
    });
}));

// Submit registration
router.post('/register',
  [
    check('name')
      .isLength({ min: 1 })
      .withMessage('Please enter a name'),

    check('email')
      .isLength({ min: 1 })
      .withMessage('Please enter an email')
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const registration = new Registration(req.body);

      registration.save()
        .then(() => {
          res.render('thankyou', {
            title: 'Thank You'
          });
        })
        .catch(() => {
          res.send('Sorry! Something went wrong.');
        });

    } else {
      res.render('form', {
        title: 'Registration Form',
        errors: errors.array(),
        data: req.body
      });
    }
  }
);

module.exports = router;