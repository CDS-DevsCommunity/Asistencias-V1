package com.cds.asistencia.domain.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "registration")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Person person;
    
    private LocalDateTime fechaRegistro;

    private boolean asistio;
    
    private String metodoRegistro;
    
    @Column(length = 500)
    private String observaciones;


    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
    }

}
