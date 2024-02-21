package com.project.ecommerceBE.dto;

import lombok.Data;

@Data
public class PurchaseResponse {
    private final String orderTrackingNumber;
}

/*
The Lombok annotation '@Data' is providing a constructor here for all the final fields.
*/