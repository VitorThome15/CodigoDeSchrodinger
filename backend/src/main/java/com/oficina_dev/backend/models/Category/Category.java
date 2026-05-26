package com.oficina_dev.backend.models.Category;


import com.oficina_dev.backend.models.Item.Item;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "tb_categories", schema = "public")
public class Category {

    @Id
    @Setter
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "name", length = 100, nullable = false, unique = true)
    private String name;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "update_at")
    private ZonedDateTime updateAt;

    @OneToMany(mappedBy = "category", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Item> items;

    public Category(String name) {
        this.setName(name);
    }

    public void setName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name cannot be null or blank");
        }
        this.name = name.toLowerCase().trim();
    }

}
