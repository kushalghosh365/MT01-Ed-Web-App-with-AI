
package com.example.backend.controllers;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.CertificateDetails;
import com.example.backend.entity.Certificates;
import com.example.backend.repository.CertificateRepo;
import com.example.backend.services.JwtService;
import com.example.backend.services.UserService;

import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/certificates")
public class CertificateController {

    @Autowired
    private CertificateRepo certificateRepo;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserService userService;

    // Add a certificate
    @PostMapping("/addCertificate")
    public ResponseEntity<?> addCertificate(HttpServletRequest request, @RequestBody CertificateDetails certificateDetails) {
        try{
            System.out.println(certificateDetails);
            String authHeader = request.getHeader("Authorization");
            String token = null;
            String username = null;

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                username = jwtService.extractUsername(token);
            }

            if (username == null || username.isEmpty()) {
                throw new RuntimeException("Invalid or missing token.");
            }
            Long userId = userService.getUserId(username);
            Certificates certificateTobeSaved = new Certificates();
            certificateTobeSaved.setCertificateName(certificateDetails.getCertificationName());
            certificateTobeSaved.setCertificateProvider(certificateDetails.getProvider());
            certificateTobeSaved.setUserId(userId);
            certificateRepo.save(certificateTobeSaved);
            return new ResponseEntity<>("Certificate Added successfully", HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete a certificate
    @PostMapping("/deleteCertificate")
    public ResponseEntity<?> deleteCertificate(HttpServletRequest request,
            @RequestBody Certificates certificateDetails) {

                try{
                    
                        System.out.println("Asche asche" + certificateDetails);
                        String authHeader = request.getHeader("Authorization");
                        String token = null;
                        String username = null;
            
                        if (authHeader != null && authHeader.startsWith("Bearer ")) {
                            token = authHeader.substring(7);
                            username = jwtService.extractUsername(token);
                        }
            
                        if (username == null || username.isEmpty()) {
                            throw new RuntimeException("Invalid or missing token.");
                        }
                        Long userId = userService.getUserId(username);
                        certificateRepo.deleteByCertificateNameAndCertificateProviderAndUserId(
                            certificateDetails.getCertificateName(), certificateDetails.getCertificateProvider(), userId);
                        return new ResponseEntity<>("Certificate Deleted successfully", HttpStatus.OK);
                }
                catch(Exception e){
                    return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);

                }
       
    }

    @GetMapping("/getCertificates")
    public ResponseEntity<?> getCertificates(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            String token = null;
            String username = null;

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                username = jwtService.extractUsername(token);
            }

            if (username == null || username.isEmpty()) {
                throw new RuntimeException("Invalid or missing token.");
            }

            Long userId = userService.getUserId(username);
            List<Certificates> certificates = certificateRepo.findByUserId(userId);

            return new ResponseEntity<>(certificates, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
