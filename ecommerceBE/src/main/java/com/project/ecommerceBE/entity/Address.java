package com.project.ecommerceBE.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "address")
@Getter
@Setter
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "street")
    private String street;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "country")
    private String country;

    @Column(name = "zip_code")
    private String zipCode;

    @OneToOne
    @PrimaryKeyJoinColumn
    private Order order;
}

/*
The `@PrimaryKeyJoinColumn` annotation in Hibernate is used when you have an entity that has a one-to-one relationship with another
entity through a primary key association.

Here's a simple explanation:
1. Primary Key Association:
   In some database relationships, one entity is associated with another entity through a primary key.
   This means that the primary key of one entity is also a foreign key in another entity.

2. Use of @PrimaryKeyJoinColumn:
   When you use `@PrimaryKeyJoinColumn` in Hibernate, you are essentially telling Hibernate to use
   the primary key of the associated entity as the foreign key in the current entity to establish the relationship.

3. Example:
   For example, let's say you have an entity `Employee` and another entity `EmployeeDetails`, where each employee has one
   set of details stored in the `EmployeeDetails` entity. If the primary key of `Employee` is used as a foreign key in `EmployeeDetails`
   to establish this relationship, you would use `@PrimaryKeyJoinColumn` in the `EmployeeDetails` entity to specify that association.

4. Simplifying Relationship Mapping:
   Essentially, `@PrimaryKeyJoinColumn` simplifies the mapping of a one-to-one relationship between
   entities by indicating that the primary key of one entity should be used as a foreign key in another entity to establish the relationship.

In summary, `@PrimaryKeyJoinColumn` is used to specify that the primary key of one entity should be used as a foreign key in another
entity to establish a one-to-one relationship between them, simplifying the mapping of such associations in Hibernate.
*/