<?php

namespace App\Providers;

use App\Repository\Interface\admin\BrandRepositoryInterface;
use App\Repository\Interface\admin\CategoryRepositoryInterface;
use App\Repository\Interface\admin\ProductRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(CategoryRepositoryInterface::class, \App\Repository\Admin\CategoryRepository::class);
        $this->app->bind(ProductRepositoryInterface::class, \App\Repository\Admin\ProductRepository::class);
        $this->app->bind(BrandRepositoryInterface::class, \App\Repository\Admin\BrandRepository::class);


    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
