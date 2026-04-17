package com.example.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.OtpDetails;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepo;
import com.example.backend.services.EmailServiceImpl;
import com.example.backend.services.UserService;

import java.util.Map;
import java.util.concurrent.TimeUnit;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/forgotpassword")
public class OtpController {

     @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired UserRepo userRepo;
    @Autowired EmailServiceImpl emailService;

    @Autowired UserService userService;
    // Executor to clean expired OTPs
    public OtpController() {
        
    }

    @PostMapping("/generate-otp")
    public ResponseEntity<?> generateOtp(@RequestBody Map<String, String> request) {
       try{
        String email = request.get("email");

        if (email == null || email.isBlank()) {
            throw new RuntimeException("Invalid email address.");
        }
        User user = userRepo.findByEmail(email);
        if(user == null) throw new RuntimeException("Email is not registered");

        // Generate 4-digit OTP
        int otp = 1000 + (int) (Math.random() * 9000);
        String sub = "MT01";
        String body = otp + " is your one time password. This is only valid for 60 secs";
        // Store OTP in Redis with a 30-second expiration
        emailService.sendMail(email, sub, body);
        redisTemplate.opsForValue().set(email, String.valueOf(otp), 60, TimeUnit.SECONDS);
        System.out.println(otp);
        // Respond to the client
        return new ResponseEntity<>(Map.of(
            "message", "OTP generated successfully. It is valid for 30 seconds."
        ), HttpStatus.OK);
       }catch(Exception e){
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
       }
    }

    @PostMapping("/validate-otp")
    public ResponseEntity<?> validateOtp(@RequestBody OtpDetails otpDetails) {
        String email = otpDetails.getEmail();
        String otpString = otpDetails.getOtp();

        try {
            if (email == null || email.isBlank() ) {
                throw new RuntimeException("email is not passed");
            }
            if( otpString == null || otpString.isBlank()){
                throw new RuntimeException("otp cannot be empty");
            }
    
            // Retrieve the OTP from Redis
            String storedOtp = redisTemplate.opsForValue().get(email);
    
            if (storedOtp == null) {
                throw new RuntimeException("OTP expired please resend the otp");
            }
    
            if (storedOtp.equals(otpString)) {
                redisTemplate.delete(email); // Delete OTP after successful validation
                return new ResponseEntity<>(Map.of("message", "OTP validated successfully."), HttpStatus.OK);
            } else {
                throw new RuntimeException("Invalid OTP.") ;
            }
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/updatepassword")
    public ResponseEntity<?> postMethodName(@RequestBody LoginRequest credentials) {
        try{
            String email = credentials.getEmail();
            String newPassword = credentials.getPassword();
            if(email == null){
                throw new RuntimeException("email cannot be empty");
            }
            if(newPassword == null){
                throw new RuntimeException("password cannot be empty");
            }

            String res =userService.updatePassword(email, newPassword);
            return new ResponseEntity<>(res, HttpStatus.OK);
        }catch(RuntimeException E){
            return new ResponseEntity<>(E.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
}
