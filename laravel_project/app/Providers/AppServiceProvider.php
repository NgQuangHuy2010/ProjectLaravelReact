<?php

namespace App\Providers;
use App\Repository\Brand\BrandRepositoryInterface;
use App\Repository\Category\CategoryRepositoryInterface;
use App\Repository\Product\ProductRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(CategoryRepositoryInterface::class, \App\Repository\Category\CategoryRepository::class);
        $this->app->bind(ProductRepositoryInterface::class, \App\Repository\Product\ProductRepository::class);
        $this->app->bind(BrandRepositoryInterface::class, \App\Repository\Brand\BrandRepository::class);


    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
