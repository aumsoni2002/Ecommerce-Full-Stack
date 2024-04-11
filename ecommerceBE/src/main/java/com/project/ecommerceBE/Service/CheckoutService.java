package com.project.ecommerceBE.Service;

import com.project.ecommerceBE.dto.PaymentInfo;
import com.project.ecommerceBE.dto.Purchase;
import com.project.ecommerceBE.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
