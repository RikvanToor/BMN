<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends Controller {
    /**
     * Remove entry from 'news' table
     */
    public function delete($id) {
        $news = News::findOrFail($id);
        $news->delete();

        return response()->json('Deleted succesfully', 200);
    }

    /**
     * Show a single news article
     */
    public function showOneArticle($id) {
        $article = News::find($id);
        return response()->json($article, 200);
    }

    /**
     * Show all news articles
     */
    public function showAllNews() {
        $news = News::with('writer')->get();
        return response()->json($news, 200);
    }
}