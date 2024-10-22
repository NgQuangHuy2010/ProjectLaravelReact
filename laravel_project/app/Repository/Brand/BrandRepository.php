<?php


namespace App\Repository\Brand;
use App\Models\Brand;
use App\Repository\BaseRepository;


class BrandRepository extends BaseRepository implements BrandRepositoryInterface
{
    public function __construct(Brand $model)
    {
        parent::__construct($model);
    }

}
