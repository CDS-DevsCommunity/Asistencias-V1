package com.cds.asistencia.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.cds.asistencia.security.jwt.JwtAuthenticationFilter;
import com.cds.asistencia.util.Permission;


import lombok.RequiredArgsConstructor;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class HttpSecurityConfig {

    
    private final AuthenticationProvider authenticationProvider;

    
    private final JwtAuthenticationFilter authenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{

        http
                .csrf(csrfConfig -> csrfConfig.disable())
                .sessionManagement( sessionMangConfig -> sessionMangConfig.sessionCreationPolicy(SessionCreationPolicy.STATELESS) )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(authConfig -> authConfig
                    

                    .requestMatchers(
                        "/swagger-ui/**",
                        "/v3/api-docs/**",
                        "/swagger-ui/index.html",
                        "/swagger-resources/**",
                        "/webjars/**"
                    ).permitAll()
                    // .requestMatchers("/swagger-ui/index.html").permitAll()

                    // .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()
                    // .requestMatchers(HttpMethod.POST, "/auth/authenticate").permitAll()
                    // .requestMatchers(HttpMethod.GET, "/auth/public-access").permitAll()
                    // .requestMatchers("/error").permitAll()
                    
                    // .requestMatchers(HttpMethod.GET,"/cds/positions")
                    //     .hasAnyAuthority(Permission.READ.name())
                        
                    // .requestMatchers(HttpMethod.POST,"/positions").hasAuthority(Permission.CREATE.name())

                    .anyRequest().permitAll()
                );

        return http.build();
    }

}
