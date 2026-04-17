package com.example.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.Links;
import com.example.backend.repository.LinksRepo;
import com.example.backend.services.JwtService;
import com.example.backend.services.LinksService;
import com.example.backend.services.UserService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/links")
public class LinkController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private LinksRepo linksRepo;
    @Autowired
    private LinksService linksService;

    @PostMapping("/addLinks")
    public ResponseEntity<?> addAllLinks(HttpServletRequest request, @RequestBody List<Links> links) {
        try {
            String username = extractUsernameFromToken(request);

            if (username == null || username.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token.");
            }

            Long userId = userService.getUserId(username);

            List<Links> socialMediaList = links.stream().map(link -> {
                Links existingLink = linksService.getLinksByUserIdAndPlatform(userId, link.getPlatform().toLowerCase());
                if (existingLink != null) {
                    existingLink.setLink(link.getLink());
                    return existingLink;
                } else {
                    Links newLink = new Links();
                    newLink.setUserId(userId);
                    newLink.setPlatform(link.getPlatform().toLowerCase());
                    newLink.setLink(link.getLink());
                    return newLink;
                }
            }).toList();

            linksRepo.saveAll(socialMediaList);
            return ResponseEntity.ok("Links added/updated successfully.");

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/getLinks")
    public ResponseEntity<?> getAllLinks(HttpServletRequest request) {
        try {
            String username = extractUsernameFromToken(request);

            if (username == null || username.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            Long userId = userService.getUserId(username);
            List<Links> linksList = linksRepo.findByUserId(userId);

            return new ResponseEntity<>(linksList,HttpStatus.OK);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    private String extractUsernameFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtService.extractUsername(token);
        }
        return null;
    }
}
