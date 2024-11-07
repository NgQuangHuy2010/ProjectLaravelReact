<?php

namespace App\Repository\Interface\admin;



interface AttributeDefinitionInterface extends RepositoryInterface
{
  //mở rộng những phương thức mà ở repositoryInterface ko có
    public function getByCategory($categoryId);
    public function checkIdCategory($categoryId);
    


}