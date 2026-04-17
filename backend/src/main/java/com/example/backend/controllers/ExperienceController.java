package com.example.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.Experiences;
import com.example.backend.repository.ExperienceRepo;
import com.example.backend.services.JwtService;
import com.example.backend.services.UserService;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/experience")
public class ExperienceController {

    @Autowired UserService userService;
    @Autowired JwtService jwtService;
    @Autowired ExperienceRepo experienceRepo;

    
    static class CustomComparator implements Comparator<Experiences>{
        @Override
        public int compare(Experiences e1, Experiences e2){
            return (int)  (e1.getExperienceId() - e2.getExperienceId());
        }
    }

    @PostMapping("/addExperience")
    public ResponseEntity<?> AddOneExperience(HttpServletRequest request, @RequestBody Experiences newExperience) {
       try{
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
            if(userId == null ) throw new RuntimeException("User Not Found");

            Experiences experienceTobeInserted = new Experiences();
            experienceTobeInserted.setUserId(userId);
            experienceTobeInserted.setCompanyName(newExperience.getCompanyName());
            experienceTobeInserted.setRole(newExperience.getRole());
            experienceTobeInserted.setStartDate(newExperience.getStartDate());
            experienceTobeInserted.setEndDate(newExperience.getEndDate());
            experienceTobeInserted.setLocation(newExperience.getLocation());
            experienceTobeInserted.setDescription(newExperience.getDescription());

            // Save experience in the repository
            experienceRepo.save(experienceTobeInserted);
            return new ResponseEntity<>("Experience added successfully", HttpStatus.OK);
       }catch(RuntimeException e){
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
       }
    }
    

    @GetMapping("/getExperience")
    public ResponseEntity<?> getUserExperience(HttpServletRequest request) {
        try{
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
             if(userId == null ) throw new RuntimeException("User Not Found");

             List<Experiences> userExperiences = experienceRepo.findByUserId(userId);
             if(userExperiences.size()  == 0){
                return new ResponseEntity<>("Empty List", HttpStatus.PARTIAL_CONTENT);
             }
             System.out.println(userExperiences);
             Collections.sort(userExperiences, new CustomComparator());
             
             // Save experience in the repository
            
             return new ResponseEntity<>(userExperiences, HttpStatus.OK);
        }catch(RuntimeException e){
         return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
     }

     @PostMapping("/deleteExperience")
     public ResponseEntity<?> postMethodName(HttpServletRequest request, @RequestBody HashMap<String, Long> experienceId) {
         try{
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
            if(userId == null ) throw new RuntimeException("User Not Found");
            Long id =  experienceId.get("experienceId");
            experienceRepo.deleteByUserIdAndExperienceId(userId,id);
            return new ResponseEntity<>("Experience Deleted Successfully", HttpStatus.OK);
         }catch(RuntimeException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
         }
     }
     
}

