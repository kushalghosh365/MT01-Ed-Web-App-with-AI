package com.example.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl {
    
    @Autowired
    private JavaMailSender javaMailSender;

    
    public void sendMail(String to, String sub, String body){
        try{
           
            SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
            simpleMailMessage.setFrom("dhananjoyghosh415@gmail.com");
            simpleMailMessage.setTo(to);
            simpleMailMessage.setSubject(sub);
            simpleMailMessage.setText(body);

            javaMailSender.send(simpleMailMessage);
        }catch(Exception e){
            throw new RuntimeException("Exception with mail", e);
        }
    }
}
