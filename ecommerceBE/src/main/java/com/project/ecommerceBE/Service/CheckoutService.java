package com.project.ecommerceBE.Service;

import com.project.ecommerceBE.dto.Purchase;
import com.project.ecommerceBE.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
