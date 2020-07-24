'use strict'

const { RouteResource } = require('@adonisjs/framework/src/Route/Manager')

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello every one this is CherrySoft Delivery Rider API' }
})


//---------------------------------------------------------General Use
Route.group(() => {

}).prefix('api/v1/general')



//---------------------------------------------------------Admin

Route.group(() => {
 //-----------------------------Auth
 Route.get('/customers/:page', 'Customer/CustomerController.index') //Fetch all customer from the database (admin)

}).prefix('api/v1/admin')




//---------------------------------------------------------Customer
Route.group(() => {
  //-----------------------------Auth
  Route.post('register', 'Customer/AuthController.register').validator('Customer/Register').formats(['json']) //Create a New Customer in the application
  Route.post('login', 'Customer/AuthController.login').validator('Customer/Login').formats(['json']) //Log in Customer into the application
  Route.post('verify', 'Customer/VerifyController.verify').validator('Customer/AuthVerify').formats(['json']) //Verify customer verify code
  Route.post('forgotPassword', 'Customer/ForgotPasswordController.forgotPassword').validator('Customer/ForgotPassword').formats(['json']) //Forgot Password
  Route.post('resetPassword', 'Customer/ResetPasswordController.resetPassword').validator('Customer/ResetPassword').formats(['json']) //Reset Password 
  

  Route.get('/', 'Customer/CustomerController.show').middleware(['auth:customerJwt1', 'findCustomer']).formats(['json'])//Fetch a customer
  Route.put('update/:id', 'Customer/CustomerController.update').validator('Update').middleware(['auth:customerJwt1', 'findCustomer']).formats(['json'])//Update a customer
  Route.delete('delete', 'Customer/CustomerController.destroy').middleware(['auth:customerJwt1', 'findCustomer']).formats(['json'])//Delete a customer

}).prefix('api/v1/customer')



//---------------------------------------------------------Rider
Route.group(() => {

}).prefix('api/v1/rider')

