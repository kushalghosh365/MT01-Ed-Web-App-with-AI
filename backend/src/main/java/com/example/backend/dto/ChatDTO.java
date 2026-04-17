package com.example.backend.dto;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChatDTO {
       private String chatId;
       private String chatTitle;
       private String promt;
        
}
