package com.example.backend.dto;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GeminiResponse {

    private List<Candidate> candidates;

    // Getter and Setter for candidates
    public List<Candidate> getCandidates() {
        return candidates;
    }

    public void setCandidates(List<Candidate> candidates) {
        this.candidates = candidates;
    }

    public static class Candidate {
        private Content content;

        // Getter and Setter for content
        public Content getContent() {
            return content;
        }

        public void setContent(Content content) {
            this.content = content;
        }
    }

    public static class Content {
        private List<Part> parts;

        // Getter and Setter for parts
        public List<Part> getParts() {
            return parts;
        }

        public void setParts(List<Part> parts) {
            this.parts = parts;
        }
    }

    public static class Part {
        private String text;

        // Getter and Setter for text
        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }
}
