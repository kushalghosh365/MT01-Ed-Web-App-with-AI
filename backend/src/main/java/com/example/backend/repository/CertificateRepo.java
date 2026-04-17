package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.entity.Certificates;

import java.util.List;

@Repository
public interface CertificateRepo extends JpaRepository<Certificates, Long> {

    // Find certificates by user ID
    List<Certificates> findByUserId(Long userId);

    // Delete certificate by name, provider, and user ID
    @Transactional
    @Modifying
    @Query("DELETE FROM Certificates c WHERE c.certificateName = :certificateName AND c.certificateProvider = :certificateProvider AND c.userId = :userId")
    void deleteByCertificateNameAndCertificateProviderAndUserId(
            String certificateName,
            String certificateProvider,
            Long userId
    );
}

