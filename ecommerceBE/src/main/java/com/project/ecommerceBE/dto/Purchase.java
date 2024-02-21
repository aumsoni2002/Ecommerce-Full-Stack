package com.project.ecommerceBE.dto;

import com.project.ecommerceBE.entity.Address;
import com.project.ecommerceBE.entity.Customer;
import com.project.ecommerceBE.entity.Order;
import com.project.ecommerceBE.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
