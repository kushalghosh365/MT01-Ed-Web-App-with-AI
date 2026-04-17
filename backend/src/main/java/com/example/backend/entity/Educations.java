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
public class Educations {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long educationId;
    @Column(nullable = false)
    private Long userId;
    @Column(nullable = false)
    private String organizationName;
    @Column(nullable = false)
    private String degree;
    @Column(nullable = false)
    private String department;
    @Column(nullable = false)
    private LocalDate startDate;
    @Column(nullable = false)
    private LocalDate endDate;
    @Column(nullable = false)
    private String location;
    @Column(nullable = false)
    private String scoreType;
    @Column(nullable = false)
    private String score;
    private String description;
    private LocalDateTime createdAt;
    public Educations() {
        this.createdAt = LocalDateTime.now(); // Automatically set creation time
    }
}
