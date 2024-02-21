package com.project.ecommerceBE.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "order_tracking_number")
    private String orderTrackingNumber;

    @Column(name = "total_quantity")
    private int totalQuantity;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @Column(name = "status")
    private String status;

    @Column(name = "date_created")
    @CreationTimestamp
    private Date dateCreated;

    @Column(name = "last_updated")
    @UpdateTimestamp
    private Date lastUpdated;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "order") // one order has many order items.
    private Set<OrderItem> orderItems = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "shipping_address_id", referencedColumnName = "id")
    private Address shippingAddress;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "billing_address_id", referencedColumnName = "id")
    private Address billingAddress;

    public void add(OrderItem item) {
        if (item != null) {
            if (orderItems == null) {
                orderItems = new HashSet<>();
            }
            orderItems.add(item);
            item.setOrder(this);
        }
    }
}

/*
In simple terms, the @CreationTimestamp and @UpdateTimestamp annotations in Spring Boot with Hibernate are used to automatically populate
columns in your database table with the timestamp of when a record was created and when it was last updated, respectively.

Here's a breakdown:
@CreationTimestamp:
When you mark a field in your entity class with @CreationTimestamp, Hibernate will automatically set the value of that field to the
current timestamp when a new record is inserted into the database.

@UpdateTimestamp:
Similarly, when you mark a field with @UpdateTimestamp, Hibernate will automatically update the value of that field to the current
timestamp whenever the corresponding record is updated in the database.

These annotations save you the hassle of manually setting these timestamp fields in your code every time you create or update an
entity object. They help in tracking when records were created or modified, which can be useful for auditing purposes or any scenario
where you need to keep track of the history of changes in your data.

In summary, @CreationTimestamp automatically sets the creation timestamp when a record is inserted, and @UpdateTimestamp automatically
updates the timestamp when a record is modified, making it easier to manage and track changes in your database records.
*/