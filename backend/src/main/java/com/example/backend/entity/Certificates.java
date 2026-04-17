package com.example.backend.entity;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
@Entity
@Table(name = "certificates")
@Data
public class Certificates {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "certificate_name", nullable = false)
    private String certificateName;

    @Column(name = "certificate_provider", nullable = false)
    private String certificateProvider;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Certificates() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters

}
