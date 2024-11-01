<?php

namespace App\Providers;

use App\Repository\Interface\admin\AttributeDefinitionInterface;
use App\Repository\Interface\admin\BrandRepositoryInterface;
use App\Repository\Interface\admin\CategoryRepositoryInterface;
use App\Repository\Interface\admin\ProductAttributeRepositoryInterface;
use App\Repository\Interface\admin\ProductRepositoryInterface;

use App\Repository\Interface\client\FeaturedProductClientInterface;
use App\Repository\Interface\client\FindProductsByCategoryInterface;
use App\Repository\Interface\client\SearchProductClientInterface;
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
        $this->app->bind(AttributeDefinitionInterface::class, \App\Repository\Admin\AttributeDefinitionRepository::class);
        $this->app->bind(ProductAttributeRepositoryInterface::class, \App\Repository\Admin\ProductAttributeRepository::class);



        $this->app->bind(FeaturedProductClientInterface::class, \App\Repository\Client\FeaturedProductClientRepository::class);
        $this->app->bind(SearchProductClientInterface::class, \App\Repository\Client\SearchProductClientRepository::class);
        $this->app->bind(FindProductsByCategoryInterface::class, \App\Repository\Client\FindProductsByCategoryRepository::class);

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
