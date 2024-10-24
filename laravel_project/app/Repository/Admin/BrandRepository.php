<?php


namespace App\Repository\Admin;
use App\Models\Brand;
use App\Repository\BaseRepository;
use App\Repository\Interface\admin\BrandRepositoryInterface;



class BrandRepository extends BaseRepository implements BrandRepositoryInterface
{
    public function __construct(Brand $model)
    {
        parent::__construct($model);
    }

}
