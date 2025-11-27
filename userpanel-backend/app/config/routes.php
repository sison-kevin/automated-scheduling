<?php
defined('PREVENT_DIRECT_ACCESS') OR exit('No direct script access allowed');
/**
 * ------------------------------------------------------------------
 * LavaLust - an opensource lightweight PHP MVC Framework
 * ------------------------------------------------------------------
 *
 * MIT License
 *
 * Copyright (c) 2020 Ronald M. Marasigan
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @package LavaLust
 * @author Ronald M. Marasigan <ronald.marasigan@yahoo.com>
 * @since Version 1
 * @link https://github.com/ronmarasigan/LavaLust
 * @license https://opensource.org/licenses/MIT MIT License
 */

/*
| -------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------
| Here is where you can register web routes for your application.
|
|
*/

$router->get('/', 'AuthController::showRegister');
$router->post('/register', 'AuthController::register');
$router->get('/login', 'AuthController::showRegister'); // Redirect to homepage with login popup
$router->post('/login', 'AuthController::login');
$router->get('/verify', 'AuthController::showVerify');
$router->post('/verify', 'AuthController::verify');
$router->get('/landing', 'AuthController::landing');
$router->get('/logout', 'AuthController::logout');
$router->post('/logout', 'AuthController::logout');
$router->get('/dashboard', 'DashboardController::index');

// API Routes for React Frontend
$router->post('/api/login', 'AuthController::api_login');
$router->post('/api/register', 'AuthController::api_register');
$router->post('/api/verify', 'AuthController::api_verify');
$router->post('/api/logout', 'AuthController::api_logout');
$router->get('/api/check-auth', 'AuthController::api_check_auth');
$router->post('/api/register/resend', 'AuthController::api_resend_verification');

// API Routes for Dashboard Pages
$router->get('/api/dashboard', 'DashboardController::api_index');
$router->get('/api/pets', 'PetsController::api_index');
$router->post('/api/pets/add', 'PetsController::api_add');
$router->post('/api/pets/update', 'PetsController::api_update');
$router->post('/api/pets/delete', 'PetsController::api_delete');
$router->get('/api/pets/qr/{id}', 'PetsController::qr');
$router->get('/api/pets/download-qr/{id}', 'PetsController::downloadQr');
$router->get('/api/appointments', 'AppointmentsController::api_index');
$router->post('/api/appointments/book', 'AppointmentsController::api_book');
$router->post('/api/appointments/cancel', 'AppointmentsController::api_cancel');
$router->get('/api/appointments/getBookedSlots', 'AppointmentsController::getBookedSlots');
$router->get('/api/services', 'AppointmentsController::services');
$router->get('/api/veterinarians', 'VeterinariansController::api_index');
$router->get('/api/settings', 'SettingsController::api_index');
$router->post('/api/settings/update_profile', 'SettingsController::api_update_profile');
$router->post('/api/settings/change_password', 'SettingsController::api_change_password');

// User Dashboard Sections (PHP Views)

// --- Appointments ---
$router->get('/appointments', 'AppointmentsController::index');
$router->post('/appointments/book', 'AppointmentsController::book');
$router->get('/appointments/cancel/{id}', 'AppointmentsController::cancel');
$router->get('/appointments/getBookedSlots', 'AppointmentsController::getBookedSlots');

$router->get('/pets', 'PetsController::index');
$router->get('/pets/qr/{id}', 'PetsController::qr');
$router->get('/pets/download-qr/{id}', 'PetsController::downloadQr');
$router->get('/pets/view/{id}', 'PetsController::view');
$router->get('/pets/add', 'PetsController::add');
$router->post('/pets/add', 'PetsController::add');
$router->post('/pets/update', 'PetsController::update');
$router->get('/pets/delete/{id}', 'PetsController::delete');


$router->get('/veterinarians', 'VeterinariansController::index');
$router->get('/services', 'AppointmentsController::services');
$router->get('/settings', 'SettingsController::index');
$router->post('/settings/update_profile', 'SettingsController::update_profile');
$router->post('/settings/change_password', 'SettingsController::change_password');



