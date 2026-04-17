package com.example.backend.services;

import java.util.ArrayList;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.entity.SkillList;
import com.example.backend.entity.User;
import com.example.backend.repository.SkillsRepo;
import com.example.backend.repository.UserRepo;

@Service
public class SkillSaveService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private SkillsRepo skillsRepo;

    public String saveSkill(String email, String skillName) {
        try {
            // Find the user by email
            User user = userRepo.findByEmail(email);
            if (user == null) {
                throw new RuntimeException("User not found with email: " + email);
            }

            // Create and save the skill
            Long userId = user.getId();

            // Check if the skill already exists for the user
            List<SkillList> existingSkills = skillsRepo.findByUserId(userId);
            for (SkillList skill : existingSkills) {
                if (skill.getSkillName().equalsIgnoreCase(skillName)) {
                    return "Skill already present";
                }
            }
    
            // Create and save the new skill
            SkillList newSkill = new SkillList();
            newSkill.setUserId(userId);
            newSkill.setSkillName(skillName);
            skillsRepo.save(newSkill);
    
            return "Skill added successfully";
        } catch (Exception e) {
            // Log the error for debugging purposes
            System.err.println("Error saving skill: " + e.getMessage());
            return e.getMessage();
        }
    }

    public ArrayList<String> getAllSkills(String username) {
        try{
            User user = userRepo.findByEmail(username);
            Long user_id = user.getId();
            if(user_id == null ) throw new RuntimeException("User not found");
            List<SkillList> skills = skillsRepo.findByUserId(user_id);
            if(skills.size() == 0 ) throw new RuntimeException("Skills No Found");
            ArrayList<String> ans = new ArrayList<>();
            for(SkillList it : skills){
                ans.add(it.getSkillName());
            }
            if(ans.size() == 0) throw new RuntimeException("Skills No Found");
            return ans;
        }catch(Exception e){
            return  null;
        }
    }

    public String deleteUserSkill(String username, String skillName) {
       try{
            User user = userRepo.findByEmail(username);
            if (user == null) throw new RuntimeException("User not found with email: " + username);
            Long user_id = user.getId();
            skillsRepo.deleteByUserIdAndSkillName(user_id, skillName);
            return "success";
       }catch(Exception e){
        return e.getMessage();
       }
    }
}
