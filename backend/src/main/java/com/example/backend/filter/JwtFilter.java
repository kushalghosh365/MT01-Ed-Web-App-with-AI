package com.example.backend.filter;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.backend.services.JwtService;
import com.example.backend.services.MyUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

        @Autowired
        JwtService jwtService;
        @Autowired
        ApplicationContext context;
        @Autowired
        MyUserDetailsService myUserDetailsService;

        @Override
       protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException{
            final String authHeader = request.getHeader("Authorization");
           
            String token ="";
            String username = "";

            if(authHeader != null && authHeader.startsWith("Bearer ")){
                token = authHeader.substring(7);
                
                username = jwtService.extractUsername(token);
                
            }

            if(username!="" && token!="" && (SecurityContextHolder.getContext().getAuthentication() == null))
            {
                UserDetails userDetails = context.getBean(myUserDetailsService.getClass()).loadUserByUsername(username);
                System.out.println(userDetails);
                if(jwtService.validateToken(token, userDetails)){
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                   System.out.println(usernamePasswordAuthenticationToken);
                    usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                }
            }
            filterChain.doFilter(request, response);
        }
       
    
}