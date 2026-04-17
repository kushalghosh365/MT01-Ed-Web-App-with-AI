package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.backend.entity.SkillList;

import io.lettuce.core.dynamic.annotation.Param;
import jakarta.transaction.Transactional;

import java.util.List;


public interface SkillsRepo extends JpaRepository<SkillList,Long> {
        List<SkillList> findBySkillName(String skillName);
        
        List<SkillList> findByUserId(Long userId);

       @Transactional
        @Modifying
        @Query("DELETE FROM SkillList s WHERE s.userId = :userId AND s.skillName = :skillName")
        void deleteByUserIdAndSkillName(@Param("userId") Long userId, @Param("skillName") String skillName);
}
