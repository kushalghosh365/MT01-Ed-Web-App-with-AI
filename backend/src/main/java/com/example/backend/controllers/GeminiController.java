package com.example.backend.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.ChatMessages;
import com.example.backend.repository.MessageRepo;
import com.example.backend.services.GeminiService;
import com.example.backend.services.JwtService;
import com.example.backend.services.UserService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;




@RestController
@RequestMapping("/gemini/api")

public class GeminiController {

    @Autowired UserService userService;
    @Autowired JwtService jwtService;
    @Autowired GeminiService geminiService;
    @Autowired MessageRepo messageRepo;

    @PostMapping("/askQuestion")
    public ResponseEntity<?> sendAPromtToGemini(@RequestBody HashMap<String,String> payload) {
       try{
            String promt = payload.get("prompt");
            String ans = geminiService.getAnswer(promt);

            return new ResponseEntity<>(ans,HttpStatus.OK);
       }
       catch(RuntimeException e){
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
       }
    }

    @PostMapping("/savemessages")
    public ResponseEntity<?> saveMessages(HttpServletRequest request,@RequestBody HashMap<String, List<ChatMessages>> payload) {
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
            List<ChatMessages> chatMessages = payload.get("messages");
            System.out.println(chatMessages);
            boolean response = geminiService.saveMessages(userId, chatMessages);
            if(response == false){
                throw new RuntimeException("failed to save message in db");
            }

            return new ResponseEntity<>("Messases Saved Successfully",HttpStatus.OK);
        }catch(RuntimeException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getMessages")
    public ResponseEntity<?> getMessages(HttpServletRequest request) {
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
            
            List<ChatMessages> ans = messageRepo.findByUserId(userId);
            if (ans == null || ans.isEmpty()) {
                return new ResponseEntity<>("No messages found.", HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(ans,HttpStatus.OK);
        }
        catch(RuntimeException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    
    
}
