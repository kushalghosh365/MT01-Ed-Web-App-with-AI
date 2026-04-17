package com.example.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.services.JwtService;
import com.example.backend.services.SkillSaveService;

import jakarta.servlet.http.HttpServletRequest;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;


@RequestMapping("/skills")
@RestController
public class SkillsControllers {

    @Autowired
    private SkillSaveService skillSaveService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/addSkill")
    public ResponseEntity<?> addSkill(HttpServletRequest request, @RequestBody HashMap<String, String> input) {
        try {
            String skillName = input.get("skillName");
            if (skillName == null || skillName.isEmpty()) {
                throw new RuntimeException("Skill name is required.");
            }

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

            String isSkillAdded = skillSaveService.saveSkill(username, skillName);
            if(isSkillAdded =="Skill already present") return new ResponseEntity<>(isSkillAdded, HttpStatus.ALREADY_REPORTED);
            return new ResponseEntity<>(isSkillAdded, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getuserskills")
    public ResponseEntity<?> getAllSkillsOfUser(HttpServletRequest request) {
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
            ArrayList<String> ans = skillSaveService.getAllSkills(username);
            return new ResponseEntity<>(ans, HttpStatus.OK);

        }catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    @PostMapping("/deleteskills")
    public ResponseEntity<?> deleteSkill(HttpServletRequest request, @RequestBody HashMap<String, String> input) {
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
            String skillName = input.get("skillName");
            String ans = skillSaveService.deleteUserSkill(username,skillName);
            if(ans =="success")
            return new ResponseEntity<>("Skills Removed", HttpStatus.OK);
            else throw new RuntimeException("skills removal failed");
        }catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
}
