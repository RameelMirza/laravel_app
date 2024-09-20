<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use Inertia\Inertia;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Route::post('/update_preferences', [ProfileController::class, 'updatePreferences'])->middleware('auth:sanctum');
Route::post('/update_preferences', [ProfileController::class, 'updatePreferences']);