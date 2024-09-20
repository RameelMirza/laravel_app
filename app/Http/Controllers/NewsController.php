<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Http;
use App\Models\News;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class NewsController extends Controller
{

    public function index()
    {
        $news = News::all();
        return inertia('News', ['news' => $news]);
        
    }

    public function searchNews(Request $request)
    {
        $query = $request->input('q', '');
        $from = $request->input('from', '');
        $sortBy = $request->input('sortBy', 'published_at');

        $newsQuery = News::query();

        if (!empty($query)) {
            $newsQuery->where('title', 'like', "%{$query}%")
                      ->orWhere('description', 'like', "%{$query}%");
        }

        if (!empty($from)) {
            $newsQuery->whereDate('published_at', '>=', $from);
        }

        if (in_array($sortBy, ['popularity', 'relevance', 'publishedAt'])) {
            $sortByColumn = $sortBy === 'publishedAt' ? 'published_at' : $sortBy;
            $newsQuery->orderBy($sortByColumn, 'desc');
        } else {
            $newsQuery->orderBy('published_at', 'desc');
        }

        $news = $newsQuery->get();

        return response()->json($news);
    }

    public function getNewsApi(){

        if (Auth::user()){
                
            $user = Auth::user();

            $selectedCategories = json_decode($user->categories_preferences, true) ?? [];
            $selectedAuthors = json_decode($user->authors_preferences, true) ?? [];
            $selectedSources = json_decode($user->sources_preferences, true) ?? [];
    
            $query = News::query();
    
            if (!empty($selectedAuthors)) {
                $query->whereIn('author', $selectedAuthors);
            }
    
            if (!empty($selectedSources)) {
                $query->whereIn('source', $selectedSources);
            }
    
            if (!empty($selectedCategories)) {
                $query->whereIn('category', $selectedCategories);
            }
    
            $filteredNews = $query->get();
    
            if (empty($selectedCategories) && empty($selectedAuthors) && empty($selectedSources)) {
                $filteredNews = News::all();
            }
    
            $newsApi = News::where('source', 'News API')->get();
            $guardianNews = News::where('source', 'The Guardian')->get();
            $nytNews = News::where('source', 'The New York Times')->get();
    
            $combinedNews = [
                'filteredNews' => $filteredNews,
                'all' => News::all(),
                'newsApi' => $newsApi,
                'guardianNews' => $guardianNews,
                'nytNews' => $nytNews,
            ];
    
            return response()->json($combinedNews);

        }else{

            $news = News::all();
            $filteredNews = News::all();
            $newsApi = News::where('source','News API')->get();
            $guardianNews = News::where('source','The Guardian')->get();
            $nytNews = News::where('source','The New York Times')->get();

            $combinedNews = [
                'all' => $news,
                'filteredNews' => $filteredNews,
                'newsApi' => $newsApi,
                'guardianNews' => $guardianNews,
                'nytNews' => $nytNews,
            ];

            return response()->json($combinedNews);
        }


    }

    public function store()
    {

        $apiKeys = [
            'news_api' => env('NEWS_API_KEY'),
            'guardian_api' => env('GUARDIAN_API_KEY'),
            'nyt_api_key' => env('NEWYORK_TIMES_API_KEY'),
        ];


        function mapArticleData($source, $article) {
            switch ($source) {
                case 'newsapi':
                    return [
                        'title' => $article['title'] ?? '',
                        'description' => $article['description'] ?? '',
                        'url' => $article['url'] ?? '',
                        'author' => $article['author'] ?? '',
                        'published_at' => $article['publishedAt'] ?? '',
                        'content' => $article['content'] ?? '',
                        // 'source' => $article['source']['name'] ?? '',
                        'source' => 'News API',
                        'image_url' => $article['urlToImage'] ?? '',
                    ];

                case 'guardian':
                    return [
                        'title' => $article['webTitle'] ?? '',
                        'description' => $article['fields']['bodyText'] ?? '',
                        'url' => $article['webUrl'] ?? '',
                        'author' => $article['byline'] ?? '',
                        'category' => $article['sectionName'] ?? '',
                        'published_at' => $article['webPublicationDate'] ?? '',
                        'content' => $article['fields']['trailText'] ?? '',
                        'source' => 'The Guardian',
                        'image_url' => $article['fields']['thumbnail'] ?? '',
                    ];

                case 'nyt':
                    return [
                        'title' => $article['headline']['main'] ?? '',
                        'description' => $article['lead_paragraph'] ?? '',
                        'url' => $article['web_url'] ?? '',
                        'author' => implode(', ', array_column($article['byline']['person'], 'firstname')) ?? '',
                        'category' => $article['section_name'] ?? '',
                        'published_at' => $article['pub_date'] ?? '',
                        'content' => $article['snippet'] ?? '',
                        'source' => 'The New York Times',
                        'image_url' => isset($article['multimedia'][0]['url']) ? 'https://www.nytimes.com/' . $article['multimedia'][0]['url'] : '',
                    ];

                default:
                    return [];
            }
        }


        $responses = [
            Http::get('https://newsapi.org/v2/everything', [
                'q' => 'sports',
                'from' => '2024-09-01',
                'sortBy' => 'popularity',
                'apiKey' => $apiKeys['news_api']
            ]),
            
            Http::get('https://content.guardianapis.com/search', [
                'api-key' => $apiKeys['guardian_api'],
                'show-fields' => 'all'
            ]),

            Http::timeout(120)->get('https://api.nytimes.com/svc/archive/v3/2024/9.json', [
                'api-key' => $apiKeys['nyt_api_key'], // Pass the API key as a query parameter
            ]),

            // Http::get('https://api.nytimes.com/svc/news/v3/content/all/all.json', [
            //     'api-key' => $apiKeys['nyt_api_key'], // Use your actual API key here
            // ]),
        ];

        $allArticles = [];

        foreach ($responses as $response) {
            $data = $response->json();

            if (isset($data['articles'])) {
                foreach ($data['articles'] as $article) {
                    $allArticles[] = mapArticleData('newsapi', $article);
                }
            } elseif (isset($data['response']['results'])) {
                foreach ($data['response']['results'] as $article) {
                    $allArticles[] = mapArticleData('guardian', $article);
                }
            } 
            elseif (isset($data['response']['docs'])) {
                foreach ($data['response']['docs'] as $article) {
                    $allArticles[] = mapArticleData('nyt', $article);
                }
            }
        }

        foreach ($allArticles as $article) {
            News::updateOrCreate(
                ['url' => $article['url']],
                $article
            );
        }

        return response()->json(['message' => 'News updated successfully']);
    }
}
