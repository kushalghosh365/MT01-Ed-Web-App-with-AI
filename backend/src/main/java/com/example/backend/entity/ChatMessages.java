package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chat_messages")
@Data
@NoArgsConstructor
public class ChatMessages {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long messageId;

        @Column(name = "user_id", nullable = false)
        private Long userId;

       
        @Column(name = "text", nullable = false, columnDefinition = "TEXT")
        private String text;

        @Column(name = "type", nullable = false)
        private String type;

}
