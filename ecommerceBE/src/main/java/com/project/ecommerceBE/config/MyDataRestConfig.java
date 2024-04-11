package com.project.ecommerceBE.config;

import com.project.ecommerceBE.entity.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    @Value("${allowed.origins}")
    private String[] theAllowedOrigins;

    // Auto wiring JPA Entity Manager to have access to all entities(tables) that are in our database
    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager) { // injecting the jpa entity manager
        this.entityManager = theEntityManager;      // saving the injected entity manager into our private variable of type EntityManager
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        // First we will create a list of HTTP Methods that we want to disable
        HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH};

        // Product: Now we will write code for disabling the above listed HTTP Actions.
        disableHttpMethods(Product.class, config, theUnsupportedActions);

        // ProductCategory: Now we will write code for disabling the above listed HTTP Actions.
        disableHttpMethods(ProductCategory.class, config, theUnsupportedActions);

        // Country: Now we will write code for disabling the above listed HTTP Actions.
        disableHttpMethods(Country.class, config, theUnsupportedActions);

        // State: Now we will write code for disabling the above listed HTTP Actions.
        disableHttpMethods(State.class, config, theUnsupportedActions);

        // Order: Now we will write code for disabling the above listed HTTP Actions.
        disableHttpMethods(Order.class, config, theUnsupportedActions);


        // By default, JpaRepository or Spring Data REST does not expose ids from the database of any entities(tables)
        // We must do it manually by below following method whenever we need to make use of it.
        // calling an internal helper method to expose the ids
        exposeIds(config);

        // CorsRegistry cors: this parameter will help us in adding cross-origin resource mapping between our
        // backend exposed REST APIs and our frontend localhost running URL that is /api/** with the localhost:4200
        cors.addMapping(config.getBasePath() + "/**").allowedOrigins(theAllowedOrigins);
    }

    private static void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                // here we are declaring which classes we want to disable these actions for.
                .forDomainType(theClass)
                // here we are first disabling the actions for one item.
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                // here we are then disabling the actions for collection of items.
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config) {
        // Lets expose entity ids

        // First we need to get a list of all entity classes from the database with the help of entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // Now we will extract the entity types from each entity and put them in an array list
        // To make this clear, the entity type is just those classes(tables) that we added into our database which are product and product category
        List<Class> entityClasses = new ArrayList<>(); // creating an array to add all entity types in this list.

        // Getting the entity types for each and every entity
        for (EntityType tempEntityType : entities) {
            entityClasses.add(tempEntityType.getJavaType());
        }

        // Now that we have all entity types in the array list.
        // We have to expose ids for all the rows(each and every data) of all entity types

        // First we will take all entity classes of type List and convert the ArrayList into simple array.
        Class[] entityTypes = entityClasses.toArray(new Class[0]);

        // Now we will call a method to which we will provide above simple array that is 'entityTypes'
        // and that method will expose ids of all entity's rows/data for us.
        config.exposeIdsFor(entityTypes);
    }
}
