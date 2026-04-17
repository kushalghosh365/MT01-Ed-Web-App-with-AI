package com.example.backend.services;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.backend.entity.ChatMessages;
import com.example.backend.repository.MessageRepo;



@Service
public class GeminiService {

        @Value("${gemini.api.url}")
        private String geminiApiUrl;
    
        @Value("${gemini.api.key}")
        private String geminiApiKey;
    
        private final WebClient webClient;

        @Autowired MessageRepo messageRepo;
    
        public GeminiService(WebClient.Builder webClient) {
            this.webClient = webClient.build();
        }
    
        public String getAnswer(String question) {
            // Construct the request payload
            Map<String, Object> requestBody = Map.of(
                    "contents", new Object[] {
                            Map.of("parts", new Object[] {
                                    Map.of("text", question)
                            } )
                    }
            );
    
            // Make API Call
            String response = webClient.post()
                    .uri(geminiApiUrl + geminiApiKey)
                    .header("Content-Type","application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
                    
                //     GeminiChats newGeminiChats = new GeminiChats();
                //     newGeminiChats.setUserId(userId);
                //     newGeminiChats.setMessage(question);
                    
                //      Return response
            return response;
        }

        public boolean saveMessages(Long userId, List<ChatMessages> chatMessages) {
            try{
                
                for(ChatMessages msg :chatMessages){
                        msg.setUserId(userId);
                        messageRepo.save(msg);
                }
                return true;
            }catch(RuntimeException e){
                return false;
            }
        }

        // public List<ChatMessages> getAllMessages(Long userId) {
        //         try{
        //                 List<ChatMessages> ans = messageRepo.findByUserId(userId);
                     
        //              return ans;
        //         }
        //         catch(RuntimeException e){

        //         }
                     
        // }
}