package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.backend.entity.Educations;

import io.lettuce.core.dynamic.annotation.Param;
import jakarta.transaction.Transactional;

public interface EducationRepo extends JpaRepository<Educations, Long> {
        List<Educations> findByUserId(Long userId);

        @Transactional
        @Modifying
        @Query("DELETE FROM Educations e WHERE e.userId = :userId AND e.educationId = :educationId")
        void deleteByUserIdAndEducationId(@Param("userId") Long userId, @Param("educationId") Long educationId);
}
