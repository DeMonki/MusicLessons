const express = require('express');

const router = express.Router();

const { getStudents, getLessons, addInstructor, checkIfUserNameExists, 
    registerNewStudent, loginInstructor, newLesson, lessonsByStudentId } = require('./controller');

const {  authenticateToken } = require('./auth');

router.get('/getStudents', authenticateToken, getStudents);
router.get('/getLessons', authenticateToken, getLessons);
router.get('/lessonsByStudentId', lessonsByStudentId);

router.post('/addInstructor', addInstructor);

router.post('/checkIfUserNameExists', checkIfUserNameExists);

router.post('/registerNewStudent',authenticateToken, registerNewStudent);

router.post('/login', loginInstructor);

router.post('/newLesson',authenticateToken, newLesson);

module.exports = router;