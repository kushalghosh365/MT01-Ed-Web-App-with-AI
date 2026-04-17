package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.backend.entity.Experiences;

import io.lettuce.core.dynamic.annotation.Param;
import jakarta.transaction.Transactional;

public interface ExperienceRepo extends JpaRepository<Experiences,Long> {
        List<Experiences> findByUserId(Long userId);

        @Transactional
        @Modifying
        @Query("DELETE FROM Experiences e WHERE e.userId = :userId AND e.experienceId = :experienceId")
        void deleteByUserIdAndExperienceId(@Param("userId") Long userId, @Param("experienceId") Long experienceId);
}
