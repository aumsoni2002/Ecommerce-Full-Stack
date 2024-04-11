package com.project.ecommerceBE.dao;

import com.project.ecommerceBE.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


@RepositoryRestResource(collectionResourceRel = "productCategory", path = "product-category")
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
}

// With above annotation we just change the name of JSON entry and path from productCategories to below shown
// productCategory is the name of the JSON entry.
// /product-category is the reference for the path of the product-category
