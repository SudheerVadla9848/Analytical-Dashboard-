"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NewspaperIcon, ArrowUpRight, XCircle } from "lucide-react";
import Image from "next/image";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
}

const API_KEY = "84c37fa114664031bab666be230b59d"; 
const CATEGORIES = ["general", "business", "technology", "sports"];

export function NewsWidget() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("general");
  const [page, setPage] = useState<number>(1);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchNews = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=5&page=${pageNumber}&apiKey=${API_KEY}`
      );
      const data = await res.json();
      if (data.articles) {
        setArticles((prev) => (pageNumber === 1 ? data.articles : [...prev, ...data.articles]));
      } else {
        setError("Failed to load news.");
      }
    } catch (err) {
      setError("Error fetching news.");
    }
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
    setArticles([]);
    fetchNews(1);
  }, [category]);

  const lastArticleRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
          fetchNews(page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  return (
    <Card className="relative bg-gradient-to-r from-blue-900 via-gray-800 to-red-800 text-white shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-600">
        <CardTitle className="text-lg font-bold">Latest News</CardTitle>
        <NewspaperIcon className="h-5 w-5 text-gray-300" />
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                category === cat ? "bg-red-600 text-white" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map((article, index) => (
              <div
                key={article.url}
                ref={index === articles.length - 1 ? lastArticleRef : null}
                className="p-3 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-900 transition"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="flex items-center space-x-3">
                  {article.urlToImage && (
                    <Image 
                      src={article.urlToImage} 
                      alt={article.title} 
                      width={50} 
                      height={50} 
                      className="rounded" 
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-sm">{article.title}</h3>
                    <p className="text-xs text-gray-300">{article.source.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : loading ? (
          <p className="text-center text-gray-300">Loading news...</p>
        ) : (
          <p className="text-center text-red-500">{error}</p>
        )}

        {/* News Article Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 p-4 overflow-auto">
            <div className="bg-gray-900 text-white p-5 rounded-lg max-w-lg w-full relative shadow-lg">
              <button className="absolute top-2 right-2" onClick={() => setSelectedArticle(null)}>
                <XCircle className="w-6 h-6 text-gray-500 hover:text-gray-300" />
              </button>
              {selectedArticle.urlToImage && (
                <Image
                  src={selectedArticle.urlToImage}
                  alt={selectedArticle.title}
                  width={500}
                  height={300}
                  className="rounded-lg mb-4 cursor-pointer"
                  onClick={() => setSelectedImage(selectedArticle.urlToImage)}
                />
              )}
              <h2 className="text-xl font-semibold">{selectedArticle.title}</h2>
              <p className="text-sm text-gray-400 mb-3">{selectedArticle.source.name}</p>
              <p className="text-sm">{selectedArticle.description}</p>
              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center text-blue-400 hover:underline"
              >
                Read More <ArrowUpRight className="ml-1 w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* Fullscreen Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center">
            <button className="absolute top-4 right-4 text-white" onClick={() => setSelectedImage(null)}>
              <XCircle className="w-8 h-8" />
            </button>
            <Image src={selectedImage} alt="Fullscreen Image" width={800} height={600} className="rounded-lg" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
