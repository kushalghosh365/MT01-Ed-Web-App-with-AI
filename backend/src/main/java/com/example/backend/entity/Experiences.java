package com.example.backend.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Experiences {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long experienceId;
    @Column(nullable = false)
    private Long userId;
    @Column(nullable = false)
    private String companyName;
    @Column(nullable = false)
    private String role;
    @Column(nullable = false)
    private LocalDate startDate;
    @Column(nullable = false)
    private LocalDate endDate;
    @Column(nullable = false)
    private String location;
    private String description;
    private LocalDateTime createdAt;
    public Experiences() {
        this.createdAt = LocalDateTime.now(); // Automatically set creation time
    }
}
