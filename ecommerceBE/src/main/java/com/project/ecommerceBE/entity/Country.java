package com.project.ecommerceBE.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "country")
@Getter
@Setter
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    // while exposing all country table's column data which are id, code, name and states through localhost:8080/api/countries.
    // we do not want the states column to be exposed as we have a separate REST API for it. So this can be fulfilled by adding
    // an annotation '@JsonIgnore' which will ignore this particular field to be exposed.
    @OneToMany(mappedBy = "country")
    @JsonIgnore
    private List<State> states;
}
