package com.project.ecommerceBE.dao;

import com.project.ecommerceBE.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Spring Data REST and Spring JPA has built-in queries that we can use by using names like findBy, searchBy, queryBy etc.
    // We do not need to write any queries if we want to perform simple operations.
    Page<Product> findByCategoryId(@Param("id") Long id, Pageable pageable);

    // SELECT * FROM Product p WHERE p.name LIKE CONCAT('%', :name, '%')
    Page<Product> findByNameContaining(@Param("name") String name, Pageable page);
}

/*
Add CrossOrigin Support to Spring Boot:
Same-Origin:
When a web page makes a request (like loading an image or fetching data) to the same domain (same website) from which it originated,
it is considered a same-origin request.
Browsers generally allow these requests without any restrictions for security reasons, assuming that if the content comes from the
same origin, it's likely safe and trustworthy.

Cross-Origin:
Cross-origin refers to making requests from one domain (website) to another different domain.
Browsers typically restrict cross-origin requests to prevent potential security vulnerabilities. This restriction is known as the
"Same-Origin Policy" (SOP).
If your web page on "example.com" tries to fetch data from "anotherdomain.com," the browser might block that request by default.
Cross-Origin Support:

To enable cross-origin requests intentionally, web developers can use mechanisms like Cross-Origin Resource Sharing (CORS).
CORS is a set of headers that the server includes in its response to tell the browser it's okay for the requesting website on a
different origin to access the requested resource.
In simple terms, same-origin is when your web page talks to itself or its own domain, and cross-origin is when it talks to a
different domain. Cross-origin requests are restricted by default for security, but CORS provides a way to explicitly allow them
when needed.
*/

/*
Page        : this page here is an interface which helps us to know total elements, total pages such as 4 pages and each has 25 elements.
<Product>   : this means that the query will look for data from the Product table.
findBy      : this is our query method that we are looking for some data
CategoryId  : Match by category id.
(@Param("id") Long id, : Use this parameter value for matching
Pageable pageable);    : we will make use of this class for pagiantion, it has properties like getPageNumber, getPageSize
*/

/*
Pagination:
As we have created our REST API methods with 'Page' as their data type, Spring DATA REST provides built-in pagination support i.e. we do
not have to write queries specially for pagination support. The parameter pageable of type Pageable in above queries is for getting the
metadata as a response when the REST APIs are called.
For Instance : http://localhost:8080/api/products?page=0&size=10
The above URL will provide first 10 products from the database and will show it on the first page.
While using Pageable, the page starts from the number 0.
When asked for all products which is by hitting this URL: http://localhost:8080/api/products, the Spring DATA REST provides only
20 items by default and shows page number as 0 by default.
Metadata with every response Example:
"page" : {
    "size" : 20,
    "totalElements" : 100,
    "totalPages" : 5,
    "number" : 0
}
*/