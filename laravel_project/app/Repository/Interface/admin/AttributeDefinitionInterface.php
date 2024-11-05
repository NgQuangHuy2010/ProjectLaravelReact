<?php

namespace App\Repository\Interface\admin;



interface AttributeDefinitionInterface extends RepositoryInterface
{
    public function getByCategory($categoryId);

    public function create(array $attributes);
    public function checkIdCategory($categoryId);
    public function update($id, array $data);
    public function find($id);
    public function delete($id);

}