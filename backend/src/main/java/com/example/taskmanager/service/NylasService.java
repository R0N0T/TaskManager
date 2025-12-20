package com.example.taskmanager.service;

import com.example.taskmanager.model.NylasMessage;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class NylasService {

    private final WebClient webClient;

    public NylasService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.us.nylas.com/v3/grants")
                .defaultHeader("Authorization", "Bearer nyk_v0_1CAoakKmXfSeOSvEDz0zjvzTuj52BC68E10OUSZ3mmRkBLimrHUIyf7AtHezaIZ5") // auth header
                .build();
    }

    public String sendMessage(String grantId, Object payload) {
        return webClient.post()
                .uri("/c26a2e63-5463-49eb-8369-26909b1e7552/messages/send", grantId)
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(String.class)
                .block(); // makes it synchronous
    }
}