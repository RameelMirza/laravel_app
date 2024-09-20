<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\News;
use App\Models\User;


class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {

        $authors = News::select('author')->distinct()->get()->pluck('author')->filter()->values();
        $categories = News::select('category')->distinct()->get()->pluck('category')->filter()->values();
        $sources = News::select('source')->distinct()->get()->pluck('source')->filter()->values();

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'authors' => $authors,
            'categories' => $categories,
            'sources' => $sources,
        ]);
    }

    public function prefrences()
    {

        $authors = News::select('author')->distinct()->get()->pluck('author')->filter()->values();
        $categories = News::select('category')->distinct()->get()->pluck('category')->filter()->values();
        $sources = News::select('source')->distinct()->get()->pluck('source')->filter()->values();

        $combinedPrefrences = [
            'authors' => $authors,
            'categories' => $categories,
            'sources' => $sources,
        ];

        return response()->json($combinedPrefrences);

    }

    public function getSelectedPreferences(Request $request)
    {

        $userId = $request->input('id');
        
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $allSelectedPreferences = [
            'authors' => $user->authors_preferences ? json_decode($user->authors_preferences) : [],
            'categories' => $user->categories_preferences ? json_decode($user->categories_preferences) : [],
            'sources' => $user->sources_preferences ? json_decode($user->sources_preferences) : [],
        ];

        return response()->json($allSelectedPreferences);
    }


    public function updatePreferences(Request $request)
    {

        $userId = $request->input('id');
        $user = User::find($userId);

        if (!$user) {
            Log::info('User is not authenticated.');
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        
        $validator = Validator::make($request->all(), [
            'sources_prefrences' => 'nullable|array',
            'categories_prefrences' => 'nullable|array',
            'authors_prefrences' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update([
            'sources_preferences' => $request->input('sources_prefrences', []),
            'categories_preferences' => $request->input('categories_prefrences', []),
            'authors_preferences' => $request->input('authors_prefrences', []),
        ]);

        return response()->json(['message' => 'Preferences updated successfully']);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
