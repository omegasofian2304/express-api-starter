const express = require('express');
const { body, param } = require('express-validator');
const ingredientsController = require('../controllers/ingredientsController');

const router = express.Router();

const createAndUpdateValidations = [
    body('name').isString().notEmpty().withMessage('name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('price must be a positive number'),
];

router.get('/', ingredientsController.findAll);
router.post('/', createAndUpdateValidations, ingredientsController.create);
router.get('/:id', [param('id').isInt().withMessage('id must be an integer')], ingredientsController.findOne);
router.put('/:id', [param('id').isInt().withMessage('id must be an integer'), ...createAndUpdateValidations], ingredientsController.update);
router.delete('/:id', [param('id').isInt().withMessage('id must be an integer')], ingredientsController.delete);

module.exports = router;