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


//-------------------------------------------------------General Use
Route.group(() => {

  Route.get('find-riders/:query/:page', 'Rider/RiderController.findRiders').middleware(['auth:customerJwt1,riderJwt', 'findUser']).formats(['json']) //Search for Riders 

}).prefix('api/v1/general')



//---------------------------------------------------------Admin

Route.group(() => {
 //-----------------------------Auth


}).prefix('api/v1/admin')



//---------------------------------------------------------Customer
Route.group(() => {
  //Admin Only Route
  Route.get(':page', 'Customer/CustomerController.index') //Fetch all customer from the database (admin)

  //-----------------------------Auth
  Route.post('register', 'Customer/AuthController.register').validator('Customer/Register').formats(['json']) //Create a New Customer in the application
  Route.post('login', 'Customer/AuthController.login').validator('Customer/Login').formats(['json']) //Log in Customer into the application
  Route.post('verify', 'Customer/VerifyController.verify').validator('Customer/AuthVerify').formats(['json']) //Verify customer verify code
  Route.post('forgotPassword', 'Customer/ForgotPasswordController.forgotPassword').validator('Customer/ForgotPassword').formats(['json']) //Forgot Password
  Route.post('resetPassword', 'Customer/ResetPasswordController.resetPassword').validator('Customer/ResetPassword').formats(['json']) //Reset Password 
  Route.post('resendCode', 'Customer/ResendVerifyCodeControlller.resendCode').validator('Customer/ForgotPassword').formats(['json']) //Resend Verification Code

  Route.get('/', 'Customer/CustomerController.show').middleware(['auth:customerJwt1', 'findUser']).formats(['json'])//Fetch a customer
  Route.put('update/:id', 'Customer/CustomerController.update').validator('Customer/Update').middleware(['auth:customerJwt1', 'findUser'])//Update a customer
  Route.delete('delete', 'Customer/CustomerController.destroy').middleware(['auth:customerJwt1', 'findUser']).formats(['json'])//Delete a customer

}).prefix('api/v1/customer')



//---------------------------------------------------------Rider
Route.group(() => {
  //Admin Only Routes
  Route.post('register', 'Rider/AuthController.register').validator('Rider/Register').formats(['json']) //Create a New Rider in the application

  //-----------------------------Auth
  Route.post('login', 'Rider/AuthController.login').validator('Rider/Login').formats(['json']) //Log in Rider into the application
  Route.post('forgotPassword', 'Rider/ForgotPasswordController.forgotPassword').validator('Rider/ForgotPassword').formats(['json']) //Forgot Password
  Route.post('resetPassword', 'Rider/ResetPasswordController.resetPassword').validator('Rider/ResetPassword').formats(['json']) //Reset Password 
  //-----------------------------Rider Krud
  Route.put('update/:id', 'Rider/RiderController.update').validator('Rider/Update').middleware(['auth:riderJwt', 'findUser'])//Update Rider Data 

}).prefix('api/v1/rider')

