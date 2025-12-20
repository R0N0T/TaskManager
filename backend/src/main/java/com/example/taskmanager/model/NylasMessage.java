package com.example.taskmanager.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NylasMessage {
    private List<Recipient> to;
    private String subject;
    private String body;
    private long send_at;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Recipient {
        private String name;
        private String email;
    }
}
