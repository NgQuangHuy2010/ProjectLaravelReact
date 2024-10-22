<?php

namespace App\Repository\Brand;
use App\Repository\RepositoryInterface;


interface BrandRepositoryInterface extends RepositoryInterface
{
    public function getAll();
    public function delete($id);
    public function create(array $attributes);
    public function update($id, array $attributes);
    public function find($id);

}
