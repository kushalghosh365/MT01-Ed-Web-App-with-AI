package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.ChatMessages;
import java.util.List;


public interface MessageRepo extends JpaRepository<ChatMessages, Long> {
        List<ChatMessages> findByUserId(Long userId);
}
