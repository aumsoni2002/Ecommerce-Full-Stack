package com.project.ecommerceBE.Service;

import com.project.ecommerceBE.dao.CustomerRepository;
import com.project.ecommerceBE.dto.PaymentInfo;
import com.project.ecommerceBE.dto.Purchase;
import com.project.ecommerceBE.dto.PurchaseResponse;
import com.project.ecommerceBE.entity.Customer;
import com.project.ecommerceBE.entity.Order;
import com.project.ecommerceBE.entity.OrderItem;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service    // As this is a service implementation, we need to annotate it as a service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository, @Value("${stripe.key.secret}") String secretKey) {
        this.customerRepository = customerRepository;

        // Initializing Stripe API with secret key
        Stripe.apiKey = secretKey;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        // Retrieve the order information from the dto 'Purchase'
        Order order = purchase.getOrder();

        // generate tracking number and set the tracking number to order's tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        // Populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        // Populate order with billingAddress and shippingAddress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        // Populate customer with order
        Customer customer = purchase.getCustomer();

        // Check if this customer is an existing customer
        String theEmail = customer.getEmail();
        Customer customerFromDB = customerRepository.findByEmail(theEmail);
        if (customerFromDB != null) {
            // there is an existing customer with same email, so we will add the order to that same email only
            customer = customerFromDB;
        }

        customer.add(order);

        // Save to the database
        customerRepository.save(customer);

        // Return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    // Below method generates a unique and random id and returns it.
    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfo.getAmount());
        params.put("currency", paymentInfo.getCurrency());
        params.put("payment_method_types", paymentMethodTypes);
        params.put("description", "BharatBazaarHub Purchase");
        params.put("receipt_email", paymentInfo.getReceiptEmail());

        return PaymentIntent.create(params);
    }
}

/*
UUID: Universally Unique Identifier
We want a tracking number that is unique, random and hard to guess.
The UUID is perfect for this use case.
It is a standardized method for generating unique ids
It is available in four versions, and We are using 4th version which generates a random UUID number.
*/

