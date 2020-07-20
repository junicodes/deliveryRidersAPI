'use strict'

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

//Route prefix in this format api/v1
Route.group(() => {

  //---------------------------------------------------------General Use
  
  //---------------------------------------------------------Admin
  //-----------------------------Auth
  Route.get('customers/:page', 'Customer/CustomerController.index') //Fetch all customer from the database (admin)

  //---------------------------------------------------------Customer
  //-----------------------------Auth
  Route.post('/customer/register', 'Customer/AuthController.register').validator('RegCustomer').formats(['json']) //Create a New Customer in the application
  Route.post('/customer/login', 'Customer/AuthController.login').validator('LogCustomer').formats(['json']) //Log in Customer into the application

  Route.get('customer', 'Customer/CustomerController.show').middleware(['auth:customerJwt1', 'findCustomer']).formats(['json'])//Fetch a customer
  Route.put('customer/update', 'Customer/CustomerController.update').validator('UpdateCustomer').middleware(['auth:customerJwt', 'findCustomer']).formats(['json'])//Update a customer
  Route.delete('customer/delete', 'Customer/CustomerController.destroy').middleware(['auth:customerJwt', 'findCustomer']).formats(['json'])//Delete a customer
  //Route.post('customer', 'Customer/CustomerController.store').validator('RegCustomer')//Create a New Customer in the application

  //--------------------------------------------------------Our Riders
  //-----------------------------Auth

}).prefix('api/v1')


