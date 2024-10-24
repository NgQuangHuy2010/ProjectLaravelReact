<?php

namespace App\Repository\Interface\admin;
use App\Repository\Interface\admin\RepositoryInterface;


interface CategoryRepositoryInterface extends RepositoryInterface
{
    public function getAll();
    public function delete($id);
    public function create(array $attributes);
    public function update($id, array $attributes);
    public function find($id);
    
    public function existsInCategory($id);
    public function hasProducts($id);
}
