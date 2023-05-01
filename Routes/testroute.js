const express = require('express')
const { testFunction, secondFuntion } = require('../Controller/testController')

const router=express.Router()

router.get('/test',testFunction)

router.get('/second',secondFuntion)

module.exports = router 