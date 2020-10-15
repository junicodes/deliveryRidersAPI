+'use strict'

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
  //Admin Related Route in General
  Route.post('create/transit-report/:currentOrderId', 'TransitReportController.createTransitReport').middleware(['auth:riderJwt,adminJwt']).formats(['json'])//Create a Transit Report (Admin & Rider Only)

  // Route.put('update/transit-report/:transitReportId', 'TransitReportController.updateTransitReport').middleware(['auth:riderJwt,adminJwt']).formats(['json'])// Update Transit Report (Admin & Rider Only)

  Route.get('transit-report/:currentOrderId/:page', 'TransitReportController.getTransitReport').middleware(['auth:customerJwt1,riderJwt,adminJwt']).formats(['json']) //get One transit Report for a current Order (All)

  Route.get('all/transit-report/:page', 'TransitReportController.getAllTransitReport').middleware(['auth:adminJwt']).formats(['json']) //get One transit Report for a current Order (Admin Only)

  Route.delete('delete/transit-report/:transitReportId', 'TransitReportController.destroyTransitReport').middleware(['auth:adminJwt']).formats(['json'])// Delete A transit Report (Admin Only)

  Route.get('find-riders/:query/:page', 'Rider/RiderController.findRiders').middleware(['auth:customerJwt1,riderJwt']).formats(['json']) //Search for Riders (Admin & Customer)

  Route.get('current-orders/:page', 'CurrentOrderController.currentOrders').middleware(['auth:customerJwt1,riderJwt']).formats(['json']) //Get All Current Request

  Route.put('update/current-orders', 'CurrentOrderController.updateOrder').middleware(['auth:customerJwt1']).formats(['json']) //Get All Current Request

  Route.delete('delete/current-order', 'CurrentOrderController.deleteOrders').middleware(['auth:customerJwt1']).formats(['json']) //Delete All Current Request

  Route.get('order-records/:page', 'OrderRecordController.getOrderRecords').middleware(['auth:customerJwt1,riderJwt']).formats(['json']) // Get all Order Records (Customer & Rider)

  Route.get('track-order/:orderId', 'TrackOrderController.trackOrder').middleware(['auth:customerJwt1,riderJwt,adminJwt']).formats(['json']) //Track a current Order request

  Route.post('send-message', 'MessageController.sendMessage').middleware(['auth:customerJwt1,riderJwt,adminJwt']).formats(['json']) //Send Message (Admin, Rider, Customer)

  Route.get('messages/:page', 'MessageController.fetchMessages').middleware(['auth:customerJwt1,riderJwt,adminJwt']).formats(['json']) //Get related Messaege for a user

}).prefix('api/v1/general')



//---------------------------------------------------------Admin

Route.group(() => {
 //-----------------------------Auth
  Route.post('login', 'Admin/AuthController.login').validator('Admin/Login').formats(['json'])

  Route.post('verify', 'Admin/VerifyController.verify').validator('Admin/Verify').formats(['json'])

  Route.post('resend/token', 'Admin/AuthController.resendToken').middleware(['auth:adminJwt', 'onlySuperAdmin']).formats(['json'])

  Route.post('create/admin', 'Admin/AuthController.makeAdminApp').validator('Admin/Register').middleware(['auth:adminJwt', 'onlySuperAdmin']).formats(['json'])

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

  Route.get('/', 'Customer/CustomerController.show').middleware(['auth:customerJwt1']).formats(['json'])//Fetch a customer

  Route.put('update/:id', 'Customer/CustomerController.update').validator('Customer/Update').middleware(['auth:customerJwt1'])//Update a customer

  Route.delete('delete', 'Customer/CustomerController.destroy').middleware(['auth:customerJwt1']).formats(['json'])//Delete a customer

  Route.post('request-order', 'CurrentOrderController.requestOrder').validator('General/CurrentOrder').middleware(['auth:customerJwt1']).formats(['json']) //Order a Current Request (Admin & Customer)

}).prefix('api/v1/customer')



//---------------------------------------------------------Rider
Route.group(() => {
  //Admin Only Routes
  Route.post('register', 'Rider/AuthController.register').validator('Rider/Register').middleware(['auth:adminJwt']).formats(['json']) //Create a New Rider (Admin Only)

  //-----------------------------Auth
  Route.post('login', 'Rider/AuthController.login').validator('Rider/Login').formats(['json']) //Log in Rider into the application

  Route.post('forgotPassword', 'Rider/ForgotPasswordController.forgotPassword').validator('Rider/ForgotPassword').formats(['json']) //Forgot Password

  Route.post('resetPassword', 'Rider/ResetPasswordController.resetPassword').validator('Rider/ResetPassword').formats(['json']) //Reset Password 
  //-----------------------------Rider Krud
  Route.put('update/:id', 'Rider/RiderController.update').validator('Rider/Update').middleware(['auth:riderJwt'])//Update Rider Data 

}).prefix('api/v1/rider')



//------------------------------------------------------Test Case
Route.group(() => {

  Route.post('image-compress', 'TestController.imageCompress').middleware(['auth:customerJwt1,riderJwt']).formats(['json']) //Get All Current Request

}).prefix('api/v1/test')
