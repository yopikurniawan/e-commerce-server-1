'use strict'
const { hashPassword } = require('../helpers/bcrypt')
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			User.belongsToMany(models.Product, {
				through: models.Cart
			})
			User.hasMany(models.Transcation)
		}
	}
	User.init(
		{
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: {
						msg: 'Please enter valid email address',
					},
					notNull: {
						msg: 'Please enter valid email address',
					},
					isEmail: {
						msg: 'Invalid Email Format!',
					},
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: {
						args: [6, 15],
						msg: 'Password length must be between 6 - 15 characters',
					},
					notEmpty: {
						msg: 'Please enter password',
					},
					notNull: {
						msg: 'Please enter password',
					},
				},
			},
			role: {
				type: DataTypes.STRING,
				defaultValue: 'customer',
				isIn: [['admin', 'customer']]
			},
		},
		{
			sequelize,
			modelName: 'User',
			hooks: {
				beforeCreate: user => {
					let newPassword = hashPassword(user.password)
					user.password = newPassword
				},
			},
		}
	)
	return User
}
