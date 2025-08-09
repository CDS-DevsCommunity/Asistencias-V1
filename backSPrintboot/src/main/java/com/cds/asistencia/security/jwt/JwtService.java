package com.cds.asistencia.security.jwt;

import java.security.Key;
import java.sql.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.cds.asistencia.domain.entities.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${security.jwt.expiration-minutes}")
    private long EXPIRATION_MINUTES;

    @Value("${security.jwt.secret-key}")
    private String SECRET_KEY;

    

    public String generateToken(User user, Map<String, Object> extractClaims) {
        
        Date issueAt = new Date(System.currentTimeMillis());
        Date expiration = new Date( issueAt.getTime() + (EXPIRATION_MINUTES * 60 * 1000 ));

        return Jwts.builder()
                .setClaims(extractClaims)
                .setSubject(user.getEmail())
                .setIssuedAt(issueAt)
                .setExpiration(expiration)
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE)
                .signWith(generateKey(), SignatureAlgorithm.HS256)
                .compact();


    }



    private Key generateKey() {

        byte[] secretAsBytes = Decoders.BASE64.decode(SECRET_KEY);

        return Keys.hmacShaKeyFor(secretAsBytes);
    }



    public String extractUsername(String jwt) {
        
        return extractAllClaims(jwt).getSubject();

    }



    private Claims extractAllClaims(String jwt) {
        return Jwts.parser().setSigningKey(generateKey()).build()
                .parseClaimsJws(jwt).getBody();
    }

	

}
