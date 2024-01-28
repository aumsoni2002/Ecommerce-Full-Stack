package com.project.ecommerceBE.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.util.Date;

@Entity                 // To let spring know that this class is an entity
@Table(name="product")  // To associate this entity to the table 'product' in our database
@Data                   // This annotation is from lombok which creates getters and setters for us to use.
public class Product {

    // Here we are associating each and every property of this entity to the columns of the table 'product'.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    // Here we are creating many-to-one association between MANY products and ONE category
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private ProductCategory category;

    @Column(name = "sku")
    private String sku;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "unit_price")
    private BigDecimal unitPrice;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "active")
    private boolean active;

    @Column(name = "units_in_stock")
    private int unitsInStock;

    @Column(name = "date_created")
    @CreationTimestamp                  // with this annotation, hibernate will automatically manage the timestamps
    private Date dateCreated;

    @Column(name = "last_updated")
    @UpdateTimestamp                    // with this annotation, hibernate will automatically manage the timestamps
    private Date lastUpdated;
}
