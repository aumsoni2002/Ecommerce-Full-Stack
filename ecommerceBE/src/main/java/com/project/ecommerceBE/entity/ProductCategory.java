package com.project.ecommerceBE.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "product_category")
@Getter
@Setter
public class ProductCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "category_name")
    private String categoryName;

    // Here we are creating one-to-many association between ONE category and MANY products
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "category")
    private Set<Product> products;
}