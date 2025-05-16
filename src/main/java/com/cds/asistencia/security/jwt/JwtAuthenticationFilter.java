package com.cds.asistencia.security.jwt;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.cds.asistencia.domain.entities.User;
import com.cds.asistencia.repositories.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter{

    
    private final JwtService jwtService;

    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        //1. Obtener el header que contiene el jwt
        String authHeader = request.getHeader("Authorization"); //Bearer jwt


        if (authHeader == null || !authHeader.startsWith("Bearer ") ) {
            filterChain.doFilter(request, response);
            return;
        }

        //2. Obtener jwt desde header
        String jwt = authHeader.split(" ")[1];

        //3. Obtener subject/username desde el jwt
        String email = jwtService.extractUsername(jwt);

        //4.Setear un objeto Authentication dentro del SecurityContext

        User user = userRepository.findByEmail(email).get();

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
            email, 
            null, 
            user.getAuthorities()
        );

        SecurityContextHolder.getContext().setAuthentication(authToken);

        //5.Ejecutar el resto de filtros

        filterChain.doFilter(request, response);
        
        
    }

}
