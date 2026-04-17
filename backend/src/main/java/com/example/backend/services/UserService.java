package com.example.backend.services;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.example.backend.dto.LoginRequest;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepo;

@Component
public class UserService {
    @Autowired
    UserRepo userRepo;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtService jwtService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    public String signup(User user) {
        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User savedUser = userRepo.save(user);
            if(savedUser == null) throw new RuntimeException("Invalid Request");
            // return "OK";
            return jwtService.generateToken(user.getEmail());
        } catch (Exception e) {
            throw new RuntimeException("User save failed -> " + e.getMessage());
        }
    }

    public String handleLogin(LoginRequest credentials) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(credentials.getEmail(), credentials.getPassword())
            );
            if(!authentication.isAuthenticated()){
                throw new RuntimeException("Login failed");
            }
            // else return "OK";
            else return jwtService.generateToken(credentials.getEmail());
        } catch (Exception e) {
            throw new RuntimeException("Login failed -> " + e.getMessage());
        }
    }
    
    public ArrayList<String> getProfileDetails(String username) {
       ArrayList<String> ans = new ArrayList<>();
       User user = userRepo.findByEmail(username);
        ans.add(user.getName());
       ans.add(user.getProfileImgUrl());
       ans.add(user.getHeadline());
       ans.add(user.getEmail());
        return ans;
    }
    public Long getUserId(String username){
        return userRepo.findByEmail(username).getId();
    }
    public String setProfileimageUrl(String email, String profileImageUrl) {
        try{
            User user = userRepo.findByEmail(email);
            if(user == null){
                throw new RuntimeException("User not found");
            }
           
            user.setProfileImgUrl(profileImageUrl);
            userRepo.save(user);
            return "Profile picture updated";
        }
        catch(Exception e){
            return  e.getMessage();
        }
    }
    public String updatePassword(String email, String newPassword){
        try{
            User user = userRepo.findByEmail(email);
            if(user == null) throw new RuntimeException("Email is not registered");
            else{
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepo.save(user);
                return "Password updated successfully";
            }
        }catch(RuntimeException e){
            return e.getMessage();
        }
    }

    public String updateResume(String email,String resumeId) {
         try{
            User user = userRepo.findByEmail(email);
            if(user == null) throw new RuntimeException("User not found");
            System.out.println("hmm eseche ");
            user.setResumeId(resumeId);
            User savedUser = userRepo.save(user);
            if(savedUser != null) 
            return "Success";
            else{
                System.out.println("User resume id not stored");
                return "Not succed";
            } 
         }   
         catch(Exception e){
           return e.getMessage();
         }
    }

    public String getResumeId(String email) {
        try{
           User user = userRepo.findByEmail(email);
           String resumeId = user.getResumeId();
           if(resumeId == null) throw new RuntimeException("resumeId not found");
           else return resumeId;
         }   
         catch(Exception e){
            return e.getMessage();
         }
    }

    public Boolean deleteResumeId(String username) {
        try{
             User user = userRepo.findByEmail(username);   
             if(user == null){
                throw new RuntimeException("User not found");
             }
             user.setResumeId(null);
             User savedUser =userRepo.save(user);
             if(savedUser !=null){
                System.out.println("hmmmmmmm");
                return true;
             } 
             else throw new RuntimeException("resumeId not deleted");
        }catch(RuntimeException e){
            return false;
        }
    }
    public String addExperience(String email,String resumeId) {
        try{
           User user = userRepo.findByEmail(email);
           if(user == null) throw new RuntimeException("User not found");
           System.out.println("hmm eseche ");
           user.setResumeId(resumeId);
           User savedUser = userRepo.save(user);
           if(savedUser != null) 
           return "Success";
           else{
               System.out.println("User resume id not stored");
               return "Not succed";
           } 
        }   
        catch(Exception e){
          return e.getMessage();
        }
   }

}
