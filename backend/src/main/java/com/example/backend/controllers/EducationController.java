package com.example.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.Educations;
import com.example.backend.repository.EducationRepo;
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
@RequestMapping("/education")
public class EducationController {

    @Autowired UserService userService;
    @Autowired JwtService jwtService;
    @Autowired EducationRepo educationRepo;


    static class CustomComparator implements Comparator<Educations>{
        @Override
        public int compare(Educations e1, Educations e2){
            return (int) (e1.getEducationId() - e2.getEducationId());
        }
    }

    @PostMapping("/addEducation")
    public ResponseEntity<?> AddOneExperience(HttpServletRequest request, @RequestBody Educations educations) {
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

            Educations educationTobeInserted = new Educations();
            educationTobeInserted.setUserId(userId);
            System.out.println(educations.getOrganizationName());
            educationTobeInserted.setOrganizationName(educations.getOrganizationName());
            educationTobeInserted.setDegree(educations.getDegree());
            educationTobeInserted.setDepartment(educations.getDepartment());
            educationTobeInserted.setStartDate(educations.getStartDate());
            educationTobeInserted.setEndDate(educations.getEndDate());
            educationTobeInserted.setLocation(educations.getLocation());
            educationTobeInserted.setScoreType(educations.getScoreType());
            educationTobeInserted.setScore(educations.getScore());
            educationTobeInserted.setDescription(educations.getDescription());

            // Save experience in the repository
            educationRepo.save(educationTobeInserted);
            return new ResponseEntity<>("Education added successfully", HttpStatus.OK);
       }catch(RuntimeException e){
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
       }
    }
    

    @GetMapping("/getEducation")
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

             List<Educations> userEducations = educationRepo.findByUserId(userId);
             if(userEducations.size()  == 0){
                return new ResponseEntity<>("Empty List", HttpStatus.PARTIAL_CONTENT);
             }
            
             Collections.sort(userEducations, new CustomComparator() )      ;       
             // Save experience in the repository
            
             return new ResponseEntity<>(userEducations, HttpStatus.OK);
        }catch(RuntimeException e){
         return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
     }

     @PostMapping("/deleteEducation")
     public ResponseEntity<?> postMethodName(HttpServletRequest request, @RequestBody HashMap<String, Long> educationId) {
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
            Long id =  educationId.get("educationId");
            educationRepo.deleteByUserIdAndEducationId(userId,id);
            return new ResponseEntity<>("Education Deleted Successfully", HttpStatus.OK);
         }catch(RuntimeException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
         }
     }
     
}


