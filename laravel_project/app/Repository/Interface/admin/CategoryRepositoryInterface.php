<?php

namespace App\Repository\Interface\admin;
use App\Repository\Interface\admin\RepositoryInterface;


interface CategoryRepositoryInterface extends RepositoryInterface
{
  //mở rộng những phương thức mà ở repositoryInterface ko có
 
    public function existsInCategory($id);
    public function hasProducts($id);
}
