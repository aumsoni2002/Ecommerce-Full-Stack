package com.project.ecommerceBE.dao;

import com.project.ecommerceBE.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "countries", path = "countries")
// Exposes : localhost:8080/api/countries
public interface CountryRepository extends JpaRepository<Country, Integer> {
}
