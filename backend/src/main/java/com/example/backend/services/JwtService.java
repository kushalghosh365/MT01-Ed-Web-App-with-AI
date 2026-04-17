package com.example.backend.services;

// import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

// import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final String secretKey="7e51a395a4f5c689071c61021fcd257c35c44897317cbe15d1f425a7fd066d2a4b167fce805739b8531725d5d89e42ed89ac63a95d3615409941237f9bfc55c6ccd8107de0e2365fc2398e29a4cc2c7364a94e34d53006eba23195688f7cad50dd508b4457cdd3f8a32a219a6b729ef343b1b803d5f0752c9702bd0fd05d1c80d01a9fe280f25f4d07c1553313e9ca40586433608321112f05bf4e43286e720d92078f535d8c053da00553529950520e871f2b32f3d8b715ce379fb418d865cebb05fa1101f84fce5ea76716fa22f09673b25824add02602cab1f8c589b642e111413387962fd567cd02461050808865ca569b29191e93e96e7831a3c3a00510";

    // public JwtService(){
    //     try{
    //         KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
    //         SecretKey sk = keyGen.generateKey();
    //         this.secretKey = Base64.getEncoder().encodeToString(sk.getEncoded());
    //     }catch(Exception e){
    //         throw new RuntimeException(e);
    //     }
    // }

    public String generateToken(String email){


        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .and()
                .signWith(generateKey())
                .compact();
    }

    private SecretKey generateKey(){
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token){
        return extractClaim(token, Claims::getSubject);
    }

    private <T> T extractClaim(String token, Function<Claims, T>claimResolver){
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token){
        return Jwts.parser()
                    .verifyWith(generateKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();  
    }

    public boolean validateToken(String token , UserDetails userDetails){
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token){
        return extractClaim(token, Claims:: getExpiration);
    }
}
